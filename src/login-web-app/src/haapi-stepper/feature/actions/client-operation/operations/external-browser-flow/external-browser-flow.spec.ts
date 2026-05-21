/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { afterEach, beforeEach, describe, expect, it, vi, type MockInstance } from 'vitest';
import { runExternalBrowserFlow } from './external-browser-flow';
import { HAAPI_PROBLEM_STEPS, HAAPI_STEPS } from '../../../../../data-access/types/haapi-step.types';
import { createMockExternalBrowserFlowAction, createMockStep } from '../../../../../util/tests/mocks';

describe('external-browser-flow', () => {
  const launchOrigin = new URL(createMockExternalBrowserFlowAction().model.arguments.href).origin;
  const closeDelay = 0;
  const stepWithoutErrorMetadata = createMockStep(HAAPI_STEPS.AUTHENTICATION, { metadata: {} });
  const failedStep = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
    metadata: {
      viewData: {
        error: {
          clientOperation: {
            externalBrowserFlow: { launch: 'Launch error copy.', resume: 'Resume error copy.' },
          },
        },
      },
    },
  });

  let abortController: AbortController;
  let externalWindowClose: ReturnType<typeof vi.fn>;
  let fakeExternalWindow: Window;
  let openSpy: MockInstance<typeof window.open>;

  beforeEach(() => {
    abortController = new AbortController();
    externalWindowClose = vi.fn();
    fakeExternalWindow = { close: externalWindowClose } as unknown as Window;
    openSpy = vi.spyOn(window, 'open').mockReturnValue(fakeExternalWindow);
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe('runExternalBrowserFlow', () => {
    describe('success', () => {
      it('opens the launch URL with for_origin appended', () => {
        const action = createMockExternalBrowserFlowAction();
        void runExternalBrowserFlow(action, closeDelay, abortController.signal, stepWithoutErrorMetadata);

        const expected = new URL(action.model.arguments.href);
        expected.searchParams.set('for_origin', window.location.origin);

        const opened = openSpy.mock.calls[0][0] as URL;
        expect(opened.href).toBe(expected.href);
      });

      it('awaits postMessage from the external window and resolves with continuation data and nonce payload', async () => {
        const action = createMockExternalBrowserFlowAction();
        const externalBrowserFlowResult = runExternalBrowserFlow(
          action,
          closeDelay,
          abortController.signal,
          stepWithoutErrorMetadata
        );

        sendBrowserMessage({ source: fakeExternalWindow, origin: launchOrigin, data: 'nonce-abc' });

        await expect(externalBrowserFlowResult).resolves.toEqual({
          clientOperationData: {
            action: action.model.continueActions[0],
            payload: new Map([['_resume_nonce', 'nonce-abc']]),
          },
        });
      });

      it('ignores messages whose source is not the external window', async () => {
        const action = createMockExternalBrowserFlowAction();
        const externalBrowserFlowResult = runExternalBrowserFlow(
          action,
          closeDelay,
          abortController.signal,
          stepWithoutErrorMetadata
        );

        sendBrowserMessage({ source: window, origin: launchOrigin, data: 'wrong-source' });
        sendBrowserMessage({ source: fakeExternalWindow, origin: launchOrigin, data: 'nonce-ok' });

        await expect(externalBrowserFlowResult).resolves.toEqual({
          clientOperationData: {
            action: action.model.continueActions[0],
            payload: new Map([['_resume_nonce', 'nonce-ok']]),
          },
        });
      });
    });

    describe('failure', () => {
      it('window.open returns null → launch error copy', async () => {
        openSpy.mockReturnValue(null);

        const result = await runExternalBrowserFlow(
          createMockExternalBrowserFlowAction(),
          closeDelay,
          abortController.signal,
          failedStep
        );

        expect(result).toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: 'Launch error copy.' }],
            },
          },
        });
        expect(externalWindowClose).not.toHaveBeenCalled();
      });

      it('message from unexpected origin → resume error copy', async () => {
        const externalBrowserFlowResult = runExternalBrowserFlow(
          createMockExternalBrowserFlowAction(),
          closeDelay,
          abortController.signal,
          failedStep
        );

        sendBrowserMessage({ source: fakeExternalWindow, origin: 'http://attacker.example', data: 'nonce-x' });

        await expect(externalBrowserFlowResult).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: 'Resume error copy.' }],
            },
          },
        });
        expect(externalWindowClose).toHaveBeenCalledTimes(1);
      });

      it('message with non-string data → resume error copy', async () => {
        const externalBrowserFlowResult = runExternalBrowserFlow(
          createMockExternalBrowserFlowAction(),
          closeDelay,
          abortController.signal,
          failedStep
        );

        sendBrowserMessage({ source: fakeExternalWindow, origin: launchOrigin, data: { not: 'a string' } });

        await expect(externalBrowserFlowResult).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: 'Resume error copy.' }],
            },
          },
        });
        expect(externalWindowClose).toHaveBeenCalledTimes(1);
      });

      it('abort signal fires → resume error copy', async () => {
        const externalBrowserFlowResult = runExternalBrowserFlow(
          createMockExternalBrowserFlowAction(),
          closeDelay,
          abortController.signal,
          failedStep
        );

        abortController.abort();

        await expect(externalBrowserFlowResult).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: 'Resume error copy.' }],
            },
          },
        });
        expect(externalWindowClose).toHaveBeenCalledTimes(1);
      });
    });

    describe('metadata-key fallback', () => {
      it('step has no externalBrowserFlow error copy → synthesised error has no messages', async () => {
        openSpy.mockReturnValue(null);

        const result = await runExternalBrowserFlow(
          createMockExternalBrowserFlowAction(),
          closeDelay,
          abortController.signal,
          stepWithoutErrorMetadata
        );

        expect(result).toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [],
            },
          },
        });
      });
    });
  });
});

function sendBrowserMessage({
  source,
  origin,
  data,
}: {
  source: MessageEventSource | null;
  origin: string;
  data: unknown;
}) {
  window.dispatchEvent(new MessageEvent('message', { source, origin, data }));
}

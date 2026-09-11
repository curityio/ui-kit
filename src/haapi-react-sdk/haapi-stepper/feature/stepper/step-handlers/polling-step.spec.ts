/*
 * Copyright (C) 2026 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handlePollingStep } from './polling-step';
import { pollingBankIdStep, pollingPendingStep } from '../../../util/tests/api-responses';
import { createMockFormAction, createPollingStep, defaultStepperAPI } from '../../../util/tests/mocks';
import { HAAPI_POLLING_STATUS, HaapiPollingStep } from '../../../data-access/types/haapi-step.types';
import { HAAPI_ACTION_TYPES, HAAPI_FORM_ACTION_KINDS } from '../../../data-access/types/haapi-action.types';
import type {
  HaapiStepperConfig,
  HaapiStepperHistoryEntry,
  HaapiStepperPollingStep,
  HaapiStepperStep,
} from '../haapi-stepper.types';

const mockOpenBankIdApp = vi.hoisted(() => vi.fn());
vi.mock('../../actions/client-operation/operations/bankid/open-bankid-app', () => ({
  openBankIdApp: mockOpenBankIdApp,
}));

const DEFAULT_POLLING_INTERVAL = 3000;
// The shared mock turns BankID autostart off; the SDK default is on, so mirror the default here.
const config: HaapiStepperConfig = {
  ...defaultStepperAPI.config,
  defaultPollingInterval: DEFAULT_POLLING_INTERVAL,
  bankIdAutostart: true,
};

describe('handlePollingStep', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
    mockOpenBankIdApp.mockReset();
  });

  describe('Polling Status', () => {
    describe('PENDING', () => {
      it('triggers the poll action after the interval to request the next step', () => {
        const { nextStep } = handleStep(getTestPollingStep());

        vi.runAllTimers();

        expect(nextStep).toHaveBeenCalledTimes(1);
        expect(nextStep).toHaveBeenCalledWith(expect.objectContaining({ kind: HAAPI_FORM_ACTION_KINDS.POLL }));
      });

      it('returns the step without its poll action so the UI does not render it', () => {
        const { resultStep } = handleStep(getTestPollingStep());

        const kinds = (resultStep as HaapiStepperPollingStep).actions.map(action => action.kind);
        expect(kinds).not.toContain(HAAPI_FORM_ACTION_KINDS.POLL);
        expect(kinds).toContain(HAAPI_FORM_ACTION_KINDS.CANCEL);
      });

      it('keeps the scheduled timer in pendingOperation so the stepper can cancel it', () => {
        const { pendingOperation } = handleStep(getTestPollingStep());

        expect(pendingOperation.current).not.toBeNull();
      });

      it('throws when the step carries no poll action', () => {
        const stepWithoutPollAction = createPollingStep({
          actions: [createMockFormAction({ kind: HAAPI_FORM_ACTION_KINDS.CANCEL })],
        });

        expect(() => handleStep(stepWithoutPollAction)).toThrow(
          'Polling step must have a poll action when status is pending'
        );
      });

      describe('polling interval', () => {
        it('uses the server interval when the step carries one', () => {
          const stepPollingInterval = '500';
          const testPollingStep = getTestPollingStep(stepPollingInterval);

          expectNextPollScheduledAfter(stepPollingInterval, testPollingStep);
        });

        it('falls back to defaultPollingInterval when the step carries none', () => {
          const testPollingStep = getTestPollingStep();

          expectNextPollScheduledAfter(DEFAULT_POLLING_INTERVAL, testPollingStep);
        });

        it.each(['abc', '0', '-1', ''])(
          'falls back to defaultPollingInterval for a malformed server interval (%j)',
          stepPollingInterval => {
            const testPollingStep = getTestPollingStep(stepPollingInterval);

            expectNextPollScheduledAfter(DEFAULT_POLLING_INTERVAL, testPollingStep);
          }
        );
      });
    });

    describe('DONE', () => {
      it('triggers the first form action right away to request the next step', () => {
        const doneStep = pollingPendingStep('/polling-url', HAAPI_POLLING_STATUS.DONE);

        const { nextStep } = handleStep(doneStep);

        expect(nextStep).toHaveBeenCalledTimes(1);
        expect(nextStep).toHaveBeenCalledWith(
          expect.objectContaining({ kind: HAAPI_FORM_ACTION_KINDS.AUTHENTICATOR_SELECTOR })
        );
      });

      it('does not trigger any action when the step carries none', () => {
        const doneStepWithoutActions = createPollingStep({ status: HAAPI_POLLING_STATUS.DONE, actions: [] });

        const { nextStep, resultStep } = handleStep(doneStepWithoutActions);

        expect(nextStep).not.toHaveBeenCalled();
        expect(resultStep.type).toBe(doneStepWithoutActions.type);
      });
    });

    describe('FAILED', () => {
      it.each([HAAPI_FORM_ACTION_KINDS.REDIRECT, HAAPI_FORM_ACTION_KINDS.CONTINUE])(
        'triggers the only action to request the next step when it is a %s',
        kind => {
          const failedStep = createPollingStep({
            status: HAAPI_POLLING_STATUS.FAILED,
            actions: [createMockFormAction({ kind })],
          });

          const { nextStep } = handleStep(failedStep);

          expect(nextStep).toHaveBeenCalledTimes(1);
          expect(nextStep).toHaveBeenCalledWith(expect.objectContaining({ kind }));
        }
      );

      it('does not trigger the only action when it needs the user, such as cancel', () => {
        const failedStep = createPollingStep({
          status: HAAPI_POLLING_STATUS.FAILED,
          actions: [createMockFormAction({ kind: HAAPI_FORM_ACTION_KINDS.CANCEL })],
        });

        const { nextStep } = handleStep(failedStep);

        expect(nextStep).not.toHaveBeenCalled();
      });

      it('does not trigger any action when the user has several to choose from', () => {
        const failedStep = createPollingStep({
          status: HAAPI_POLLING_STATUS.FAILED,
          actions: [
            createMockFormAction({ kind: HAAPI_FORM_ACTION_KINDS.REDIRECT }),
            createMockFormAction({ kind: HAAPI_FORM_ACTION_KINDS.CANCEL }),
          ],
        });

        const { nextStep } = handleStep(failedStep);

        expect(nextStep).not.toHaveBeenCalled();
      });
    });
  });

  describe('BankID', () => {
    describe('autostart', () => {
      it('opens the BankID app on the first pending BankID step', () => {
        handleStep(pollingBankIdStep('/polling-url'));

        expect(mockOpenBankIdApp).toHaveBeenCalledTimes(1);
        expect(mockOpenBankIdApp).toHaveBeenCalledWith(
          expect.objectContaining({ template: HAAPI_ACTION_TYPES.CLIENT_OPERATION })
        );
      });

      it('does not open the BankID app when autostart is off', () => {
        handleStep(pollingBankIdStep('/polling-url'), { config: { ...config, bankIdAutostart: false } });

        expect(mockOpenBankIdApp).not.toHaveBeenCalled();
      });

      it('opens the BankID app only once across consecutive polling steps', () => {
        const { resultStep: firstPollingStep } = handleStep(pollingBankIdStep('/polling-url'));
        const historyWithPreviousPollingStep = { history: [historyEntryFor(firstPollingStep)] };

        handleStep(pollingBankIdStep('/polling-url'), historyWithPreviousPollingStep);

        expect(mockOpenBankIdApp).toHaveBeenCalledTimes(1);
      });

      it('does not open the BankID app for a polling step of another authenticator', () => {
        handleStep(getTestPollingStep());

        expect(mockOpenBankIdApp).not.toHaveBeenCalled();
      });
    });
  });
});

function getTestPollingStep(stepPollingInterval?: string): HaapiPollingStep {
  return createPollingStep({
    interval: stepPollingInterval,
    actions: [
      createMockFormAction({ kind: HAAPI_FORM_ACTION_KINDS.POLL }),
      createMockFormAction({ kind: HAAPI_FORM_ACTION_KINDS.CANCEL }),
    ],
  });
}

// Mirrors what the stepper records after handling a step, so the follow-up poll sees it as its predecessor.
function historyEntryFor(step: HaapiStepperStep): HaapiStepperHistoryEntry {
  return { step, timestamp: new Date() } as HaapiStepperHistoryEntry;
}

function handleStep(
  pollingStep: HaapiPollingStep,
  options: { config?: HaapiStepperConfig; history?: HaapiStepperHistoryEntry[] } = {}
) {
  const nextStep = vi.fn();
  const pendingOperation: { current: AbortController | NodeJS.Timeout | null } = { current: null };
  const resultStep = handlePollingStep(
    pollingStep,
    pendingOperation,
    nextStep,
    options.config ?? config,
    options.history ?? []
  );
  return { nextStep, pendingOperation, resultStep };
}

function expectNextPollScheduledAfter(expectedInterval: string | number, pollingStep: HaapiPollingStep): void {
  const { nextStep } = handleStep(pollingStep);

  const ms = Number(expectedInterval);
  vi.advanceTimersByTime(ms - 1);
  expect(nextStep).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(nextStep).toHaveBeenCalledTimes(1);
}

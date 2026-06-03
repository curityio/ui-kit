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

import {
  HaapiAction,
  HAAPI_ACTION_CLIENT_OPERATIONS,
  HAAPI_ACTION_TYPES,
  HaapiExternalBrowserFlowClientOperationAction,
} from '../../../../../data-access/types/haapi-action.types';
import { HaapiStep } from '../../../../../data-access/types/haapi-step.types';
import { ClientOperationResult } from '../typings';
import { getHaapiStepperError } from '../helpers';
import { EXTERNAL_BROWSER_FLOW_ERROR_TYPE } from './typings';

/**
 * Executes an external browser flow by opening a new window at the launch URL and waiting for the
 * completion message from that window.
 */
export function runExternalBrowserFlow(
  action: HaapiExternalBrowserFlowClientOperationAction,
  closeDelay: number,
  abortSignal: AbortSignal,
  currentStep: HaapiStep | null
): Promise<ClientOperationResult> {
  return new Promise(resolve => {
    const launchUrl = new URL(action.model.arguments.href, window.location.origin);
    launchUrl.searchParams.set('for_origin', window.location.origin);

    const externalWindow = window.open(launchUrl);
    if (!externalWindow) {
      resolve({
        clientOperationError: getHaapiStepperError(
          getExternalBrowserFlowErrorMessage(EXTERNAL_BROWSER_FLOW_ERROR_TYPE.LAUNCH, currentStep)
        ),
      });
      return;
    }

    const onMessage = (event: MessageEvent) => {
      if (event.source !== externalWindow) {
        return;
      }
      if (event.origin !== launchUrl.origin || typeof event.data !== 'string') {
        cleanup(true);
        resolve({
          clientOperationError: getHaapiStepperError(
            getExternalBrowserFlowErrorMessage(EXTERNAL_BROWSER_FLOW_ERROR_TYPE.RESUME, currentStep)
          ),
        });
        return;
      }

      cleanup(false);
      resolve({
        clientOperationData: {
          action: action.model.continueActions[0],
          payload: new Map([['_resume_nonce', event.data]]),
        },
      });
    };

    const onAbort = () => {
      cleanup(true);
      resolve({
        clientOperationError: getHaapiStepperError(
          getExternalBrowserFlowErrorMessage(EXTERNAL_BROWSER_FLOW_ERROR_TYPE.RESUME, currentStep)
        ),
      });
    };

    window.addEventListener('message', onMessage);
    abortSignal.addEventListener('abort', onAbort);

    const cleanup = (closeImmediately: boolean) => {
      window.removeEventListener('message', onMessage);
      abortSignal.removeEventListener('abort', onAbort);
      if (closeImmediately) {
        externalWindow.close();
      } else {
        setTimeout(() => externalWindow.close(), closeDelay);
      }
    };
  });
}

/**
 * Hardcoded English copy for each `EXTERNAL_BROWSER_FLOW_ERROR_TYPE` bucket. Used as the single
 * source of user-facing copy until the BE emits the equivalent
 * `step.metadata.viewData.error.clientOperation.externalBrowserFlow.<key>` keys (tracked
 * separately). When those keys land, switch `getExternalBrowserFlowErrorMessage` to read from
 * `currentStep` first and fall back to this map.
 */
export const EXTERNAL_BROWSER_FLOW_ERROR_MESSAGES = {
  launch: 'External browser flow could not start.',
  resume: 'External browser flow could not be resumed.',
} as const;

function getExternalBrowserFlowErrorMessage(
  type: EXTERNAL_BROWSER_FLOW_ERROR_TYPE,
  currentStep: HaapiStep | null
): string {
  // `currentStep` is kept on the signature for forward-compat with BE-supplied viewData copy.
  void currentStep;
  return type === EXTERNAL_BROWSER_FLOW_ERROR_TYPE.LAUNCH
    ? EXTERNAL_BROWSER_FLOW_ERROR_MESSAGES.launch
    : EXTERNAL_BROWSER_FLOW_ERROR_MESSAGES.resume;
}

export const isExternalBrowserFlowClientOperation = (
  action: HaapiAction
): action is HaapiExternalBrowserFlowClientOperationAction =>
  action.template === HAAPI_ACTION_TYPES.CLIENT_OPERATION &&
  action.model.name === HAAPI_ACTION_CLIENT_OPERATIONS.EXTERNAL_BROWSER_FLOW;

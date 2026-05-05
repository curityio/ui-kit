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

import {
  HaapiAction,
  HAAPI_ACTION_CLIENT_OPERATIONS,
  HAAPI_ACTION_TYPES,
  HaapiExternalBrowserFlowClientOperationAction,
} from '../../../../data-access/types/haapi-action.types';
import { HaapiFetchFormAction } from '../../../../data-access/types/haapi-fetch.types';

/**
 * Executes an external browser flow by opening a new window in the launch URL defined by the action and waiting for
 * the completion message from that window.
 *
 * When the flow completes, the returned promise resolves with the form action and values that should be used to resume
 * the flow via HAAPI.
 *
 * The flow can be cancelled by aborting the provided AbortSignal, in which case the external window is closed and the
 * returned promise is rejected.
 *
 * @param action the external browser flow action to execute
 * @param closeDelay the delay in milliseconds before closing the external window after successful completion
 * @param abortSignal an AbortSignal to listen to for cancellation of the flow
 * @returns a promise that represents the execution of the external browser flow
 */
export function runExternalBrowserFlow(
  action: HaapiExternalBrowserFlowClientOperationAction,
  closeDelay: number,
  abortSignal: AbortSignal
): Promise<HaapiFetchFormAction> {
  return new Promise((resolve, reject) => {
    const launchUrl = new URL(action.model.arguments.href);
    launchUrl.searchParams.set('for_origin', window.location.origin);

    const externalWindow = window.open(launchUrl);
    if (!externalWindow) {
      reject(new Error('Failed to open external browser window'));
      return;
    }

    const onMessage = (event: MessageEvent) => {
      if (event.source !== externalWindow) {
        return;
      }
      if (event.origin !== launchUrl.origin || typeof event.data !== 'string') {
        reject(new Error('External browser flow: unexpected origin or type in resume message'));
        return;
      }

      cleanup(false);
      resolve({ action: action.model.continueActions[0], payload: new Map([['_resume_nonce', event.data]]) });
    };

    const onAbort = () => {
      cleanup(true);
      reject(abortSignal.reason as Error);
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

export const isExternalBrowserFlowClientOperation = (
  action: HaapiAction
): action is HaapiExternalBrowserFlowClientOperationAction =>
  action.template === HAAPI_ACTION_TYPES.CLIENT_OPERATION &&
  action.model.name === HAAPI_ACTION_CLIENT_OPERATIONS.EXTERNAL_BROWSER_FLOW;

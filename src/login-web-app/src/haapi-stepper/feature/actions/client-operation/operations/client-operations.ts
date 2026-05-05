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
  HaapiClientOperationAction,
  HAAPI_ACTION_TYPES,
  HaapiAction,
} from '../../../../data-access/types/haapi-action.types';
import { HaapiLink } from '../../../../data-access/types/haapi-step.types';
import { RefObject } from 'react';
import { HaapiStepperAction, HaapiStepperLink } from '../../../stepper/haapi-stepper.types';
import { HaapiFetchFormAction } from '../../../../data-access/types/haapi-fetch.types';
import { isBankIdClientOperation, runBankIdAuthentication } from './bankid';
import { isExternalBrowserFlowClientOperation, runExternalBrowserFlow } from './external-browser-flow';
import {
  isWebAuthnAuthenticationClientOperation,
  isWebAuthnRegistrationClientOperation,
  runWebAuthnAuthentication,
  runWebAuthnRegistration,
} from './webauthn';

export function isClientOperation(
  action: HaapiAction | HaapiStepperAction | HaapiLink | HaapiStepperLink
): action is HaapiClientOperationAction {
  return 'template' in action && action.template === HAAPI_ACTION_TYPES.CLIENT_OPERATION;
}

/**
 * Performs a client operation, returning a continuation action and values if further action is required, or null if
 * no further action is required or if the operation was aborted.
 */
export async function performClientOperation(
  action: HaapiClientOperationAction,
  pendingOperation: RefObject<AbortController | NodeJS.Timeout | null>
): Promise<HaapiFetchFormAction | null> {
  const abortController = new AbortController();
  pendingOperation.current = abortController;

  try {
    if (isExternalBrowserFlowClientOperation(action)) {
      return await runExternalBrowserFlow(action, 2500, abortController.signal);
    }

    if (isWebAuthnRegistrationClientOperation(action)) {
      return await runWebAuthnRegistration(action, abortController.signal);
    }

    if (isWebAuthnAuthenticationClientOperation(action)) {
      return await runWebAuthnAuthentication(action, abortController.signal);
    }

    if (isBankIdClientOperation(action)) {
      return await runBankIdAuthentication(action);
    }
  } catch (err) {
    /**
     * If the operation was aborted by the caller, convert to null - i.e. no further action - instead of error
     * Note that the cancellation is triggered by code on this file and a 'reason' is not provided, so we can rely on
     * the error being the default AbortError.
     */
    if (abortController.signal.aborted && err instanceof DOMException && err.name === 'AbortError') {
      return null;
    }

    throw err;
  }

  throw new Error(`Unsupported client operation: ${action.model.name}`);
}

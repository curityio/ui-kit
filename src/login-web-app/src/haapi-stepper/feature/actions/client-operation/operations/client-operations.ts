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
  HaapiClientOperationAction,
  HAAPI_ACTION_TYPES,
  HaapiAction,
} from '../../../../data-access/types/haapi-action.types';
import { HaapiLink, HaapiStep } from '../../../../data-access/types/haapi-step.types';
import { RefObject } from 'react';
import { HaapiStepperAction, HaapiStepperLink } from '../../../stepper/haapi-stepper.types';
import { isBankIdClientOperation, runBankIdAuthentication } from './bankid';
import { isExternalBrowserFlowClientOperation, runExternalBrowserFlow } from './external-browser-flow';
import {
  isWebAuthnAuthenticationClientOperation,
  isWebAuthnRegistrationClientOperation,
  runWebAuthnAuthentication,
  runWebAuthnRegistration,
} from './webauthn';
import { ClientOperationResult } from './typings';

export function isClientOperation(
  action: HaapiAction | HaapiStepperAction | HaapiLink | HaapiStepperLink
): action is HaapiClientOperationAction {
  return 'template' in action && action.template === HAAPI_ACTION_TYPES.CLIENT_OPERATION;
}

export async function performClientOperation(
  action: HaapiClientOperationAction,
  pendingOperation: RefObject<AbortController | NodeJS.Timeout | null>,
  currentStep: HaapiStep | null
): Promise<ClientOperationResult> {
  const abortController = new AbortController();
  pendingOperation.current = abortController;
  const signal = abortController.signal;

  if (isWebAuthnRegistrationClientOperation(action)) {
    return runWebAuthnRegistration(action, signal, currentStep);
  }

  if (isWebAuthnAuthenticationClientOperation(action)) {
    return runWebAuthnAuthentication(action, signal, currentStep);
  }

  if (isExternalBrowserFlowClientOperation(action)) {
    return runExternalBrowserFlow(action, 2500, signal, currentStep);
  }

  if (isBankIdClientOperation(action)) {
    return runBankIdAuthentication(action);
  }

  throw new Error(`Unsupported client operation: ${action.model.name}`);
}

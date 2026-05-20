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
import { HaapiLink, HaapiStep } from '../../../../data-access/types/haapi-step.types';
import { RefObject } from 'react';
import { HaapiStepperAction, HaapiStepperError, HaapiStepperLink } from '../../../stepper/haapi-stepper.types';
import { isBankIdClientOperation, runBankIdAuthentication } from './bankid';
import { isExternalBrowserFlowClientOperation, runExternalBrowserFlow } from './external-browser-flow';
import {
  isWebAuthnAuthenticationClientOperation,
  isWebAuthnRegistrationClientOperation,
  runWebAuthnAuthentication,
  runWebAuthnRegistration,
} from './webauthn';
import { ClientOperationResult } from './webauthn/typings';

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
    return runWebAuthnRegistration(action, signal, currentStep)
      .then(clientOperationData => ({ clientOperationData }))
      .catch(wrapStepperErrorOrRethrow);
  }

  if (isWebAuthnAuthenticationClientOperation(action)) {
    return runWebAuthnAuthentication(action, signal, currentStep)
      .then(clientOperationData => ({ clientOperationData }))
      .catch(wrapStepperErrorOrRethrow);
  }

  if (isExternalBrowserFlowClientOperation(action)) {
    return runExternalBrowserFlow(action, 2500, signal).then(clientOperationData => ({ clientOperationData }));
  }

  if (isBankIdClientOperation(action)) {
    return runBankIdAuthentication(action).then(clientOperationData => ({ clientOperationData }));
  }

  throw new Error(`Unsupported client operation: ${action.model.name}`);
}

/**
 * Catch-handler shared by the WebAuthn dispatcher branches. WebAuthn runners throw a
 * synthesised {@link HaapiStepperError} on ceremony failure (IS-11327); anything else is a
 * programming bug or an unexpected runtime error and should escape to the React error boundary
 * rather than being misrouted into `error.app`. The type guard discriminates between the two.
 */
function isHaapiStepperError(value: unknown): value is HaapiStepperError {
  return typeof value === 'object' && value !== null && ('app' in value || 'input' in value);
}

function wrapStepperErrorOrRethrow(rejection: unknown): ClientOperationResult {
  if (isHaapiStepperError(rejection)) {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment -- `rejection` is narrowed to HaapiStepperError by the guard above; the rule still flags it as error-typed because the parent type was `unknown`.
    return { clientOperationError: rejection };
  }
  // Rethrow non-conforming rejections (programming bugs / unexpected runtime errors) so the
  // React error boundary handles them — they're not routed into `error.app`.
  // eslint-disable-next-line @typescript-eslint/only-throw-error
  throw rejection;
}

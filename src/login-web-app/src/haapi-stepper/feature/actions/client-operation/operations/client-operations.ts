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
import {
  HAAPI_PROBLEM_STEPS,
  HaapiLink,
  HaapiStep,
  HaapiUserMessage,
} from '../../../../data-access/types/haapi-step.types';
import { RefObject } from 'react';
import { HaapiStepperAction, HaapiStepperError, HaapiStepperLink } from '../../../stepper/haapi-stepper.types';
import { formatErrorStepData } from '../../../stepper/data-formatters/problem-step';
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

/**
 * Synthesises a {@link HaapiStepperError} for a client-operation failure (IS-11327).
 *
 * Client-operation failures (WebAuthn ceremony cancel / timeout / parse error / unsupported
 * API today; BankID / EBF on the same pattern when their per-operation error handling lands)
 * happen on the client and aren't part of the HAAPI response, so the stepper has no native
 * category for them. We treat them as `AppError`-class problems of the current step — building
 * a `HaapiUnexpectedProblemStep` via {@link formatErrorStepData} — so they surface via
 * `useHaapiStepper().error.app` like any server-driven problem and consumers handle them
 * through the same channel (e.g. `HaapiStepperErrorNotifier`).
 *
 * Callers resolve the user-facing copy themselves (typically from
 * `step.metadata.viewData.error.clientOperation.<operationKey>`) and pass the resolved string
 * here. Empty/undefined → synthesised step has no `messages` and consumers fall back to
 * whatever copy they choose.
 */
export function getHaapiStepperError(messageText: string | undefined): HaapiStepperError {
  const messages: HaapiUserMessage[] = messageText ? [{ text: messageText }] : [];
  return formatErrorStepData({
    type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
    messages,
  });
}

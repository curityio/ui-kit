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
  HAAPI_WEBAUTHN_REGISTRATION_SELECTED_OPTION,
  HaapiWebAuthnAuthenticationClientOperationAction,
  HaapiWebAuthnRegistrationClientOperationAction,
} from '../../../../../data-access/types/haapi-action.types';
import { HaapiFetchFormAction } from '../../../../../data-access/types/haapi-fetch.types';
import { HAAPI_PROBLEM_STEPS, HaapiStep, HaapiUserMessage } from '../../../../../data-access/types/haapi-step.types';
import type { HaapiStepperError } from '../../../../stepper/haapi-stepper.types';
import { formatErrorStepData } from '../../../../stepper/data-formatters/problem-step';
import { isPasskeysWebAuthnRegistrationAction, isWebAuthnApiSupported } from './utils';
import { WEBAUTHN_ERROR_TYPE, WEBAUTHN_OPERATION } from './typings';

/**
 * Executes the `webauthn-registration` ceremony and returns the HAAPI continuation form
 * action and optional payload on success.
 *
 * Throws a synthesised {@link HaapiStepperError} on every ceremony including unsupported-API
 * and null credential returns.
 */
export async function runWebAuthnRegistration(
  action: HaapiWebAuthnRegistrationClientOperationAction,
  abortSignal: AbortSignal,
  currentStep: HaapiStep | null
): Promise<HaapiFetchFormAction> {
  const selectedOption = getWebAuthnRegistrationSelectedOption(action);
  const credential = await createWebAuthnRegistrationCredential(action, abortSignal, currentStep);

  return {
    action: action.model.continueActions[0],
    payload: { [selectedOption]: credential.toJSON() as unknown },
  };
}

/**
 * Executes the `webauthn-authentication` ceremony and returns the HAAPI continuation form
 * action and optional payload on success.
 *
 * Throws a synthesised {@link HaapiStepperError} on every ceremony including unsupported-API
 * and null credential returns.
 */
export async function runWebAuthnAuthentication(
  action: HaapiWebAuthnAuthenticationClientOperationAction,
  abortSignal: AbortSignal,
  currentStep: HaapiStep | null
): Promise<HaapiFetchFormAction> {
  const credential = await getWebAuthnAuthenticationCredential(action, abortSignal, currentStep);

  return {
    action: action.model.continueActions[0],
    payload: { credential: credential.toJSON() as unknown },
  };
}

async function createWebAuthnRegistrationCredential(
  action: HaapiWebAuthnRegistrationClientOperationAction,
  abortSignal: AbortSignal,
  currentStep: HaapiStep | null
): Promise<PublicKeyCredential> {
  if (!isWebAuthnApiSupported()) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- synthesised HaapiStepperError (data, not Error instance); caught + wrapped by `performClientOperation` (IS-11327)
    throw getHaapiStepperError(WEBAUTHN_ERROR_TYPE.FAILED, WEBAUTHN_OPERATION.REGISTRATION, currentStep);
  }

  let credential: PublicKeyCredential | null;
  try {
    const publicKey = PublicKeyCredential.parseCreationOptionsFromJSON(getWebAuthnRegistrationCreationOptions(action));
    credential = (await navigator.credentials.create({
      publicKey,
      signal: abortSignal,
    })) as PublicKeyCredential | null;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- synthesised HaapiStepperError (data, not Error instance); caught + wrapped by `performClientOperation` (IS-11327)
    throw getHaapiStepperError(getWebAuthnErrorType(error), WEBAUTHN_OPERATION.REGISTRATION, currentStep);
  }

  if (credential === null) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- synthesised HaapiStepperError (data, not Error instance); caught + wrapped by `performClientOperation` (IS-11327)
    throw getHaapiStepperError(WEBAUTHN_ERROR_TYPE.CANCEL_OR_TIMEOUT, WEBAUTHN_OPERATION.REGISTRATION, currentStep);
  }

  return credential;
}

async function getWebAuthnAuthenticationCredential(
  action: HaapiWebAuthnAuthenticationClientOperationAction,
  abortSignal: AbortSignal,
  currentStep: HaapiStep | null
): Promise<PublicKeyCredential> {
  if (!isWebAuthnApiSupported()) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- synthesised HaapiStepperError (data, not Error instance); caught + wrapped by `performClientOperation` (IS-11327)
    throw getHaapiStepperError(WEBAUTHN_ERROR_TYPE.FAILED, WEBAUTHN_OPERATION.AUTHENTICATION, currentStep);
  }

  let credential: PublicKeyCredential | null;
  try {
    const publicKey = PublicKeyCredential.parseRequestOptionsFromJSON(
      action.model.arguments.credentialRequestOptions.publicKey
    );
    credential = (await navigator.credentials.get({
      publicKey,
      signal: abortSignal,
    })) as PublicKeyCredential | null;
  } catch (error) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- synthesised HaapiStepperError (data, not Error instance); caught + wrapped by `performClientOperation` (IS-11327)
    throw getHaapiStepperError(getWebAuthnErrorType(error), WEBAUTHN_OPERATION.AUTHENTICATION, currentStep);
  }

  if (credential === null) {
    // eslint-disable-next-line @typescript-eslint/only-throw-error -- synthesised HaapiStepperError (data, not Error instance); caught + wrapped by `performClientOperation` (IS-11327)
    throw getHaapiStepperError(WEBAUTHN_ERROR_TYPE.CANCEL_OR_TIMEOUT, WEBAUTHN_OPERATION.AUTHENTICATION, currentStep);
  }

  return credential;
}

/**
 * Synthesises a {@link HaapiStepperError} for a WebAuthn ceremony failure.
 *
 * Client-operation failures happen on the client and aren't part of the HAAPI response, so
 * the stepper has no native category for them. We treat them as `AppError`-class problems of
 * the current step — building a `HaapiUnexpectedProblemStep` via {@link formatErrorStepData} —
 * so they surface via `useHaapiStepper().error.app` like any server-driven problem and
 * consumers handle them through the same channel (e.g. `HaapiStepperErrorNotifier`).
 *
 * Message copy comes from `step.metadata.messages.error` per
 * `type` and `operation`.
 */
function getHaapiStepperError(
  type: WEBAUTHN_ERROR_TYPE,
  operation: WEBAUTHN_OPERATION,
  currentStep: HaapiStep | null
): HaapiStepperError {
  const webauthnErrors = currentStep?.metadata?.messages?.error?.clientOperation?.webauthn;
  const messageText =
    type === WEBAUTHN_ERROR_TYPE.CANCEL_OR_TIMEOUT
      ? (webauthnErrors?.cancelOrTimeout ?? '')
      : operation === WEBAUTHN_OPERATION.REGISTRATION
        ? (webauthnErrors?.registration ?? '')
        : (webauthnErrors?.authentication ?? '');
  const messages: HaapiUserMessage[] = messageText ? [{ text: messageText }] : [];

  return formatErrorStepData({
    type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
    messages,
  });
}

function getWebAuthnErrorType(error: unknown): WEBAUTHN_ERROR_TYPE {
  if (error instanceof DOMException && (error.name === 'NotAllowedError' || error.name === 'AbortError')) {
    return WEBAUTHN_ERROR_TYPE.CANCEL_OR_TIMEOUT;
  }
  return WEBAUTHN_ERROR_TYPE.FAILED;
}

function getWebAuthnRegistrationSelectedOption(
  action: HaapiWebAuthnRegistrationClientOperationAction
): HAAPI_WEBAUTHN_REGISTRATION_SELECTED_OPTION {
  if (isPasskeysWebAuthnRegistrationAction(action)) {
    return HAAPI_WEBAUTHN_REGISTRATION_SELECTED_OPTION.CREDENTIAL;
  }

  const anyDeviceWebAuthRegistrationArgs = action.model.arguments;
  if (anyDeviceWebAuthRegistrationArgs.platformCredentialCreationOptions) {
    return HAAPI_WEBAUTHN_REGISTRATION_SELECTED_OPTION.PLATFORM_CREDENTIAL;
  } else {
    return HAAPI_WEBAUTHN_REGISTRATION_SELECTED_OPTION.CROSS_PLATFORM_CREDENTIAL;
  }
}

function getWebAuthnRegistrationCreationOptions(
  action: HaapiWebAuthnRegistrationClientOperationAction
): PublicKeyCredentialCreationOptionsJSON {
  if (isPasskeysWebAuthnRegistrationAction(action)) {
    return action.model.arguments.credentialCreationOptions.publicKey;
  }

  const anyDeviceWebAuthRegistrationArgs = action.model.arguments;
  if (anyDeviceWebAuthRegistrationArgs.platformCredentialCreationOptions) {
    return anyDeviceWebAuthRegistrationArgs.platformCredentialCreationOptions.publicKey;
  } else {
    return anyDeviceWebAuthRegistrationArgs.crossPlatformCredentialCreationOptions.publicKey;
  }
}

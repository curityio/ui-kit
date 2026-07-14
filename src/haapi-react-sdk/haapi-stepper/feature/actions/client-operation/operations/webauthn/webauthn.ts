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
import { HaapiStep } from '../../../../../data-access/types/haapi-step.types';
import type { HaapiStepperError } from '../../../../stepper/haapi-stepper.types';
import { isPasskeysWebAuthnRegistrationAction, isWebAuthnApiSupported } from './utils';
import { WEBAUTHN_ERROR_TYPE, WEBAUTHN_OPERATION } from './typings';
import { ClientOperationResult } from '../typings';
import { getHaapiStepperError } from '../helpers';

type WebAuthnCredentialResult =
  | { credential: PublicKeyCredential; error?: undefined }
  | { credential?: undefined; error: HaapiStepperError };

export async function runWebAuthnRegistration(
  action: HaapiWebAuthnRegistrationClientOperationAction,
  abortSignal: AbortSignal,
  currentStep: HaapiStep | null
): Promise<ClientOperationResult> {
  const selectedOption = getWebAuthnRegistrationSelectedOption(action);
  const { credential, error } = await createWebAuthnRegistrationCredential(action, abortSignal, currentStep);

  if (error) {
    return { clientOperationError: error };
  }

  return {
    clientOperationData: {
      action: action.model.continueActions[0],
      payload: { [selectedOption]: credential.toJSON() as unknown },
    },
  };
}

export async function runWebAuthnAuthentication(
  action: HaapiWebAuthnAuthenticationClientOperationAction,
  abortSignal: AbortSignal,
  currentStep: HaapiStep | null
): Promise<ClientOperationResult> {
  const { credential, error } = await getWebAuthnAuthenticationCredential(action, abortSignal, currentStep);

  if (error) {
    return { clientOperationError: error };
  }

  return {
    clientOperationData: {
      action: action.model.continueActions[0],
      payload: { credential: credential.toJSON() as unknown },
    },
  };
}

async function createWebAuthnRegistrationCredential(
  action: HaapiWebAuthnRegistrationClientOperationAction,
  abortSignal: AbortSignal,
  currentStep: HaapiStep | null
): Promise<WebAuthnCredentialResult> {
  if (!isWebAuthnApiSupported()) {
    return {
      error: getHaapiStepperError(
        getWebAuthnErrorMessage(WEBAUTHN_ERROR_TYPE.NOT_SUPPORTED, WEBAUTHN_OPERATION.REGISTRATION, currentStep)
      ),
    };
  }

  try {
    const publicKey = PublicKeyCredential.parseCreationOptionsFromJSON(getWebAuthnRegistrationCreationOptions(action));
    const credential = (await navigator.credentials.create({
      publicKey,
      signal: abortSignal,
    })) as PublicKeyCredential | null;

    if (credential === null) {
      return {
        error: getHaapiStepperError(
          getWebAuthnErrorMessage(WEBAUTHN_ERROR_TYPE.FAILED, WEBAUTHN_OPERATION.REGISTRATION, currentStep)
        ),
      };
    }

    return { credential };
  } catch (error) {
    return {
      error: getHaapiStepperError(
        getWebAuthnErrorMessage(getWebAuthnErrorType(error), WEBAUTHN_OPERATION.REGISTRATION, currentStep)
      ),
    };
  }
}

async function getWebAuthnAuthenticationCredential(
  action: HaapiWebAuthnAuthenticationClientOperationAction,
  abortSignal: AbortSignal,
  currentStep: HaapiStep | null
): Promise<WebAuthnCredentialResult> {
  if (!isWebAuthnApiSupported()) {
    return {
      error: getHaapiStepperError(
        getWebAuthnErrorMessage(WEBAUTHN_ERROR_TYPE.NOT_SUPPORTED, WEBAUTHN_OPERATION.AUTHENTICATION, currentStep)
      ),
    };
  }

  try {
    const publicKey = PublicKeyCredential.parseRequestOptionsFromJSON(
      action.model.arguments.credentialRequestOptions.publicKey
    );
    const credential = (await navigator.credentials.get({
      publicKey,
      signal: abortSignal,
    })) as PublicKeyCredential | null;

    if (credential === null) {
      return {
        error: getHaapiStepperError(
          getWebAuthnErrorMessage(WEBAUTHN_ERROR_TYPE.FAILED, WEBAUTHN_OPERATION.AUTHENTICATION, currentStep)
        ),
      };
    }

    return { credential };
  } catch (error) {
    return {
      error: getHaapiStepperError(
        getWebAuthnErrorMessage(getWebAuthnErrorType(error), WEBAUTHN_OPERATION.AUTHENTICATION, currentStep)
      ),
    };
  }
}

export const WEBAUTHN_ERROR_MESSAGES = {
  cancelOrTimeout: 'The operation was cancelled or timed out.',
  notSupported: 'WebAuthn is currently not supported in this browser.',
  registration: 'Registration failed.',
  authentication: 'Authentication failed.',
} as const;

// The stable key suffix each error resolves to in `metadata.viewData.messages`. The full key's
// prefix varies per authenticator + flow (webauthn/passkeys, register/authenticate-device), but the
// step carries a single authenticator+flow, so a suffix match uniquely selects the localized copy.
function getWebAuthnErrorViewDataSuffix(type: WEBAUTHN_ERROR_TYPE, operation: WEBAUTHN_OPERATION): string {
  switch (type) {
    case WEBAUTHN_ERROR_TYPE.CANCEL_OR_TIMEOUT:
      return '.view.error.cancel-or-timeout';
    case WEBAUTHN_ERROR_TYPE.NOT_SUPPORTED:
      return '.view.error.not-supported';
    case WEBAUTHN_ERROR_TYPE.FAILED:
      return operation === WEBAUTHN_OPERATION.REGISTRATION ? '.view.error.registration' : '.view.error.authentication';
  }
}

function getWebAuthnErrorFallback(type: WEBAUTHN_ERROR_TYPE, operation: WEBAUTHN_OPERATION): string {
  switch (type) {
    case WEBAUTHN_ERROR_TYPE.CANCEL_OR_TIMEOUT:
      return WEBAUTHN_ERROR_MESSAGES.cancelOrTimeout;
    case WEBAUTHN_ERROR_TYPE.NOT_SUPPORTED:
      return WEBAUTHN_ERROR_MESSAGES.notSupported;
    case WEBAUTHN_ERROR_TYPE.FAILED:
      return operation === WEBAUTHN_OPERATION.REGISTRATION
        ? WEBAUTHN_ERROR_MESSAGES.registration
        : WEBAUTHN_ERROR_MESSAGES.authentication;
  }
}

function getWebAuthnErrorMessage(
  type: WEBAUTHN_ERROR_TYPE,
  operation: WEBAUTHN_OPERATION,
  currentStep: HaapiStep | null
): string {
  const suffix = getWebAuthnErrorViewDataSuffix(type, operation);
  const messages = currentStep?.metadata?.viewData?.messages ?? {};
  const localizedMessage = Object.entries(messages).find(([key]) => key.endsWith(suffix))?.[1];

  return localizedMessage ?? getWebAuthnErrorFallback(type, operation);
}

function getWebAuthnErrorType(error: unknown): WEBAUTHN_ERROR_TYPE {
  if (!(error instanceof DOMException)) {
    throw error;
  }
  if (error.name === 'NotAllowedError' || error.name === 'AbortError') {
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

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
  HAAPI_WEBAUTHN_REGISTRATION_SELECTED_OPTION,
  HaapiWebAuthnAuthenticationClientOperationAction,
  HaapiWebAuthnRegistrationClientOperationAction,
} from '../../../../../data-access/types/haapi-action.types';
import { HaapiFetchFormAction } from '../../../../../data-access/types/haapi-fetch.types';
import { isAnyDeviceWebAuthnRegistrationAction, isPasskeysWebAuthnRegistrationAction } from './utils';

const WEBAUTHN_API_NOT_SUPPORTED_ERROR_MESSAGE = 'WebAuthn API is not supported in this browser';

export function isWebAuthnApiSupported(): boolean {
  return (
    typeof PublicKeyCredential === 'function' &&
    typeof PublicKeyCredential.parseCreationOptionsFromJSON === 'function' &&
    typeof PublicKeyCredential.parseRequestOptionsFromJSON === 'function'
  );
}

/**
 * Executes the `webauthn-registration` ceremony: prompts the browser for a new public-key
 * credential and returns the HAAPI continue-action with the credential serialised under the
 * payload key matching the option the server offered (`credential` / `platformCredential` /
 * `crossPlatformCredential` (`HAAPI_WEBAUTHN_REGISTRATION_SELECTED_OPTION`)).
 */
export async function runWebAuthnRegistration(
  action: HaapiWebAuthnRegistrationClientOperationAction,
  abortSignal: AbortSignal
): Promise<HaapiFetchFormAction> {
  if (!isWebAuthnApiSupported()) {
    throw new Error(WEBAUTHN_API_NOT_SUPPORTED_ERROR_MESSAGE);
  }

  const selectedOption = getWebAuthnRegistrationSelectedOption(action);
  const credential = await createWebAuthnRegistrationCredential(action, abortSignal);

  return {
    action: action.model.continueActions[0],
    payload: { [selectedOption]: credential.toJSON() as unknown },
  };
}

/**
 * Executes the `webauthn-authentication` ceremony: prompts the browser for an existing
 * public-key credential and returns the HAAPI continue-action with the credential serialised
 * under the `credential` payload key.
 */
export async function runWebAuthnAuthentication(
  action: HaapiWebAuthnAuthenticationClientOperationAction,
  abortSignal: AbortSignal
): Promise<HaapiFetchFormAction> {
  if (!isWebAuthnApiSupported()) {
    throw new Error(WEBAUTHN_API_NOT_SUPPORTED_ERROR_MESSAGE);
  }

  const credential = await getWebAuthnAuthenticationCredential(action, abortSignal);

  return {
    action: action.model.continueActions[0],
    payload: { credential: credential.toJSON() as unknown },
  };
}

async function createWebAuthnRegistrationCredential(
  action: HaapiWebAuthnRegistrationClientOperationAction,
  abortSignal: AbortSignal
): Promise<PublicKeyCredential> {
  const creationOptions = getWebAuthnRegistrationCreationOptions(action);
  const publicKey = PublicKeyCredential.parseCreationOptionsFromJSON(creationOptions);
  const credential = (await navigator.credentials.create({
    publicKey,
    signal: abortSignal,
  })) as PublicKeyCredential | null;

  if (credential === null) {
    throw new Error('Could not create credential');
  }

  return credential;
}

async function getWebAuthnAuthenticationCredential(
  action: HaapiWebAuthnAuthenticationClientOperationAction,
  abortSignal: AbortSignal
): Promise<PublicKeyCredential> {
  const publicKey = PublicKeyCredential.parseRequestOptionsFromJSON(
    action.model.arguments.credentialRequestOptions.publicKey
  );
  const credential = (await navigator.credentials.get({
    publicKey,
    signal: abortSignal,
  })) as PublicKeyCredential | null;

  if (credential === null) {
    throw new Error('Could not get credential');
  }

  return credential;
}

function getWebAuthnRegistrationSelectedOption(
  action: HaapiWebAuthnRegistrationClientOperationAction
): HAAPI_WEBAUTHN_REGISTRATION_SELECTED_OPTION {
  if (isPasskeysWebAuthnRegistrationAction(action)) {
    return HAAPI_WEBAUTHN_REGISTRATION_SELECTED_OPTION.CREDENTIAL;
  }

  if (isAnyDeviceWebAuthnRegistrationAction(action)) {
    const args = action.model.arguments;
    if (args.platformCredentialCreationOptions) {
      return HAAPI_WEBAUTHN_REGISTRATION_SELECTED_OPTION.PLATFORM_CREDENTIAL;
    }
    if (args.crossPlatformCredentialCreationOptions) {
      return HAAPI_WEBAUTHN_REGISTRATION_SELECTED_OPTION.CROSS_PLATFORM_CREDENTIAL;
    }
  }

  throw new Error('webauthn-registration action has no credential creation options');
}

function getWebAuthnRegistrationCreationOptions(
  action: HaapiWebAuthnRegistrationClientOperationAction
): PublicKeyCredentialCreationOptionsJSON {
  if (isPasskeysWebAuthnRegistrationAction(action)) {
    return action.model.arguments.credentialCreationOptions.publicKey;
  }

  if (isAnyDeviceWebAuthnRegistrationAction(action)) {
    const args = action.model.arguments;
    if (args.platformCredentialCreationOptions) {
      return args.platformCredentialCreationOptions.publicKey;
    }
    if (args.crossPlatformCredentialCreationOptions) {
      return args.crossPlatformCredentialCreationOptions.publicKey;
    }
  }

  throw new Error('webauthn-registration action has no credential creation options');
}

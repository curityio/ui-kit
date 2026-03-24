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
  HaapiExternalBrowserFlowClientOperationAction,
  HAAPI_ACTION_CLIENT_OPERATIONS,
  HAAPI_ACTION_TYPES,
  HaapiAction,
  HaapiWebAuthnAuthenticationClientOperationAction,
  HaapiWebAuthnRegistrationClientOperationAction,
  HaapiBankIdClientOperationAction,
} from '../../../data-access/types/haapi-action.types';
import { exhaustiveCheck } from '../../../../shared/util/type-utils';
import { HaapiLink } from '../../../data-access/types/haapi-step.types';
import { RefObject } from 'react';
import { HaapiStepperAction, HaapiStepperLink } from '../../stepper/haapi-stepper.types';
import { HaapiFetchFormAction } from '../../../data-access/types/haapi-fetch.types';
import { openBankIdApp } from './openBankIdApp';

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
      // TODO how to handle the different types of credentials on registration
      return await runWebAuthnRegistration(action, 'platformCredential', abortController.signal);
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

/**
 * Executes a WebAuthn registration operation, returning a request to continue the flow with the created credential.
 *
 * @param action the WebAuthn registration action to execute
 * @param selectedOption the selected credential option
 * @param abortSignal an AbortSignal to listen to for cancellation of the operation
 */
export async function runWebAuthnRegistration(
  action: HaapiWebAuthnRegistrationClientOperationAction,
  selectedOption: 'credential' | 'platformCredential' | 'crossPlatformCredential',
  abortSignal: AbortSignal
): Promise<HaapiFetchFormAction> {
  const isSupported =
    typeof PublicKeyCredential === 'function' && typeof PublicKeyCredential.parseCreationOptionsFromJSON === 'function';

  if (!isSupported) {
    throw new Error('PublicKeyCredential not supported');
  }

  let options: PublicKeyCredentialCreationOptionsJSON | undefined;

  switch (selectedOption) {
    case 'credential': {
      if ('credentialCreationOptions' in action.model.arguments) {
        options = action.model.arguments.credentialCreationOptions.publicKey;
      }
      break;
    }

    case 'platformCredential': {
      if ('platformCredentialCreationOptions' in action.model.arguments) {
        options = action.model.arguments.platformCredentialCreationOptions?.publicKey;
      }
      break;
    }

    case 'crossPlatformCredential': {
      if ('crossPlatformCredentialCreationOptions' in action.model.arguments) {
        options = action.model.arguments.crossPlatformCredentialCreationOptions?.publicKey;
      }
      break;
    }

    default:
      exhaustiveCheck(selectedOption);
  }

  if (options === undefined) {
    throw new Error('Could not find options for selected credential type');
  }

  const publicKey = PublicKeyCredential.parseCreationOptionsFromJSON(options);
  const credential = (await navigator.credentials.create({
    publicKey,
    signal: abortSignal,
  })) as PublicKeyCredential | null;

  if (credential === null) {
    throw new Error('Could not create credential');
  }

  const nextAction = action.model.continueActions[0];
  const payload = {
    [selectedOption]: credential.toJSON() as unknown,
  };

  return { action: nextAction, payload };
}

/**
 * Executes a WebAuthn authentication operation, returning a request to continue the flow with the obtained credential.
 *
 * @param action the WebAuthn authentication action to execute
 * @param abortSignal an AbortSignal to listen to for cancellation of the operation
 */
export async function runWebAuthnAuthentication(
  action: HaapiWebAuthnAuthenticationClientOperationAction,
  abortSignal: AbortSignal
): Promise<HaapiFetchFormAction> {
  const isSupported =
    typeof PublicKeyCredential === 'function' && typeof PublicKeyCredential.parseRequestOptionsFromJSON === 'function';

  if (!isSupported) {
    throw new Error('PublicKeyCredential not supported');
  }

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

  const nextAction = action.model.continueActions[0];
  const payload = {
    credential: credential.toJSON() as unknown,
  };
  return { action: nextAction, payload };
}

export async function runBankIdAuthentication(action: HaapiBankIdClientOperationAction): Promise<HaapiFetchFormAction> {
  openBankIdApp(action);

  const nextAction = action.model.continueActions[0];

  return Promise.resolve({ action: nextAction });
}

export const isBankIdClientOperation = (action: HaapiAction): action is HaapiBankIdClientOperationAction =>
  action.template === HAAPI_ACTION_TYPES.CLIENT_OPERATION &&
  action.model.name === HAAPI_ACTION_CLIENT_OPERATIONS.BANKID;

export const isExternalBrowserFlowClientOperation = (
  action: HaapiClientOperationAction
): action is HaapiExternalBrowserFlowClientOperationAction =>
  action.model.name === HAAPI_ACTION_CLIENT_OPERATIONS.EXTERNAL_BROWSER_FLOW;

export const isWebAuthnRegistrationClientOperation = (
  action: HaapiClientOperationAction
): action is HaapiWebAuthnRegistrationClientOperationAction =>
  action.model.name === HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_REGISTRATION;

export const isWebAuthnAuthenticationClientOperation = (
  action: HaapiClientOperationAction
): action is HaapiWebAuthnAuthenticationClientOperationAction =>
  action.model.name === HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_AUTHENTICATION;

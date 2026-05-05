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
  HAAPI_ACTION_CLIENT_OPERATIONS,
  HAAPI_ACTION_TYPES,
  HaapiAction,
  HaapiClientOperationAction,
  HaapiWebAuthnAnyDeviceRegistrationAction,
  HaapiWebAuthnAuthenticationClientOperationAction,
  HaapiWebAuthnPasskeysRegistrationAction,
  HaapiWebAuthnRegistrationClientOperationAction,
} from '../../../../../data-access/types/haapi-action.types';

const WEBAUTHN_PLATFORM_LABEL = 'This device';
const WEBAUTHN_CROSS_PLATFORM_LABEL = 'Another device';

/**
 * When the server returned both `platformCredentialCreationOptions` and
 * `crossPlatformCredentialCreationOptions` (any-device mode of the `webauthn` authenticator),
 * splits the action into two sibling actions — one per credential type, each with
 * `model.arguments` narrowed to its single creation-options key and `title` suffixed with the
 * matching English label (e.g. `"Register new device (This device)"`). Default action
 * rendering produces one button per emitted action.
 *
 * Single-option (any-device platform-only / cross-platform-only) and passkeys-mode actions
 * pass through unchanged.
 *
 * Throws if an any-device-mode action carries no creation options at all (malformed HAAPI).
 */
export function splitWebAuthnRegistrationAction(
  action: HaapiWebAuthnRegistrationClientOperationAction
): HaapiClientOperationAction[] {
  if (isAnyDeviceWebAuthnRegistrationAction(action)) {
    const args = action.model.arguments;

    const platformAction: HaapiClientOperationAction[] = args.platformCredentialCreationOptions
      ? [
          {
            ...action,
            title: composeTitle(action.title, WEBAUTHN_PLATFORM_LABEL),
            model: {
              ...action.model,
              arguments: { platformCredentialCreationOptions: args.platformCredentialCreationOptions },
            },
          },
        ]
      : [];

    const crossPlatformAction: HaapiClientOperationAction[] = args.crossPlatformCredentialCreationOptions
      ? [
          {
            ...action,
            title: composeTitle(action.title, WEBAUTHN_CROSS_PLATFORM_LABEL),
            model: {
              ...action.model,
              arguments: { crossPlatformCredentialCreationOptions: args.crossPlatformCredentialCreationOptions },
            },
          },
        ]
      : [];

    const webAuthActions = [...platformAction, ...crossPlatformAction];

    if (webAuthActions.length === 0) {
      throw new Error('webauthn-registration action has no credential creation options');
    }

    return webAuthActions;
  }

  return [action];
}

const composeTitle = (originalTitle: string | undefined, label: string): string =>
  originalTitle ? `${originalTitle} (${label})` : label;

export const isWebAuthnRegistrationClientOperation = (
  action: HaapiAction
): action is HaapiWebAuthnRegistrationClientOperationAction => {
  return (
    action.template === HAAPI_ACTION_TYPES.CLIENT_OPERATION &&
    action.model.name === HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_REGISTRATION
  );
};

export const isWebAuthnAuthenticationClientOperation = (
  action: HaapiAction
): action is HaapiWebAuthnAuthenticationClientOperationAction => {
  return (
    action.template === HAAPI_ACTION_TYPES.CLIENT_OPERATION &&
    action.model.name === HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_AUTHENTICATION
  );
};

export const isWebAuthnClientOperationAction = (action: HaapiAction): boolean =>
  isWebAuthnRegistrationClientOperation(action) || isWebAuthnAuthenticationClientOperation(action);

export function isPlatformOnlyAnyDeviceWebAuthnRegistrationAction(action: HaapiAction): boolean {
  if (!isWebAuthnRegistrationClientOperation(action) || !isAnyDeviceWebAuthnRegistrationAction(action)) {
    return false;
  }

  const args = action.model.arguments;

  return (
    args.platformCredentialCreationOptions !== undefined && args.crossPlatformCredentialCreationOptions === undefined
  );
}

/**
 * Passkeys-mode (`passkey` authenticator or `webauthn` in passkeys-mode) — the server collapses
 * platform vs cross-platform into a single option. Continue payload key: `credential`.
 */
export function isPasskeysWebAuthnRegistrationAction(
  action: HaapiWebAuthnRegistrationClientOperationAction
): action is HaapiWebAuthnPasskeysRegistrationAction {
  return 'credentialCreationOptions' in action.model.arguments;
}

/**
 * Any-device-mode (`webauthn` authenticator) — the server offers one or both of the platform /
 * cross-platform options for the user to pick from. Continue payload keys: `platformCredential`
 * and/or `crossPlatformCredential`.
 */
export function isAnyDeviceWebAuthnRegistrationAction(
  action: HaapiWebAuthnRegistrationClientOperationAction
): action is HaapiWebAuthnAnyDeviceRegistrationAction {
  return !isPasskeysWebAuthnRegistrationAction(action);
}

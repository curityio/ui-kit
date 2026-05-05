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

import { HaapiStepperClientOperationAction } from '../../stepper/haapi-stepper.types';
import {
  isPlatformOnlyAnyDeviceWebAuthnRegistrationAction,
  isWebAuthnApiSupported,
  isWebAuthnClientOperationAction,
  useIsWebAuthnPlatformAuthenticatorAvailable,
} from './operations/webauthn';

export function useIsClientOperationAvailable(action: HaapiStepperClientOperationAction): boolean {
  const isPlatformAuthenticatorAvailable = useIsWebAuthnPlatformAuthenticatorAvailable();

  if (isWebAuthnClientOperationAction(action) && !isWebAuthnApiSupported()) {
    return false;
  }
  if (isPlatformOnlyAnyDeviceWebAuthnRegistrationAction(action) && isPlatformAuthenticatorAvailable === false) {
    return false;
  }
  return true;
}

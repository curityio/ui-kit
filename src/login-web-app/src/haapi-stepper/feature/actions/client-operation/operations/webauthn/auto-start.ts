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

import type { HaapiStepperNextStep, HaapiStepperStep } from '../../../../stepper/haapi-stepper.types';
import {
  isPlatformOnlyAnyDeviceWebAuthnRegistrationAction,
  isWebAuthnApiSupported,
  isWebAuthnClientOperationAction,
  isWebAuthnPlatformAuthenticatorAvailable,
  requiresWebAuthnUserInteraction,
} from './utils';

export const manageWebAuthnAutoStart = async (
  step: HaapiStepperStep,
  nextStep: HaapiStepperNextStep
): Promise<void> => {
  if (!isWebAuthnApiSupported() || requiresWebAuthnUserInteraction()) {
    return;
  }

  const clientOperationActions = step.dataHelpers.actions?.clientOperation ?? [];
  const webAuthnActions = clientOperationActions.filter(isWebAuthnClientOperationAction);

  /*
   * Multi-option registration steps (any-device with both platform + cross-platform)
   * are split into two actions by `splitWebAuthnRegistrationAction` upstream, so they
   * won't trigger auto-start.
   */
  if (webAuthnActions.length !== 1) {
    return;
  }

  const action = webAuthnActions[0];

  if (isPlatformOnlyAnyDeviceWebAuthnRegistrationAction(action)) {
    const webAuthnPlatformAuthenticatorAvailable = await isWebAuthnPlatformAuthenticatorAvailable();
    if (!webAuthnPlatformAuthenticatorAvailable) {
      return;
    }
  }

  nextStep(action);
};

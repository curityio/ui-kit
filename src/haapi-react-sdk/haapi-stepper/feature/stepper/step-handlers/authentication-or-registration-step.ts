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

import type { HaapiAuthenticationStep, HaapiRegistrationStep } from '../../../data-access/types/haapi-step.types';
import { formatStepData } from '../data-formatters/format-step-data';
import type { HaapiStepperConfig, HaapiStepperNextStep, HaapiStepperStep } from '../haapi-stepper.types';
import { isWebAuthnStep, manageWebAuthnAutoStart } from '../../actions/client-operation/operations/webauthn';

export function handleAuthenticationOrRegistrationStep(
  step: HaapiAuthenticationStep | HaapiRegistrationStep,
  nextStep: HaapiStepperNextStep,
  config: HaapiStepperConfig
): HaapiStepperStep {
  const nextStepData = formatStepData(step);

  if (config.webAuthnAutostart && isWebAuthnStep(nextStepData)) {
    void manageWebAuthnAutoStart(nextStepData, nextStep);
  }

  return nextStepData;
}

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

import type { HaapiCompletedWithSuccessStep } from '../../../data-access/types/haapi-step.types';
import type { HaapiStepperConfig } from '../HaapiStepper';
import { formatNextStepData } from '../data-formatters/format-next-step-data';

export function handleCompletedWithSuccessStep(
  nextStepResponse: HaapiCompletedWithSuccessStep,
  config: HaapiStepperConfig
) {
  if (config.redirectOnAuthenticationCompletedWithSuccess) {
    const redirectHref = nextStepResponse.links?.find(
      (link) => link.rel === 'authorization-response'
    )?.href;

    if (!redirectHref) {
      throw new Error(
        'redirectOnAuthenticationCompletedWithSuccess is enabled, but the completed-with-success step did not include an authorization-response link.'
      );
    }

    window.location.href = redirectHref;
    return { nextStepData: undefined };
  }

  return { nextStepData: formatNextStepData(nextStepResponse) };
}

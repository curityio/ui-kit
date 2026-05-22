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

import { HAAPI_PROBLEM_STEPS, HAAPI_STEPS, type HaapiCompletedStep } from '../../../data-access/types/haapi-step.types';
import type { HaapiStepperConfig } from '../HaapiStepper';
import { AUTO_REDIRECT_ON_AUTHENTICATION_COMPLETE } from '../typings';
import { formatNextStepData } from '../data-formatters/format-next-step-data';

export function handleCompletedStep(step: HaapiCompletedStep, config: HaapiStepperConfig) {
  const isSuccess = step.type === HAAPI_STEPS.COMPLETED_WITH_SUCCESS;
  const isError = step.type === HAAPI_PROBLEM_STEPS.COMPLETED_WITH_ERROR;
  const setting = config.autoRedirectOnAuthenticationComplete;
  const shouldRedirect =
    setting === true ||
    (setting === AUTO_REDIRECT_ON_AUTHENTICATION_COMPLETE.ONLY_ON_SUCCESS && isSuccess) ||
    (setting === AUTO_REDIRECT_ON_AUTHENTICATION_COMPLETE.ONLY_ON_ERROR && isError);

  if (!shouldRedirect) {
    return { nextStepData: formatNextStepData(step) };
  }

  const redirectHref = step.links?.find(link => link.rel === 'authorization-response')?.href;

  if (!redirectHref) {
    throw new Error(
      `autoRedirectOnAuthenticationComplete is enabled, but the completed-with-${isSuccess ? 'success' : 'error'} step did not include an authorization-response link.`
    );
  }

  window.location.href = redirectHref;
  return { nextStepData: undefined };
}

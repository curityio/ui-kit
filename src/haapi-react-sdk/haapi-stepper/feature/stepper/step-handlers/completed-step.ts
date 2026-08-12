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

import { type HaapiCompletedStep } from '../../../data-access/types/haapi-step.types';
import { HAAPI_FORM_ACTION_KINDS, type HaapiFormAction } from '../../../data-access/types/haapi-action.types';
import type { HaapiStepperConfig } from '../haapi-stepper.types';
import { formatNextStepData } from '../data-formatters/format-next-step-data';

/**
 * Handles a terminal step by redirecting back to the client application that initiated the flow (when configured to
 * automatically do so).
 * This is always done via a top-level navigation, meaning that the current application will be unloaded. That's why
 * the window/document are modified directly, instead of rendering a component and using effects.
 */
export function handleCompletedStep(step: HaapiCompletedStep, config: HaapiStepperConfig) {
  if (!config.autoRedirectOnAuthenticationComplete) {
    return { nextStepData: formatNextStepData(step) };
  }

  if (tryHandleRedirectResponse(step) || tryHandleFormPostResponse(step)) {
    return { nextStepData: undefined };
  }

  throw new Error(
    `autoRedirectOnAuthenticationComplete is enabled, but the '${step.type}' step did not include an authorization-response link or action.`
  );
}

/**
 * Response modes that use redirect/GET.
 */
function tryHandleRedirectResponse(step: HaapiCompletedStep): boolean {
  const responseLink = step.links?.find(link => link.rel === 'authorization-response');
  if (responseLink) {
    window.location.href = responseLink.href;
    return true;
  }

  return false;
}

/**
 * Form POST response mode.
 */
function tryHandleFormPostResponse(step: HaapiCompletedStep): boolean {
  const responseAction = step.actions?.find(action => action.kind === HAAPI_FORM_ACTION_KINDS.AUTHORIZATION_RESPONSE);
  if (responseAction) {
    const htmlForm = createHtmlForm(responseAction);
    document.body.appendChild(htmlForm);
    htmlForm.submit();
    return true;
  }

  return false;
}

function createHtmlForm(action: HaapiFormAction): HTMLFormElement {
  const { href, method, fields } = action.model;

  const form = document.createElement('form');
  form.method = method;
  form.action = href;
  form.classList.add('hidden');

  (fields ?? []).forEach(field => {
    const input = document.createElement('input');
    input.type = field.type;
    input.name = field.name;
    input.value = field.value ?? '';
    form.appendChild(input);
  });

  return form;
}

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

import type { FC } from 'react';
import type { HaapiStepperAPIWithRequiredCurrentStep } from '../stepper/haapi-stepper.types';
import { BankIdViewNameBuiltInUI } from './BankIdViewNameBuiltInUI';
import { HaapiStepperViewNameBuiltInUI } from './viewname.types';

/**
 * Registry of built-in viewName UIs keyed by `HaapiStepperViewNameBuiltInUI`.
 *
 * Every enum member must have a matching entry here — this is the invariant that keeps the
 * set of "view names with built-in UX" in sync with the set of available components.
 */
export const VIEW_NAME_BUILT_IN_UIS_MAP: Record<
  HaapiStepperViewNameBuiltInUI,
  FC<HaapiStepperAPIWithRequiredCurrentStep>
> = {
  [HaapiStepperViewNameBuiltInUI.BANKID]: BankIdViewNameBuiltInUI,
};

export const VIEW_NAMES_BUILT_IN_UIS: HaapiStepperViewNameBuiltInUI[] = Object.values(HaapiStepperViewNameBuiltInUI);

export const getViewNameBuiltInUI = (
  haapiStepperAPI: HaapiStepperAPIWithRequiredCurrentStep,
  enableViewNameBuiltInUIs?: HaapiStepperViewNameBuiltInUI[] | boolean
): FC<HaapiStepperAPIWithRequiredCurrentStep> | undefined => {
  const currentViewName = haapiStepperAPI.currentStep.metadata?.viewName;
  const enabledViewNames: HaapiStepperViewNameBuiltInUI[] =
    enableViewNameBuiltInUIs === true
      ? VIEW_NAMES_BUILT_IN_UIS
      : Array.isArray(enableViewNameBuiltInUIs)
        ? enableViewNameBuiltInUIs
        : [];

  const isOptedInViewNameBuiltIn = (viewName: string): viewName is HaapiStepperViewNameBuiltInUI => {
    return enabledViewNames.includes(viewName as HaapiStepperViewNameBuiltInUI);
  };

  if (!currentViewName || !isOptedInViewNameBuiltIn(currentViewName)) {
    return undefined;
  }

  return VIEW_NAME_BUILT_IN_UIS_MAP[currentViewName];
};

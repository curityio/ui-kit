/*
 * Copyright (C) 2026 Curity AB. All rights reserved.
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
import type { ViewNameBuiltInUIProps } from './typings';
import { HaapiStepperViewNameBuiltInUI } from './viewname.types';

/**
 * Registry of built-in viewName UIs keyed by `HaapiStepperViewNameBuiltInUI`.
 *
 * Every enum member must have a matching entry here — this is the invariant that keeps the
 * set of "view names with built-in UX" in sync with the set of available components.
 */
export const VIEW_NAME_BUILT_IN_UI_MAP: Record<HaapiStepperViewNameBuiltInUI, FC<ViewNameBuiltInUIProps>> = {
  [HaapiStepperViewNameBuiltInUI.BANKID]: BankIdViewNameBuiltInUI,
};

const isBuiltInViewName = (viewName?: string): viewName is HaapiStepperViewNameBuiltInUI =>
  !!viewName && viewName in VIEW_NAME_BUILT_IN_UI_MAP;

export const getViewNameBuiltInUI = (
  haapiStepperAPI: HaapiStepperAPIWithRequiredCurrentStep
): FC<ViewNameBuiltInUIProps> | undefined => {
  const viewName = haapiStepperAPI.currentStep.metadata?.viewName;
  return isBuiltInViewName(viewName) ? VIEW_NAME_BUILT_IN_UI_MAP[viewName] : undefined;
};

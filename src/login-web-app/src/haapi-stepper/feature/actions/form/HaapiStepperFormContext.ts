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

import { createContext, use } from 'react';

import { HaapiStepperFormAction, HaapiStepperFormState } from '../../stepper/haapi-stepper.types';

export interface HaapiStepperFormContextValue {
  formState: HaapiStepperFormState;
  action: HaapiStepperFormAction;
  submit: () => void;
}

export const HaapiStepperFormContext = createContext<HaapiStepperFormContextValue | null>(null);

export function useHaapiStepperForm(): HaapiStepperFormContextValue {
  const context = use(HaapiStepperFormContext);
  if (!context) {
    throw new Error('useHaapiStepperForm must be used within a <HaapiStepperForm>.');
  }
  return context;
}

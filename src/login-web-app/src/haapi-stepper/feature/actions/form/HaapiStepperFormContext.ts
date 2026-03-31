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

// eslint-disable-next-line @eslint-react/no-use-context
import { createContext, useContext } from 'react';

import { HaapiStepperFormAction, HaapiStepperFormState } from '../../stepper/haapi-stepper.types';

export interface HaapiStepperFormContextValue {
  formState: HaapiStepperFormState;
  action: HaapiStepperFormAction;
  submit: () => void;
}

export const HaapiStepperFormContext = createContext<HaapiStepperFormContextValue | null>(null);

export function useHaapiStepperForm(): HaapiStepperFormContextValue {
  // eslint-disable-next-line @eslint-react/no-use-context -- useContext is preferred here over use() to keep explicit null handling
  const context = useContext(HaapiStepperFormContext);
  if (!context) {
    throw new Error('useHaapiStepperForm must be used within a <HaapiStepperForm>.');
  }
  return context;
}

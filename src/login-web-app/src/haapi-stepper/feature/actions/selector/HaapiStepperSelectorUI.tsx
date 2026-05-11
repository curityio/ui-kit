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

import { HAAPI_ACTION_TYPES } from '../../../data-access/types/haapi-action.types';
import type { HaapiStepperNextStep } from '../../stepper/haapi-stepper.types';
import {
  HaapiStepperClientOperationAction,
  HaapiStepperFormAction,
  HaapiStepperSelectorAction,
} from '../../stepper/haapi-stepper.types';
import { HaapiStepperFormUI } from '../form/HaapiStepperFormUI';

interface HaapiStepperSelectorUIProps {
  action: HaapiStepperSelectorAction;
  onSubmit: HaapiStepperNextStep<HaapiStepperFormAction | HaapiStepperClientOperationAction>;
}

/**
 * @description
 * # SELECTOR ACTION COMPONENT
 *
 * Presents a HAAPI selector action as a list of nested form options and forwards the
 * user's choice to the provided onSubmit handler, forwarding the option clicked to the
 * provided `onSubmit` handler.
 *
 * @example
 * ```tsx
 * function HaapiComponentExample() {
 *   const { currentStep, nextStep } = useHaapiStepper();
 *   const selectorAction = currentStep?.dataHelpers.actions?.selector?.[0];
 *
 *   return selectorAction && <HaapiStepperSelectorUI action={selectorAction} onSubmit={nextStep} />;
 * }
 *
 * <HaapiStepper>
 *   <HaapiComponentExample />
 * </HaapiStepper>
 * ```
 */
export function HaapiStepperSelectorUI({ action, onSubmit }: HaapiStepperSelectorUIProps) {
  const options = action.model.options;

  return (
    <div className="haapi-stepper-selector" key={action.id} data-testid="selector-action">
      {action.title && <h2 data-testid="form-selector-title">{action.title}</h2>}
      {options.map(option => {
        if (option.subtype === HAAPI_ACTION_TYPES.FORM) {
          return <HaapiStepperFormUI key={option.id} action={option} onSubmit={onSubmit} />;
        }
      })}
    </div>
  );
}

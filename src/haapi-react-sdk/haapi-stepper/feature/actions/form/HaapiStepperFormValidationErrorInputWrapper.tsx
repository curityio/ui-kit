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

import { ReactNode } from 'react';
import { useHaapiStepper } from '../../stepper/HaapiStepperHook';
import { HaapiInvalidField } from '../../../data-access/types/haapi-step.types';

export interface HaapiStepperFormValidationErrorInputWrapperProps {
  children: ReactNode;
  fieldName: string;
}

/**
 * @description
 *
 * Field-level display for HAAPI validation `InputError`s. Wrap an input so its validation messages render
 * beneath it and the field gets the error styling, letting the user correct and resubmit in place.
 *
 * ```tsx
 * <HaapiStepperFormValidationErrorInputWrapper fieldName="username">
 *   <input name="username" type="text" />
 * </HaapiStepperFormValidationErrorInputWrapper>
 * ```
 * {@see_example docs/examples/FormValidationErrorWrapper.tsx Field validation error}
 *
 * **Features**
 * - Shows `InputValidationProblemStep` errors below the corresponding input field.
 * - Applies the `haapi-validation-error` CSS classes for styling.
 */
export function HaapiStepperFormValidationErrorInputWrapper({
  children,
  fieldName,
}: HaapiStepperFormValidationErrorInputWrapperProps) {
  const { error } = useHaapiStepper();

  const inputError = error?.input;
  const hasValidationError = inputError && 'invalidFields' in inputError && !!inputError.invalidFields.length;

  if (!hasValidationError) {
    return <>{children}</>;
  }

  const validationErrors = inputError.invalidFields.filter(field => field.name === fieldName);
  const showValidationErrors = !!validationErrors.length;
  const getValidationErrorMessage = (fieldError: HaapiInvalidField) =>
    fieldError.detail ?? `Field '${fieldError.name}' ${fieldError.reason === 'missing' ? 'is required' : 'is invalid'}`;

  return (
    <div className={`haapi-validation-errors-container ${showValidationErrors ? 'has-errors' : ''}`}>
      {children}
      {showValidationErrors && (
        <div data-testid="haapi-validation-errors" className="haapi-validation-errors">
          {validationErrors.map(fieldError => (
            <div
              key={`${inputError.type}-${fieldName}`}
              className="haapi-validation-error red py1"
              data-testid="haapi-validation-error"
            >
              <span className="haapi-validation-error-description">{getValidationErrorMessage(fieldError)}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

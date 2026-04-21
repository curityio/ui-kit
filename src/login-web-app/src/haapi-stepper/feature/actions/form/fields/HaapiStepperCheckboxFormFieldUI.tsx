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

import type { ReactElement } from 'react';

import type { HaapiStepperCheckboxFormField } from '../../../stepper/haapi-stepper.types';
import { useHaapiStepperForm } from '../HaapiStepperFormContext';

export function HaapiStepperCheckboxFormFieldUI({ field }: { field: HaapiStepperCheckboxFormField }): ReactElement {
  const { formState, action } = useHaapiStepperForm();
  const inputId = `${action.id}-${field.name}-input`;

  return (
    <label className="haapi-stepper-form-field-checkbox-label" htmlFor={inputId}>
      {field.label ?? field.name}
      <input
        id={inputId}
        data-testid={`haapi-form-field-checkbox-${field.name}`}
        type="checkbox"
        name={field.name}
        checked={formState.get(field)}
        disabled={field.readonly ?? false}
        onChange={e => formState.set(field, e.target.checked)}
        className="haapi-stepper-form-field-checkbox-input"
      />
    </label>
  );
}

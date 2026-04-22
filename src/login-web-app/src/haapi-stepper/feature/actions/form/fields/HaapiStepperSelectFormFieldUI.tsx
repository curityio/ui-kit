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

import type { HaapiStepperSelectFormField } from '../../../stepper/haapi-stepper.types';
import { useHaapiStepperForm } from '../HaapiStepperFormContext';
import type { HaapiStepperSelectFormFieldInputProps } from './HaapiStepperFormFieldUI';

export function HaapiStepperSelectFormFieldUI({
  field,
  inputProps,
}: {
  field: HaapiStepperSelectFormField;
  inputProps?: HaapiStepperSelectFormFieldInputProps;
}): ReactElement {
  const { formState, action } = useHaapiStepperForm();
  const selectId = `${action.id}-${field.name}-input`;
  const inputPropsClassName = inputProps?.className;

  return (
    <label className="haapi-stepper-form-field-select-label" htmlFor={selectId}>
      {field.label ?? field.name}
      <select
        {...inputProps}
        id={selectId}
        data-testid={`haapi-form-field-select-${field.name}`}
        name={field.name}
        value={formState.get(field)}
        onChange={e => formState.set(field, e.target.value)}
        className={['haapi-stepper-form-field-select-input', inputPropsClassName].filter(Boolean).join(' ')}
      >
        {field.options.map(option => (
          <option key={option.value + '_' + option.label} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </label>
  );
}

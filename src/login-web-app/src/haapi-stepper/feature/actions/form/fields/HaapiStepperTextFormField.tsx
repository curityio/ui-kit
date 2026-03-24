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

import {
  HAAPI_FORM_FIELDS,
  HaapiCheckboxFormField,
  HaapiFormField,
  HaapiPasswordFormField,
  HaapiSelectFormField,
} from '../../../../data-access/types/haapi-form.types';
import { useHaapiStepperForm } from '../HaapiStepperFormContext';

export type TextLikeFormField = Exclude<HaapiFormField, HaapiCheckboxFormField | HaapiSelectFormField | HaapiPasswordFormField>;

export function HaapiStepperTextFormField({ field }: { field: TextLikeFormField }): ReactElement {
  const { formState, action } = useHaapiStepperForm();
  const autoComplete = getTextAutoComplete(field);
  const inputId = `${action.id}-${field.name}-input`;

  return (
    <label className="haapi-stepper-form-field-text-label" htmlFor={inputId}>
      {field.label ?? field.name}
      <input
        id={inputId}
        data-testid={`haapi-form-field-${HAAPI_FORM_FIELDS.TEXT}-${field.name}`}
        type="text"
        className="haapi-stepper-form-field-text-input"
        name={field.name}
        value={formState.get(field)}
        placeholder={field.placeholder}
        autoComplete={autoComplete}
        onChange={e => formState.set(field, e.target.value)}
      />
    </label>
  );
}

const getTextAutoComplete = (field: TextLikeFormField) => {
  if (field.type === HAAPI_FORM_FIELDS.USERNAME) {
    return 'username';
  }

  return undefined;
};

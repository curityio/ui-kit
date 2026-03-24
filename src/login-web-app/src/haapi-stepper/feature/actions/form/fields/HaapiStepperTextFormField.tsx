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
  HaapiSelectFormField,
} from '../../../../data-access/types/haapi-form.types';
import { useHaapiStepperForm } from '../HaapiStepperFormContext';

export type TextLikeFormField = Exclude<HaapiFormField, HaapiCheckboxFormField | HaapiSelectFormField>;

export function HaapiStepperTextFormField({ field }: { field: TextLikeFormField }): ReactElement {
  const { formState } = useHaapiStepperForm();
  const inputType = field.type === HAAPI_FORM_FIELDS.PASSWORD ? field.type : 'text';
  const autoComplete =
    field.type === HAAPI_FORM_FIELDS.PASSWORD
      ? 'current-password'
      : field.type === HAAPI_FORM_FIELDS.USERNAME
        ? 'username'
        : undefined;
  const inputId = `${field.name}-input`;

  return (
    <label className="haapi-form-field-label" htmlFor={inputId}>
      {field.label ?? field.name}
      <input
        id={inputId}
        data-testid={`haapi-form-field-${inputType}-${field.name}`}
        type={inputType}
        className="haapi-form-input "
        name={field.name}
        value={formState.get(field)}
        placeholder={field.placeholder}
        autoComplete={autoComplete}
        onChange={e => formState.set(field, e.target.value)}
      />
    </label>
  );
}

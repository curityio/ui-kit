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

import type { ReactElement } from 'react';

import { HAAPI_FORM_FIELDS, HAAPI_TEXT_FIELD_KINDS } from '../../../../data-access/types/haapi-form.types';
import type { HaapiStepperTextFormField, HaapiStepperUsernameFormField } from '../../../stepper/haapi-stepper.types';
import { useHaapiStepperForm } from '../HaapiStepperFormContext';

export function HaapiStepperTextFormFieldUI({
  field,
}: {
  field: HaapiStepperTextFormField | HaapiStepperUsernameFormField;
}): ReactElement {
  const { formState, action } = useHaapiStepperForm();
  const autoComplete = getTextAutoComplete(field);
  const inputType = getTextInputType(field);
  const inputId = `${action.id}-${field.name}-input`;

  return (
    <label className="haapi-stepper-form-field-text-label" htmlFor={inputId}>
      {field.label ?? field.name}
      <input
        id={inputId}
        data-testid={`haapi-form-field-${HAAPI_FORM_FIELDS.TEXT}-${field.name}`}
        type={inputType}
        className="haapi-stepper-form-field-text-input"
        name={field.name}
        value={formState.get(field)}
        placeholder={field.placeholder}
        autoComplete={autoComplete}
        required={field.required ?? true}
        onChange={e => formState.set(field, e.target.value)}
      />
    </label>
  );
}

// Kinds are free-form, so only those well-known are used, to avoid setting input type to something with specific
// behavior (e.g. password or checkbox).
const KNOWN_TEXT_FIELD_KINDS = new Set<string>(Object.values(HAAPI_TEXT_FIELD_KINDS));

const getTextInputType = (field: HaapiStepperTextFormField | HaapiStepperUsernameFormField) => {
  if (field.type === HAAPI_FORM_FIELDS.TEXT && field.kind && KNOWN_TEXT_FIELD_KINDS.has(field.kind)) {
    return field.kind;
  }

  return 'text';
};

const getTextAutoComplete = (field: HaapiStepperTextFormField | HaapiStepperUsernameFormField) => {
  if (field.type === HAAPI_FORM_FIELDS.USERNAME) {
    return 'username';
  }

  return undefined;
};

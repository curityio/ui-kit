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
import { useState } from 'react';

import { HAAPI_FORM_ACTION_KINDS, HAAPI_FORM_ACTION_KINDS_TYPE } from '../../../../data-access/types/haapi-action.types';
import { HAAPI_FORM_FIELDS, HaapiPasswordFormField } from '../../../../data-access/types/haapi-form.types';
import { useHaapiStepperForm } from '../HaapiStepperFormContext';

export function HaapiStepperPasswordFormField({ field }: { field: HaapiPasswordFormField }): ReactElement {
  const { formState, action } = useHaapiStepperForm();
  const [isVisible, setIsVisible] = useState(false);
  const inputId = `${action.id}-${field.name}-input`;
  const autoComplete = getPasswordAutoComplete(action.kind);
  const ariaLabel = `${isVisible ? 'Hide' : 'Show'} password`;

  return (
    <label className="haapi-stepper-form-field-password-label" htmlFor={inputId}>
      {field.label ?? field.name}
      <div className="haapi-stepper-form-field-password-wrapper">
        <input
          id={inputId}
          data-testid={`haapi-form-field-${HAAPI_FORM_FIELDS.PASSWORD}-${field.name}`}
          type={isVisible ? 'text' : 'password'}
          className="haapi-stepper-form-field-password-input"
          name={field.name}
          value={formState.get(field)}
          placeholder={field.placeholder}
          autoComplete={autoComplete}
          onChange={event => formState.set(field, event.target.value)}
        />
        <button
          type="button"
          className="haapi-stepper-form-field-password-visibility-toggle"
          aria-label={ariaLabel}
          aria-pressed={isVisible}
          aria-controls={inputId}
          onClick={() => setIsVisible(current => !current)}
        >
          {isVisible ? 'Hide' : 'Show'}
        </button>
      </div>
    </label>
  );
}

const getPasswordAutoComplete = (
  actionKind: HAAPI_FORM_ACTION_KINDS_TYPE
): 'current-password' | 'new-password' => {
  const isRegistrationFlow = actionKind === HAAPI_FORM_ACTION_KINDS.USER_REGISTER;

  if (isRegistrationFlow) {
    return 'new-password';
  }

  return 'current-password';
};

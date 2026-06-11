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
import { useState } from 'react';
import { IconGeneralEye, IconGeneralEyeHide } from '@curity/ui-kit-icons';

import {
  HAAPI_FORM_ACTION_KINDS,
  HAAPI_FORM_ACTION_KINDS_TYPE,
} from '../../../../data-access/types/haapi-action.types';
import { HAAPI_FORM_FIELDS } from '../../../../data-access/types/haapi-form.types';
import type { HaapiStepperPasswordFormField } from '../../../stepper/haapi-stepper.types';
import { useHaapiStepperForm } from '../HaapiStepperFormContext';

/**
 * Renders the built-in password input (with a show/hide toggle) for a HAAPI password `field`, wired to the
 * form's state.
 *
 * Must be rendered inside a `HaapiStepperFormUI` (it reads `formState` from the form context, so it throws
 * outside one). Normally {@link HaapiStepperFormFieldUI} picks it automatically — use it directly only to place
 * the password field yourself in a custom layout:
 *
 * ```tsx
 * // Add a "forgot password?" link under the password field, keep the default rendering for every other field.
 * <HaapiStepperFormUI action={action} onSubmit={nextStep}>
 *   {({ fields }) => (
 *     <>
 *       {fields.map(field =>
 *         field.type === HAAPI_FORM_FIELDS.PASSWORD ? (
 *           <section key={field.name}>
 *             <HaapiStepperPasswordFormFieldUI field={field} />
 *             <a href="/forgot-password">Forgot your password?</a>
 *           </section>
 *         ) : (
 *           <HaapiStepperFormFieldUI key={field.name} field={field} />
 *         )
 *       )}
 *     </>
 *   )}
 * </HaapiStepperFormUI>
 * ```
 */
export function HaapiStepperPasswordFormFieldUI({ field }: { field: HaapiStepperPasswordFormField }): ReactElement {
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
          required={field.required ?? true}
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
          {isVisible ? <IconGeneralEyeHide /> : <IconGeneralEye />}
        </button>
      </div>
    </label>
  );
}

const getPasswordAutoComplete = (actionKind: HAAPI_FORM_ACTION_KINDS_TYPE): 'current-password' | 'new-password' => {
  const isRegistrationFlow = actionKind === HAAPI_FORM_ACTION_KINDS.USER_REGISTER;

  if (isRegistrationFlow) {
    return 'new-password';
  }

  return 'current-password';
};

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

import { HAAPI_FORM_FIELDS } from '../../../../data-access/types/haapi-form.types';
import type { HaapiStepperTextFormField, HaapiStepperUsernameFormField } from '../../../stepper/haapi-stepper.types';
import { useHaapiStepperForm } from '../HaapiStepperFormContext';

/**
 * Renders the built-in text input for a HAAPI text/username `field`, wired to the form's state.
 *
 * Must be rendered inside a `HaapiStepperFormUI` (it reads `formState` from the form context, so it throws
 * outside one). Normally you let {@link HaapiStepperFormFieldUI} pick the field component automatically — reach
 * for this one only to place a specific field yourself in a custom layout:
 *
 * ```tsx
 * // Give the username field its own titled section, keep the default rendering for every other field.
 * <HaapiStepperFormUI action={action} onSubmit={nextStep}>
 *   {({ fields }) => (
 *     <>
 *       {fields.map(field =>
 *         field.type === HAAPI_FORM_FIELDS.USERNAME ? (
 *           <section key={field.name}>
 *             <h2>Your account</h2>
 *             <HaapiStepperTextFormFieldUI field={field} />
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
export function HaapiStepperTextFormFieldUI({
  field,
}: {
  field: HaapiStepperTextFormField | HaapiStepperUsernameFormField;
}): ReactElement {
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
        required={field.required ?? true}
        onChange={e => formState.set(field, e.target.value)}
      />
    </label>
  );
}

const getTextAutoComplete = (field: HaapiStepperTextFormField | HaapiStepperUsernameFormField) => {
  if (field.type === HAAPI_FORM_FIELDS.USERNAME) {
    return 'username';
  }

  return undefined;
};

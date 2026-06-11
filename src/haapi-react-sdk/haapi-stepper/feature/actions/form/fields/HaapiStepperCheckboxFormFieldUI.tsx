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

import type { HaapiStepperCheckboxFormField } from '../../../stepper/haapi-stepper.types';
import { useHaapiStepperForm } from '../HaapiStepperFormContext';

/**
 * Renders the built-in checkbox for a HAAPI checkbox `field`, wired to the form's state.
 *
 * Must be rendered inside a `HaapiStepperFormUI` (it reads `formState` from the form context, so it throws
 * outside one). Normally {@link HaapiStepperFormFieldUI} picks it automatically — use it directly only to place
 * the checkbox yourself in a custom layout:
 *
 * ```tsx
 * // Pair the checkbox with a terms description, keep the default rendering for every other field.
 * <HaapiStepperFormUI action={action} onSubmit={nextStep}>
 *   {({ fields }) => (
 *     <>
 *       {fields.map(field =>
 *         field.type === HAAPI_FORM_FIELDS.CHECKBOX ? (
 *           <section key={field.name}>
 *             <HaapiStepperCheckboxFormFieldUI field={field} />
 *             <small>Read our <a href="/terms">terms and conditions</a>.</small>
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
        required={field.required ?? true}
        onChange={e => formState.set(field, e.target.checked)}
        className="haapi-stepper-form-field-checkbox-input"
      />
    </label>
  );
}

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

import type { HaapiStepperSelectFormField } from '../../../stepper/haapi-stepper.types';
import { useHaapiStepperForm } from '../HaapiStepperFormContext';

/**
 * Renders the built-in `<select>` dropdown for a HAAPI select `field`, wired to the form's state.
 *
 * Must be rendered inside a `HaapiStepperFormUI` (it reads `formState` from the form context, so it throws
 * outside one). Normally {@link HaapiStepperFormFieldUI} picks it automatically — use it directly only to place
 * the select yourself in a custom layout:
 *
 * ```tsx
 * // Pair the selector with a hint, keep the default rendering for every other field.
 * <HaapiStepperFormUI action={action} onSubmit={nextStep}>
 *   {({ fields }) => (
 *     <>
 *       {fields.map(field =>
 *         field.type === HAAPI_FORM_FIELDS.SELECT ? (
 *           <section key={field.name}>
 *             <HaapiStepperSelectFormFieldUI field={field} />
 *             <p className="hint">You can change this later in your settings.</p>
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
export function HaapiStepperSelectFormFieldUI({ field }: { field: HaapiStepperSelectFormField }): ReactElement {
  const { formState, action } = useHaapiStepperForm();
  const selectId = `${action.id}-${field.name}-input`;

  return (
    <label className="haapi-stepper-form-field-select-label" htmlFor={selectId}>
      {field.label ?? field.name}
      <select
        id={selectId}
        data-testid={`haapi-form-field-select-${field.name}`}
        name={field.name}
        value={formState.get(field)}
        required={field.required ?? true}
        onChange={e => formState.set(field, e.target.value)}
        className="haapi-stepper-form-field-select-input"
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

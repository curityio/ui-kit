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

import type { HaapiCheckboxFormField } from '../../../../data-access/types/haapi-form.types';
import { useHaapiStepperForm } from '../HaapiStepperFormContext';

export function HaapiStepperCheckboxFormField({ field }: { field: HaapiCheckboxFormField }): ReactElement {
  const { formState } = useHaapiStepperForm();
  const inputId = `${field.name}-input`;

  return (
    <label className="label block" htmlFor={inputId}>
      {field.label ?? field.name}:
      <input
        id={inputId}
        data-testid={`haapi-form-field-checkbox-${field.name}`}
        type="checkbox"
        name={field.name}
        checked={formState.get(field)}
        disabled={field.readonly ?? false}
        onChange={e => formState.set(field, e.target.checked)}
      />
    </label>
  );
}

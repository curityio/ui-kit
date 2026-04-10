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

import { useState } from 'react';
import { HAAPI_FORM_FIELDS } from '../../../data-access/types/haapi-form.types';
import { HaapiStepperFormField, HaapiStepperFormState } from '../../stepper/haapi-stepper.types';

/**
 * Hook to manage form state. Returns an array with two values:
 * 1. a convenience {@link HaapiStepperFormState} object that can be used to get and set field values
 * 2. a map of the current form values that can be used to submit the form
 */
export function useHaapiStepperFormState(fields: HaapiStepperFormField[]): HaapiStepperFormState {
  // State to hold values of form fields. Initial value is calculated once, lazily.
  const [formValues, setFormValues] = useState(() => getInitialValues(fields));

  return {
    values: formValues,

    // @ts-expect-error TS can't fully resolve return types of function overloads in this case
    get(field: HaapiStepperFormField) {
      return getValue(field, formValues);
    },
    set(field: HaapiStepperFormField, value: string | boolean) {
      setFormValues(currentValues => setValue(field, value, currentValues));
    },
  };
}

function getInitialValues(fields: HaapiStepperFormField[]): Map<string, string> {
  const initialValues = new Map<string, string>();
  fields.forEach(f => {
    switch (f.type) {
      case HAAPI_FORM_FIELDS.SELECT:
        {
          const selectedOption = f.options.find(it => it.selected);
          if (selectedOption) {
            initialValues.set(f.name, selectedOption.value);
          }
        }
        break;

      case HAAPI_FORM_FIELDS.CHECKBOX:
        if (f.checked) {
          initialValues.set(f.name, f.value ?? 'on');
        }
        break;

      default:
        if (f.value) {
          initialValues.set(f.name, f.value);
        }
        break;
    }
  });
  return initialValues;
}

function getValue(field: HaapiStepperFormField, currentValues: Map<string, string>): string | boolean {
  if (field.type === HAAPI_FORM_FIELDS.CHECKBOX) {
    return currentValues.has(field.name);
  }
  return currentValues.get(field.name) ?? '';
}

function setValue(
  field: HaapiStepperFormField,
  value: string | boolean,
  currentValues: Map<string, string>
): Map<string, string> {
  const newValues = new Map(currentValues);

  if (field.type === HAAPI_FORM_FIELDS.CHECKBOX && typeof value === 'boolean') {
    if (!field.readonly) {
      if (value) {
        newValues.set(field.name, field.value ?? 'on');
      } else {
        newValues.delete(field.name);
      }
    }
  } else {
    if (typeof value !== 'string') {
      // Not allowed by overloads
      throw new Error('Unexpected value type');
    }

    if (field.type === HAAPI_FORM_FIELDS.SELECT) {
      if (field.options.some(o => o.value === value)) {
        newValues.set(field.name, value);
      }
    } else if (field.type !== HAAPI_FORM_FIELDS.HIDDEN) {
      newValues.set(field.name, value);
    }
  }
  return newValues;
}

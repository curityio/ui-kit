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

import { act, renderHook } from '@testing-library/react';
import { useHaapiStepperFormState } from './HaapiStepperFormHook';
import { HAAPI_FORM_FIELDS } from '../../../data-access/types/haapi-form.types';
import type {
  HaapiStepperCheckboxFormField,
  HaapiStepperHiddenFormField,
  HaapiStepperSelectFormField,
  HaapiStepperTextFormField,
} from '../../stepper/haapi-stepper.types';
import { expect, it } from 'vitest';

it('can calculate initial values', () => {
  const text1: HaapiStepperTextFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.TEXT,
    name: 'text-1',
    value: 't1',
  };
  const text2: HaapiStepperTextFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.TEXT,
    name: 'text-2',
  };
  const select1: HaapiStepperSelectFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.SELECT,
    name: 'select-1',
    options: [
      {
        label: 'Option 1',
        value: 's1o1',
      },
      {
        label: 'Option 2',
        value: 's1o2',
      },
    ],
  };
  const select2: HaapiStepperSelectFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.SELECT,
    name: 'select-2',
    options: [
      {
        label: 'Option 1',
        value: 's2o1',
        selected: true,
      },
      {
        label: 'Option 2',
        value: 's2o2',
      },
    ],
  };
  const checkbox1: HaapiStepperCheckboxFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.CHECKBOX,
    name: 'checkbox-1',
    value: 'cb1',
    checked: true,
  };
  const checkbox2: HaapiStepperCheckboxFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.CHECKBOX,
    name: 'checkbox-2',
    value: 'cb2',
  };
  const hidden1: HaapiStepperHiddenFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.HIDDEN,
    name: 'hidden-1',
    value: 'h1',
  };

  const { result } = renderHook(() =>
    useHaapiStepperFormState([text1, text2, select1, select2, checkbox1, checkbox2, hidden1])
  );

  expect(result.current.values).toStrictEqual(
    new Map([
      ['text-1', 't1'],
      ['select-2', 's2o1'],
      ['checkbox-1', 'cb1'],
      ['hidden-1', 'h1'],
    ])
  );
  expect(result.current.get(text1)).toBe('t1');
  expect(result.current.get(text2)).toBe('');
  expect(result.current.get(select1)).toBe('');
  expect(result.current.get(select2)).toBe('s2o1');
  expect(result.current.get(checkbox1)).toBe(true);
  expect(result.current.get(checkbox2)).toBe(false);
  expect(result.current.get(hidden1)).toBe('h1');
});

it('can set and get field values', () => {
  const text: HaapiStepperTextFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.TEXT,
    name: 'text-1',
    value: 't1',
  };
  const select: HaapiStepperSelectFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.SELECT,
    name: 'select-1',
    options: [
      {
        label: 'Option 1',
        value: 's1o1',
      },
      {
        label: 'Option 2',
        value: 's1o2',
        selected: true,
      },
    ],
  };
  const checkbox: HaapiStepperCheckboxFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.CHECKBOX,
    name: 'checkbox-1',
  };

  const { result } = renderHook(() => useHaapiStepperFormState([text, select, checkbox]));

  act(() => {
    result.current.set(text, 't1-updated');
    result.current.set(select, 's1o1');
    result.current.set(checkbox, true);
  });

  expect(result.current.values).toStrictEqual(
    new Map([
      ['text-1', 't1-updated'],
      ['select-1', 's1o1'],
      ['checkbox-1', 'on'],
    ])
  );
  expect(result.current.get(text)).toBe('t1-updated');
  expect(result.current.get(select)).toBe('s1o1');
  expect(result.current.get(checkbox)).toBe(true);

  act(() => {
    result.current.set(checkbox, false);
  });

  expect(result.current.values).toStrictEqual(
    new Map([
      ['text-1', 't1-updated'],
      ['select-1', 's1o1'],
    ])
  );
  expect(result.current.get(checkbox)).toBe(false);
});

it('setting select to invalid value does not change it', () => {
  const select: HaapiStepperSelectFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.SELECT,
    name: 'select-1',
    options: [
      {
        label: 'Option 1',
        value: 's1o1',
        selected: true,
      },
    ],
  };

  const { result } = renderHook(() => useHaapiStepperFormState([select]));

  act(() => {
    result.current.set(select, 'invalid-value');
  });

  expect(result.current.values).toStrictEqual(new Map([['select-1', 's1o1']]));
  expect(result.current.get(select)).toBe('s1o1');
});

it('is not possible to modify readonly checkboxes', () => {
  const checkbox: HaapiStepperCheckboxFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.CHECKBOX,
    name: 'checkbox-1',
    value: 'cb-1',
    checked: true,
    readonly: true,
  };

  const { result } = renderHook(() => useHaapiStepperFormState([checkbox]));

  act(() => {
    result.current.set(checkbox, false);
  });

  expect(result.current.values).toStrictEqual(new Map([['checkbox-1', 'cb-1']]));
  expect(result.current.get(checkbox)).toBe(true);
});

it('is not possible to modify hidden fields', () => {
  const hidden: HaapiStepperHiddenFormField = {
    id: crypto.randomUUID(),
    type: HAAPI_FORM_FIELDS.HIDDEN,
    name: 'hidden-1',
    value: 'secret',
  };

  const { result } = renderHook(() => useHaapiStepperFormState([hidden]));

  act(() => {
    result.current.set(hidden, 'new');
  });

  expect(result.current.values).toStrictEqual(new Map([['hidden-1', 'secret']]));
  expect(result.current.get(hidden)).toBe('secret');
});

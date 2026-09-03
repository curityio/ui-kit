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

import { describe, it, expect, vi } from 'vitest';
import { render, screen } from '@testing-library/react';

import {
  HAAPI_FORM_FIELDS,
  HAAPI_TEXT_FIELD_KINDS,
  type HaapiTextFormField,
} from '../../../../data-access/types/haapi-form.types';
import type { HaapiStepperTextFormField, HaapiStepperUsernameFormField } from '../../../stepper/haapi-stepper.types';
import { createMockFormAction } from '../../../../util/tests/mocks';
import { HaapiStepperFormContext, type HaapiStepperFormContextValue } from '../HaapiStepperFormContext';
import { HaapiStepperTextFormFieldUI } from './HaapiStepperTextFormFieldUI';

describe('HaapiStepperTextFormFieldUI', () => {
  it.each([
    [HAAPI_TEXT_FIELD_KINDS.NUMBER, 'number'],
    [HAAPI_TEXT_FIELD_KINDS.EMAIL, 'email'],
    [HAAPI_TEXT_FIELD_KINDS.URL, 'url'],
    [HAAPI_TEXT_FIELD_KINDS.TEL, 'tel'],
    [HAAPI_TEXT_FIELD_KINDS.COLOR, 'color'],
    [HAAPI_TEXT_FIELD_KINDS.DATE, 'date'],
  ])('presents a text field of well-known kind "%s" as an input of type "%s"', (kind, expectedInputType) => {
    renderTextField(createTextField({ kind }));

    expect(textFieldInput()).toHaveAttribute('type', expectedInputType);
  });

  it('presents a text field without a kind as a text input', () => {
    renderTextField(createTextField());

    expect(textFieldInput()).toHaveAttribute('type', 'text');
  });

  it.each([
    'passport-number',
    '',
    '   ',
    ' email ',
    'EMAIL',
    'hidden',
    'file',
    'submit',
    'reset',
    'button',
    'image',
    'checkbox',
    'radio',
    'password',
  ])('presents a text field of the unknown kind "%s" as a text input', kind => {
    renderTextField(createTextField({ kind }));

    expect(textFieldInput()).toHaveAttribute('type', 'text');
    expect(textFieldInput()).toBeVisible();
  });

  it('presents a username field as a text input', () => {
    const field: HaapiStepperUsernameFormField = {
      id: fieldId,
      type: HAAPI_FORM_FIELDS.USERNAME,
      name: fieldName,
    };

    renderTextField(field);

    expect(textFieldInput()).toHaveAttribute('type', 'text');
  });
});

const renderTextField = (field: HaapiStepperTextFormField | HaapiStepperUsernameFormField) =>
  render(
    <HaapiStepperFormContext value={mockFormContextValue}>
      <HaapiStepperTextFormFieldUI field={field} />
    </HaapiStepperFormContext>
  );

const mockFormContextValue: HaapiStepperFormContextValue = {
  formState: {
    values: new Map(),
    get: vi.fn().mockReturnValue(''),
    set: vi.fn(),
  },
  action: createMockFormAction(),
  submit: vi.fn(),
};

const createTextField = (field: Partial<HaapiTextFormField> = {}): HaapiStepperTextFormField => ({
  id: fieldId,
  type: HAAPI_FORM_FIELDS.TEXT,
  name: fieldName,
  ...field,
});

const textFieldInput = () => screen.getByTestId(`haapi-form-field-${HAAPI_FORM_FIELDS.TEXT}-${fieldName}`);

const fieldId = 'field-1';
const fieldName = 'fieldName';

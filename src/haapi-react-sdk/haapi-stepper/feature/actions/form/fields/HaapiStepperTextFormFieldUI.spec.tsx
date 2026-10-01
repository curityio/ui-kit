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

import { HAAPI_FORM_FIELDS, HAAPI_TEXT_FIELD_KINDS } from '../../../../data-access/types/haapi-form.types';
import type { HaapiStepperTextFormField, HaapiStepperUsernameFormField } from '../../../stepper/haapi-stepper.types';
import { createMockFormAction, createMockTextField, createMockUsernameField } from '../../../../util/tests/mocks';
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
    const field = createMockTextField({ kind });
    renderTextField(field);

    expect(textFieldInput(field.name)).toHaveAttribute('type', expectedInputType);
  });

  it('presents a text field without a kind as a text input', () => {
    const field = createMockTextField();
    renderTextField(field);

    expect(textFieldInput(field.name)).toHaveAttribute('type', 'text');
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
    const field = createMockTextField({ kind });
    renderTextField(field);

    expect(textFieldInput(field.name)).toHaveAttribute('type', 'text');
    expect(textFieldInput(field.name)).toBeVisible();
  });

  it('presents a username field as a text input', () => {
    const field = createMockUsernameField();
    renderTextField(field);

    expect(textFieldInput(field.name)).toHaveAttribute('type', 'text');
  });

  describe('Length constraints', () => {
    it('presents the length constraints of a text field on its input', () => {
      const field = createMockTextField({ minLength: 6, maxLength: 8 });
      renderTextField(field);

      expect(textFieldInput(field.name)).toHaveAttribute('minlength', '6');
      expect(textFieldInput(field.name)).toHaveAttribute('maxlength', '8');
    });

    it('presents only the length constraint a text field defines', () => {
      const field = createMockTextField({ maxLength: 8 });
      renderTextField(field);

      expect(textFieldInput(field.name)).not.toHaveAttribute('minlength');
      expect(textFieldInput(field.name)).toHaveAttribute('maxlength', '8');
    });

    it('presents a text field without length constraints as an input without length limits', () => {
      const field = createMockTextField();
      renderTextField(field);

      expect(textFieldInput(field.name)).not.toHaveAttribute('minlength');
      expect(textFieldInput(field.name)).not.toHaveAttribute('maxlength');
    });
  });

  describe('Label', () => {
    it('presents the field label as the accessible name of its input', () => {
      const field = createMockTextField({ label: 'Phone number' });
      renderTextField(field);

      expect(screen.getByLabelText('Phone number')).toBe(textFieldInput(field.name));
    });

    it('presents the field name as the accessible name of its input when the field has no label', () => {
      const field = createMockTextField();
      renderTextField(field);

      expect(screen.getByLabelText(field.name)).toBe(textFieldInput(field.name));
    });
  });

  it('presents the field placeholder on its input', () => {
    const field = createMockTextField({ placeholder: '+46 70 123 45 67' });
    renderTextField(field);

    expect(textFieldInput(field.name)).toHaveAttribute('placeholder', '+46 70 123 45 67');
  });

  describe('Autocomplete', () => {
    it('presents a username field with the username autocomplete hint', () => {
      const field = createMockUsernameField();
      renderTextField(field);

      expect(textFieldInput(field.name)).toHaveAttribute('autocomplete', 'username');
    });

    it('presents a text field without an autocomplete hint', () => {
      const field = createMockTextField();
      renderTextField(field);

      expect(textFieldInput(field.name)).not.toHaveAttribute('autocomplete');
    });
  });

  describe('Required', () => {
    it('presents a text field as required when the field does not say otherwise', () => {
      const field = createMockTextField();
      renderTextField(field);

      expect(textFieldInput(field.name)).toBeRequired();
    });

    it('presents a text field as optional when the field is not required', () => {
      const field = createMockTextField({ required: false });
      renderTextField(field);

      expect(textFieldInput(field.name)).not.toBeRequired();
    });
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

const textFieldInput = (name: string) => screen.getByTestId(`haapi-form-field-${HAAPI_FORM_FIELDS.TEXT}-${name}`);

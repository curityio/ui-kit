import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { HaapiStepperFormFieldUI } from './HaapiStepperFormFieldUI';
import { HAAPI_FORM_FIELDS, HTTP_METHODS } from '../../../../data-access/types/haapi-form.types';
import { HAAPI_FORM_ACTION_KINDS } from '../../../../data-access/types/haapi-action.types';
import { useHaapiStepper } from '../../../stepper/HaapiStepperHook';
import { createHaapiStepperApiMock, createMockFormAction } from '../../../../util/tests/mocks';
import { HaapiStepperForm } from '../HaapiStepperForm';
import type { HaapiStepperFormAction, HaapiStepperFormField } from '../../../stepper/haapi-stepper.types';

vi.mock('../../../stepper/HaapiStepperHook', () => ({
  useHaapiStepper: vi.fn(() => ({ error: null })),
}));

const mockUseHaapiStepper = vi.mocked(useHaapiStepper);

describe('HaapiStepperFormFieldUI', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseHaapiStepper.mockReturnValue(createHaapiStepperApiMock());
  });

  describe('Default rendering', () => {
    it('should render a text input for USERNAME fields', () => {
      const action = createFormActionWithField({
        id: 'username-id',
        type: HAAPI_FORM_FIELDS.USERNAME,
        name: 'username',
        label: 'Username',
      });

      render(
        <HaapiStepperForm action={action} onSubmit={vi.fn()}>
          {({ fields }) => (
            <>
              {fields.map(field => (
                <HaapiStepperFormFieldUI key={field.name} field={field} />
              ))}
            </>
          )}
        </HaapiStepperForm>
      );

      const input = screen.getByTestId(`haapi-form-field-${HAAPI_FORM_FIELDS.TEXT}-username`);
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render a text input for TEXT fields', () => {
      const action = createFormActionWithField({
        id: 'firstName-id',
        type: HAAPI_FORM_FIELDS.TEXT,
        name: 'firstName',
        label: 'First Name',
      });

      render(
        <HaapiStepperForm action={action} onSubmit={vi.fn()}>
          {({ fields }) => (
            <>
              {fields.map(field => (
                <HaapiStepperFormFieldUI key={field.name} field={field} />
              ))}
            </>
          )}
        </HaapiStepperForm>
      );

      const input = screen.getByTestId(`haapi-form-field-${HAAPI_FORM_FIELDS.TEXT}-firstName`);
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
      expect(input).toHaveAttribute('type', 'text');
    });

    it('should render a password input for PASSWORD fields', () => {
      const action = createFormActionWithField({
        id: 'password-id',
        type: HAAPI_FORM_FIELDS.PASSWORD,
        name: 'password',
        label: 'Password',
      });

      render(
        <HaapiStepperForm action={action} onSubmit={vi.fn()}>
          {({ fields }) => (
            <>
              {fields.map(field => (
                <HaapiStepperFormFieldUI key={field.name} field={field} />
              ))}
            </>
          )}
        </HaapiStepperForm>
      );

      const input = screen.getByTestId(`haapi-form-field-${HAAPI_FORM_FIELDS.PASSWORD}-password`);
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
      expect(input).toHaveAttribute('type', 'password');
    });

    it('should render a checkbox input for CHECKBOX fields', () => {
      const action = createFormActionWithField({
        id: 'rememberMe-id',
        type: HAAPI_FORM_FIELDS.CHECKBOX,
        name: 'rememberMe',
        label: 'Remember me',
      });

      render(
        <HaapiStepperForm action={action} onSubmit={vi.fn()}>
          {({ fields }) => (
            <>
              {fields.map(field => (
                <HaapiStepperFormFieldUI key={field.name} field={field} />
              ))}
            </>
          )}
        </HaapiStepperForm>
      );

      const input = screen.getByTestId(`haapi-form-field-checkbox-rememberMe`);
      expect(input).toBeInTheDocument();
      expect(input.tagName).toBe('INPUT');
      expect(input).toHaveAttribute('type', 'checkbox');
    });

    it('should render a select element for SELECT fields', () => {
      const action = createFormActionWithField({
        id: 'country-id',
        type: HAAPI_FORM_FIELDS.SELECT,
        name: 'country',
        label: 'Country',
        options: [
          { label: 'Sweden', value: 'SE' },
          { label: 'Canada', value: 'CA' },
        ],
      });

      render(
        <HaapiStepperForm action={action} onSubmit={vi.fn()}>
          {({ fields }) => (
            <>
              {fields.map(field => (
                <HaapiStepperFormFieldUI key={field.name} field={field} />
              ))}
            </>
          )}
        </HaapiStepperForm>
      );

      const select = screen.getByTestId('haapi-form-field-select-country');
      expect(select).toBeInTheDocument();
      expect(select.tagName).toBe('SELECT');
    });
  });

  describe('Custom rendering', () => {
    it('should spread inputProps onto text input elements', () => {
      const action = createFormActionWithField({
        id: 'username-id',
        type: HAAPI_FORM_FIELDS.USERNAME,
        name: 'username',
        label: 'Username',
      });
      const inputProps = { 'aria-label': 'custom-aria', 'data-custom': 'text-value' };

      render(
        <HaapiStepperForm
          action={action}
          onSubmit={vi.fn()}
          formFieldRenderInterceptor={field => (
            <HaapiStepperFormFieldUI field={field} inputProps={inputProps} />
          )}
        />
      );

      const input = screen.getByTestId(`haapi-form-field-${HAAPI_FORM_FIELDS.TEXT}-username`);
      expect(input).toHaveAttribute('aria-label', 'custom-aria');
      expect(input).toHaveAttribute('data-custom', 'text-value');
    });

    it('should spread inputProps onto password input elements', () => {
      const action = createFormActionWithField({
        id: 'password-id',
        type: HAAPI_FORM_FIELDS.PASSWORD,
        name: 'password',
        label: 'Password',
      });
      const inputProps = { 'aria-label': 'custom-password', 'data-custom': 'pw-value' };

      render(
        <HaapiStepperForm
          action={action}
          onSubmit={vi.fn()}
          formFieldRenderInterceptor={field => (
            <HaapiStepperFormFieldUI field={field} inputProps={inputProps} />
          )}
        />
      );

      const input = screen.getByTestId(`haapi-form-field-${HAAPI_FORM_FIELDS.PASSWORD}-password`);
      expect(input).toHaveAttribute('aria-label', 'custom-password');
      expect(input).toHaveAttribute('data-custom', 'pw-value');
    });

    it('should spread inputProps onto checkbox input elements', () => {
      const action = createFormActionWithField({
        id: 'rememberMe-id',
        type: HAAPI_FORM_FIELDS.CHECKBOX,
        name: 'rememberMe',
        label: 'Remember me',
      });
      const inputProps = { 'aria-label': 'custom-checkbox', 'data-custom': 'cb-value' };

      render(
        <HaapiStepperForm
          action={action}
          onSubmit={vi.fn()}
          formFieldRenderInterceptor={field => (
            <HaapiStepperFormFieldUI field={field} inputProps={inputProps} />
          )}
        />
      );

      const input = screen.getByTestId(`haapi-form-field-checkbox-rememberMe`);
      expect(input).toHaveAttribute('aria-label', 'custom-checkbox');
      expect(input).toHaveAttribute('data-custom', 'cb-value');
    });

    it('should spread inputProps onto select elements', () => {
      const action = createFormActionWithField({
        id: 'country-id',
        type: HAAPI_FORM_FIELDS.SELECT,
        name: 'country',
        label: 'Country',
        options: [
          { label: 'Sweden', value: 'SE' },
          { label: 'Canada', value: 'CA' },
        ],
      });
      const inputProps = { 'aria-label': 'custom-select', 'data-custom': 'sel-value' };

      render(
        <HaapiStepperForm
          action={action}
          onSubmit={vi.fn()}
          formFieldRenderInterceptor={field => (
            <HaapiStepperFormFieldUI field={field} inputProps={inputProps} />
          )}
        />
      );

      const select = screen.getByTestId(`haapi-form-field-select-country`);
      expect(select).toHaveAttribute('aria-label', 'custom-select');
      expect(select).toHaveAttribute('data-custom', 'sel-value');
    });

    it('should not allow inputProps to override managed props', () => {
      const action = createFormActionWithField({
        id: 'username-id',
        type: HAAPI_FORM_FIELDS.USERNAME,
        name: 'username',
        label: 'Username',
      });

      render(
        <HaapiStepperForm
          action={action}
          onSubmit={vi.fn()}
          formFieldRenderInterceptor={field => (
            <HaapiStepperFormFieldUI
              field={field}
              inputProps={{
                name: 'overridden-name',
                type: 'email',
                value: 'overridden-value',
                onChange: vi.fn(),
              }}
            />
          )}
        />
      );

      const input = screen.getByTestId(`haapi-form-field-${HAAPI_FORM_FIELDS.TEXT}-username`);
      expect(input).toHaveAttribute('name', 'username');
      expect(input).toHaveAttribute('type', 'text');
      expect(input).toHaveAttribute('value', '');
    });

    it('should merge inputProps className with the default className', () => {
      const action = createFormActionWithField({
        id: 'username-id',
        type: HAAPI_FORM_FIELDS.USERNAME,
        name: 'username',
        label: 'Username',
      });

      render(
        <HaapiStepperForm
          action={action}
          onSubmit={vi.fn()}
          formFieldRenderInterceptor={field => (
            <HaapiStepperFormFieldUI field={field} inputProps={{ className: 'custom-class' }} />
          )}
        />
      );

      const input = screen.getByTestId(`haapi-form-field-${HAAPI_FORM_FIELDS.TEXT}-username`);
      expect(input).toHaveAttribute('class', 'haapi-stepper-form-field-text-input custom-class');
    });
  });
});

const createFormActionWithField = (field: HaapiStepperFormField): HaapiStepperFormAction =>
  createMockFormAction({
    kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
    model: {
      href: '/login',
      method: HTTP_METHODS.POST,
      fields: [field],
    },
  });

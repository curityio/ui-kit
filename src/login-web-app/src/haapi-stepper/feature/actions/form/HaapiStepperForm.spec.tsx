import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';

import { HaapiStepperForm } from './HaapiStepperForm';
import { HAAPI_FORM_FIELDS, HTTP_METHODS, VisibleHaapiFormField } from '../../../data-access/types/haapi-form.types';
import { HAAPI_PROBLEM_STEPS } from '../../../data-access/types/haapi-step.types';
import { HaapiStepperFormField } from './fields/HaapiStepperFormField';
import { useHaapiStepper } from '../../stepper/HaapiStepperHook';
import { createHaapiStepperApiMock, createMockFormAction } from '../../../util/tests/mocks';
import { useEffect } from 'react';
import {
  HaapiStepperFormAction,
  HaapiStepperFormFieldRenderInterceptor,
  HaapiStepperFormState,
  HaapiStepperInputError,
  HaapiStepperNextStep,
} from '../../stepper/haapi-stepper.types';
import { HaapiStepperFormSubmitButton } from './HaapiStepperFormSubmitButton';
import userEvent from '@testing-library/user-event';

/* eslint-disable @typescript-eslint/no-unsafe-assignment */
/* eslint-disable @typescript-eslint/no-unsafe-argument */

describe('HaapiStepperForm', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    vi.clearAllMocks();
    mockUseHaapiStepper.mockReturnValue(createHaapiStepperApiMock());
  });

  describe('Default rendering', () => {
    it('should render visible fields with default components', () => {
      const action = createLoginFormAction();
      const onSubmit = vi.fn();

      render(<HaapiStepperForm action={action} onSubmit={onSubmit} />);

      expect(screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.TEXT, usernameFieldName))).toBeInTheDocument();
      expect(screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.PASSWORD, passwordFieldName))).toBeInTheDocument();
      expect(screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.SELECT, countryFieldName))).toBeInTheDocument();
      expect(screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.CHECKBOX, rememberMeFieldName))).toBeInTheDocument();
      expect(screen.queryByDisplayValue(hiddenContextValue)).not.toBeInTheDocument();
    });

    it('should submit the correct payload', async () => {
      const action = createLoginFormAction();
      const onSubmit = vi.fn();

      render(<HaapiStepperForm action={action} onSubmit={onSubmit} />);

      const usernameInput = screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.TEXT, usernameFieldName));
      const passwordInput = screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.PASSWORD, passwordFieldName));
      const countrySelect = screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.SELECT, countryFieldName));
      const rememberCheckbox = screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.CHECKBOX, rememberMeFieldName));
      const submitButton = screen.getByTestId(submitButtonTestId);

      await user.type(usernameInput, usernameValue);
      await user.type(passwordInput, passwordValue);
      await user.selectOptions(countrySelect, countryCanadaValue);
      await user.click(rememberCheckbox);

      await user.click(submitButton);

      expect(onSubmit).toHaveBeenCalledTimes(1);
      const payload = onSubmit.mock.calls[0]?.[1];
      expect(Object.fromEntries(payload)).toEqual({
        [contextFieldName]: hiddenContextValue,
        [usernameFieldName]: usernameValue,
        [passwordFieldName]: passwordValue,
        [rememberMeFieldName]: rememberValue,
        [countryFieldName]: countryCanadaValue,
      });
    });

    it('should show validation errors only after the form submits', async () => {
      const action = createLoginFormAction();
      const onSubmit = vi.fn();
      const validationError: HaapiStepperInputError = {
        type: HAAPI_PROBLEM_STEPS.INVALID_INPUT,
        invalidFields: [
          { name: usernameFieldName, reason: 'missing' },
          { name: passwordFieldName, reason: 'invalidValue', detail: validationInvalidPasswordMessage },
        ],
        dataHelpers: {
          messages: [],
          links: [],
        },
      };

      const { rerender } = render(<HaapiStepperForm action={action} onSubmit={onSubmit} />);

      expect(screen.queryByTestId(validationErrorTestId)).not.toBeInTheDocument();

      mockUseHaapiStepper.mockReturnValue(createHaapiStepperApiMock({ error: { app: null, input: validationError } }));

      await user.click(screen.getByTestId(submitButtonTestId));

      rerender(<HaapiStepperForm action={action} onSubmit={onSubmit} />);

      await waitFor(() => {
        expect(screen.getAllByTestId(validationErrorTestId)).toHaveLength(2);
      });
      expect(screen.getByText(validationMissingUsernameMessage)).toBeInTheDocument();
      expect(screen.getByText(validationInvalidPasswordMessage)).toBeInTheDocument();
    });
  });

  describe('Custom rendering', () => {
    describe('Via Interceptors', () => {
      describe('Data customization', () => {
        it('allows field data customizations before default rendering', () => {
          const action = createLoginFormAction();
          const onSubmit = vi.fn();

          const formFieldRenderInterceptor: HaapiStepperFormFieldRenderInterceptor = field => {
            if (field.type === HAAPI_FORM_FIELDS.USERNAME) {
              return { ...field, label: interceptedUsernameLabel };
            }
            return field;
          };

          render(
            <HaapiStepperForm
              action={action}
              onSubmit={onSubmit}
              formFieldRenderInterceptor={formFieldRenderInterceptor}
            />
          );

          expect(screen.getByLabelText(interceptedUsernameLabel)).toBeInTheDocument();
        });
      });

      describe('UI customization', () => {
        it('supports custom form field components', async () => {
          const action = createLoginFormAction();
          const onSubmit = vi.fn();

          const formFieldRenderInterceptor: HaapiStepperFormFieldRenderInterceptor = (field, formState) => {
            if (field.type === HAAPI_FORM_FIELDS.USERNAME) {
              const usernameField = field;

              return (
                <label className="label block">
                  {customUsernameLabelWithSuffix}
                  <input
                    type="text"
                    className="field w100"
                    name={usernameField.name}
                    value={formState.get(usernameField)}
                    onChange={e => formState.set(usernameField, e.target.value)}
                  />
                </label>
              );
            }

            return field;
          };

          render(
            <HaapiStepperForm
              action={action}
              onSubmit={onSubmit}
              formFieldRenderInterceptor={formFieldRenderInterceptor}
            />
          );

          const customUsernameInput = screen.getByLabelText(customUsernameLabelWithSuffix);
          await user.type(customUsernameInput, usernameValue);
          await user.click(screen.getByTestId(submitButtonTestId));

          expect(onSubmit).toHaveBeenCalledTimes(1);
          const payload = onSubmit.mock.calls[0]?.[1];
          expect(Object.fromEntries(payload)).toEqual({
            [contextFieldName]: hiddenContextValue,
            [usernameFieldName]: usernameValue,
          });
        });

        it('supports excluding fields from the rendered form', async () => {
          const action = createLoginFormAction();
          const onSubmit = vi.fn();

          const formFieldRenderInterceptor: HaapiStepperFormFieldRenderInterceptor = field => {
            if (field.type === HAAPI_FORM_FIELDS.PASSWORD) {
              return null;
            }
            return field;
          };

          render(
            <HaapiStepperForm
              action={action}
              onSubmit={onSubmit}
              formFieldRenderInterceptor={formFieldRenderInterceptor}
            />
          );

          expect(
            screen.queryByTestId(formFieldTestId(HAAPI_FORM_FIELDS.PASSWORD, passwordFieldName))
          ).not.toBeInTheDocument();

          const usernameInput = screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.TEXT, usernameFieldName));
          await user.type(usernameInput, usernameValue);
          await user.click(screen.getByTestId(submitButtonTestId));

          expect(onSubmit).toHaveBeenCalledTimes(1);
          const payload = onSubmit.mock.calls[0]?.[1];
          expect(Object.fromEntries(payload)).toEqual({
            [contextFieldName]: hiddenContextValue,
            [usernameFieldName]: usernameValue,
          });
        });

        it('supports inserting additional elements between specific fields', async () => {
          const action = createLoginFormAction();
          const onSubmit = vi.fn();

          const formFieldRenderInterceptor: HaapiStepperFormFieldRenderInterceptor = field => {
            if (field.name === countryFieldName) {
              return (
                <div data-testid="interceptor-country-wrapper">
                  <HaapiStepperFormField field={field} />
                  <p data-testid="interceptor-extra-element">{helperTextBetweenFields}</p>
                </div>
              );
            }

            return field;
          };

          render(
            <HaapiStepperForm
              action={action}
              onSubmit={onSubmit}
              formFieldRenderInterceptor={formFieldRenderInterceptor}
            />
          );

          expect(screen.getByTestId(interceptorExtraElementTestId)).toBeInTheDocument();
          await user.click(screen.getByTestId(submitButtonTestId));
          expect(onSubmit).toHaveBeenCalledTimes(1);
          const payload = onSubmit.mock.calls[0]?.[1];
          expect(Object.fromEntries(payload)).toEqual({
            [contextFieldName]: hiddenContextValue,
          });
        });
      });

      describe('Behavior customization', () => {
        it('allows side effects when rendering form fields', async () => {
          const action = createLoginFormAction();
          const onSubmit = vi.fn();

          const CustomFormField = ({
            field,
            formState,
          }: {
            field: VisibleHaapiFormField;
            formState: HaapiStepperFormState;
          }) => {
            useEffect(() => {
              if (field.type === HAAPI_FORM_FIELDS.USERNAME) {
                formState.set(field, prefilledUsernameValue);
              }
              // eslint-disable-next-line react-hooks/exhaustive-deps
            }, [field]);

            return (
              <div>
                <HaapiStepperFormField field={field} />
              </div>
            );
          };

          const formFieldRenderInterceptor: HaapiStepperFormFieldRenderInterceptor = (field, formState) => (
            <CustomFormField field={field} formState={formState} />
          );

          render(
            <HaapiStepperForm
              action={action}
              onSubmit={onSubmit}
              formFieldRenderInterceptor={formFieldRenderInterceptor}
            />
          );

          const usernameInput: HTMLInputElement = screen.getByTestId(
            formFieldTestId(HAAPI_FORM_FIELDS.TEXT, usernameFieldName)
          );

          await waitFor(() => {
            expect(usernameInput.value).toBe(prefilledUsernameValue);
          });

          await user.click(screen.getByTestId(submitButtonTestId));

          expect(onSubmit).toHaveBeenCalledTimes(1);
          const payload = onSubmit.mock.calls[0]?.[1];
          expect(Object.fromEntries(payload)).toEqual({
            [contextFieldName]: hiddenContextValue,
            [usernameFieldName]: prefilledUsernameValue,
          });
        });
      });
    });

    describe('Via Composition (children render interceptor)', () => {
      describe('Data customization', () => {
        it('allows field data customization', () => {
          const action = createLoginFormAction();
          const onSubmit = vi.fn();

          render(
            <HaapiStepperForm action={action} onSubmit={onSubmit}>
              {({ fields }) => (
                <>
                  {fields.map(field => {
                    const customizedLabel = `${field.label ?? field.name} (customized)`;
                    const customizedField =
                      field.type === HAAPI_FORM_FIELDS.USERNAME
                        ? { ...field, placeholder: customPlaceholderForUsername, label: customizedLabel }
                        : { ...field, label: customizedLabel };

                    return (
                      <div key={field.name}>
                        <HaapiStepperFormField field={customizedField} />
                      </div>
                    );
                  })}
                </>
              )}
            </HaapiStepperForm>
          );

          expect(screen.getByLabelText(customizedUsernameLabel)).toBeInTheDocument();
          expect(screen.getByPlaceholderText(customPlaceholderForUsername)).toBeInTheDocument();
        });
      });

      describe('UI customization', () => {
        it('supports default form components', async () => {
          const action = createLoginFormAction();
          const onSubmit = vi.fn();

          render(
            <HaapiStepperForm action={action} onSubmit={onSubmit}>
              {({ fields }) => (
                <>
                  {fields.map(field => (
                    <div key={field.name}>
                      <HaapiStepperFormField field={field} />
                    </div>
                  ))}
                  <HaapiStepperFormSubmitButton />
                </>
              )}
            </HaapiStepperForm>
          );

          const usernameInput = screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.TEXT, usernameFieldName));

          await user.type(usernameInput, usernameValue);
          await user.click(screen.getByTestId(submitButtonTestId));

          expect(onSubmit).toHaveBeenCalledTimes(1);
          const payload = onSubmit.mock.calls[0]?.[1];
          expect(Object.fromEntries(payload)).toEqual({
            [contextFieldName]: hiddenContextValue,
            [usernameFieldName]: usernameValue,
          });
        });

        it('supports supports custom submit button', async () => {
          const action = createLoginFormAction();
          const onSubmit = vi.fn();

          render(
            <HaapiStepperForm action={action} onSubmit={onSubmit}>
              {({ fields }) => (
                <>
                  {fields.map(field => (
                    <div key={field.name}>
                      <HaapiStepperFormField field={field} />
                    </div>
                  ))}
                  <button type="submit">{submitButtonLabel}</button>
                </>
              )}
            </HaapiStepperForm>
          );

          const usernameInput = screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.TEXT, usernameFieldName));

          await user.type(usernameInput, usernameValue);
          await user.click(screen.getByRole('button', { name: submitButtonLabel }));

          expect(onSubmit).toHaveBeenCalledTimes(1);
          const payload = onSubmit.mock.calls[0]?.[1];
          expect(Object.fromEntries(payload)).toEqual({
            [contextFieldName]: hiddenContextValue,
            [usernameFieldName]: usernameValue,
          });
        });

        it('supports custom input components', async () => {
          const action = createLoginFormAction();
          const onSubmit = vi.fn();

          render(
            <HaapiStepperForm action={action} onSubmit={onSubmit}>
              {({ fields, formState }) => {
                const usernameField = fields.find(field => field.type === HAAPI_FORM_FIELDS.USERNAME)!;
                const otherVisibleFields = fields.filter(field => field !== usernameField);

                return (
                  <>
                    <div data-testid="composed-custom-input">
                      <label className="label block">
                        {customUsernameLabelWithSuffix}
                        <input
                          type="text"
                          className="field w100"
                          name={usernameField.name}
                          value={formState.get(usernameField)}
                          onChange={e => formState.set(usernameField, e.target.value)}
                        />
                      </label>
                    </div>
                    {otherVisibleFields.map(field => (
                      <div key={field.name}>
                        <HaapiStepperFormField field={field} />
                      </div>
                    ))}
                    <HaapiStepperFormSubmitButton />
                  </>
                );
              }}
            </HaapiStepperForm>
          );

          const customInput = screen.getByLabelText(customUsernameLabelWithSuffix);
          await user.type(customInput, usernameValue);
          await user.click(screen.getByTestId(submitButtonTestId));

          expect(onSubmit).toHaveBeenCalledTimes(1);
          let payload = onSubmit.mock.calls[0]?.[1];
          expect(Object.fromEntries(payload)).toEqual({
            [contextFieldName]: hiddenContextValue,
            [usernameFieldName]: usernameValue,
          });

          const usernameUpdate = usernameValue + 'Test';
          await user.clear(customInput);
          await user.type(customInput, usernameUpdate);
          await user.click(screen.getByTestId(submitButtonTestId));

          expect(onSubmit).toHaveBeenCalledTimes(2);
          payload = onSubmit.mock.calls[1]?.[1];
          expect(Object.fromEntries(payload)).toEqual({
            [contextFieldName]: hiddenContextValue,
            [usernameFieldName]: usernameUpdate,
          });
        });

        it('supports excluding fields from the rendered form', async () => {
          const action = createLoginFormAction();
          const onSubmit = vi.fn();

          render(
            <HaapiStepperForm action={action} onSubmit={onSubmit}>
              {({ fields }) => (
                <>
                  {fields
                    .filter(field => field.type !== HAAPI_FORM_FIELDS.PASSWORD)
                    .map(field => (
                      <div key={field.name}>
                        <HaapiStepperFormField field={field} />
                      </div>
                    ))}
                  <HaapiStepperFormSubmitButton />
                </>
              )}
            </HaapiStepperForm>
          );

          expect(
            screen.queryByTestId(formFieldTestId(HAAPI_FORM_FIELDS.PASSWORD, passwordFieldName))
          ).not.toBeInTheDocument();

          const usernameInput = screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.TEXT, usernameFieldName));
          await user.type(usernameInput, usernameValue);
          await user.click(screen.getByTestId(submitButtonTestId));

          expect(onSubmit).toHaveBeenCalledTimes(1);
          const payload = onSubmit.mock.calls[0]?.[1];
          expect(Object.fromEntries(payload)).toEqual({
            [contextFieldName]: hiddenContextValue,
            [usernameFieldName]: usernameValue,
          });
        });

        it('supports inserting additional elements between fields', async () => {
          const action = createLoginFormAction();
          const onSubmit = vi.fn();

          render(
            <HaapiStepperForm action={action} onSubmit={onSubmit}>
              {({ fields }) => (
                <>
                  {fields.map(field => (
                    <div key={field.name}>
                      <label className="label block">
                        {field.label ?? field.name}:
                        <HaapiStepperFormField field={field} />
                      </label>
                      {field.type === HAAPI_FORM_FIELDS.USERNAME && (
                        <p data-testid={composedExtraElementTestId}>{helperTextBetweenFields}</p>
                      )}
                    </div>
                  ))}
                  <HaapiStepperFormSubmitButton />
                </>
              )}
            </HaapiStepperForm>
          );

          expect(screen.getByTestId(composedExtraElementTestId)).toHaveTextContent(helperTextBetweenFields);
          await user.click(screen.getByTestId(submitButtonTestId));
          expect(onSubmit).toHaveBeenCalledTimes(1);
          const payload = onSubmit.mock.calls[0]?.[1];
          expect(Object.fromEntries(payload)).toEqual({
            [contextFieldName]: hiddenContextValue,
          });
        });
      });

      describe('Behavior customization', () => {
        it('supports custom submission callbacks', async () => {
          const action = createLoginFormAction();
          const onSubmit = vi.fn();
          const handleSubmit: HaapiStepperNextStep<HaapiStepperFormAction> = (action, payload) => {
            if (window.confirm(confirmSubmissionMessage)) {
              onSubmit(action, payload);
            }
          };

          render(
            <HaapiStepperForm action={action} onSubmit={handleSubmit}>
              {({ fields }) => (
                <>
                  {fields.map(field => (
                    <div key={field.name}>
                      <HaapiStepperFormField field={field} />
                    </div>
                  ))}
                  <button type="submit">{submitButtonLabel}</button>
                </>
              )}
            </HaapiStepperForm>
          );

          const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);
          const usernameInput = screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.TEXT, usernameFieldName));
          const passwordInput = screen.getByTestId(formFieldTestId(HAAPI_FORM_FIELDS.PASSWORD, passwordFieldName));
          await user.type(usernameInput, usernameValue);
          await user.type(passwordInput, passwordValue);

          await user.click(screen.getByRole('button', { name: submitButtonLabel }));

          expect(confirmSpy).toHaveBeenCalledWith(confirmSubmissionMessage);
          expect(onSubmit).toHaveBeenCalledTimes(1);
          const payload = onSubmit.mock.calls[0]?.[1];
          expect(Object.fromEntries(payload)).toEqual({
            [contextFieldName]: hiddenContextValue,
            [usernameFieldName]: usernameValue,
            [passwordFieldName]: passwordValue,
          });
          confirmSpy.mockRestore();
        });
      });
    });
  });
});

vi.mock('../../stepper/HaapiStepperHook', () => ({
  useHaapiStepper: vi.fn(() => ({ error: null })),
}));

const mockUseHaapiStepper = vi.mocked(useHaapiStepper);

const createLoginFormAction = () =>
  createMockFormAction({
    id: loginFormId,
    title: loginFormTitle,
    model: {
      href: loginFormActionHref,
      method: HTTP_METHODS.POST,
      actionTitle: loginFormActionTitle,
      fields: [
        { type: HAAPI_FORM_FIELDS.USERNAME, name: usernameFieldName, label: 'Username' },
        { type: HAAPI_FORM_FIELDS.PASSWORD, name: passwordFieldName, label: 'Password' },
        {
          type: HAAPI_FORM_FIELDS.CHECKBOX,
          name: rememberMeFieldName,
          label: 'Remember me',
          value: rememberValue,
        },
        {
          type: HAAPI_FORM_FIELDS.SELECT,
          name: countryFieldName,
          label: 'Country',
          options: [
            { label: 'Sweden', value: countrySwedenValue },
            { label: 'Canada', value: countryCanadaValue },
          ],
        },
        { type: HAAPI_FORM_FIELDS.HIDDEN, name: contextFieldName, value: hiddenContextValue },
      ],
    },
  });

const formFieldTestId = (type: string, name: string) => `haapi-form-field-${type}-${name}`;
const submitButtonTestId = 'haapi-form-submit-button';
const validationErrorTestId = 'haapi-validation-error';
const interceptorExtraElementTestId = 'interceptor-extra-element';
const composedExtraElementTestId = 'composed-extra-element';
const helperTextBetweenFields = 'Helper text between fields';
const usernameFieldName = 'username';
const passwordFieldName = 'password';
const rememberMeFieldName = 'rememberMe';
const countryFieldName = 'country';
const contextFieldName = 'context';
const loginFormId = 'form-login';
const loginFormTitle = 'Login';
const loginFormActionHref = '/login';
const loginFormActionTitle = 'Sign In';
const hiddenContextValue = 'hidden-value';
const usernameValue = 'alice';
const passwordValue = 's3cret';
const rememberValue = 'remember';
const countryCanadaValue = 'CA';
const countrySwedenValue = 'SE';
const validationMissingUsernameMessage = `Field '${usernameFieldName}' is required`;
const validationInvalidPasswordMessage = 'Wrong password';
const interceptedUsernameLabel = 'Intercepted Username';
const customUsernameLabel = 'Custom Username';
const customUsernameLabelWithSuffix = `${customUsernameLabel}:`;
const customPlaceholderForUsername = 'Custom placeholder for username';
const customizedUsernameLabel = 'Username (customized)';
const confirmSubmissionMessage = 'Do you want to submit the form?';
const submitButtonLabel = 'Submit';
const prefilledUsernameValue = 'prefilled-user';

import { useEffect, useRef } from 'react';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';

import { HAAPI_FORM_ACTION_KINDS } from '../../../data-access/types/haapi-action.types';
import { HTTP_METHODS } from '../../../data-access/types/haapi-form.types';
import { HaapiStepperForm } from './HaapiStepperForm';
import { HaapiStepperFormSubmitButton } from './HaapiStepperFormSubmitButton';
import { useHaapiStepper } from '../../stepper/HaapiStepperHook';
import { createHaapiStepperApiMock, createMockFormAction } from '../../../util/tests/mocks';

describe('HaapiStepperFormSubmitButton', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockUseHaapiStepper.mockReturnValue(createHaapiStepperApiMock());
  });

  describe('Default rendering', () => {
    it('uses action.model.actionTitle as the default label', () => {
      const action = createNonAuthenticatorFormAction();

      render(<HaapiStepperForm action={action} onSubmit={vi.fn()} />);

      expect(screen.getByTestId(submitButtonTestId)).toHaveTextContent(nonAuthenticatorActionTitle);
    });

    it('falls back to action.title when action.model.actionTitle is absent', () => {
      const action = createMockFormAction({
        kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
        title: fallbackActionTitle,
        model: { href: '/login', method: HTTP_METHODS.POST, fields: [] },
      });

      render(<HaapiStepperForm action={action} onSubmit={vi.fn()} />);

      expect(screen.getByTestId(submitButtonTestId)).toHaveTextContent(fallbackActionTitle);
    });

    it('renders no icon for a non-authenticator form action', () => {
      const action = createNonAuthenticatorFormAction();

      render(<HaapiStepperForm action={action} onSubmit={vi.fn()} />);

      expect(screen.getByTestId(submitButtonTestId).querySelector('.icon')).toBeNull();
    });

    it('applies the default haapi-stepper-button class for a non-authenticator form action', () => {
      const action = createNonAuthenticatorFormAction();

      render(<HaapiStepperForm action={action} onSubmit={vi.fn()} />);

      const button = screen.getByTestId(submitButtonTestId);
      expect(button).toHaveClass('haapi-stepper-button');
      expect(button).not.toHaveClass('haapi-stepper-button-outline');
      expect(button).not.toHaveClass('haapi-stepper-authenticator-button');
    });

    it('applies the outline class and no icon for a cancel form action', () => {
      const action = createCancelFormAction();

      render(<HaapiStepperForm action={action} onSubmit={vi.fn()} />);

      const button = screen.getByTestId(submitButtonTestId);
      expect(button).toHaveClass('haapi-stepper-button-outline');
      expect(button).not.toHaveClass('haapi-stepper-button');
      expect(button).not.toHaveClass('haapi-stepper-authenticator-button');
      expect(button.querySelector('.icon')).toBeNull();
    });

    describe('Authenticator form', () => {
      it('renders the authenticator icon and classes', () => {
        const action = createAuthenticatorSelectorOption({ authenticatorType: 'google' });

        render(<HaapiStepperForm action={action} onSubmit={vi.fn()} />);

        const button = screen.getByTestId(submitButtonTestId);
        expect(button).toHaveClass('haapi-stepper-authenticator-button');
        expect(button).toHaveClass('button-google');
        expect(button).not.toHaveClass('haapi-stepper-button');
        expect(button.querySelector('.icon svg')).not.toBeNull();
      });

      it('falls back to the default icon for an unknown authenticator type', () => {
        const action = createAuthenticatorSelectorOption({ authenticatorType: 'some-unknown-type' });

        render(<HaapiStepperForm action={action} onSubmit={vi.fn()} />);

        const button = screen.getByTestId(submitButtonTestId);
        expect(button).toHaveClass('button-some-unknown-type');
        expect(button.querySelector('.icon svg')).not.toBeNull();
      });
    });
  });

  describe('Custom rendering', () => {
    describe('label prop', () => {
      it('overrides the default computed label with the provided label', () => {
        const action = createAuthenticatorSelectorOption({ authenticatorType: 'google' });

        render(
          <HaapiStepperForm action={action} onSubmit={vi.fn()}>
            {() => <HaapiStepperFormSubmitButton label={customLabel} />}
          </HaapiStepperForm>
        );

        const button = screen.getByTestId(submitButtonTestId);
        expect(button).toHaveTextContent(customLabel);
        expect(button).not.toHaveTextContent('Continue with google');
      });
    });

    describe('icon prop', () => {
      it('renders the provided icon for a non-authenticator action', () => {
        const action = createNonAuthenticatorFormAction();

        render(
          <HaapiStepperForm action={action} onSubmit={vi.fn()}>
            {() => <HaapiStepperFormSubmitButton icon={<span data-testid={customIconTestId} />} />}
          </HaapiStepperForm>
        );

        const button = screen.getByTestId(submitButtonTestId);
        expect(button).toHaveClass('haapi-stepper-button');
        expect(button.querySelector('.icon')?.firstElementChild).toBe(screen.getByTestId(customIconTestId));
      });

      it('overrides the default authenticator icon when the action has an authenticatorType', () => {
        const action = createAuthenticatorSelectorOption({ authenticatorType: 'google' });

        render(
          <HaapiStepperForm action={action} onSubmit={vi.fn()}>
            {() => <HaapiStepperFormSubmitButton icon={<span data-testid={customIconTestId} />} />}
          </HaapiStepperForm>
        );

        const button = screen.getByTestId(submitButtonTestId);
        expect(button).toHaveClass('haapi-stepper-authenticator-button');
        expect(button).toHaveClass('button-google');
        expect(button.querySelector('.icon')?.firstElementChild).toBe(screen.getByTestId(customIconTestId));
      });
    });

    describe('children prop', () => {
      it('replaces the default button content while preserving the button styling', () => {
        const action = createAuthenticatorSelectorOption({ authenticatorType: 'google' });

        render(
          <HaapiStepperForm action={action} onSubmit={vi.fn()}>
            {() => (
              <HaapiStepperFormSubmitButton>
                <span data-testid={customChildrenTestId}>Custom content</span>
              </HaapiStepperFormSubmitButton>
            )}
          </HaapiStepperForm>
        );

        const button = screen.getByTestId(submitButtonTestId);
        expect(button).toHaveClass('haapi-stepper-authenticator-button');
        expect(button).toHaveClass('button-google');
        expect(button.querySelector('.icon')).toBeNull();
        expect(screen.getByTestId(customChildrenTestId)).toBeInTheDocument();
      });
    });

    describe('className prop', () => {
      it('merges the extra className with the computed class names', () => {
        const action = createAuthenticatorSelectorOption({ authenticatorType: 'google' });

        render(
          <HaapiStepperForm action={action} onSubmit={vi.fn()}>
            {() => <HaapiStepperFormSubmitButton className="my-extra-class" />}
          </HaapiStepperForm>
        );

        const button = screen.getByTestId(submitButtonTestId);
        expect(button).toHaveClass('haapi-stepper-authenticator-button');
        expect(button).toHaveClass('button-google');
        expect(button).toHaveClass('my-extra-class');
      });
    });

    describe('ref prop', () => {
      it('forwards the ref to the underlying button element', () => {
        const action = createNonAuthenticatorFormAction();

        function FocusSubmitOnMount() {
          const submitButtonRef = useRef<HTMLButtonElement>(null);

          useEffect(() => {
            submitButtonRef.current?.focus();
          }, []);

          return <HaapiStepperFormSubmitButton ref={submitButtonRef} />;
        }

        render(
          <HaapiStepperForm action={action} onSubmit={vi.fn()}>
            {() => <FocusSubmitOnMount />}
          </HaapiStepperForm>
        );

        expect(screen.getByTestId(submitButtonTestId)).toHaveFocus();
      });
    });

    describe('Native button attributes', () => {
      it('forwards aria, disabled, and other native attributes to the underlying button', () => {
        const action = createAuthenticatorSelectorOption({ authenticatorType: 'google' });

        render(
          <HaapiStepperForm action={action} onSubmit={vi.fn()}>
            {() => (
              <HaapiStepperFormSubmitButton
                aria-label="Sign in with Google"
                aria-describedby="help-text"
                disabled
                name="submit"
              />
            )}
          </HaapiStepperForm>
        );

        const button = screen.getByTestId(submitButtonTestId);
        expect(button).toHaveAttribute('aria-label', 'Sign in with Google');
        expect(button).toHaveAttribute('aria-describedby', 'help-text');
        expect(button).toHaveAttribute('name', 'submit');
        expect(button).toBeDisabled();
      });
    });
  });
});

vi.mock('../../stepper/HaapiStepperHook', () => ({
  useHaapiStepper: vi.fn(() => ({ error: null })),
}));

const mockUseHaapiStepper = vi.mocked(useHaapiStepper);

const submitButtonTestId = 'form-submit-button';
const customIconTestId = 'custom-authenticator-icon';
const customChildrenTestId = 'custom-submit-button-children';
const customLabel = 'Custom Submit Label';
const nonAuthenticatorActionTitle = 'Sign in';
const fallbackActionTitle = 'Fallback title';

const createNonAuthenticatorFormAction = () =>
  createMockFormAction({
    kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
    model: {
      href: '/login',
      method: HTTP_METHODS.POST,
      actionTitle: nonAuthenticatorActionTitle,
      fields: [],
    },
  });

const createCancelFormAction = () =>
  createMockFormAction({
    kind: HAAPI_FORM_ACTION_KINDS.CANCEL,
    title: 'Cancel',
    model: {
      href: '/cancel',
      method: HTTP_METHODS.POST,
      fields: [],
    },
  });

const createAuthenticatorSelectorOption = ({ authenticatorType }: { authenticatorType: string }) =>
  createMockFormAction({
    kind: HAAPI_FORM_ACTION_KINDS.AUTHENTICATOR_SELECTOR_OPTION,
    title: authenticatorType,
    properties: { authenticatorType },
    model: {
      href: `/authenticate/${authenticatorType}`,
      method: HTTP_METHODS.POST,
      actionTitle: `Continue with ${authenticatorType}`,
      fields: [],
    },
  });

import { render, screen, within } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { beforeEach, describe, expect, it, vi } from 'vitest';

import { MEDIA_TYPES } from '../../../shared/util/types/media.types';
import {
  HAAPI_ACTION_CLIENT_OPERATIONS,
  HAAPI_ACTION_TYPES,
  HAAPI_FORM_ACTION_KINDS,
} from '../../data-access/types/haapi-action.types';
import { HTTP_METHODS } from '../../data-access/types/haapi-form.types';
import { HAAPI_STEPPER_ELEMENT_TYPES } from '../../data-access/types/haapi-step.types';
import {
  HaapiStepperClientOperationAction,
  HaapiStepperFormAction,
  HaapiStepperNextStep,
  HaapiStepperSelectorAction,
} from '../../feature/stepper/haapi-stepper.types';
import { HaapiStepperActionsUI } from './HaapiStepperActionsUI';

describe('HaapiStepperActionsUI', () => {
  let onAction: HaapiStepperNextStep<HaapiStepperFormAction | HaapiStepperClientOperationAction>;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    onAction = vi.fn();
    user = userEvent.setup();
  });

  describe('Default Rendering', () => {
    it('should render null when actions are not provided', () => {
      const { container } = render(<HaapiStepperActionsUI actions={undefined} onAction={onAction} />);

      expect(container.firstChild).toBeNull();
    });

    it('should invoke onAction when the default elements trigger submission', async () => {
      const formAction = createMockFormAction({
        title: 'Login Form',
        model: { actionTitle: 'Submit Login' } as HaapiStepperFormAction['model'],
      });
      const clientAction = createMockClientOperationAction({ title: 'External Flow' });

      render(<HaapiStepperActionsUI actions={[formAction, clientAction]} onAction={onAction} />);

      const formElement = screen.getByTestId('form-action');
      const submitButton = within(formElement).getByRole('button', { name: 'Submit Login' });
      await user.click(submitButton);

      expect(onAction).toHaveBeenNthCalledWith(1, formAction, expect.any(Object));

      const clientOperationButton = screen.getByRole('button', { name: 'External Flow' });
      await user.click(clientOperationButton);

      expect(onAction).toHaveBeenNthCalledWith(2, clientAction);
      expect(onAction).toHaveBeenCalledTimes(2);
    });

    describe('Container', () => {
      it('should render the default container when no custom container is provided', () => {
        const actions = [
          createMockFormAction({
            title: 'Login Heading',
            model: { actionTitle: 'Login' } as HaapiStepperFormAction['model'],
          }),
        ];

        render(<HaapiStepperActionsUI actions={actions} onAction={onAction} />);

        const container = screen.getByTestId('actions');
        expect(container.tagName).toBe('DIV');
        expect(screen.getByTestId('form-action')).toBeInTheDocument();
        expect(screen.getByRole('button', { name: 'Login' })).toBeInTheDocument();
      });
    });

    describe('Actions', () => {
      it('should render form, selector, and client operation actions using the default factory', () => {
        const formAction = createMockFormAction({
          title: 'Form Action',
          model: { actionTitle: 'Submit Form' } as HaapiStepperFormAction['model'],
        });
        const selectorAction = createMockSelectorAction({ title: 'Selector Action' });
        const clientAction = createMockClientOperationAction({ title: 'Client Action' });

        render(<HaapiStepperActionsUI actions={[formAction, selectorAction, clientAction]} onAction={onAction} />);

        const formElement = screen.getAllByTestId('form-action')[0];
        expect(within(formElement).getByRole('button', { name: 'Submit Form' })).toBeInTheDocument();

        const selectorElement = screen.getByTestId('selector-action');
        expect(within(selectorElement).getByTestId('form-selector-title')).toHaveTextContent('Selector Action');

        const clientOperationElement = screen.getByTestId('client-operation-action');
        expect(within(clientOperationElement).getByText('Client Action')).toBeInTheDocument();
        expect(within(clientOperationElement).getByRole('button', { name: 'Client Action' })).toBeInTheDocument();
      });
    });
  });

  describe('Custom Rendering', () => {
    describe('Container', () => {
      it('should render inside a custom container element when provided', () => {
        const actions = [createMockFormAction({ title: 'Login' })];

        render(<HaapiStepperActionsUI actions={actions} onAction={onAction} container="section" />);

        expect(screen.getByTestId('actions').tagName).toBe('SECTION');
      });

      it('should skip the container when container is null', () => {
        const actions = [createMockFormAction({ title: 'Login' })];

        render(<HaapiStepperActionsUI actions={actions} onAction={onAction} container={null} />);

        expect(screen.queryByTestId('actions')).not.toBeInTheDocument();
        expect(screen.getByTestId('form-action')).toBeInTheDocument();
      });
    });

    describe('Actions', () => {
      describe('Data Customization', () => {
        it('should pass customized data to the default rendering', () => {
          const formAction = createMockFormAction({ title: 'Form Action' });
          const selectorAction = createMockSelectorAction({ title: 'Selector Action' });
          const clientAction = createMockClientOperationAction({ title: 'Client Action' });

          const formInterceptor = (action: HaapiStepperFormAction) => ({
            ...action,
            title: 'Intercepted Form',
            model: { ...action.model, actionTitle: 'Intercepted Form Submit' },
          });
          const selectorInterceptor = (action: HaapiStepperSelectorAction) => ({
            ...action,
            title: 'Intercepted Selector',
          });
          const clientInterceptor = (action: HaapiStepperClientOperationAction) => ({
            ...action,
            title: 'Intercepted Client',
          });

          render(
            <HaapiStepperActionsUI
              actions={[formAction, selectorAction, clientAction]}
              onAction={onAction}
              formActionRenderInterceptor={formInterceptor}
              selectorActionRenderInterceptor={selectorInterceptor}
              clientOperationActionRenderInterceptor={clientInterceptor}
            />
          );

          const standaloneForm = screen.getAllByTestId('form-action')[0];
          expect(within(standaloneForm).getByText('Intercepted Form Submit')).toBeInTheDocument();
          expect(within(standaloneForm).getByRole('button', { name: 'Intercepted Form Submit' })).toBeInTheDocument();

          const selectorHeading = screen.getByTestId('form-selector-title');
          expect(selectorHeading).toHaveTextContent('Intercepted Selector');

          const clientOperation = screen.getByTestId('client-operation-action');
          expect(within(clientOperation).getByRole('button', { name: 'Intercepted Client' })).toBeInTheDocument();
        });
      });

      describe('UI Customization', () => {
        it('should render custom elements returned by the form, selector, and client operation interceptors', () => {
          const formAction = createMockFormAction({ title: 'Form Action' });
          const selectorAction = createMockSelectorAction({ title: 'Selector Action' });
          const clientAction = createMockClientOperationAction({ title: 'Client Action' });

          render(
            <HaapiStepperActionsUI
              actions={[formAction, selectorAction, clientAction]}
              onAction={onAction}
              formActionRenderInterceptor={() => <div data-testid="custom-form">Custom Form</div>}
              selectorActionRenderInterceptor={() => <div data-testid="custom-selector">Custom Selector</div>}
              clientOperationActionRenderInterceptor={() => <div data-testid="custom-client">Custom Client</div>}
            />
          );

          expect(screen.getByTestId('custom-form')).toHaveTextContent('Custom Form');
          expect(screen.getByTestId('custom-selector')).toHaveTextContent('Custom Selector');
          expect(screen.getByTestId('custom-client')).toHaveTextContent('Custom Client');
          expect(screen.queryByTestId('form-action')).not.toBeInTheDocument();
          expect(screen.queryByTestId('selector-action')).not.toBeInTheDocument();
          expect(screen.queryByTestId('client-operation-action')).not.toBeInTheDocument();
        });

        it('should hide actions when interceptors return null', () => {
          const formAction = createMockFormAction({ title: 'Form Action' });
          const selectorAction = createMockSelectorAction({ title: 'Selector Action' });
          const clientAction = createMockClientOperationAction({ title: 'Client Action' });

          const { container } = render(
            <HaapiStepperActionsUI
              actions={[formAction, selectorAction, clientAction]}
              onAction={onAction}
              formActionRenderInterceptor={() => null}
              selectorActionRenderInterceptor={() => null}
              clientOperationActionRenderInterceptor={() => null}
            />
          );

          expect(container.firstChild).toBeNull();
        });
      });
    });
  });
});

const createMockFormAction = (overrides: Partial<HaapiStepperFormAction> = {}): HaapiStepperFormAction => ({
  id: crypto.randomUUID(),
  type: HAAPI_STEPPER_ELEMENT_TYPES.ACTION,
  subtype: HAAPI_ACTION_TYPES.FORM,
  kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
  title: 'Form Action',
  template: HAAPI_ACTION_TYPES.FORM,
  model: {
    href: '/login',
    method: HTTP_METHODS.POST,
    type: MEDIA_TYPES.FORM_URLENCODED,
    actionTitle: 'Login',
    fields: [],
    ...(overrides.model ?? {}),
  },
  ...overrides,
});

const createMockSelectorAction = (overrides: Partial<HaapiStepperSelectorAction> = {}): HaapiStepperSelectorAction => ({
  id: crypto.randomUUID(),
  type: HAAPI_STEPPER_ELEMENT_TYPES.ACTION,
  subtype: HAAPI_ACTION_TYPES.SELECTOR,
  kind: 'selector',
  title: 'Selector Action',
  template: HAAPI_ACTION_TYPES.SELECTOR,
  model: {
    options: [
      createMockFormAction({ title: 'Option 1', id: 'option-1' }),
      createMockFormAction({ title: 'Option 2', id: 'option-2' }),
    ],
    ...(overrides.model ?? {}),
  },
  ...overrides,
});

const createMockClientOperationAction = (
  overrides: Partial<HaapiStepperClientOperationAction> = {}
): HaapiStepperClientOperationAction => ({
  id: crypto.randomUUID(),
  type: HAAPI_STEPPER_ELEMENT_TYPES.ACTION,
  subtype: HAAPI_ACTION_TYPES.CLIENT_OPERATION,
  kind: 'client-operation',
  title: 'Client Operation',
  template: HAAPI_ACTION_TYPES.CLIENT_OPERATION,
  model: {
    name: HAAPI_ACTION_CLIENT_OPERATIONS.EXTERNAL_BROWSER_FLOW,
    arguments: { href: '/external' },
    continueActions: [createMockFormAction({ title: 'Continue' })],
    ...(overrides.model ?? {}),
  },
  ...overrides,
});

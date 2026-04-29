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

import { render, screen, within, fireEvent, waitFor } from '@testing-library/react';
import { useEffect } from 'react';
import userEvent from '@testing-library/user-event';
import { vi, describe, it, expect, beforeEach } from 'vitest';
import { HaapiStepperContext } from '../stepper/HaapiStepperContext';
import type {
  HaapiStepperAPI,
  HaapiStepperNextStep,
  HaapiStepperNextStepAction,
  HaapiStepperNextStepPayload,
  HaapiStepperStepUIActionsRenderInterceptor,
  HaapiStepperStepUIClientOperationActionRenderInterceptor,
  HaapiStepperStepUIErrorRenderInterceptor,
  HaapiStepperStepUIFormActionRenderInterceptor,
  HaapiStepperStepUILinkRenderInterceptor,
  HaapiStepperStepUILoadingRenderInterceptor,
  HaapiStepperStepUIMessageRenderInterceptor,
  HaapiStepperStepUISelectorActionRenderInterceptor,
  HaapiStepperStepUIStepRenderInterceptor,
  HaapiStepperAPIWithRequiredCurrentStep,
  HaapiStepperUnexpectedProblemStep,
  HaapiStepperInputValidationProblemStep,
  HaapiStepperFormAction,
  HaapiStepperUserMessage,
  HaapiStepperLink,
  HaapiStepperFormFieldRenderInterceptor,
  HaapiStepperFormState,
  HaapiStepperVisibleFormField,
} from '../stepper/haapi-stepper.types';
import { HAAPI_FORM_FIELDS } from '../../data-access/types/haapi-form.types';
import { MEDIA_TYPES } from '../../../shared/util/types/media.types';
import { HaapiStepperActionsUI } from '../../ui/actions/HaapiStepperActionsUI';
import {
  HAAPI_FORM_ACTION_KINDS,
  HAAPI_ACTION_CLIENT_OPERATIONS,
  HaapiBaseClientOperationModel,
} from '../../data-access/types/haapi-action.types';
import { HAAPI_STEPS, HAAPI_PROBLEM_STEPS, HAAPI_POLLING_STATUS } from '../../data-access/types/haapi-step.types';
import { HaapiStepperViewNameBuiltInUI } from '../viewnames';
import { HTTP_METHODS } from '../../data-access/types/haapi-form.types';
import { HaapiStepperStepUI } from './HaapiStepperStepUI';
import {
  createBankIdPollingStep,
  createMockClientOperationAction,
  createMockFormAction,
  createMockLink,
  createMockMessage,
  createMockQrLink,
  createMockSelectorAction,
  createMockStep,
  defaultStepperAPI,
  MockActionTitle,
  MockLinkText,
  MockMessageClassList,
  MockMessageText,
  mockNextStep,
} from '../../util/tests/mocks';
import { HaapiStepperFormFieldUI } from '../actions/form/fields/HaapiStepperFormFieldUI';

const renderWithContext = (ui: React.ReactElement, contextValue: Partial<HaapiStepperAPI> = {}) => {
  const value: HaapiStepperAPI = {
    ...defaultStepperAPI,
    ...contextValue,
  };

  return render(<HaapiStepperContext value={value}>{ui}</HaapiStepperContext>);
};

describe('HaapiStepperStepUI', () => {
  let user: ReturnType<typeof userEvent.setup>;

  const mockActions = [
    createMockFormAction({ title: 'Original Form Title' }),
    createMockSelectorAction({ title: 'Original Selector Title' }),
    createMockClientOperationAction({ title: 'Original Client Op Title' }),
  ];

  beforeEach(() => {
    user = userEvent.setup();
    vi.resetAllMocks();
  });

  describe('Loading Rendering', () => {
    describe('Default Rendering', () => {
      describe('No current step present', () => {
        it('should render loading element when no currentStep and loading=true', () => {
          renderWithContext(<HaapiStepperStepUI />, {
            currentStep: null,
            loading: true,
          });

          expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
        });

        it('should render nothing (null) when no currentStep and loading=false', () => {
          const { container } = renderWithContext(<HaapiStepperStepUI />, {
            currentStep: null,
          });

          expect(container.firstChild).toBeNull();
        });
      });

      describe('Current step present', () => {
        it('should render step content when currentStep exists and loading=false', () => {
          renderWithContext(<HaapiStepperStepUI />);

          expect(screen.queryByTestId('messages')).toBeInTheDocument();
          expect(screen.queryByTestId('links')).toBeInTheDocument();
        });

        it('should render step content when currentStep exists and loading=true', () => {
          renderWithContext(<HaapiStepperStepUI />, {
            loading: true,
          });

          expect(screen.queryByTestId('messages')).toBeInTheDocument();
          expect(screen.queryByTestId('links')).toBeInTheDocument();
        });
      });
    });

    describe('Custom Rendering', () => {
      describe('Data Customization', () => {
        it('should pass customized data to the default rendering', () => {
          const loadingRenderInterceptor: HaapiStepperStepUILoadingRenderInterceptor = ({
            loading,
            currentStep,
            ...rest
          }) => {
            return { loading: loading && currentStep?.metadata?.templateArea !== 'lwa', currentStep, ...rest };
          };

          renderWithContext(<HaapiStepperStepUI loadingRenderInterceptor={loadingRenderInterceptor} />, {
            loading: true,
          });

          expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
        });
      });

      describe('UI Customization', () => {
        it('should render custom loading element when loadingRenderInterceptor is provided', () => {
          const customLoadingRenderInterceptor: HaapiStepperStepUILoadingRenderInterceptor = ({
            loading,
            currentStep,
            ...rest
          }) => {
            if (loading && currentStep?.metadata?.viewName?.includes('select-authenticator')) {
              return <div data-testid="custom-loading">Authenticating...</div>;
            }

            return { loading, currentStep, ...rest };
          };

          const { unmount } = renderWithContext(
            <HaapiStepperStepUI loadingRenderInterceptor={customLoadingRenderInterceptor} />,
            {
              loading: true,
            }
          );

          expect(screen.queryByTestId('custom-loading')?.textContent).toBe('Authenticating...');

          unmount();

          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            metadata: { viewName: 'views/login/index' },
          });

          renderWithContext(<HaapiStepperStepUI loadingRenderInterceptor={customLoadingRenderInterceptor} />, {
            loading: true,
            currentStep: step,
          });

          expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
          expect(screen.queryByTestId('custom-loading')).not.toBeInTheDocument();
        });

        it('should render nothing when loadingRenderInterceptor returns null or undefined and no currentStep exists', () => {
          const customLoadingRenderInterceptor = () => null;

          const { container } = renderWithContext(
            <HaapiStepperStepUI loadingRenderInterceptor={customLoadingRenderInterceptor} />,
            {
              currentStep: null,
              loading: true,
            }
          );

          expect(container.firstChild).toBeNull();
        });

        it('should render step content when loadingRenderInterceptor returns null and currentStep exists', () => {
          const customLoadingRenderInterceptor = () => null;

          renderWithContext(<HaapiStepperStepUI loadingRenderInterceptor={customLoadingRenderInterceptor} />, {
            loading: true,
          });

          expect(screen.queryByTestId('loading-spinner')).not.toBeInTheDocument();
          expect(screen.queryByTestId('messages')).toBeInTheDocument();
          expect(screen.queryByTestId('links')).toBeInTheDocument();
        });
      });

      describe('Behavior Customization', () => {
        it('should execute side effects when loading', () => {
          const analyticsTracker = vi.fn();

          const loadingWithAnalytics: HaapiStepperStepUILoadingRenderInterceptor = ({
            loading,
            currentStep,
            ...rest
          }) => {
            if (loading) {
              analyticsTracker('loading_started', { hasStep: !!currentStep });
            }
            return { loading, currentStep, ...rest };
          };

          renderWithContext(<HaapiStepperStepUI loadingRenderInterceptor={loadingWithAnalytics} />, {
            loading: true,
          });

          expect(analyticsTracker).toHaveBeenCalledWith('loading_started', { hasStep: true });
          expect(screen.queryByTestId('loading-spinner')).toBeInTheDocument();
        });
      });
    });
  });

  describe('Error Rendering', () => {
    describe('Default Rendering', () => {
      it('should render step content when error exists but no errorRenderInterceptor', () => {
        const errorStep: HaapiStepperUnexpectedProblemStep = {
          type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
          title: 'Unexpected Error',
          messages: [createMockMessage({ text: 'Something went wrong' })],
          dataHelpers: {
            messages: [],
            links: [],
          },
        };

        renderWithContext(<HaapiStepperStepUI />, {
          error: {
            app: errorStep,
            input: null,
          },
        });

        expect(screen.queryByTestId('messages')).toBeInTheDocument();
        expect(screen.queryByTestId('links')).toBeInTheDocument();
        expect(screen.queryByTestId('form-action')).toBeInTheDocument();
      });

      it('should display error.input messages and links over step content when error.input exists', () => {
        const errorInput: HaapiStepperInputValidationProblemStep = {
          type: HAAPI_PROBLEM_STEPS.INVALID_INPUT,
          invalidFields: [],
          messages: [createMockMessage({ text: 'Error Message' })],
          links: [createMockLink({ title: 'Error Link' })],
          dataHelpers: {
            messages: [createMockMessage({ text: 'Error Message' })],
            links: [createMockLink({ title: 'Error Link' })],
          },
        };

        renderWithContext(<HaapiStepperStepUI />, {
          error: {
            app: null,
            input: errorInput,
          },
        });

        const messagesContainer = screen.getByTestId('messages');
        const linksContainer = screen.getByTestId('links');
        expect(within(messagesContainer).getByText('Error Message')).toBeInTheDocument();
        expect(within(linksContainer).getByText('Error Link')).toBeInTheDocument();
        expect(screen.queryByText('Step Message')).not.toBeInTheDocument();
        expect(screen.queryByText('Step Link')).not.toBeInTheDocument();
      });

      it('should display error.input messages and links over step content when error.input exists even when no error.input.messages', () => {
        const errorInput: HaapiStepperInputValidationProblemStep = {
          type: HAAPI_PROBLEM_STEPS.INVALID_INPUT,
          invalidFields: [],
          dataHelpers: {
            messages: [],
            links: [],
          },
        };

        renderWithContext(<HaapiStepperStepUI />, {
          error: {
            app: null,
            input: errorInput,
          },
        });

        expect(screen.queryByText('Step Message')).not.toBeInTheDocument();
        expect(screen.queryByText('Step Link')).toBeInTheDocument();
      });

      it('should render steps links when error.input exists but has no links', () => {
        const errorInput: HaapiStepperInputValidationProblemStep = {
          type: HAAPI_PROBLEM_STEPS.INVALID_INPUT,
          invalidFields: [],
          dataHelpers: {
            messages: [],
            links: [],
          },
        };

        renderWithContext(<HaapiStepperStepUI />, {
          error: {
            app: null,
            input: errorInput,
          },
        });

        expect(screen.getByText('Step Link')).toBeInTheDocument();
      });
    });

    describe('Custom Rendering', () => {
      describe('Data Customization', () => {
        it('should pass customized error data to the default rendering', () => {
          // Because there is not default rendering for errors (it always displays null), there is
          // nothing to test here. Keeping test for feature documentation purposes.
        });
      });

      describe('UI Customization', () => {
        it('should render custom error element when errorRenderInterceptor is provided', () => {
          const errorStep: HaapiStepperUnexpectedProblemStep = {
            type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
            title: 'Unexpected Error',
            dataHelpers: {
              messages: [],
              links: [],
            },
          };

          const customErrorRenderInterceptor: HaapiStepperStepUIErrorRenderInterceptor = ({ error }) => (
            <div data-testid="custom-error">Custom Error Display: {error?.app?.title ?? ''}</div>
          );

          renderWithContext(<HaapiStepperStepUI errorRenderInterceptor={customErrorRenderInterceptor} />, {
            error: {
              app: errorStep,
              input: null,
            },
          });

          expect(screen.queryByTestId('custom-error')).toContainHTML(`Custom Error Display: ${errorStep.title ?? ''}`);
          const messagesContainer = screen.queryByTestId('messages');
          const linksContainer = screen.queryByTestId('links');
          expect(within(messagesContainer!).getByText(MockMessageText)).toBeInTheDocument();
          expect(within(linksContainer!).getByText(MockLinkText)).toBeInTheDocument();
        });

        it('should fall back to normal step rendering (no error reporting) when errorRenderInterceptor returns null', () => {
          const errorInput: HaapiStepperInputValidationProblemStep = {
            type: HAAPI_PROBLEM_STEPS.INVALID_INPUT,
            invalidFields: [],
            messages: [createMockMessage({ text: 'Validation Error Message' })],
            links: [createMockLink({ title: 'Validation Error Link' })],
            dataHelpers: {
              messages: [createMockMessage({ text: 'Validation Error Message' })],
              links: [createMockLink({ title: 'Validation Error Link' })],
            },
          };

          const customErrorRenderInterceptor = () => null;

          renderWithContext(<HaapiStepperStepUI errorRenderInterceptor={customErrorRenderInterceptor} />, {
            error: {
              app: null,
              input: errorInput,
            },
          });

          const messagesContainer = screen.getByTestId('messages');
          const linksContainer = screen.getByTestId('links');
          expect(within(messagesContainer).getByText('Validation Error Message')).toBeInTheDocument();
          expect(within(linksContainer).getByText('Validation Error Link')).toBeInTheDocument();
        });
      });

      describe('Behaviour Customization', () => {
        it('should execute side effects when error occurs (e.g. error tracking in this case)', () => {
          const errorTracker = vi.fn();
          const errorStep: HaapiStepperUnexpectedProblemStep = {
            type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
            title: 'Unexpected Error',
            messages: [createMockMessage({ text: 'Something went wrong' })],
            dataHelpers: {
              messages: [],
              links: [],
            },
          };

          const errorRenderInterceptorWithTracking: HaapiStepperStepUIErrorRenderInterceptor = ({
            error,
            currentStep,
            ...rest
          }) => {
            if (error?.app) {
              errorTracker('error_occurred', {
                type: error.app.type,
                title: error.app.title,
                stepType: currentStep?.type,
              });
            }
            return { error, currentStep, ...rest };
          };

          renderWithContext(<HaapiStepperStepUI errorRenderInterceptor={errorRenderInterceptorWithTracking} />, {
            error: {
              app: errorStep,
              input: null,
            },
          });

          expect(errorTracker).toHaveBeenCalledWith('error_occurred', {
            type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
            title: 'Unexpected Error',
            stepType: 'authentication-step',
          });
        });
      });
    });
  });

  describe('Actions Rendering', () => {
    describe('Default Rendering', () => {
      it('should render actions with the correct default action`s component', () => {
        const actions = [
          createMockFormAction({ title: 'Login Form' }),
          createMockSelectorAction({ title: 'Choose Authenticator' }),
          createMockClientOperationAction(),
        ];
        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
          actions,
        });

        renderWithContext(<HaapiStepperStepUI />, {
          currentStep: step,
        });

        const standaloneFormAction = screen.getAllByTestId('form-action')[0];
        const selectorAction = screen.getByTestId('selector-action');
        const selectorFormActions = within(selectorAction).queryAllByTestId('form-action');

        expect(standaloneFormAction.textContent).toContain('Login Form');
        expect(selectorAction.textContent).toContain('Choose Authenticator');
        expect(selectorFormActions).toHaveLength(2);
        const clientOperationContainer = screen.queryByTestId('client-operation-action');
        expect(within(clientOperationContainer!).getByText('External Browser')).toBeInTheDocument();
      });

      describe('No actions scenarios', () => {
        it('should handle step with empty actions array', () => {
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            actions: [],
          });

          renderWithContext(<HaapiStepperStepUI />, {
            currentStep: step,
          });

          expect(screen.queryByTestId('form-action')).not.toBeInTheDocument();
        });
      });
    });

    describe('Custom Rendering', () => {
      describe('Data Customization', () => {
        it('should render modified action data when the render interceptor returns action data', () => {
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, { actions: mockActions });

          const actionsRenderInterceptor: HaapiStepperStepUIActionsRenderInterceptor = haapiStepperAPI => {
            const currentActions = haapiStepperAPI.currentStep.dataHelpers.actions?.all ?? [];
            const updatedActions = currentActions.map(action => ({
              ...action,
              title: `Modified ${action.title ?? ''}`,
            }));

            const updatedStep = {
              ...haapiStepperAPI.currentStep,
              dataHelpers: {
                ...haapiStepperAPI.currentStep.dataHelpers,
                actions: {
                  ...haapiStepperAPI.currentStep.dataHelpers.actions,
                  all: updatedActions,
                },
              },
            };

            return {
              ...haapiStepperAPI,
              currentStep: updatedStep,
            } as HaapiStepperAPIWithRequiredCurrentStep;
          };

          renderWithContext(<HaapiStepperStepUI actionsRenderInterceptor={actionsRenderInterceptor} />, {
            currentStep: step,
          });

          expect(screen.getAllByTestId('form-action')[0]).toHaveTextContent('Modified Original Form Title');
          expect(screen.getByTestId('selector-action')).toHaveTextContent('Modified Original Selector Title');
          expect(screen.getByTestId('client-operation-action')).toHaveTextContent('Modified Original Client Op Title');
        });

        it('should delegate rendering to action, selector, and client operation render interceptors when present and the render interceptor returns action data', () => {
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, { actions: mockActions });

          const actionsRenderInterceptor: HaapiStepperStepUIActionsRenderInterceptor = haapiStepperAPI => {
            const currentActions = haapiStepperAPI.currentStep.dataHelpers.actions?.all ?? [];
            const updatedActions = currentActions.map(action => ({
              ...action,
              title: `Modified ${action.title ?? ''}`,
            }));

            const updatedStep = {
              ...haapiStepperAPI.currentStep,
              dataHelpers: {
                ...haapiStepperAPI.currentStep.dataHelpers,
                actions: {
                  ...(haapiStepperAPI.currentStep.dataHelpers.actions ?? {}),
                  all: updatedActions,
                },
              },
            };

            return {
              ...haapiStepperAPI,
              currentStep: updatedStep,
            } as HaapiStepperAPIWithRequiredCurrentStep;
          };

          const formInterceptor: HaapiStepperStepUIFormActionRenderInterceptor = ({ action }) => (
            <div data-testid="custom-form-action">{action.title}</div>
          );
          const selectorInterceptor: HaapiStepperStepUISelectorActionRenderInterceptor = ({ action }) => (
            <div data-testid="custom-selector-action">{action.title}</div>
          );
          const clientInterceptor: HaapiStepperStepUIClientOperationActionRenderInterceptor = ({ action }) => (
            <div data-testid="custom-client-action">{action.title}</div>
          );

          renderWithContext(
            <HaapiStepperStepUI
              actionsRenderInterceptor={actionsRenderInterceptor}
              formActionRenderInterceptor={formInterceptor}
              selectorActionRenderInterceptor={selectorInterceptor}
              clientOperationActionRenderInterceptor={clientInterceptor}
            />,
            {
              currentStep: step,
            }
          );

          expect(screen.getByTestId('custom-form-action')).toHaveTextContent('Modified Original Form Title');
          expect(screen.getByTestId('custom-selector-action')).toHaveTextContent('Modified Original Selector Title');
          expect(screen.getByTestId('custom-client-action')).toHaveTextContent('Modified Original Client Op Title');
        });
      });
      describe('UI Customization', () => {
        it('should render custom elements when the actions render interceptor returns a custom element', () => {
          const actionsRenderInterceptor: HaapiStepperStepUIActionsRenderInterceptor = ({ currentStep, nextStep }) => (
            <div data-testid="custom-actions-wrapper">
              <HaapiStepperActionsUI actions={currentStep.dataHelpers.actions?.all} onAction={nextStep} />
            </div>
          );

          renderWithContext(<HaapiStepperStepUI actionsRenderInterceptor={actionsRenderInterceptor} />);

          expect(screen.getByTestId('custom-actions-wrapper')).toBeInTheDocument();
          expect(screen.queryByTestId('actions')).toBeInTheDocument();
        });

        it('should skip rendering actions when the interceptor returns null', () => {
          const actionsRenderInterceptor: HaapiStepperStepUIActionsRenderInterceptor = () => null;

          renderWithContext(<HaapiStepperStepUI actionsRenderInterceptor={actionsRenderInterceptor} />);

          expect(screen.queryByTestId('actions')).not.toBeInTheDocument();
        });
      });

      describe('Behavior Customization', () => {
        it('should execute side effects when actions are rendered', () => {
          const actions = [
            createMockFormAction({ title: 'Behavior Form' }),
            createMockSelectorAction({ title: 'Behavior Selector' }),
            createMockClientOperationAction({ title: 'Behavior Client Operation' }),
          ];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, { actions });

          const actionsTracker = vi.fn();
          const formTracker = vi.fn();
          const selectorTracker = vi.fn();
          const clientTracker = vi.fn();

          const actionsRenderInterceptor: HaapiStepperStepUIActionsRenderInterceptor = haapiStepperAPI => {
            const actionCount = haapiStepperAPI.currentStep.dataHelpers.actions?.all.length ?? 0;
            actionsTracker('actions_rendered', { actionCount });
            return haapiStepperAPI;
          };

          const formInterceptor: HaapiStepperStepUIFormActionRenderInterceptor = ({ action }) => {
            formTracker('form_rendered', { id: action.id, title: action.title });
            return action;
          };

          const selectorInterceptor: HaapiStepperStepUISelectorActionRenderInterceptor = ({ action }) => {
            selectorTracker('selector_rendered', { id: action.id, title: action.title });
            return action;
          };

          const clientInterceptor: HaapiStepperStepUIClientOperationActionRenderInterceptor = ({ action }) => {
            clientTracker('client_rendered', { id: action.id, title: action.title });
            return action;
          };

          renderWithContext(
            <HaapiStepperStepUI
              actionsRenderInterceptor={actionsRenderInterceptor}
              formActionRenderInterceptor={formInterceptor}
              selectorActionRenderInterceptor={selectorInterceptor}
              clientOperationActionRenderInterceptor={clientInterceptor}
            />,
            {
              currentStep: step,
            }
          );

          expect(actionsTracker).toHaveBeenCalledWith('actions_rendered', { actionCount: actions.length });
          expect(formTracker).toHaveBeenCalledWith('form_rendered', {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(String),
            title: 'Behavior Form',
          });
          expect(selectorTracker).toHaveBeenCalledWith('selector_rendered', {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(String),
            title: 'Behavior Selector',
          });
          expect(clientTracker).toHaveBeenCalledWith('client_rendered', {
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            id: expect.any(String),
            title: 'Behavior Client Operation',
          });

          expect(screen.getByTestId('actions')).toBeInTheDocument();
        });

        it('should execute side effects when nextStep is triggered', async () => {
          const actions = [
            createMockFormAction({
              title: 'Tracked Login',
              kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
              model: {
                href: '/login',
                method: HTTP_METHODS.POST,
                type: MEDIA_TYPES.FORM_URLENCODED,
                fields: [],
                actionTitle: 'Tracked Login',
              },
            }),
            createMockFormAction({
              title: 'Cancel Session',
              kind: HAAPI_FORM_ACTION_KINDS.CANCEL,
              model: {
                href: '/cancel',
                method: HTTP_METHODS.POST,
                type: MEDIA_TYPES.FORM_URLENCODED,
                fields: [],
                actionTitle: 'Cancel Session',
              },
            }),
          ];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, { actions });

          const originalNextStepMock = vi.fn();
          const analyticsTracker = vi.fn();
          const confirmSpy = vi.spyOn(window, 'confirm').mockReturnValue(true);

          const actionsRenderInterceptor: HaapiStepperStepUIActionsRenderInterceptor = ({
            currentStep,
            nextStep,
            ...rest
          }) => {
            const trackedNextStep: HaapiStepperNextStep = (
              action: HaapiStepperNextStepAction,
              payload?: HaapiStepperNextStepPayload
            ) => {
              analyticsTracker('action_next_step', {
                stepType: currentStep.type,
                actionId: action.id,
                actionKind: (action as HaapiStepperFormAction).kind,
              });

              if (
                (action as HaapiStepperFormAction).kind === HAAPI_FORM_ACTION_KINDS.CANCEL &&
                !confirm('Exit authentication?')
              ) {
                return;
              }

              nextStep(action, payload);
            };

            return { currentStep, nextStep: trackedNextStep, ...rest };
          };

          renderWithContext(<HaapiStepperStepUI actionsRenderInterceptor={actionsRenderInterceptor} />, {
            currentStep: step,
            nextStep: originalNextStepMock,
          });

          const loginButton = screen.getByRole('button', { name: 'Tracked Login' });
          const cancelButton = screen.getByRole('button', { name: 'Cancel Session' });

          expect(analyticsTracker).not.toHaveBeenCalled();
          expect(originalNextStepMock).not.toHaveBeenCalled();

          await user.click(loginButton);

          expect(analyticsTracker).toHaveBeenCalledTimes(1);
          expect(analyticsTracker).toHaveBeenLastCalledWith('action_next_step', {
            stepType: HAAPI_STEPS.AUTHENTICATION,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            actionId: expect.any(String),
            actionKind: HAAPI_FORM_ACTION_KINDS.LOGIN,
          });
          expect(confirmSpy).not.toHaveBeenCalled();
          expect(originalNextStepMock).toHaveBeenCalledTimes(1);

          confirmSpy.mockReturnValueOnce(false);
          await user.click(cancelButton);

          expect(analyticsTracker).toHaveBeenCalledTimes(2);
          expect(analyticsTracker).toHaveBeenLastCalledWith('action_next_step', {
            stepType: HAAPI_STEPS.AUTHENTICATION,
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            actionId: expect.any(String),
            actionKind: HAAPI_FORM_ACTION_KINDS.CANCEL,
          });
          expect(confirmSpy).toHaveBeenCalledTimes(1);
          expect(confirmSpy).toHaveBeenCalledWith('Exit authentication?');
          expect(originalNextStepMock).toHaveBeenCalledTimes(1);

          confirmSpy.mockReturnValueOnce(true);
          await user.click(cancelButton);

          expect(analyticsTracker).toHaveBeenCalledTimes(3);
          expect(confirmSpy).toHaveBeenCalledTimes(2);
          expect(originalNextStepMock).toHaveBeenCalledTimes(2);

          confirmSpy.mockRestore();
        });
      });
    });
  });

  describe('Action Rendering', () => {
    describe('Custom Rendering', () => {
      describe('Data Customization', () => {
        it('should render modified action data when interceptors return action data', () => {
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            actions: mockActions,
          });

          const modifyFormDataInterceptor: HaapiStepperStepUIFormActionRenderInterceptor = ({ action }) => ({
            ...action,
            title: 'Modified Form Title',
          });

          const modifySelectorDataInterceptor: HaapiStepperStepUISelectorActionRenderInterceptor = ({ action }) => ({
            ...action,
            title: 'Modified Selector Title',
          });

          const modifyClientOpDataInterceptor: HaapiStepperStepUIClientOperationActionRenderInterceptor = ({
            action,
          }) => ({
            ...action,
            title: 'Modified Client Op Title',
          });

          renderWithContext(
            <HaapiStepperStepUI
              formActionRenderInterceptor={modifyFormDataInterceptor}
              selectorActionRenderInterceptor={modifySelectorDataInterceptor}
              clientOperationActionRenderInterceptor={modifyClientOpDataInterceptor}
            />,
            {
              currentStep: step,
            }
          );

          expect(screen.getByRole('button', { name: 'Modified Form Title' })).toBeInTheDocument();
          expect(screen.getByText('Modified Selector Title')).toBeInTheDocument();
          expect(screen.getByText('Modified Client Op Title')).toBeInTheDocument();

          expect(screen.queryByRole('button', { name: 'Original Form Title' })).not.toBeInTheDocument();
          expect(screen.queryByText('Original Selector Title')).not.toBeInTheDocument();
          expect(screen.queryByText('Original Client Op Title')).not.toBeInTheDocument();
        });
      });

      describe('UI Customization', () => {
        it('should render custom elements when action render interceptors return custom elements', () => {
          const actions = [
            createMockFormAction({ title: 'Login Form' }),
            createMockSelectorAction({ title: 'Choose Authenticator' }),
            createMockClientOperationAction({
              title: 'External Browser',
              model: { name: HAAPI_ACTION_CLIENT_OPERATIONS.EXTERNAL_BROWSER_FLOW } as HaapiBaseClientOperationModel,
            }),
          ];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            actions,
          });

          const customFormRenderInterceptor: HaapiStepperStepUIFormActionRenderInterceptor = ({
            action,
            currentStep,
          }) => (
            <div data-testid="custom-form-action">
              Custom Form Element - Action: {action.title} - Step: {currentStep.type}
            </div>
          );

          const customSelectorRenderInterceptor: HaapiStepperStepUISelectorActionRenderInterceptor = ({
            action,
            currentStep,
          }) => (
            <div data-testid="custom-selector-action">
              Custom Selector Element - Action: {action.title} - Step: {currentStep.type}
            </div>
          );

          const customClientOpRenderInterceptor: HaapiStepperStepUIClientOperationActionRenderInterceptor = ({
            action,
            currentStep,
          }) => (
            <div data-testid="custom-client-op-action">
              Custom Client Operation Element - Action: {action.title} - Step: {currentStep.type}
            </div>
          );

          renderWithContext(
            <HaapiStepperStepUI
              formActionRenderInterceptor={customFormRenderInterceptor}
              selectorActionRenderInterceptor={customSelectorRenderInterceptor}
              clientOperationActionRenderInterceptor={customClientOpRenderInterceptor}
            />,
            {
              currentStep: step,
            }
          );

          expect(screen.queryByTestId('custom-form-action')).toHaveTextContent(
            'Custom Form Element - Action: Login Form - Step: authentication'
          );
          expect(screen.queryByTestId('custom-selector-action')).toHaveTextContent(
            'Custom Selector Element - Action: Choose Authenticator - Step: authentication'
          );
          expect(screen.queryByTestId('custom-client-op-action')).toHaveTextContent(
            'Custom Client Operation Element - Action: External Browser - Step: authentication'
          );

          // Verify default elements are not rendered
          expect(screen.queryByTestId('form-action')).not.toBeInTheDocument();
          expect(screen.queryByTestId('selector-action')).not.toBeInTheDocument();
          expect(screen.queryByTestId('client-operation-action')).not.toBeInTheDocument();
        });

        it('should render default elements when action render interceptors return the action data', () => {
          const actions = [
            createMockFormAction({ title: 'Login Form' }),
            createMockSelectorAction({ title: 'Choose Authenticator' }),
            createMockClientOperationAction({ title: 'External Browser' }),
          ];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            actions,
          });

          const passthroughFormRenderInterceptor: HaapiStepperStepUIFormActionRenderInterceptor = ({ action }) =>
            action;
          const passthroughSelectorRenderInterceptor: HaapiStepperStepUISelectorActionRenderInterceptor = ({
            action,
          }) => action;
          const passthroughClientOpRenderInterceptor: HaapiStepperStepUIClientOperationActionRenderInterceptor = ({
            action,
          }) => action;

          renderWithContext(
            <HaapiStepperStepUI
              formActionRenderInterceptor={passthroughFormRenderInterceptor}
              selectorActionRenderInterceptor={passthroughSelectorRenderInterceptor}
              clientOperationActionRenderInterceptor={passthroughClientOpRenderInterceptor}
            />,
            {
              currentStep: step,
            }
          );

          const standaloneFormAction = screen.getAllByTestId('form-action')[0];
          const selectorAction = screen.getByTestId('selector-action');
          const selectorFormActions = within(selectorAction).queryAllByTestId('form-action');
          const clientOperationContainer = screen.queryByTestId('client-operation-action');

          expect(standaloneFormAction.textContent).toContain('Login Form');
          expect(selectorAction.textContent).toContain('Choose Authenticator');
          expect(selectorFormActions).toHaveLength(2);
          expect(within(clientOperationContainer!).getByText('External Browser')).toBeInTheDocument();
        });

        it('should skip rendering when action render interceptors return null', () => {
          const actions = [
            createMockFormAction({ title: 'Login Form' }),
            createMockSelectorAction({ title: 'Choose Authenticator' }),
            createMockClientOperationAction({ title: 'External Browser' }),
          ];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            actions,
          });

          const skipFormRenderInterceptor: HaapiStepperStepUIFormActionRenderInterceptor = () => null;
          const skipSelectorRenderInterceptor: HaapiStepperStepUISelectorActionRenderInterceptor = () => null;
          const skipClientOpRenderInterceptor: HaapiStepperStepUIClientOperationActionRenderInterceptor = () => null;

          renderWithContext(
            <HaapiStepperStepUI
              formActionRenderInterceptor={skipFormRenderInterceptor}
              selectorActionRenderInterceptor={skipSelectorRenderInterceptor}
              clientOperationActionRenderInterceptor={skipClientOpRenderInterceptor}
            />,
            {
              currentStep: step,
            }
          );

          expect(screen.queryByTestId('form-action')).not.toBeInTheDocument();
          expect(screen.queryByTestId('selector-action')).not.toBeInTheDocument();
          expect(screen.queryByTestId('client-operation-action')).not.toBeInTheDocument();
        });
      });

      describe('Behavior Customization', () => {
        it('should execute side effects when actions are rendered', () => {
          const analyticsTracker = vi.fn();

          const formActionRenderInterceptorWithAnalytics: HaapiStepperStepUIFormActionRenderInterceptor = ({
            action,
            currentStep,
          }) => {
            analyticsTracker('form_action_rendered', {
              actionTitle: action.title,
              stepType: currentStep.type,
            });
            return action;
          };

          renderWithContext(
            <HaapiStepperStepUI formActionRenderInterceptor={formActionRenderInterceptorWithAnalytics} />
          );

          expect(analyticsTracker).toHaveBeenCalledWith('form_action_rendered', {
            actionTitle: MockActionTitle,
            stepType: HAAPI_STEPS.AUTHENTICATION,
          });
          const formActionContainer = screen.getByTestId('form-action');
          expect(within(formActionContainer).getByRole('button', { name: MockActionTitle })).toBeInTheDocument();
        });
      });
    });
  });

  describe('Form field rendering', () => {
    describe('Data customization', () => {
      it('should allow field data customizations before default rendering', () => {
        const customUsername = 'Intercepted Username';
        const formFieldRenderInterceptor: HaapiStepperFormFieldRenderInterceptor = field => {
          if (field.type === HAAPI_FORM_FIELDS.USERNAME) {
            return { ...field, label: customUsername };
          }
          return field;
        };

        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION);

        renderWithContext(<HaapiStepperStepUI formFieldRenderInterceptor={formFieldRenderInterceptor} />, {
          currentStep: step,
        });

        expect(screen.getByLabelText(customUsername)).toBeInTheDocument();
      });

      it('should render the default form when the interceptor returns the field data', () => {
        const formFieldRenderInterceptor: HaapiStepperFormFieldRenderInterceptor = field => field;

        renderWithContext(<HaapiStepperStepUI formFieldRenderInterceptor={formFieldRenderInterceptor} />, {
          currentStep: createMockStep(HAAPI_STEPS.AUTHENTICATION),
        });

        expect(screen.getByLabelText('Username')).toBeInTheDocument();
        expect(screen.getByLabelText('Password')).toBeInTheDocument();
      });
    });

    describe('UI customization', () => {
      it('should render custom form field components', () => {
        const customLabel = 'Username (customized)';
        const formFieldRenderInterceptor: HaapiStepperFormFieldRenderInterceptor = (field, formState) => {
          if (field.type === HAAPI_FORM_FIELDS.USERNAME) {
            return (
              <label key={field.name} className="label block">
                {customLabel}
                <input
                  type="text"
                  className="field w100"
                  value={formState.get(field)}
                  onChange={event => formState.set(field, event.target.value)}
                />
              </label>
            );
          }
          return field;
        };

        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION);

        renderWithContext(<HaapiStepperStepUI formFieldRenderInterceptor={formFieldRenderInterceptor} />, {
          currentStep: step,
        });

        const customInput = screen.getByLabelText(customLabel);
        fireEvent.change(customInput, { target: { value: 'alice@example.com' } });
        fireEvent.click(screen.getByRole('button', { name: MockActionTitle }));

        expect(mockNextStep).toHaveBeenCalledTimes(1);
        const payload = mockNextStep.mock.calls[0]?.[1] as Map<string, string>;
        expect(Object.fromEntries(payload)).toMatchObject({
          username: 'alice@example.com',
        });
      });

      it('should support excluding fields from the rendered form', () => {
        const formFieldRenderInterceptor: HaapiStepperFormFieldRenderInterceptor = field => {
          if (field.type === HAAPI_FORM_FIELDS.PASSWORD) {
            return null;
          }
          return field;
        };

        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION);

        renderWithContext(<HaapiStepperStepUI formFieldRenderInterceptor={formFieldRenderInterceptor} />, {
          currentStep: step,
        });

        expect(screen.queryByLabelText('Password:')).not.toBeInTheDocument();
      });

      it('should allow inserting additional elements for between specific fields', () => {
        const helperTestId = 'helper-text';
        const formFieldRenderInterceptor: HaapiStepperFormFieldRenderInterceptor = field => {
          if (field.name === 'country') {
            return (
              <div key={field.name} data-testid="country-wrapper">
                <HaapiStepperFormFieldUI field={field} />
                <span data-testid={helperTestId}>Choose wisely</span>
              </div>
            );
          }
          return field;
        };

        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
          actions: [
            createMockFormAction({
              model: {
                href: '/login',
                method: HTTP_METHODS.POST,
                type: MEDIA_TYPES.FORM_URLENCODED,
                fields: [
                  {
                    id: crypto.randomUUID(),
                    type: HAAPI_FORM_FIELDS.USERNAME,
                    name: 'username',
                  },
                  {
                    id: crypto.randomUUID(),
                    type: HAAPI_FORM_FIELDS.SELECT,
                    name: 'country',
                    options: [
                      { label: 'Sweden', value: 'se' },
                      { label: 'Norway', value: 'no' },
                    ],
                  },
                ],
              },
            }),
          ],
        });

        renderWithContext(<HaapiStepperStepUI formFieldRenderInterceptor={formFieldRenderInterceptor} />, {
          currentStep: step,
        });

        expect(screen.getByTestId('country-wrapper')).toBeInTheDocument();
        expect(screen.getByTestId(helperTestId)).toHaveTextContent('Choose wisely');
      });
    });

    describe('Behavior customization', () => {
      it('should allow side effects when rendering form fields', async () => {
        const prefilledUsernameValue = 'prefilled-user@example.com';

        const CustomFormField = ({
          field,
          formState,
        }: {
          field: HaapiStepperVisibleFormField;
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
              <HaapiStepperFormFieldUI field={field} />
            </div>
          );
        };

        const formFieldRenderInterceptor: HaapiStepperFormFieldRenderInterceptor = (field, formState) => (
          <CustomFormField field={field} formState={formState} />
        );

        renderWithContext(<HaapiStepperStepUI formFieldRenderInterceptor={formFieldRenderInterceptor} />);

        const usernameInput = screen.getByTestId<HTMLInputElement>('haapi-form-field-text-username');

        await waitFor(() => {
          expect(usernameInput.value).toBe(prefilledUsernameValue);
        });

        fireEvent.click(screen.getByTestId('haapi-form-submit-button'));

        expect(mockNextStep).toHaveBeenCalledTimes(1);
        const payload = mockNextStep.mock.calls[0]?.[1] as Map<string, string>;
        expect(Object.fromEntries(payload)).toMatchObject({
          username: prefilledUsernameValue,
        });
      });
    });
  });

  describe('Message Rendering', () => {
    describe('Default Rendering', () => {
      it('should render messages with default Messages component', () => {
        const messages = [
          createMockMessage({ text: 'Welcome to login' }),
          createMockMessage({ text: 'Enter your credentials' }),
        ];

        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
          messages,
        });

        renderWithContext(<HaapiStepperStepUI />, {
          currentStep: step,
        });

        expect(screen.queryByTestId('messages')).toBeInTheDocument();
        expect(screen.getByText('Welcome to login')).toBeInTheDocument();
        expect(screen.getByText('Enter your credentials')).toBeInTheDocument();
      });

      it('should render error messages instead of step messages when both exist', () => {
        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
          messages: [createMockMessage({ text: 'Step Message' })],
        });

        const errorInput: HaapiStepperInputValidationProblemStep = {
          type: HAAPI_PROBLEM_STEPS.INVALID_INPUT,
          invalidFields: [],
          messages: [createMockMessage({ text: 'Error Message' })],
          dataHelpers: {
            messages: [createMockMessage({ text: 'Error Message' })],
            links: [],
          },
        };

        renderWithContext(<HaapiStepperStepUI />, {
          currentStep: step,
          error: {
            app: null,
            input: errorInput,
          },
        });

        expect(screen.getByText('Error Message')).toBeInTheDocument();
        expect(screen.queryByText('Step Message')).not.toBeInTheDocument();
      });
    });

    describe('Custom Rendering', () => {
      describe('Data Customization', () => {
        it('should render modified message data when interceptor modifies the message', () => {
          const originalMessages = [createMockMessage({ text: 'Original Message' })];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            messages: originalMessages,
          });

          const modifyMessageRenderInterceptor = ({
            message,
          }: {
            message: HaapiStepperUserMessage;
          }): HaapiStepperUserMessage => ({
            ...message,
            text: 'Modified Message',
          });

          renderWithContext(<HaapiStepperStepUI messageRenderInterceptor={modifyMessageRenderInterceptor} />, {
            currentStep: step,
          });

          expect(screen.getByText('Modified Message')).toBeInTheDocument();
          expect(screen.queryByText('Original Message')).not.toBeInTheDocument();
        });
      });

      describe('UI Customization', () => {
        it('should render custom message elements when messageRenderInterceptor returns custom elements', () => {
          const messages = [createMockMessage({ text: 'Original Message' })];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            messages,
          });

          const customMessageRenderInterceptor: HaapiStepperStepUIMessageRenderInterceptor = ({
            message,
            currentStep,
          }) => (
            <div data-testid="custom-message">
              Custom Message Element - Message: {message.text} - Step: {currentStep.type}
            </div>
          );

          renderWithContext(<HaapiStepperStepUI messageRenderInterceptor={customMessageRenderInterceptor} />, {
            currentStep: step,
          });

          expect(screen.queryByTestId('custom-message')).toHaveTextContent(
            'Custom Message Element - Message: Original Message - Step: authentication'
          );
          expect(screen.queryByText('Original Message')).not.toBeInTheDocument();
        });

        it('should render default message element when messageRenderInterceptor returns message data', () => {
          const messages = [createMockMessage({ text: 'Passthrough Message' })];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            messages,
          });

          const passthroughMessageRenderInterceptor: HaapiStepperStepUIMessageRenderInterceptor = ({ message }) =>
            message;

          renderWithContext(<HaapiStepperStepUI messageRenderInterceptor={passthroughMessageRenderInterceptor} />, {
            currentStep: step,
          });

          expect(screen.queryByTestId('messages')).toBeInTheDocument();
          expect(screen.getByText('Passthrough Message')).toBeInTheDocument();
        });

        it('should skip rendering when messageRenderInterceptor returns null', () => {
          const messages = [createMockMessage({ text: 'Should be skipped' })];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            messages,
          });

          const skipMessageRenderInterceptor = () => null;

          renderWithContext(<HaapiStepperStepUI messageRenderInterceptor={skipMessageRenderInterceptor} />, {
            currentStep: step,
          });

          expect(screen.queryByText('Should be skipped')).not.toBeInTheDocument();
          expect(screen.queryByTestId('messages')).not.toBeInTheDocument();
        });
      });

      describe('Behaviour Customization', () => {
        it('should execute side effects when message is rendered', () => {
          const analyticsTracker = vi.fn();

          const messageWithAnalytics: HaapiStepperStepUIMessageRenderInterceptor = ({ message, currentStep }) => {
            analyticsTracker('message_displayed', {
              messageText: message.text,
              messageClasses: message.classList,
              stepType: currentStep.type,
            });
            return message;
          };

          renderWithContext(<HaapiStepperStepUI messageRenderInterceptor={messageWithAnalytics} />);

          expect(analyticsTracker).toHaveBeenCalledWith('message_displayed', {
            messageText: MockMessageText,
            messageClasses: [MockMessageClassList],
            stepType: HAAPI_STEPS.AUTHENTICATION,
          });
          expect(within(screen.getByTestId('messages')).getByText(MockMessageText)).toBeInTheDocument();
        });
      });
    });
  });

  describe('Link Rendering', () => {
    describe('Default Rendering', () => {
      it('should render links with default Links component', () => {
        const links = [
          createMockLink({ title: 'Help', rel: 'help' }),
          createMockLink({ title: 'Cancel', rel: 'cancel' }),
        ];

        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
          links,
        });

        renderWithContext(<HaapiStepperStepUI />, {
          currentStep: step,
        });

        const linkContainer = screen.queryByTestId('links');

        expect(within(linkContainer!).getByText('Help')).toBeInTheDocument();
        expect(within(linkContainer!).getByText('Cancel')).toBeInTheDocument();
      });

      it('should render error links instead of step links when both exist', () => {
        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
          links: [createMockLink({ title: 'Step Link' })],
        });

        const errorInput: HaapiStepperInputValidationProblemStep = {
          type: HAAPI_PROBLEM_STEPS.INVALID_INPUT,
          invalidFields: [],
          links: [createMockLink({ title: 'Error Link' })],
          dataHelpers: {
            messages: [],
            links: [createMockLink({ title: 'Error Link' })],
          },
        };

        renderWithContext(<HaapiStepperStepUI />, {
          currentStep: step,
          error: {
            app: null,
            input: errorInput,
          },
        });

        const linkContainer = screen.queryByTestId('links');

        expect(within(linkContainer!).getByText('Error Link')).toBeInTheDocument();
        expect(screen.queryByText('Step Link')).not.toBeInTheDocument();
      });
    });

    describe('Custom Rendering', () => {
      describe('Data Customization', () => {
        it('should render modified link data when interceptor returns the link data modified', () => {
          const originalLinks = [createMockLink({ title: 'Original Link' })];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            links: originalLinks,
          });

          const modifyLinkRenderInterceptor = ({ link }: { link: HaapiStepperLink }): HaapiStepperLink => ({
            ...link,
            title: 'Modified Link',
          });

          renderWithContext(<HaapiStepperStepUI linkRenderInterceptor={modifyLinkRenderInterceptor} />, {
            currentStep: step,
          });

          const linkContainer = screen.queryByTestId('links');

          expect(within(linkContainer!).getByText('Modified Link')).toBeInTheDocument();
          expect(screen.queryByText('Original Link')).not.toBeInTheDocument();
        });
      });

      describe('UI Customization', () => {
        it('should render custom link elements when linkRenderInterceptor returns custom elements', () => {
          const links = [createMockLink({ title: 'Original Link' })];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            links,
          });

          const customLinkRenderInterceptor: HaapiStepperStepUILinkRenderInterceptor = ({ link, currentStep }) => (
            <div data-testid="custom-link">
              Custom Link Element - Link: {link.title} - Step: {currentStep.type}
            </div>
          );

          renderWithContext(<HaapiStepperStepUI linkRenderInterceptor={customLinkRenderInterceptor} />, {
            currentStep: step,
          });

          const linkContainer = screen.queryByTestId('links');

          expect(within(linkContainer!).queryByTestId('custom-link')?.textContent).toContain(
            'Custom Link Element - Link: Original Link - Step: authentication'
          );
          expect(screen.queryByText('Original Link')).not.toBeInTheDocument();
        });

        it('should render default link element when linkRenderInterceptor returns link data', () => {
          const links = [createMockLink({ title: 'Passthrough Link' })];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            links,
          });

          const passthroughLinkRenderInterceptor: HaapiStepperStepUILinkRenderInterceptor = ({ link }) => link;

          renderWithContext(<HaapiStepperStepUI linkRenderInterceptor={passthroughLinkRenderInterceptor} />, {
            currentStep: step,
          });

          const linkContainer = screen.queryByTestId('links');

          expect(within(linkContainer!).getByText('Passthrough Link')).toBeInTheDocument();
        });

        it('should skip rendering when linkRenderInterceptor returns null', () => {
          const links = [createMockLink({ title: 'Should be skipped' })];
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            links,
          });

          const skipLinkRenderInterceptor = () => null;

          renderWithContext(<HaapiStepperStepUI linkRenderInterceptor={skipLinkRenderInterceptor} />, {
            currentStep: step,
          });

          expect(screen.queryByText('Should be skipped')).not.toBeInTheDocument();
          expect(screen.queryByTestId('links')).not.toBeInTheDocument();
        });
      });

      describe('Behaviour Customization', () => {
        it('should track link clicks with analytics', async () => {
          const analyticsTracker = vi.fn();

          const linkWithClickTracking: HaapiStepperStepUILinkRenderInterceptor = ({ link, currentStep }) => {
            const handleClick = () => {
              analyticsTracker('link_clicked', {
                linkTitle: link.title,
                linkRel: link.rel,
                linkHref: link.href,
                stepType: currentStep.type,
              });
            };

            return (
              <a key={link.href} href={link.href} onClick={handleClick} data-testid={`custom-link-${link.rel}`}>
                {link.title}
              </a>
            );
          };

          renderWithContext(<HaapiStepperStepUI linkRenderInterceptor={linkWithClickTracking} />);

          const linkContainer = screen.queryByTestId('links');
          const helpLink = within(linkContainer!).getByTestId('custom-link-help');

          expect(helpLink).toBeInTheDocument();
          expect(analyticsTracker).not.toHaveBeenCalled();

          await user.click(helpLink);

          expect(analyticsTracker).toHaveBeenCalledTimes(1);
          expect(analyticsTracker).toHaveBeenCalledWith('link_clicked', {
            linkTitle: MockLinkText,
            linkRel: 'help',
            linkHref: '/help',
            stepType: HAAPI_STEPS.AUTHENTICATION,
          });
        });
      });
    });
  });

  describe('Step Rendering', () => {
    describe('Default Rendering', () => {
      it('should render messages, actions, and links', () => {
        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION);

        renderWithContext(<HaapiStepperStepUI />, {
          currentStep: step,
        });

        expect(screen.queryByTestId('messages')).toBeInTheDocument();
        expect(screen.queryByTestId('form-action')).toBeInTheDocument();
        expect(screen.queryByTestId('links')).toBeInTheDocument();
      });

      it('should render step with actions only', () => {
        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
          links: [],
          messages: [],
        });

        renderWithContext(<HaapiStepperStepUI />, {
          currentStep: step,
        });

        expect(screen.queryByTestId('messages')).not.toBeInTheDocument();
        expect(screen.queryByTestId('form-action')).toBeInTheDocument();
        expect(screen.queryByTestId('links')).not.toBeInTheDocument();
      });

      it('should render step with messages only', () => {
        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
          actions: [],
          links: [],
        });

        renderWithContext(<HaapiStepperStepUI />, {
          currentStep: step,
        });

        expect(screen.queryByTestId('messages')).toBeInTheDocument();
        expect(screen.queryByTestId('form-action')).not.toBeInTheDocument();
        expect(screen.queryByTestId('links')).not.toBeInTheDocument();
      });

      it('should render step with links only', () => {
        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
          actions: [],
          messages: [],
        });

        renderWithContext(<HaapiStepperStepUI />, {
          currentStep: step,
        });

        expect(screen.queryByTestId('messages')).not.toBeInTheDocument();
        expect(screen.queryByTestId('form-action')).not.toBeInTheDocument();
        expect(screen.queryByTestId('links')).toBeInTheDocument();
      });
    });

    describe('Custom Rendering', () => {
      describe('Data Customization', () => {
        it('should render modified step data when stepRenderInterceptor return the step data modified', () => {
          const customStepRenderInterceptor: HaapiStepperStepUIStepRenderInterceptor = ({ currentStep, ...rest }) => {
            if (currentStep.type === HAAPI_STEPS.AUTHENTICATION) {
              return {
                currentStep: {
                  ...currentStep,
                  actions: currentStep.actions.map(action => ({
                    ...action,
                    title: `Modified ${action.title ?? ''}`,
                  })),
                  messages: currentStep.messages?.map(message => ({
                    ...message,
                    text: `Modified ${message.text}`,
                  })),
                  links: currentStep.links?.map(link => ({
                    ...link,
                    title: `Modified ${link.title ?? ''}`,
                  })),
                },
                ...rest,
              };
            }
            return { currentStep, ...rest };
          };

          renderWithContext(<HaapiStepperStepUI stepRenderInterceptor={customStepRenderInterceptor} />);

          const formActionContainer = screen.getByTestId('form-action');
          const messagesContainer = screen.getByTestId('messages');
          const linksContainer = screen.getByTestId('links');

          expect(
            within(formActionContainer).getByRole('button', { name: `Modified ${MockActionTitle}` })
          ).toBeInTheDocument();
          expect(within(messagesContainer).getByText(`Modified ${MockMessageText}`)).toBeInTheDocument();
          expect(within(linksContainer).getByText(`Modified ${MockLinkText}`)).toBeInTheDocument();
          expect(screen.queryByText(MockActionTitle)).not.toBeInTheDocument();
          expect(screen.queryByText(MockMessageText)).not.toBeInTheDocument();
          expect(screen.queryByText(MockLinkText)).not.toBeInTheDocument();
        });
      });

      describe('UI Customization', () => {
        it('should render custom step element when stepRenderInterceptor is provided', () => {
          const customStepRenderInterceptor: HaapiStepperStepUIStepRenderInterceptor = ({ currentStep, ...rest }) => {
            if (currentStep.metadata?.viewName === 'views/select-authenticator/index') {
              return (
                <div data-testid="custom-step">
                  <h1>Custom Select Authenticator</h1>
                  {currentStep.messages?.[0]?.text}
                </div>
              );
            }
            return { currentStep, ...rest };
          };

          renderWithContext(<HaapiStepperStepUI stepRenderInterceptor={customStepRenderInterceptor} />);

          const customStepContainer = screen.queryByTestId('custom-step');

          expect(within(customStepContainer!).getByText('Custom Select Authenticator')).toBeInTheDocument();
          expect(within(customStepContainer!).getByText(MockMessageText)).toBeInTheDocument();
          expect(screen.queryByTestId('form-action')).not.toBeInTheDocument();
          expect(screen.queryByTestId('messages')).not.toBeInTheDocument();
          expect(screen.queryByTestId('links')).not.toBeInTheDocument();
        });

        it('should render nothing when stepRenderInterceptor returns null', () => {
          const customStepRenderInterceptor = () => null;

          renderWithContext(<HaapiStepperStepUI stepRenderInterceptor={customStepRenderInterceptor} />);

          expect(screen.queryByTestId('messages')).not.toBeInTheDocument();
          expect(screen.queryByTestId('form-action')).not.toBeInTheDocument();
          expect(screen.queryByTestId('links')).not.toBeInTheDocument();
        });

        it('should render the default step elements when stepRenderInterceptor returns the Stepper API data', () => {
          const customStepRenderInterceptor: HaapiStepperStepUIStepRenderInterceptor = (
            haapiStepperAPI: HaapiStepperAPIWithRequiredCurrentStep
          ) => haapiStepperAPI;

          renderWithContext(<HaapiStepperStepUI stepRenderInterceptor={customStepRenderInterceptor} />);

          expect(screen.queryByTestId('messages')).toBeInTheDocument();
          expect(screen.queryByTestId('form-action')).toBeInTheDocument();
          expect(screen.queryByTestId('links')).toBeInTheDocument();
        });
      });

      describe('Behavior Customization', () => {
        it('should wrap nextStep with analytics tracking and confirmation dialog for cancel actions', async () => {
          const analyticsTracker = vi.fn();
          const originalNextStepMock = vi.fn();
          const confirmSpy = vi.spyOn(window, 'confirm');

          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
            actions: [
              createMockFormAction({
                title: 'Login',
                kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
                model: { actionTitle: 'Login' } as HaapiStepperFormAction['model'],
              }),
              createMockFormAction({
                title: 'Cancel',
                kind: HAAPI_FORM_ACTION_KINDS.CANCEL,
                model: { actionTitle: 'Cancel' } as HaapiStepperFormAction['model'],
              }),
            ],
          });

          const stepRenderInterceptorWithBehaviorCustomization: HaapiStepperStepUIStepRenderInterceptor = ({
            currentStep,
            nextStep,
            ...rest
          }) => {
            const customNextStep: HaapiStepperNextStep = (
              action: HaapiStepperNextStepAction,
              payload?: HaapiStepperNextStepPayload
            ) => {
              analyticsTracker('step_action', {
                stepType: currentStep.type,
                actionKind: (action as HaapiStepperFormAction).kind,
              });

              if (
                (action as HaapiStepperFormAction).kind === HAAPI_FORM_ACTION_KINDS.CANCEL &&
                !confirm('Exit authentication?')
              ) {
                return;
              }

              nextStep(action, payload);
            };

            return { currentStep, nextStep: customNextStep, ...rest };
          };

          renderWithContext(
            <HaapiStepperStepUI stepRenderInterceptor={stepRenderInterceptorWithBehaviorCustomization} />,
            {
              currentStep: step,
              nextStep: originalNextStepMock,
            }
          );

          const loginButton = screen.getByRole('button', { name: 'Login' });
          const cancelButton = screen.getByRole('button', { name: 'Cancel' });

          expect(loginButton).toBeInTheDocument();
          expect(cancelButton).toBeInTheDocument();
          expect(analyticsTracker).not.toHaveBeenCalled();
          expect(originalNextStepMock).not.toHaveBeenCalled();

          await user.click(loginButton);

          expect(analyticsTracker).toHaveBeenCalledTimes(1);
          expect(analyticsTracker).toHaveBeenCalledWith('step_action', {
            stepType: HAAPI_STEPS.AUTHENTICATION,
            actionKind: HAAPI_FORM_ACTION_KINDS.LOGIN,
          });
          expect(confirmSpy).not.toHaveBeenCalled();
          expect(originalNextStepMock).toHaveBeenCalledTimes(1);

          confirmSpy.mockReturnValueOnce(false);
          await user.click(cancelButton);

          expect(analyticsTracker).toHaveBeenCalledTimes(2);
          expect(analyticsTracker).toHaveBeenCalledWith('step_action', {
            stepType: HAAPI_STEPS.AUTHENTICATION,
            actionKind: HAAPI_FORM_ACTION_KINDS.CANCEL,
          });
          expect(confirmSpy).toHaveBeenCalledTimes(1);
          expect(confirmSpy).toHaveBeenCalledWith('Exit authentication?');
          expect(originalNextStepMock).toHaveBeenCalledTimes(1);

          confirmSpy.mockReturnValueOnce(true);
          await user.click(cancelButton);

          expect(analyticsTracker).toHaveBeenCalledTimes(3);
          expect(confirmSpy).toHaveBeenCalledTimes(2);
          expect(originalNextStepMock).toHaveBeenCalledTimes(2);

          confirmSpy.mockRestore();
        });
      });
    });
  });

  describe('ViewName built-in UIs Rendering', () => {
    describe('Default Rendering', () => {
      it('should render the generic step shell when enableViewNameBuiltInUIs is not provided', () => {
        const step = createBankIdPollingStep();

        renderWithContext(<HaapiStepperStepUI />, { currentStep: step });

        expect(screen.queryByTestId('bankid-spinner')).not.toBeInTheDocument();
        expect(screen.queryByTestId('messages')).toBeInTheDocument();
      });

      it('should render the generic step shell when enableViewNameBuiltInUIs is an empty array', () => {
        const step = createBankIdPollingStep();

        renderWithContext(<HaapiStepperStepUI enableViewNameBuiltInUIs={[]} />, { currentStep: step });

        expect(screen.queryByTestId('bankid-spinner')).not.toBeInTheDocument();
        expect(screen.queryByTestId('messages')).toBeInTheDocument();
      });
    });

    describe('Custom Rendering', () => {
      describe('Opt-in via boolean shorthand', () => {
        it('should apply the matching built-in when enableViewNameBuiltInUIs is true', () => {
          const step = createBankIdPollingStep();

          renderWithContext(<HaapiStepperStepUI enableViewNameBuiltInUIs={true} />, { currentStep: step });

          expect(screen.queryByTestId('bankid-spinner')).toBeInTheDocument();
        });

        it('should apply the matching built-in when the JSX boolean shorthand is used', () => {
          const step = createBankIdPollingStep();

          renderWithContext(<HaapiStepperStepUI enableViewNameBuiltInUIs />, { currentStep: step });

          expect(screen.queryByTestId('bankid-spinner')).toBeInTheDocument();
        });

        it('should render the generic step shell when the viewName has no registered built-in', () => {
          const step = createMockStep(HAAPI_STEPS.AUTHENTICATION);

          renderWithContext(<HaapiStepperStepUI enableViewNameBuiltInUIs />, { currentStep: step });

          expect(screen.queryByTestId('bankid-spinner')).not.toBeInTheDocument();
          expect(screen.queryByTestId('messages')).toBeInTheDocument();
          expect(screen.queryByTestId('form-action')).toBeInTheDocument();
        });
      });

      describe('Opt-in via subset array', () => {
        it('should apply the built-in when its viewName is in the array', () => {
          const step = createBankIdPollingStep();

          renderWithContext(<HaapiStepperStepUI enableViewNameBuiltInUIs={[HaapiStepperViewNameBuiltInUI.BANKID]} />, {
            currentStep: step,
          });

          expect(screen.queryByTestId('bankid-spinner')).toBeInTheDocument();
        });
      });

      describe('Composition with stepRenderInterceptor', () => {
        it('should apply the built-in when stepRenderInterceptor returns pass-through data', () => {
          const step = createBankIdPollingStep();
          const passThroughInterceptor: HaapiStepperStepUIStepRenderInterceptor = (
            haapiStepperAPI: HaapiStepperAPIWithRequiredCurrentStep
          ) => {
            return haapiStepperAPI;
          };

          renderWithContext(
            <HaapiStepperStepUI enableViewNameBuiltInUIs stepRenderInterceptor={passThroughInterceptor} />,
            { currentStep: step }
          );

          expect(screen.queryByTestId('bankid-spinner')).toBeInTheDocument();
        });

        it('should be skipped when stepRenderInterceptor returns a React element', () => {
          const step = createBankIdPollingStep();
          const elementInterceptor: HaapiStepperStepUIStepRenderInterceptor = () => {
            return <div data-testid="custom-step-element">Custom UI</div>;
          };

          renderWithContext(
            <HaapiStepperStepUI enableViewNameBuiltInUIs stepRenderInterceptor={elementInterceptor} />,
            {
              currentStep: step,
            }
          );

          expect(screen.queryByTestId('custom-step-element')).toBeInTheDocument();
          expect(screen.queryByTestId('bankid-spinner')).not.toBeInTheDocument();
        });

        it('should be skipped (and render nothing) when stepRenderInterceptor returns null', () => {
          const step = createBankIdPollingStep();
          const nullInterceptor: HaapiStepperStepUIStepRenderInterceptor = () => {
            return null;
          };

          renderWithContext(<HaapiStepperStepUI enableViewNameBuiltInUIs stepRenderInterceptor={nullInterceptor} />, {
            currentStep: step,
          });

          expect(screen.queryByTestId('bankid-spinner')).not.toBeInTheDocument();
          expect(screen.queryByTestId('messages')).not.toBeInTheDocument();
          expect(screen.queryByTestId('form-action')).not.toBeInTheDocument();
        });
      });

      describe('BankID viewName built-in UI', () => {
        it('should render the spinner while polling status is pending', () => {
          const step = createBankIdPollingStep({ status: HAAPI_POLLING_STATUS.PENDING });

          renderWithContext(<HaapiStepperStepUI enableViewNameBuiltInUIs />, { currentStep: step });

          expect(screen.queryByTestId('bankid-spinner')).toBeInTheDocument();
        });

        it('should not render the spinner when polling status is done', () => {
          const step = createBankIdPollingStep({ status: HAAPI_POLLING_STATUS.DONE });

          renderWithContext(<HaapiStepperStepUI enableViewNameBuiltInUIs />, { currentStep: step });

          expect(screen.queryByTestId('bankid-spinner')).not.toBeInTheDocument();
        });

        it('should not render the spinner when polling status is failed', () => {
          const step = createBankIdPollingStep({ status: HAAPI_POLLING_STATUS.FAILED });

          renderWithContext(<HaapiStepperStepUI enableViewNameBuiltInUIs />, { currentStep: step });

          expect(screen.queryByTestId('bankid-spinner')).not.toBeInTheDocument();
        });

        it('should render the QR link above the actions', () => {
          const qrLink = createMockQrLink();
          const otherLink = createMockLink({ rel: 'help', title: 'Help' });
          const step = createBankIdPollingStep({ links: [qrLink, otherLink] });

          renderWithContext(<HaapiStepperStepUI enableViewNameBuiltInUIs />, { currentStep: step });

          const renderedTestIds = screen.getAllByTestId(/^(qr-code-button|form-action)$/).map(element => {
            return element.getAttribute('data-testid');
          });

          expect(renderedTestIds).toEqual(['qr-code-button', 'form-action']);
        });

        it('should render gracefully when no QR link is present', () => {
          const otherLink = createMockLink({ rel: 'help', title: 'Help' });
          const step = createBankIdPollingStep({ links: [otherLink] });

          renderWithContext(<HaapiStepperStepUI enableViewNameBuiltInUIs />, { currentStep: step });

          expect(screen.queryByTestId('qr-code-button')).not.toBeInTheDocument();
          expect(screen.queryByTestId('bankid-spinner')).toBeInTheDocument();
          expect(screen.queryByTestId('messages')).toBeInTheDocument();
          expect(screen.queryByTestId('links')).toBeInTheDocument();
        });
      });
    });
  });
});

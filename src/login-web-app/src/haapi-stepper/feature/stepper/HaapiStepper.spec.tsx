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
import { render, screen, waitFor } from '@testing-library/react';
import { HaapiStepper } from './HaapiStepper';
import { HAAPI_STEPS, HAAPI_PROBLEM_STEPS, HAAPI_POLLING_STATUS } from '../../data-access/types/haapi-step.types';
import { HAAPI_ACTION_TYPES, HAAPI_FORM_ACTION_KINDS } from '../../data-access/types/haapi-action.types';
import { HTTP_METHODS } from '../../data-access/types/haapi-form.types';
import { MEDIA_TYPES } from '../../../shared/util/types/media.types';
import {
  authenticationStep,
  redirectionStep,
  pollingPendingStep,
  pollingBankIdStep,
  completedWithSuccessStep,
  createProblemStep,
  continueSameStep,
  createRegistrationStep,
} from '../../../shared/util/api-responses';
import { act } from 'react';
import { Mock } from 'vitest';
import { useHaapiStepper } from './HaapiStepperHook';
import type { HaapiStepperHistoryEntry, HaapiStepperNextStepAction } from './haapi-stepper.types';
import { HaapiStepperActionStep, HaapiStepperFormAction } from './haapi-stepper.types';

describe('HaapiStepper', () => {
  const initializationHref = 'https://example.com/auth';
  const initialStepType = HAAPI_STEPS.AUTHENTICATION;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('location', {
      href: initializationHref,
    });
    mockHaapiFetchStep(initialStepType);
  });

  afterEach(() => {
    vi.restoreAllMocks();
    mockHaapiFetch.mockReset();
  });

  describe('Steps', () => {
    it('should initialize the first step with the current location and render the children', async () => {
      render(
        <HaapiStepper>
          <TestComponent />
        </HaapiStepper>
      );

      expect(mockHaapiFetch).toHaveBeenCalledWith(initializationHref, { method: 'GET' });

      const stepRendered = await screen.findByTestId('step-type');

      expect(stepRendered).toHaveTextContent(initialStepType);
      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
      expect(screen.queryByTestId('error')).not.toBeInTheDocument();
    });

    it('should go to the next step and provide the updated current step', async () => {
      render(
        <HaapiStepper>
          <TestComponent />
        </HaapiStepper>
      );

      const stepRendered = await screen.findByTestId('step-type');

      expect(stepRendered).toHaveTextContent(initialStepType);

      await goToNextStep(HAAPI_STEPS.POLLING);

      await waitFor(() => {
        expect(stepRendered).toHaveTextContent(HAAPI_STEPS.POLLING);
      });

      await goToNextStep(HAAPI_STEPS.COMPLETED_WITH_SUCCESS);

      await waitFor(() => {
        expect(stepRendered).toHaveTextContent(HAAPI_STEPS.COMPLETED_WITH_SUCCESS);
      });
    });

    describe('Continue Same Step', () => {
      describe('With continueActions on the current step', () => {
        it('should display only Current Step continueActions and merge Current Step and Continue Same Step messages when there are continueActions', async () => {
          mockHaapiFetch.mockReset();
          mockHaapiFetchStep(HAAPI_STEPS.AUTHENTICATION, { withContinueActions: true });

          const initialStepMessage = 'Please enter your username to authenticate.';
          const continueSameStepMessage = 'Message from Continue Same Step with continueActions';

          render(
            <HaapiStepper>
              <TestComponent />
            </HaapiStepper>
          );

          expect(await screen.findByTestId('step-type')).toHaveTextContent(initialStepType);
          expect(screen.getByText(initialStepMessage)).toBeInTheDocument();

          const authStepActionButtons = screen.getAllByTestId('action-button');
          expect(authStepActionButtons).toHaveLength(1);
          expect(screen.getByTestId('action-button')).toHaveTextContent('Login');

          await goToNextStep(HAAPI_STEPS.CONTINUE_SAME, { withContinueActions: true });

          // Wait for CONTINUE_SAME processing to complete (indicated by the "Continue" button replacing "Login")
          await waitFor(() => {
            const continueSameActionButtons = screen.getAllByTestId('action-button');
            expect(continueSameActionButtons).toHaveLength(1);
            expect(continueSameActionButtons[0]).toHaveTextContent('Continue');
          });

          expect(screen.getByTestId('step-type')).toHaveTextContent(initialStepType);
          expect(screen.getByText(initialStepMessage)).toBeInTheDocument();
          expect(screen.getByText(continueSameStepMessage)).toBeInTheDocument();
        });
      });

      describe('Without continueActions', () => {
        it('should display no actions and continue same step messages when no continueActions are present', async () => {
          render(
            <HaapiStepper>
              <TestComponent />
            </HaapiStepper>
          );

          const initialStepMessage = 'Please enter your username to authenticate.';
          const continueSameStepMessage = 'Message from Continue Same Step without continueActions';

          expect(await screen.findByTestId('step-type')).toHaveTextContent(initialStepType);
          expect(screen.getByText(initialStepMessage)).toBeInTheDocument();

          await goToNextStep(HAAPI_STEPS.CONTINUE_SAME);

          expect(await screen.findByTestId('step-type')).toHaveTextContent(initialStepType);

          await waitFor(() => {
            expect(screen.queryByText(initialStepMessage)).not.toBeInTheDocument();
          });

          expect(screen.getByText(continueSameStepMessage)).toBeInTheDocument();

          const authStepActionButtons = screen.queryAllByTestId('action-button');
          expect(authStepActionButtons).toHaveLength(0);
        });
      });
    });

    describe('Redirection Step', () => {
      it('should handle redirection steps internally and go to the next non-redirection step', async () => {
        render(
          <HaapiStepper>
            <TestComponent />
          </HaapiStepper>
        );

        const stepRendered = await screen.findByTestId('step-type');

        expect(stepRendered).toHaveTextContent(initialStepType);

        // Redirection steps are handled internally, triggering automatically a request to
        // get the next step, which we mock to be the COMPLETED step in mockHaapiFetchStep
        await goToNextStep(HAAPI_STEPS.REDIRECTION);

        await waitFor(() => {
          expect(stepRendered).toHaveTextContent(HAAPI_STEPS.COMPLETED_WITH_SUCCESS);
        });
      });
    });
    describe('Polling Step', () => {
      beforeEach(() => {
        vi.useFakeTimers();
      });

      afterEach(() => {
        vi.useRealTimers();
      });

      it('should handle polling steps with PENDING status and automatically poll until DONE', async () => {
        const pollingInterval = 2000;

        render(
          <HaapiStepper config={{ pollingInterval }}>
            <TestComponent />
          </HaapiStepper>
        );

        // Initial advance to process initial fetch
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        vi.advanceTimersByTimeAsync(200);
        // Automatic request to get initial step
        expect(mockHaapiFetch).toHaveBeenCalledTimes(1);

        const stepRendered = await screen.findByTestId('step-type');

        expect(stepRendered).toHaveTextContent(initialStepType);

        // User click on next step (polling) and request the first polling step
        await goToNextStep(HAAPI_STEPS.POLLING);

        // Assert first polling step request and rendering
        expect(mockHaapiFetch).toHaveBeenCalledTimes(2);
        await waitFor(() => {
          expect(stepRendered).toHaveTextContent(HAAPI_STEPS.POLLING);
        });

        // Mock the next poll request to still return PENDING and advance timers
        // This is an automatic poll request (setTimeout, no user action)
        mockHaapiFetchStep(HAAPI_STEPS.POLLING);
        await vi.advanceTimersByTimeAsync(pollingInterval);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        vi.runAllTimersAsync();

        // Verify the automatic poll request
        expect(mockHaapiFetch).toHaveBeenCalledTimes(3);
        expect(mockHaapiFetch).toHaveBeenCalledWith('/poll', { method: 'GET' });
        await waitFor(() => {
          expect(stepRendered).toHaveTextContent(HAAPI_STEPS.POLLING);
        });

        // Mock the next poll request to return DONE and advance timers
        // This is an automatic poll request (setTimeout, no user action)
        mockHaapiFetchStep(HAAPI_STEPS.POLLING, { status: HAAPI_POLLING_STATUS.DONE });
        mockHaapiFetchStep(HAAPI_STEPS.COMPLETED_WITH_SUCCESS);
        await vi.advanceTimersByTimeAsync(pollingInterval);
        // eslint-disable-next-line @typescript-eslint/no-floating-promises
        vi.runAllTimersAsync();

        // Polling DONE status automatically triggers the next step request
        // this is why we expect two more calls: one for the automatic poll request and one
        // for the next step request
        expect(mockHaapiFetch).toHaveBeenCalledTimes(5);
        expect(mockHaapiFetch).toHaveBeenNthCalledWith(4, '/poll', { method: 'GET' });
        expect(mockHaapiFetch).toHaveBeenNthCalledWith(5, '/polldone', { method: 'GET' });

        await waitFor(() => {
          expect(stepRendered).toHaveTextContent(HAAPI_STEPS.COMPLETED_WITH_SUCCESS);
        });
      });

      describe('BankID Polling Step', () => {
        it('should display message, start bankid button, cancel button and QR code', async () => {
          const pollingInterval = 2000;

          render(
            <HaapiStepper config={{ pollingInterval, bankIdAutostart: false }}>
              <TestComponent />
            </HaapiStepper>
          );

          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          vi.advanceTimersByTimeAsync(200);

          const stepRendered = await screen.findByTestId('step-type');
          expect(stepRendered).toHaveTextContent(initialStepType);

          await goToNextStep(HAAPI_STEPS.POLLING, { bankId: true });

          await waitFor(() => {
            expect(stepRendered).toHaveTextContent(HAAPI_STEPS.POLLING);
          });

          const bankIdMessage = screen.getByText('Scan the QR code with your BankID app');
          expect(bankIdMessage).toBeInTheDocument();

          const actionButtons = screen.getAllByTestId('action-button');
          expect(actionButtons.some(btn => btn.textContent === 'Start BankID')).toBe(true);
          expect(actionButtons.some(btn => btn.textContent === 'Cancel')).toBe(true);

          expect(screen.getByTestId('link-image')).toBeInTheDocument();
        });

        describe('config.bankIdAutostart = true', () => {
          it('should call openBankIdApp automatically only once', async () => {
            render(
              <HaapiStepper config={{ pollingInterval: 2000, bankIdAutostart: true }}>
                <TestComponent />
              </HaapiStepper>
            );

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            vi.advanceTimersByTimeAsync(200);

            const stepRendered = await screen.findByTestId('step-type');
            expect(stepRendered).toHaveTextContent(initialStepType);

            await goToNextStep(HAAPI_STEPS.POLLING, { bankId: true });

            await waitFor(() => {
              expect(stepRendered).toHaveTextContent(HAAPI_STEPS.POLLING);
            });

            expect(mockOpenBankIdApp).toHaveBeenCalledTimes(1);

            await goToNextStep(HAAPI_STEPS.POLLING, { bankId: true });
            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            vi.runAllTimersAsync();

            await waitFor(() => {
              expect(stepRendered).toHaveTextContent(HAAPI_STEPS.POLLING);
            });

            expect(mockOpenBankIdApp).toHaveBeenCalledTimes(1);
          });
        });

        describe('config.bankIdAutostart = false', () => {
          it('should not call openBankIdApp automatically', async () => {
            const pollingInterval = 2000;

            render(
              <HaapiStepper config={{ pollingInterval, bankIdAutostart: false }}>
                <TestComponent />
              </HaapiStepper>
            );

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            vi.advanceTimersByTimeAsync(200);

            const stepRendered = await screen.findByTestId('step-type');
            expect(stepRendered).toHaveTextContent(initialStepType);

            await goToNextStep(HAAPI_STEPS.POLLING, { bankId: true });

            await waitFor(() => {
              expect(stepRendered).toHaveTextContent(HAAPI_STEPS.POLLING);
            });

            expect(mockOpenBankIdApp).not.toHaveBeenCalled();

            await goToNextStep(HAAPI_STEPS.POLLING, { bankId: true });

            await waitFor(() => {
              expect(stepRendered).toHaveTextContent(HAAPI_STEPS.POLLING);
            });

            expect(mockOpenBankIdApp).not.toHaveBeenCalled();
          });

          it('should call openBankIdApp when "Start BankID" button is clicked', async () => {
            const pollingInterval = 2000;

            render(
              <HaapiStepper config={{ pollingInterval, bankIdAutostart: false }}>
                <TestComponent />
              </HaapiStepper>
            );

            // eslint-disable-next-line @typescript-eslint/no-floating-promises
            vi.advanceTimersByTimeAsync(200);

            await screen.findByTestId('step-type');

            await goToNextStep(HAAPI_STEPS.POLLING, { bankId: true });

            const startButton = await screen.findByRole('button', { name: 'Start BankID' });
                        
            act(() => startButton.click());

            await waitFor(() => {
              expect(mockOpenBankIdApp).toHaveBeenCalledTimes(1);
            });
          });
        });
      });
    });
  });

  describe('Error handling', () => {
    it('should throw error when useHaapiStepper is used outside provider', () => {
      const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => ({}));

      expect(() => {
        render(<TestComponent />);
      }).toThrow('useHaapiStepper must be used inside HaapiStepper');

      consoleSpy.mockRestore();
    });

    describe('HAAPI errors', () => {
      it('should provide the error status for Problem steps', async () => {
        render(
          <HaapiStepper>
            <TestComponent />
          </HaapiStepper>
        );

        const step = await screen.findByTestId('step-type');

        expect(step).toHaveTextContent(initialStepType);

        await goToNextStep(HAAPI_PROBLEM_STEPS.INVALID_INPUT);

        await waitFor(() => {
          const loadingElementRef = screen.queryByTestId('loading');
          expect(loadingElementRef).not.toBeInTheDocument();
        });

        expect(screen.getByTestId('error')).toBeInTheDocument();
        expect(screen.getByTestId('error')).toHaveTextContent('Invalid Input');
      });
    });

    describe('Non-HAAPI errors', () => {
      it('should throw the error to the error boundary when it is not a Problem step', async () => {
        render(
          <HaapiStepper>
            <TestComponent />
          </HaapiStepper>
        );

        const testError = new Error('Network error');
        const step = await screen.findByTestId('step-type');

        expect(step).toHaveTextContent(initialStepType);

        mockHaapiFetch.mockRejectedValueOnce(testError);

        const nextStepButton = await screen.findByTestId('next-step-button');
        act(() => nextStepButton.click());

        await waitFor(() => {
          expect(mockThrowErrorToAppErrorBoundary).toHaveBeenCalledWith(testError.message);
        });
      });
    });
  });

  describe('Loading', () => {
    it('should provide the loading status', async () => {
      render(
        <HaapiStepper>
          <TestComponent />
        </HaapiStepper>
      );

      expect(screen.queryByTestId('loading')).toBeInTheDocument();

      expect(await screen.findByTestId('step-type')).toHaveTextContent(initialStepType);

      await goToNextStep(HAAPI_STEPS.COMPLETED_WITH_SUCCESS);

      await waitFor(() => expect(screen.getByTestId('loading')).toBeInTheDocument());

      expect(await screen.findByTestId('step-type')).toHaveTextContent(HAAPI_STEPS.COMPLETED_WITH_SUCCESS);

      expect(screen.queryByTestId('loading')).not.toBeInTheDocument();
    });
  });

  describe('History', () => {
    const bootstrapLinkAction = {
      id: 'b5a87494-17d4-48cc-8ce7-c4f75726cdac',
      href: 'https://example.com/auth',
      rel: 'self',
      type: 'link',
      subtype: 'initial-link',
    };
    it('should track history of steps with actions and timestamps', async () => {
      render(
        <HaapiStepper>
          <TestComponent />
        </HaapiStepper>
      );

      const initialStep = HAAPI_STEPS.AUTHENTICATION;
      const secondStep = HAAPI_STEPS.REGISTRATION;
      const thirdStep = HAAPI_STEPS.COMPLETED_WITH_SUCCESS;
      let history = await screen.findByTestId('history');
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      let historyData = JSON.parse(history.textContent!) as HaapiStepperHistoryEntry[];
      let previousStepTriggerActionKind = bootstrapLinkAction;

      expect(historyData).toHaveLength(1);
      expect(historyData[0].step.type).toBe(initialStep);
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
      expect(historyData[0].triggeredByAction).toEqual({ ...previousStepTriggerActionKind, id: expect.anything() });
      expect(historyData[0].triggeredByPayload).toBeUndefined();

      await goToNextStep(secondStep);

      await waitFor(() => expect(screen.getByTestId('step-type')).toHaveTextContent(secondStep));

      history = screen.getByTestId('history');
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      historyData = JSON.parse(history.textContent!) as HaapiStepperHistoryEntry[];
      // @ts-expect-error - accessing mock step actions for test validation - getStepMock returns mock data with actions array
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      previousStepTriggerActionKind = getStepMock(initialStep).actions[0].kind;

      expect(historyData).toHaveLength(2);
      expect(historyData[1].step.type).toBe(secondStep);
      expect(historyData[1].triggeredByAction).toBeDefined();
      // @ts-expect-error - skipping for testing purposes
      expect(historyData[1].triggeredByAction.kind).toBe(previousStepTriggerActionKind);

      await goToNextStep(thirdStep);

      await waitFor(() => expect(screen.getByTestId('step-type')).toHaveTextContent(thirdStep));

      history = screen.getByTestId('history');
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      historyData = JSON.parse(history.textContent!) as HaapiStepperHistoryEntry[];
      // @ts-expect-error - accessing mock step actions for test validation - getStepMock returns mock data with actions array
      // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment, @typescript-eslint/no-unsafe-member-access
      previousStepTriggerActionKind = getStepMock(secondStep).actions[0].kind;

      expect(historyData).toHaveLength(3);
      expect(historyData[2].step.type).toBe(thirdStep);
      expect(historyData[2].triggeredByAction).toBeDefined();
      // @ts-expect-error - skipping for testing purposes
      expect(historyData[2].triggeredByAction.kind).toBe(previousStepTriggerActionKind);

      const timestamp1 = new Date(historyData[0].timestamp);
      const timestamp2 = new Date(historyData[1].timestamp);
      const timestamp3 = new Date(historyData[2].timestamp);

      expect(timestamp1.getTime()).toBeLessThanOrEqual(timestamp2.getTime());
      expect(timestamp2.getTime()).toBeLessThanOrEqual(timestamp3.getTime());
    });

    it('should not include continue same step in history', async () => {
      render(
        <HaapiStepper>
          <TestComponent />
        </HaapiStepper>
      );

      await screen.findByTestId('step-type');

      await goToNextStep(HAAPI_STEPS.CONTINUE_SAME);

      await waitFor(() => {
        expect(screen.getByText('Message from Continue Same Step without continueActions')).toBeInTheDocument();
      });

      const history = screen.getByTestId('history');
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const historyData = JSON.parse(history.textContent!) as unknown as HaapiStepperHistoryEntry[];

      // Should have authentication twice - once initially, once after continue same
      // The continue same step itself is NOT in history, but the updated authentication step is
      expect(historyData).toHaveLength(2);
      expect(historyData[0].step.type).toBe(HAAPI_STEPS.AUTHENTICATION);
      expect(historyData[1].step.type).toBe(HAAPI_STEPS.AUTHENTICATION);
      // @ts-expect-error - skipping for testing purposes
      expect(historyData[1].triggeredByAction.kind).toBe(HAAPI_FORM_ACTION_KINDS.LOGIN);
    });

    it('should not include redirection steps in history', async () => {
      render(
        <HaapiStepper>
          <TestComponent />
        </HaapiStepper>
      );

      await goToNextStep(HAAPI_STEPS.REDIRECTION);

      // Redirection steps are mocked in test to return HAAPI_STEPS.COMPLETED_WITH_SUCCESS
      await waitFor(() =>
        expect(screen.getByTestId('step-type')).toHaveTextContent(HAAPI_STEPS.COMPLETED_WITH_SUCCESS)
      );

      const history = screen.getByTestId('history');
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const historyData = JSON.parse(history.textContent!) as unknown as HaapiStepperHistoryEntry[];

      expect(historyData).toHaveLength(2);
      expect(historyData[0].step.type).toBe(HAAPI_STEPS.AUTHENTICATION);
      expect(historyData[1].step.type).toBe(HAAPI_STEPS.COMPLETED_WITH_SUCCESS);
    });

    it('should not include input error problem steps in history', async () => {
      mockHaapiFetch.mockReset();
      mockHaapiFetchStep(HAAPI_STEPS.AUTHENTICATION);

      render(
        <HaapiStepper>
          <TestComponent />
        </HaapiStepper>
      );

      await screen.findByTestId('step-type');

      mockHaapiFetchStep(HAAPI_PROBLEM_STEPS.INVALID_INPUT);
      await clickNextStepButton();

      await waitFor(() => {
        expect(screen.getByTestId('error-input')).toBeInTheDocument();
      });

      const history = screen.getByTestId('history');
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const historyData = JSON.parse(history.textContent!) as unknown as HaapiStepperHistoryEntry[];

      expect(historyData).toHaveLength(1);
      expect(historyData[0].step.type).toBe(HAAPI_STEPS.AUTHENTICATION);
      expect(screen.getByTestId('step-type')).toHaveTextContent(HAAPI_STEPS.AUTHENTICATION);
    });

    it('should not include app error problem steps in history', async () => {
      mockHaapiFetch.mockReset();
      mockHaapiFetchStep(HAAPI_STEPS.AUTHENTICATION);

      render(
        <HaapiStepper>
          <TestComponent />
        </HaapiStepper>
      );

      await screen.findByTestId('step-type');

      mockHaapiFetchStep(HAAPI_PROBLEM_STEPS.UNEXPECTED);
      await clickNextStepButton();

      await waitFor(() => {
        expect(screen.getByTestId('error-app')).toBeInTheDocument();
      });

      const history = screen.getByTestId('history');
      // eslint-disable-next-line @typescript-eslint/no-unnecessary-type-assertion
      const historyData = JSON.parse(history.textContent!) as unknown as HaapiStepperHistoryEntry[];

      expect(historyData).toHaveLength(1);
      expect(historyData[0].step.type).toBe(HAAPI_STEPS.AUTHENTICATION);
      expect(screen.getByTestId('step-type')).toHaveTextContent(HAAPI_STEPS.AUTHENTICATION);
    });
  });
});

// eslint-disable-next-line no-var
var mockHaapiFetch: Mock;

vi.mock('../../data-access/haapi-fetch-initializer', () => {
  mockHaapiFetch = vi.fn();

  return {
    default: mockHaapiFetch,
  };
});

const mockThrowErrorToAppErrorBoundary = vi.fn();

vi.mock('../../util/useThrowErrorToAppErrorBoundary', () => ({
  // eslint-disable-next-line @eslint-react/hooks-extra/no-unnecessary-use-prefix
  useThrowErrorToAppErrorBoundary: () => mockThrowErrorToAppErrorBoundary,
}));

// eslint-disable-next-line no-var
var mockOpenBankIdApp: Mock;

vi.mock('../actions/client-operation/openBankIdApp', () => {
  mockOpenBankIdApp = vi.fn();
  return {
    openBankIdApp: mockOpenBankIdApp,
  };
});

const mockHaapiFetchStep = (step: HAAPI_STEPS | HAAPI_PROBLEM_STEPS, config: Record<string, unknown> = {}) => {
  const stepMock = getStepMock(step, config);

  const isProblemStep = (Object.values(HAAPI_PROBLEM_STEPS) as string[]).includes(step);
  const contentType = isProblemStep ? MEDIA_TYPES.PROBLEM : MEDIA_TYPES.AUTH;

  mockHaapiFetch.mockImplementationOnce(
    () =>
      new Promise(resolve =>
        setTimeout(
          () =>
            resolve({
              headers: {
                get: (name: string) => (name === 'Content-Type' ? contentType : null),
              },
              json: () => Promise.resolve(stepMock),
            }),
          0
        )
      )
  );

  if (step === HAAPI_STEPS.REDIRECTION) {
    // For redirection steps, we need to mock the next step fetch as well to avoid loops
    mockHaapiFetchStep(HAAPI_STEPS.COMPLETED_WITH_SUCCESS);
  }
};

function getStepMock(stepType: HAAPI_STEPS | HAAPI_PROBLEM_STEPS, config?: Record<string, unknown>) {
  let stepMock;

  switch (stepType) {
    case HAAPI_STEPS.AUTHENTICATION:
      stepMock = authenticationStep('/auth/login');
      // Add continueActions to the action if requested for testing CONTINUE_SAME scenario
      if (config?.withContinueActions) {
        // @ts-expect-error skipping for testing purposes
        stepMock.actions[0].model.continueActions = [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.CONTINUE,
            title: 'Continue',
            model: {
              href: '/auth/continue',
              method: HTTP_METHODS.POST,
            },
          },
        ];
      }
      break;
    case HAAPI_STEPS.CONTINUE_SAME:
      stepMock = continueSameStep(config?.withContinueActions as boolean);
      break;
    case HAAPI_STEPS.REDIRECTION:
      stepMock = redirectionStep('/auth/user');
      break;
    case HAAPI_STEPS.POLLING:
      if (config?.bankId) {
        stepMock =
          config.status === HAAPI_POLLING_STATUS.DONE
            ? pollingBankIdStep('/polldone', HAAPI_POLLING_STATUS.DONE)
            : pollingBankIdStep('/poll');
      } else {
        stepMock =
          config?.status === HAAPI_POLLING_STATUS.DONE
            ? pollingPendingStep('/polldone', HAAPI_POLLING_STATUS.DONE)
            : pollingPendingStep('/poll');
      }
      break;
    case HAAPI_STEPS.COMPLETED_WITH_SUCCESS:
      stepMock = completedWithSuccessStep;
      break;
    case HAAPI_STEPS.REGISTRATION:
      stepMock = createRegistrationStep();
      break;
    case HAAPI_PROBLEM_STEPS.INVALID_INPUT:
      stepMock = createProblemStep(HAAPI_PROBLEM_STEPS.INVALID_INPUT);
      break;
    case HAAPI_PROBLEM_STEPS.AUTHENTICATION_FAILED:
      stepMock = createProblemStep(HAAPI_PROBLEM_STEPS.AUTHENTICATION_FAILED);
      break;
    case HAAPI_PROBLEM_STEPS.INCORRECT_CREDENTIALS:
      stepMock = createProblemStep(HAAPI_PROBLEM_STEPS.INCORRECT_CREDENTIALS);
      break;
    case HAAPI_PROBLEM_STEPS.SESSION_TOKEN_MISMATCH:
      stepMock = createProblemStep(HAAPI_PROBLEM_STEPS.SESSION_TOKEN_MISMATCH);
      break;
    case HAAPI_PROBLEM_STEPS.UNEXPECTED:
      stepMock = createProblemStep(HAAPI_PROBLEM_STEPS.UNEXPECTED);
      break;
    case HAAPI_PROBLEM_STEPS.TOO_MANY_ATTEMPTS:
      stepMock = createProblemStep(HAAPI_PROBLEM_STEPS.TOO_MANY_ATTEMPTS);
      break;
    case HAAPI_PROBLEM_STEPS.GENERIC_USER_ERROR:
      stepMock = createProblemStep(HAAPI_PROBLEM_STEPS.GENERIC_USER_ERROR);
      break;
    default:
      throw new Error(`Unsupported step type in test mock: ${stepType}`);
  }

  return stepMock;
}

function TestComponent() {
  const { currentStep, loading, error, history, nextStep } = useHaapiStepper();

  return (
    <div>
      {loading && <div data-testid="loading">loading</div>}
      {error && <div data-testid="error">{error.app?.title ?? error.input?.title}</div>}
      {error?.app && <div data-testid="error-app">{error.app.title}</div>}
      {error?.input && <div data-testid="error-input">{error.input.title}</div>}
      {currentStep && (
        <div data-testid="step-container">
          <div data-testid="step-type">{currentStep.type}</div>
          {currentStep.dataHelpers.messages.map(message => (
            <div key={message.id} data-testid="message">
              {message.text}
            </div>
          ))}
          {currentStep.dataHelpers.actions?.all.map(action => (
            <button
              key={action.id}
              type="button"
              data-testid="action-button"
              onClick={() => nextStep(action as HaapiStepperNextStepAction)}
            >
              {action.title}
            </button>
          ))}
          {currentStep.dataHelpers.links.map(link =>
            link.subtype?.startsWith('image/') ? (
              <img key={link.id} src={link.href} alt={link.title ?? link.rel} data-testid="link-image" />
            ) : (
              <button key={link.id} type="button" data-testid="link-button" onClick={() => nextStep(link)}>
                {link.title ?? link.rel}
              </button>
            )
          )}
          <button
            data-testid="next-step-button"
            onClick={() => {
              const mockAction = (currentStep as HaapiStepperActionStep).dataHelpers.actions
                ?.all[0] as HaapiStepperFormAction;
              nextStep(mockAction);
            }}
            type="button"
          >
            Next Step
          </button>
        </div>
      )}
      {history.length && <div data-testid="history">{JSON.stringify(history)}</div>}
    </div>
  );
}

const goToNextStep = async (nextStep: HAAPI_STEPS | HAAPI_PROBLEM_STEPS, config: Record<string, unknown> = {}) => {
  mockHaapiFetchStep(nextStep, config);

  await clickNextStepButton();
};

const clickNextStepButton = async () => {
  const nextStepButton = await screen.findByTestId('next-step-button');

  act(() => nextStepButton.click());
};

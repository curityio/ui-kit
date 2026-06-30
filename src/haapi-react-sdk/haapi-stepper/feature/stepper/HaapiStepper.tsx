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

import { ReactNode, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HaapiClientOperationAction, HaapiFormAction } from '../../data-access/types/haapi-action.types';
import type { HaapiFetchAction } from '../../data-access/types/haapi-fetch.types';
import { useHaapiFetch } from '../../data-access/useHaapiFetch';
import {
  HAAPI_PROBLEM_STEPS,
  HAAPI_STEPPER_ELEMENT_TYPES,
  HAAPI_STEPS,
  HaapiLink,
  HaapiStep,
} from '../../data-access/types/haapi-step.types';

import { HaapiStepperContext } from './HaapiStepperContext';
import { isClientOperation, performClientOperation } from '../actions/client-operation/operations/client-operations';
import { formatContinueSameStepData } from './data-formatters/continue-same-step';
import { handlePollingStep } from './step-handlers/polling-step';
import { formatErrorStepData } from './data-formatters/problem-step';
import { formatNextStepData } from './data-formatters/format-next-step-data';
import { handleCompletedStep } from './step-handlers/completed-step';
import type {
  HaapiStepperClientOperationAction,
  HaapiStepperConfig,
  HaapiStepperError,
  HaapiStepperFormAction,
  HaapiStepperHistoryEntry,
  HaapiStepperLink,
  HaapiStepperNextStep,
  HaapiStepperNextStepAction,
  HaapiStepperNextStepAsync,
  HaapiStepperNextStepPayload,
  HaapiStepperStep,
} from './haapi-stepper.types';
import { useThrowErrorToAppErrorBoundary } from '../../util/useThrowErrorToAppErrorBoundary';
import { useRefCallback } from '../../util/useRefCallBack';
import { handleAuthenticationOrRegistrationStep } from './step-handlers/authentication-or-registration-step';

interface HaapiStepperProps {
  children: ReactNode;
  config?: Partial<HaapiStepperConfig>;
}

type SetCurrentStepAndUpdateHistoryFn = (
  newStep: HaapiStepperStep,
  triggeredByAction: HaapiStepperNextStepAction,
  triggeredByPayload?: HaapiStepperNextStepPayload
) => void;

/**
 * @description
 *
 * `HaapiStepper` is a React UI-less component designed to handle complex, multi-step authentication HAAPI workflows. It provides a declarative way to manage HAAPI (HTTP Authentication API) flows, abstracting away the complexity of step-by-step user interactions, HTTP requests, and state transitions.
 *
 * ## Key features
 *
 * - **Step Management**: Automatically handles navigation between authentication steps
 *   - **Automatic Redirections**: Seamlessly handles server-driven redirections without exposing them to consumers
 *   - **Automatic Polling**: Polling steps are exposed to allow custom UI, but polling requests are handled automatically based on the configured interval
 *   - **Automatic Continue Same**: Continue Same responses are automatically merged with the current step without exposing them to consumers
 * - **State Management**: Centralizes loading, error, and current step state.
 * - **Action Processing**: Supports multiple action types (forms, links, client operations).
 * - **Error Handling**: Provides comprehensive error state management with user feedback.
 * - **Type Safety**: Offers full TypeScript support with strict typing.
 *
 * ## Configuration modes
 *
 * The HaapiStepper needs a bootstrap configuration — at minimum an `initialUrl`
 * (where the flow starts) and a `haapi` driver config — supplied in one of two ways:
 *
 * 1. **Served mode (default)** — the stepper runs inside a server-rendered shell
 *    (e.g. the Curity HAAPI React App) that injects the config onto
 *    `window.__CONFIG__` before the SPA boots. No prop is required:
 *
 *    ```tsx
 *    <HaapiStepper>...</HaapiStepper>
 *    ```
 *
 * 2. **Standalone (library) mode** — when consumed as a library, or in any
 *    context without `window.__CONFIG__`, the consumer supplies the bootstrap
 *    explicitly via `config.bootstrap`:
 *
 *    ```tsx
 *    import type { HaapiStepperBootstrapConfig } from './haapi-stepper.types';
 *
 *    const bootstrap: HaapiStepperBootstrapConfig = {
 *      initialUrl: 'https://idsvr.example.com/oauth/v2/oauth-authorize/...',
 *      haapi: { ... }, // HAAPI web-driver config
 *    };
 *
 *    <HaapiStepper config={{ bootstrap }}>...</HaapiStepper>
 *    ```
 *
 * > Only one HAAPI configuration is supported per page load — the underlying
 * > driver is a process-global singleton; switching `bootstrap.haapi` mid-page
 * > throws (see {@link useHaapiFetch}).
 *
 * Both modes can be combined with `config` overrides for other tunables
 * (e.g. `pollingInterval`, `bankIdAutostart`); see {@link HaapiStepperConfig}
 * for the full set.
 *
 * ## HAAPI stepper API
 *
 * Child components can access the following API via the `useHaapiStepper()` hook:
 *
 * - `currentStep: HaapiStepperStep | null` - The current authentication step (null during initial load)
 * - `history: HaapiStepperHistoryEntry[]` - Complete history of all steps and actions taken, accessible via `history[index]`
 * - `loading: boolean` - Whether the stepper is currently loading (initial load or transitioning between steps)
 * - `error: HaapiStepperError | null` - Current error state (app errors or input validation errors)
 * - `nextStep: HaapiStepperAPINextStep` - Function to navigate to the next step by submitting an action or link
 *
 * ## Usage
 *
 * Wrap your application or authentication flow with this provider to enable HAAPI authentication:
 *
 * Built-in HAAPI flow example using HaapiStepperStepUI:
 *
 * ```tsx
 * import { HaapiStepper } from './HaapiStepper';
 * import { HaapiStepperStepUI } from '../steps/HaapiStepperStepUI';
 *
 * <HaapiStepper>
 *   <HaapiStepperStepUI />
 * </HaapiStepper>
 * ```
 * {@see_example docs/examples/DefaultRendering.tsx Default UI (HaapiStepperStepUI)}
 *
 * Partial customization example with custom links and default [HAAPI UI components](../../README.MD#haapi-ui-components) for the rest:
 *
 * ```tsx
 * import { HaapiStepper } from './HaapiStepper';
 * import { useHaapiStepper } from './useHaapiStepper';
 * import { HaapiStepperFormUI } from '../actions/form/HaapiStepperFormUI';
 * import { HaapiStepperClientOperationUI } from '../actions/client-operation/HaapiStepperClientOperationUI';
 * import { HaapiStepperSelectorUI } from '../actions/selector/HaapiStepperSelectorUI';
 *
 * function HaapiComponentExample() {
 *   const { currentStep, history, loading, error, nextStep } = useHaapiStepper();
 *
 *   if (loading || !currentStep) {
 *     return <div>Loading authentication...</div>;
 *   }
 *
 *   if (error?.app) {
 *     return <div>Error: {error.app.title}</div>;
 *   }
 *
 *   const { actions, links } = currentStep.dataHelpers;
 *
 *   return (
 *     <>
 *       {actions?.form.map(action => <HaapiStepperFormUI key={action.id} action={action} onSubmit={nextStep} />)}
 *       {actions?.selector.map(action => <HaapiStepperSelectorUI key={action.id} action={action} onSubmit={nextStep} />)}
 *       {actions?.clientOperation.map(action => <HaapiStepperClientOperationUI key={action.id} action={action} onAction={nextStep} />)}
 *       {links.map(link => (
 *         <button key={link.id} onClick={() => nextStep(link)}>
 *           {link.title}
 *         </button>
 *       ))}
 *     </>
 *   );
 * }
 *
 * <HaapiStepper>
 *   <HaapiComponentExample />
 * </HaapiStepper>
 * ```
 * {@see_example docs/examples/BuildingBlocksUICompositionExample.tsx UI composition (building blocks)}
 *
 * Full customization example:
 *
 * ```tsx
 * import { HaapiStepper } from './HaapiStepper';
 * import { useHaapiStepper } from './useHaapiStepper';
 *
 * function HaapiComponentExample() {
 *   const { currentStep, history, loading, error, nextStep } = useHaapiStepper();
 *
 *   if (loading || !currentStep) {
 *     return <div>Loading authentication...</div>;
 *   }
 *
 *   if (error?.app) {
 *     return <div>Error: {error.app.title}</div>;
 *   }
 *
 *   const { actions, links } = currentStep.dataHelpers;
 *
 *   return (
 *     <>
 *       <div>
 *         <h2>Step: {currentStep.type}</h2>
 *         {actions?.form.map(action => (
 *           <div className="mb2" key={action.id}>
 *             <h5>{action.title}</h5>
 *             <button onClick={() => nextStep(action)}>
 *               Select
 *             </button>
 *           </div>
 *         ))}
 *         {actions?.clientOperation.map(action => (
 *           <button key={action.id} onClick={() => nextStep(action)}>
 *             {action.title}
 *           </button>
 *         ))}
 *         {links.map(link => (
 *           <button key={link.id} onClick={() => nextStep(link)}>
 *             {link.title}
 *           </button>
 *         ))}
 *       </div>
 *       <div>
 *         <h3>Authentication Journey</h3>
 *         <p>Steps taken: {history.length}</p>
 *         <ul>
 *           {history.map((historyEntry, index) => (
 *             <li key={index}>
 *               {historyEntry.step.type} - {historyEntry.timestamp.toLocaleTimeString()}
 *               {historyEntry.triggeredByAction && ` (via ${historyEntry.triggeredByAction.title})`}
 *             </li>
 *           ))}
 *         </ul>
 *       </div>
 *     </>
 *   );
 * }
 *
 * <HaapiStepper>
 *   <HaapiComponentExample />
 * </HaapiStepper>
 * ```
 * {@see_example docs/examples/FullCustomizationUICompositionExample.tsx Full customization (with history)}
 *
 * Conditional customization example:
 *
 * ```tsx
 * import { HaapiStepper } from './HaapiStepper';
 * import { useHaapiStepper } from './useHaapiStepper';
 * import { HaapiStepperStepUI } from '../steps/HaapiStepperStepUI';
 *
 * function ConditionalCustomizationExample() {
 *   const { currentStep, loading, error } = useHaapiStepper();
 *
 *   if (loading || !currentStep) {
 *     return <div>Loading authentication...</div>;
 *   }
 *
 *   if (error?.app) {
 *     return <div>Error: {error.app.title}</div>;
 *   }
 *
 *   if (
 *     currentStep.metadata?.templateArea === 'lwa-dev' &&
 *     currentStep.metadata?.viewName === 'views/select-authenticator/index'
 *   ) {
 *     return (
 *       <div>
 *         <h1>Custom Select Authenticator</h1>
 *         <p>This is a custom UI for the select authenticator step.</p>
 *         {
 *           // Render actions or other UI elements as needed for this custom step
 *         }
 *       </div>
 *     );
 *   }
 *
 *   // Fallback to the default UI for all other steps
 *   return <HaapiStepperStepUI />;
 * }
 *
 * <HaapiStepper>
 *   <ConditionalCustomizationExample />
 * </HaapiStepper>
 * ```
 * {@see_example docs/examples/ConditionalCustomization.tsx Conditional customization}
 *
 * ## Error handling
 *
 * The `HaapiStepper` implements a comprehensive error-handling strategy with multiple layers to ensure
 * robust error management and an optimal user experience.
 *
 * ### Error state management
 *
 * The HAAPI stepper manages errors according to two categories: HAAPI errors and non-HAAPI errors.
 *
 * #### HAAPI errors
 *
 * HAAPI errors are HAAPI `ProblemStep`s (HAAPI flow steps of type `HAAPI_PROBLEM_STEPS`).
 *
 * HAAPI errors are classified into two groups:
 *
 * ```text
 * HaapiStepperError
 * ├── app    (Unrecoverable)
 * │   ├── UnrecoverableProblemStep
 * │   ├── UnexpectedProblemStep
 * │   └── CompletedWithErrorStep
 * └── input  (Recoverable)
 *     ├── ValidationProblemStep
 *     └── IncorrectCredentialsProblemStep
 * ```
 *
 * **`AppError` (Unrecoverable)**
 *   - **Description**: Errors that cannot be resolved in the step (action form) where they originated,
 *     so they need to be handled at the application level (e.g., show a dedicated error page) and/or
 *     require restarting the stepper flow.
 *     - Like any other problem, they might include `UserMessages` and `Links` that need to be displayed
 *       to the user.
 *   - **Types**: `UnrecoverableProblemStep`, `UnexpectedProblemStep`, `CompletedWithErrorStep`.
 *   - **Examples**: Authentication failed, too many attempts, session mismatches.
 *   - **Handling**: Displayed as toast notifications and/or a problem step UI.
 *
 * **`InputError` (Recoverable)**
 *   - **Description**: Errors that can be resolved in the step (form) where they originated.
 *     - They should be handled while keeping the step's UI, providing the problem's `UserMessages` and
 *       `Links`, and allowing the user to correct the input and resubmit.
 *   - **Types**: `ValidationProblemStep`, `IncorrectCredentialsProblemStep`.
 *   - **Examples**: Invalid form fields, incorrect credentials.
 *   - **Handling**: Displayed below relevant input fields for immediate correction.
 *
 * **`HaapiStepperError` interface**:
 *
 * ```tsx
 * interface HaapiStepperError {
 *   app?: AppError | null;
 *   input?: InputError | null;
 * }
 * ```
 *
 * HAAPI errors are provided by the `useHaapiStepper` hook:
 *
 * ```tsx
 * const { error } = useHaapiStepper();
 * const { app, input } = error || {};
 * ```
 *
 * ##### HAAPI error utils
 *
 * Two UI components render these errors — documented under **API Reference → UI Components**:
 * `HaapiStepperErrorNotifier` (toast notifications for `AppError`s, and optionally `InputError`s) and
 * `HaapiStepperFormValidationErrorInputWrapper` (field-level display of validation `InputError`s).
 *
 * #### Non-HAAPI errors
 *
 * Non-HAAPI errors are network, backend, and frontend errors that are not handled at lower levels.
 *
 * The `HaapiStepper` throws them as JavaScript errors so they can be caught by the nearest React error
 * boundary.
 *
 */
export function HaapiStepper({ children, config }: HaapiStepperProps) {
  const [currentStep, setCurrentStep] = useState<HaapiStepperStep | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<HaapiStepperError | null>(null);
  const [history, setHistory] = useState<HaapiStepperHistoryEntry[]>([]);
  const throwErrorToAppErrorBoundary = useThrowErrorToAppErrorBoundary();
  const pendingOperation = useRef<AbortController | NodeJS.Timeout | null>(null);
  const configResult = useMemo(() => resolveStepperConfig(config), [config]);
  const { sendHaapiFetchRequest } = useHaapiFetch(configResult.bootstrap.haapi);

  const setCurrentStepAndUpdateHistory = useCallback<SetCurrentStepAndUpdateHistoryFn>(
    (newStep, triggeredByAction, triggeredByPayload) => {
      setHistory(prev => [
        ...prev,
        {
          step: newStep,
          triggeredByAction,
          triggeredByPayload,
          timestamp: new Date(),
        },
      ]);
      setCurrentStep(newStep);
    },
    []
  );

  const nextStepAsync = useCallback<HaapiStepperNextStepAsync>(
    async (action, payload) => {
      setLoading(true);
      setError(null);
      cancelPendingOperation(pendingOperation);

      const { nextStepData, nextStepError } = await processHaapiNextStep({
        currentStep,
        nextStep,
        history,
        action,
        payload,
        pendingOperation,
        config: configResult,
        sendHaapiFetchRequest,
      });

      if (nextStepError) {
        setError(nextStepError);
        return;
      }

      if (!nextStepData) {
        return;
      }

      setCurrentStepAndUpdateHistory(nextStepData, action, payload);
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps -- nextStep is a stable ref via useRefCallback, defined below
    [configResult, sendHaapiFetchRequest, currentStep, history, setCurrentStepAndUpdateHistory]
  );

  const nextStepImplementation: HaapiStepperNextStep = useCallback<HaapiStepperNextStep>(
    (action, payload) => {
      nextStepAsync(action, payload)
        .catch((error: unknown) => {
          const errorMessage = error instanceof Error ? error.message : 'An unexpected error occurred';
          throwErrorToAppErrorBoundary(errorMessage);
        })
        .finally(() => setLoading(false));
    },
    [nextStepAsync, throwErrorToAppErrorBoundary]
  );

  const nextStep = useRefCallback(nextStepImplementation);

  useEffect(() => {
    nextStep(getInitialStepLink(configResult.bootstrap.initialUrl));
    return () => cancelPendingOperation(pendingOperation);
  }, [nextStep, configResult.bootstrap.initialUrl]);

  const contextValue = useMemo(
    () => ({ currentStep, loading, error, nextStep, history }),
    [currentStep, loading, error, nextStep, history]
  );

  return <HaapiStepperContext value={contextValue}>{children}</HaapiStepperContext>;
}

interface ProcessHaapiNextStepParams {
  currentStep: HaapiStep | null;
  nextStep: HaapiStepperNextStep;
  history: HaapiStepperHistoryEntry[];
  action:
    | HaapiFormAction
    | HaapiClientOperationAction
    | HaapiLink
    | HaapiStepperFormAction
    | HaapiStepperClientOperationAction
    | HaapiStepperLink;
  payload: HaapiStepperNextStepPayload | undefined;
  pendingOperation: RefObject<AbortController | NodeJS.Timeout | null>;
  config: HaapiStepperConfig;
  sendHaapiFetchRequest: (action: HaapiFetchAction) => Promise<HaapiStep>;
}

async function processHaapiNextStep(params: ProcessHaapiNextStepParams): Promise<{
  nextStepData?: HaapiStepperStep;
  nextStepError?: HaapiStepperError;
}> {
  const { currentStep, nextStep, history, action, payload, pendingOperation, config, sendHaapiFetchRequest } = params;

  if (isClientOperation(action)) {
    const { clientOperationData, clientOperationError } = await performClientOperation(
      action,
      pendingOperation,
      currentStep
    );

    if (clientOperationError) {
      return { nextStepError: clientOperationError };
    }

    return processHaapiNextStep({
      ...params,
      action: clientOperationData.action,
      payload: clientOperationData.payload,
    });
  }

  const isLinkAction = 'href' in action;
  const nextStepRequestAction = isLinkAction ? action : { action, payload };
  const nextStepResponse = await sendHaapiFetchRequest(nextStepRequestAction);

  switch (nextStepResponse.type) {
    case HAAPI_STEPS.REDIRECTION:
      return processHaapiNextStep({
        ...params,
        currentStep: nextStepResponse,
        action: nextStepResponse.actions[0],
        payload: undefined,
      });

    case HAAPI_STEPS.POLLING:
      return handlePollingStep(nextStepResponse, pendingOperation, nextStep, config, history);

    case HAAPI_STEPS.AUTHENTICATION:
    case HAAPI_STEPS.REGISTRATION:
      return handleAuthenticationOrRegistrationStep(nextStepResponse, nextStep, config);

    case HAAPI_STEPS.USER_CONSENT:
    case HAAPI_STEPS.CONSENTOR:
      return { nextStepData: formatNextStepData(nextStepResponse) };

    case HAAPI_STEPS.CONTINUE_SAME:
      if ('href' in action) {
        throw new Error('Continue Same Step received after link navigation, but links cannot have continueActions');
      }
      return { nextStepData: formatContinueSameStepData(action, nextStepResponse, currentStep as HaapiStepperStep) };

    case HAAPI_STEPS.COMPLETED_WITH_SUCCESS:
    case HAAPI_PROBLEM_STEPS.COMPLETED_WITH_ERROR:
      return handleCompletedStep(nextStepResponse, config);

    case HAAPI_PROBLEM_STEPS.INVALID_INPUT:
    case HAAPI_PROBLEM_STEPS.INCORRECT_CREDENTIALS:
    case HAAPI_PROBLEM_STEPS.AUTHENTICATION_FAILED:
    case HAAPI_PROBLEM_STEPS.TOO_MANY_ATTEMPTS:
    case HAAPI_PROBLEM_STEPS.GENERIC_USER_ERROR:
    case HAAPI_PROBLEM_STEPS.UNEXPECTED:
    case HAAPI_PROBLEM_STEPS.SESSION_TOKEN_MISMATCH:
      return { nextStepError: formatErrorStepData(nextStepResponse) };
  }
}

function cancelPendingOperation(pendingOperation: RefObject<AbortController | NodeJS.Timeout | null>) {
  if (pendingOperation.current) {
    if (pendingOperation.current instanceof AbortController) {
      pendingOperation.current.abort();
    } else {
      clearTimeout(pendingOperation.current);
    }
    pendingOperation.current = null;
  }
}

function getInitialStepLink(initialUrl: string) {
  const initialStepLink: HaapiStepperLink = {
    href: initialUrl,
    rel: 'self',
    type: HAAPI_STEPPER_ELEMENT_TYPES.LINK,
    subtype: 'initial-link',
    id: crypto.randomUUID(),
  };

  return initialStepLink;
}

function resolveStepperConfig(config: Partial<HaapiStepperConfig> | undefined): Required<HaapiStepperConfig> {
  const { bootstrap, ...configResult } = {
    pollingInterval: 3000,
    bankIdAutostart: true,
    webAuthnAutostart: true,
    autoRedirectOnAuthenticationComplete: true,
    bootstrap: window.__CONFIG__,
    ...config,
  };
  if (!bootstrap) {
    throw new Error(
      'HaapiStepper: no bootstrap configuration available. Pass it via the `config.bootstrap` prop or ensure `window.__CONFIG__` is set.'
    );
  }
  return { ...configResult, bootstrap };
}

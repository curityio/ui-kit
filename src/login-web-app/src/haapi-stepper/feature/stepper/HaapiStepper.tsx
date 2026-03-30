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

import { ReactNode, RefObject, useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { HaapiClientOperationAction, HaapiFormAction } from '../../data-access/types/haapi-action.types';
import {
  HAAPI_PROBLEM_STEPS,
  HAAPI_STEPPER_ELEMENT_TYPES,
  HAAPI_STEPS,
  HaapiLink,
  HaapiStep,
} from '../../data-access/types/haapi-step.types';

import { HaapiStepperContext } from './HaapiStepperContext';
import { isClientOperation, performClientOperation } from '../actions/client-operation/client-operations';
import { formatContinueSameStepData } from './data-formatters/continue-same-step';
import { handlePollingStep } from './data-formatters/polling-step';
import { formatErrorStepData } from './data-formatters/problem-step';
import { formatNextStepData } from './data-formatters/format-next-step-data';
import { sendHaapiFetchRequest } from '../../data-access/happi-fetch-request';
import { configuration } from '../../data-access/bootstrap-configuration';
import type {
  HaapiStepperClientOperationAction,
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

const DEFAULT_CONFIG: Required<HaapiStepperConfig> = {
  pollingInterval: 3000,
  bankIdAutostart: true,
};

export interface HaapiStepperConfig {
  pollingInterval: number;
  bankIdAutostart: boolean;
}

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
 * # HAAPI STEPPER FEATURES
 *
 * The HAAPI Stepper is a React UI-less component designed to handle complex, multi-step authentication HAAPI workflows. It provides a declarative way to manage HAAPI (HTTP Authentication API) flows, abstracting away the complexity of step-by-step user interactions, HTTP requests, and state transitions.
 *
 * ## Key Features
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
 * ## HAAPI Stepper API
 *
 * Child components can access the following API via the `useHaapiStepper()` hook:
 *
 * - `currentStep: HaapiProviderStep | null` - The current authentication step (null during initial load)
 * - `history: HaapiStepperHistoryEntry[]` - Complete history of all steps and actions taken, accessible via `history[index]`
 * - `loading: boolean` - Whether the stepper is currently loading (initial load or transitioning between steps)
 * - `error: HaapiStepperError | null` - Current error state (app errors or input validation errors)
 * - `nextStep: HaapiStepperAPINextStep` - Function to navigate to the next step by submitting an action or link
 *
 * ## Usage
 *
 * Wrap your application or authentication flow with this provider to enable HAAPI authentication:
 *
 * Built-in HAAPI flow example using HaapiUIStep:
 *
 * @example
 * ```tsx
 * import { HaapiStepper } from './HaapiStepper';
 * import { HaapiUIStep } from './HaapiUIStep';
 *
 * <HaapiStepper>
 *   <HaapiUIStep />
 * </HaapiStepper>
 * ```
 *
 * Partial customization example with custom links and default [HAAPI UI components](../../README.MD#haapi-ui-components) for the rest:
 *
 * @example
 * ```tsx
 * import { HaapiStepper } from './HaapiStepper';
 * import { useHaapiStepper } from './useHaapiStepper';
 * import { Form } from '../actions/form/Form';
 * import { ClientOperation } from '../actions/client-operation/ClientOperation';
 * import { HaapiSelector } from '../actions/selector/HaapiSelector';
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
 *   const { formActions, clientOperationActions, links } = currentStep.dataHelpers || {};
 *
 *   return (
 *     <>
 *       {formActions?.map((action) => (<Form key={action.kind} action={action} onSubmit={nextStep} />))}
 *       {selectorActions?.map(action => <HaapiSelector key={action.kind} action={action} onSubmit={nextStep} />)}
 *       {clientOperationActions?.map((action) => (<ClientOperation key={action.kind} action={action} onAction={nextStep} /> ))}
 *       {links?.map(link => (
 *         <button key={link.rel} onClick={() => nextStep(link)}>
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
 *
 * Full customization example:
 *
 * @example
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
 *  const { formActions, clientOperationActions, links } = currentStep.dataHelpers || {};
 *
 *   return (
 *     <div>
 *       <h2>Step: {currentStep.type}</h2>
 *       {formActions?.map((action) => (
 *         <div className="mb2" key={action.kind}>
 *           <h5>{action.title}</h5>
 *           <button onClick={() => nextStep(action)}>
 *             Select
 *           </button>
 *         </div>
 *       ))}
 *       {clientOperationActions?.map((action) => (
 *         <button key={action.kind} onClick={() => nextStep(action)}>
 *           {action.title}
 *         </button>
 *       ))}
 *       {links?.map((link) => (
 *         <button key={link.rel} onClick={() => nextStep(link)}>
 *           {link.title}
 *         </button>
 *       ))}
 *     </div>
 *     <div>
 *       <h3>Authentication Journey</h3>
 *       <p>Steps taken: {history.length}</p>
 *       <ul>
 *         {history.map((historyEntry, index) => (
 *           <li key={index}>
 *             {historyEntry.step.type} - {historyEntry.timestamp.toLocaleTimeString()}
 *             {historyEntry.triggeredByAction && ` (via ${historyEntry.triggeredByAction.title})`}
 *           </li>
 *         ))}
 *       </ul>
 *     </div>
 *   );
 * }
 *
 * <HaapiStepper>
 *   <HaapiComponentExample />
 * </HaapiStepper>
 * ```
 *
 * Conditional customization example:
 *
 * @example
 * ```tsx
 * import { HaapiStepper } from './HaapiStepper';
 * import { useHaapiStepper } from './useHaapiStepper';
 * import { HaapiUIStep } from '../steps/HaapiUIStep';
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
 *     currentStep.view?.templateArea === 'lwa-dev' &&
 *     currentStep.view?.viewName === 'views/select-authenticator/index'
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
 *   return <HaapiUIStep />;
 * }
 *
 * <HaapiStepper>
 *   <ConditionalCustomizationExample />
 * </HaapiStepper>
 * ```
 *
 * ## Error Handling
 *
 * The HaapiStepper distinguishes between:
 * - **App errors** (`error.app`): Unexpected problems or system errors that prevent flow continuation
 * - **Input errors** (`error.input`): Validation errors on user input that allow the user to retry
 *
 * Critical errors are thrown to the app's error boundary for proper error UI rendering.
 *
 */
export function HaapiStepper({ children, config }: HaapiStepperProps) {
  const [currentStep, setCurrentStep] = useState<HaapiStepperStep | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<HaapiStepperError | null>(null);
  const [history, setHistory] = useState<HaapiStepperHistoryEntry[]>([]);
  const throwErrorToAppErrorBoundary = useThrowErrorToAppErrorBoundary();
  const pendingOperation = useRef<AbortController | NodeJS.Timeout | null>(null);
  const configResult = useMemo(() => ({ ...DEFAULT_CONFIG, ...config }), [config]);

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

      const { nextStepData, nextStepError } = await processHaapiNextStep(
        currentStep,
        action,
        payload,
        pendingOperation,
        nextStep,
        configResult,
        history
      );

      if (nextStepError) {
        setError(nextStepError);
        return;
      }

      if (!nextStepData) {
        return;
      }

      setCurrentStepAndUpdateHistory(nextStepData, action, payload);
    },
    [configResult, currentStep, history, setCurrentStepAndUpdateHistory]
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
    nextStep(getInitialStepLink());
  }, [nextStep]);

  return (
    <HaapiStepperContext
      value={{
        currentStep,
        loading,
        error,
        nextStep,
        history,
      }}
    >
      {children}
    </HaapiStepperContext>
  );
}

async function processHaapiNextStep(
  currentStep: HaapiStep | null,
  action:
    | HaapiFormAction
    | HaapiClientOperationAction
    | HaapiLink
    | HaapiStepperFormAction
    | HaapiStepperClientOperationAction
    | HaapiStepperLink,
  payload: HaapiStepperNextStepPayload | undefined,
  pendingOperation: RefObject<AbortController | NodeJS.Timeout | null>,
  nextStep: HaapiStepperNextStep,
  config: HaapiStepperConfig,
  history: HaapiStepperHistoryEntry[]
): Promise<{
  nextStepData?: HaapiStepperStep;
  nextStepError?: HaapiStepperError;
}> {
  if (isClientOperation(action)) {
    const clientOperationResponse = await performClientOperation(action, pendingOperation);

    if (!clientOperationResponse) {
      return {};
    }

    return processHaapiNextStep(
      currentStep,
      clientOperationResponse.action,
      clientOperationResponse.payload,
      pendingOperation,
      nextStep,
      config,
      history
    );
  }

  const isLinkAction = 'href' in action;
  const nextStepRequestAction = isLinkAction ? action : { action, payload };
  const nextStepResponse = await sendHaapiFetchRequest(nextStepRequestAction);

  switch (nextStepResponse.type) {
    case HAAPI_STEPS.REDIRECTION:
      return processHaapiNextStep(
        nextStepResponse,
        nextStepResponse.actions[0],
        undefined,
        pendingOperation,
        nextStep,
        config,
        history
      );

    case HAAPI_STEPS.POLLING:
      return handlePollingStep(nextStepResponse, pendingOperation, nextStep, config, history);

    case HAAPI_STEPS.AUTHENTICATION:
    case HAAPI_STEPS.REGISTRATION:
    case HAAPI_STEPS.USER_CONSENT:
    case HAAPI_STEPS.CONSENTOR:
    case HAAPI_STEPS.COMPLETED_WITH_SUCCESS:
    case HAAPI_PROBLEM_STEPS.COMPLETED_WITH_ERROR:
      return { nextStepData: formatNextStepData(nextStepResponse) };

    case HAAPI_STEPS.CONTINUE_SAME:
      if ('href' in action) {
        throw new Error('Continue Same Step received after link navigation, but links cannot have continueActions');
      }
      return { nextStepData: formatContinueSameStepData(action, nextStepResponse, currentStep as HaapiStepperStep) };

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

function getInitialStepLink() {
  const initialUrl = configuration.initialUrl ?? window.location.href;
  const initialStepLink: HaapiStepperLink = {
    href: initialUrl,
    rel: 'self',
    type: HAAPI_STEPPER_ELEMENT_TYPES.LINK,
    subtype: 'initial-link',
    id: crypto.randomUUID(),
  };

  return initialStepLink;
}

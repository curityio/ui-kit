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

import { ReactElement, isValidElement } from 'react';
import { Spinner } from '../../../shared/ui/Spinner';
import { HaapiStepperActionsUI } from '../../ui/actions/HaapiStepperActionsUI';
import { HaapiStepperLinksUI } from '../../ui/links/HaapiStepperLinksUI';
import { HaapiStepperMessagesUI } from '../../ui/messages/HaapiStepperMessagesUI';
import { Well } from '../../ui/well/Well';
import { applyRenderInterceptor } from '../../util/generic-render-interceptor';
import { formatNextStepData } from '../stepper/data-formatters/format-next-step-data';
import { HaapiStepperViewNameBuiltInUI, getViewNameBuiltInUI } from '../viewnames';
import type {
  HaapiStepperAPI,
  HaapiStepperAPIWithRequiredCurrentStep,
  HaapiStepperFormFieldRenderInterceptor,
  HaapiStepperStepUIActionsRenderInterceptor,
  HaapiStepperStepUIClientOperationActionRenderInterceptor,
  HaapiStepperStepUIErrorRenderInterceptor,
  HaapiStepperStepUIFormActionRenderInterceptor,
  HaapiStepperStepUILinkRenderInterceptor,
  HaapiStepperStepUILoadingRenderInterceptor,
  HaapiStepperStepUIMessageRenderInterceptor,
  HaapiStepperStepUISelectorActionRenderInterceptor,
  HaapiStepperStepUIStepRenderInterceptor,
} from '../stepper/haapi-stepper.types';
import {
  HaapiStepperClientOperationAction,
  HaapiStepperFormAction,
  HaapiStepperLink,
  HaapiStepperSelectorAction,
  HaapiStepperStep,
  HaapiStepperUserMessage,
} from '../stepper/haapi-stepper.types';
import { useHaapiStepper } from '../stepper/HaapiStepperHook';

interface HaapiStepperStepUIProps {
  loadingRenderInterceptor?: HaapiStepperStepUILoadingRenderInterceptor;
  errorRenderInterceptor?: HaapiStepperStepUIErrorRenderInterceptor;
  stepRenderInterceptor?: HaapiStepperStepUIStepRenderInterceptor;
  actionsRenderInterceptor?: HaapiStepperStepUIActionsRenderInterceptor;
  formActionRenderInterceptor?: HaapiStepperStepUIFormActionRenderInterceptor;
  formFieldRenderInterceptor?: HaapiStepperFormFieldRenderInterceptor;
  selectorActionRenderInterceptor?: HaapiStepperStepUISelectorActionRenderInterceptor;
  clientOperationActionRenderInterceptor?: HaapiStepperStepUIClientOperationActionRenderInterceptor;
  linkRenderInterceptor?: HaapiStepperStepUILinkRenderInterceptor;
  messageRenderInterceptor?: HaapiStepperStepUIMessageRenderInterceptor;
  enableViewNameBuiltInUIs?: HaapiStepperViewNameBuiltInUI[] | boolean;
}

/**
 * @description
 * # HAAPI UI STEP FEATURES
 *
 * ## BUILT-IN HAAPI AUTHENTICATION FLOW SUPPORT
 *
 * In combination with the HaapiStepper, the HaapiStepperStepUI component provides a seamless way to implement
 * complete HAAPI authentication flows in your application, allowing extensive customization, with minimal setup.
 *
 * @example
 * ```tsx
 * <HaapiStepper>
 *  <HaapiStepperStepUI />
 * </HaapiStepper>
 * ```
 *
 * By default, it covers all HAAPI authentication flow steps out-of-the-box including:
 * - Authentication, Registration, User Consent, Consentor, Polling, Redirection, Continue same, Completed and,
 *   Problem steps
 * - Form, Selector, and Client Operation actions
 * - Messages, Links, Loading states, and Error handling
 *
 * Note: Redirection, and Continue Same steps are handled automatically by the HaapiStepper and never
 * reach this component
 *
 * ### VIEW NAME BUILT-IN UIs
 *
 * The HaapiStepperStepUI component also provides built-in UIs for specific HAAPI `viewName`s that require a more
 * tailored UI than the generic step shell can provide (e.g. the BankID QR code step, which requires lifting
 * the QR code up and showing a spinner while polling).
 *
 * The viewName built-in UIs are opt-in: `enableViewNameBuiltInUIs` defaults to `undefined` (no built-ins active).
 * Pass:
 *
 * - `true` (or the JSX shorthand `enableViewNameBuiltInUIs`) to enable all known built-ins. This
 *   stays in sync with the library — if a new built-in is added in a future release, it is
 *   activated automatically.
 * - An array of `HaapiStepperViewNameBuiltInUI` values to enable only specific built-ins.
 *   This pins the active set, so adding a new built-in to the library is a purely additive
 *   change that doesn't affect existing rendering.
 * - `false` or `undefined` to keep all built-ins disabled (every view renders through the
 *   generic shell).
 *
 * Composition: the matching viewName built-in UI is rendered after the `stepRenderInterceptor` has processed the
 * step, and before any of the per-element render interceptors (actions, messages, links…). It is only rendered
 * when `stepRenderInterceptor` was not provided or if it returns the stepper API data (pass-through) — the same
 * rule that governs every other render interceptor.
 *
 * #### ViewName Built-in UIs Example
 *
 * @example
 * ```tsx
 * import { HaapiStepperViewNameBuiltInUI } from '...';
 *
 * // No prop = no built-ins active. The component renders every view through the generic shell.
 * <HaapiStepperStepUI />
 *
 * // Boolean shorthand: opt in to all known built-ins (current and future).
 * <HaapiStepperStepUI enableViewNameBuiltInUIs />
 *
 * // Pin to a specific subset.
 * <HaapiStepperStepUI enableViewNameBuiltInUIs={[HaapiStepperViewNameBuiltInUI.BANKID]} />
 *
 * // Override a viewName built-in UI with a `stepRenderInterceptor`
 * const customBankIdUI: HaapiStepperStepUIStepRenderInterceptor = ({ currentStep, ...rest }) => {
 *   if (currentStep.metadata?.viewName === 'authenticator/bankid/wait/index') {
 *     return <MyBankId step={currentStep} />;
 *   }
 *   return { currentStep, ...rest };
 * };
 *
 * // MyBankId will be rendered instead of the built-in UI for the BankID
 * <HaapiStepperStepUI stepRenderInterceptor={customBankIdUI} enableViewNameBuiltInUIs />
 * ```
 *
 * ## CUSTOMIZATION
 *
 * ### CUSTOMIZATION DIMENSIONS
 *
 * The `HaapiStepperStepUI` component allows the customization of the HAAPI Authentication flows in 3 dimensions:
 * 1. Data (e.g., modify action titles)
 *    Only customizations applied to the original HaapiStep data (`actions`, `messages`, etc.) will be persisted.
 *    The HaapiStepperStep-specific data (`dataHelpers`) will be rebuilt from the HaapiStep data returned by the
 *    interceptor each time.
 * 2. UI (e.g., show custom spinner when loading)
 * 3. Behaviour/Logic (e.g., trigger a confirmation dialog on cancel actions)
 *
 * ### CUSTOMIZABLE ELEMENTS (COMPONENTS)
 *
 * Those 3 dimensions can be customized on the following elements:
 * - Loading
 * - Error
 * - Action:
 *   - Form
 *    - Form Field
 *   - Selector
 *   - Client Operation
 * - Link
 * - Message
 * - Step
 *
 * ### RENDER INTERCEPTORS
 *
 * Customization (data, ui and behaviour) is managed through render interceptors, which allow to intercept the
 * default rendering for the customizable element to provide custom UX while maintaining the underlying HAAPI
 * flow logic.
 *
 * The render interceptor receives the HAAPI API (`{currentStep, nextStep, loading, error, history}`) and can return
 * the following 3 result types:
 *
 * 1. React Element (➡️ Custom UI & Behavior):
 *    When the render interceptor returns a React element, it completely replaces the default UI rendering
 *
 * 2. Item Data (➡️ Default UI & Behavior):
 *    When the render interceptor returns the item data, it delegates to the default UI rendering (passthrough behavior)
 *    - Useful for conditional UI customization based on the data (e.g. if templateArea !== 'login' return data to
 *      delegate to default rendering)
 *
 *    2.1. Customized Item Data (➡️ Default UI & Behavior + Custom data):
 *         When the render interceptor returns the item data modified, those modifications will be applied to the default
 *         rendering of the element.
 *         - Useful for text modifications, property adjustments, or data enrichment (e.g., updated titles, properties)
 *
 * 3. null/undefined (➡️ Skipped Element):
 *    When the render interceptor returns null/undefined, it skips/hides the element entirely from the UI
 *    - Useful for conditional filtering of UI elements (actions of type 'X', specific links/messages...)
 *
 * Apart from the case when the Step render interceptor returns a React element or null/undefined, which replaces the
 * entire step UI (including loading, error, actions, messages...), all the rest of the render interceptors are
 * applied independently within the default step UI shell. This allows for highly granular customization of specific elements
 * while preserving the overall step structure and flow logic.
 *
 * For example, if only a Loading render interceptor is passed to the `HaapiStepperStepUI`, the step will show the default step UI
 * with a custom loading element when loading.
 *
 * #### RENDER INTERCEPTORS TYPES
 *
 * - Loading (loadingRenderInterceptor): customizes only loading states (e.g., custom spinner or progress bar)
 * - Error (errorRenderInterceptor): customizes only error displays (e.g., detailed error information)
 * - Action:
 *   - Form (formRenderInterceptor): customizes only form action rendering (e.g., custom login form)
 *    - Form Field (formFieldRenderInterceptor): customizes only form field rendering (e.g., custom input components)
 *   - Selector (selectorActionRenderInterceptor): customizes only selector action rendering (e.g., custom dropdown UI)
 *   - Client Operation (clientOperationRenderInterceptor): customizes only client operation action rendering (e.g., custom external browser flow button)
 * - Link (linkRenderInterceptor): customizes only link rendering (e.g., custom registration link button)
 * - Message (messageRenderInterceptor): customizes only message rendering (e.g., custom login message display)
 * - Step (stepRenderInterceptor): customizes entire step rendering (e.g., custom authentication step UI)
 *
 * ### CUSTOMIZATION EXAMPLES
 *
 * #### Loading Element Customization Example
 *
 * @example
 * ```tsx
 * // Data Customization: show loading only for specific template areas
 * const loadingRenderInterceptor: HaapiStepperStepUILoadingRenderInterceptor = ({ loading, currentStep, ...rest }) => {
 *   return { loading: loading && currentStep?.metadata?.templateArea !== 'lwa', currentStep, ...rest };
 * };
 *
 * // UI Customization: show custom loading component for the select authenticator step and delegate to default rendering otherwise
 * const customLoadingRenderInterceptor: HaapiStepperStepUILoadingRenderInterceptor = ({ loading, currentStep, ...rest }) => {
 *   if (loading && currentStep?.metadata?.viewName?.includes('select-authenticator')) {
 *     return <div data-testid="custom-loading">Authenticating...</div>;
 *   }
 *
 *   return { loading, currentStep, ...rest };
 * };
 *
 * // Behavior Customization: trigger analytics event when loading starts
 * const loadingRenderInterceptorWithAnalytics: HaapiStepperStepUILoadingRenderInterceptor = ({ loading, currentStep, ...rest }) => {
 *   if (loading) {
 *     analyticsTracker('loading_started', { hasStep: !!currentStep });
 *   }
 *   return { loading, currentStep, ...rest };
 * };
 * ```
 *
 * #### Step Element Customization Example
 *
 * @example
 * ```tsx
 * // Data customization: modify step's action, message and link data before default rendering
 * const customStepRenderInterceptor: HaapiStepperStepUIStepRenderInterceptor = ({ currentStep, ...rest }) => ({
 *  currentStep: {
 *    ...currentStep,
 *    actions: currentStep.dataHelpers?.actions?.all?.map(action => ({ ...action, title: `Modified ${action.title}` })),
 *    messages: currentStep.dataHelpers?.messages?.map(message => ({ ...message, text: `Modified ${message.text}` })),
 *    links: currentStep.dataHelpers?.links?.map(link => ({ ...link, title: `Modified ${link.title}` })),
 *  },
 *  ...rest,
 *});
 *
 * // UI customization: show custom component for the select authenticator step and delegate to default rendering otherwise
 * const customStepRenderInterceptor: HaapiStepperStepUIStepRenderInterceptor = ({ currentStep, ...rest }) => {
 *   if (currentStep.metadata?.viewName === 'views/select-authenticator/index') {
 *     return (
 *       <div data-testid="custom-step">
 *         <h1>Custom Select Authenticator</h1>
 *         {currentStep?.messages?.[0]?.text}
 *       </div>
 *     );
 *   }
 *   // Delegate to default rendering for other steps
 *   return { currentStep, ...rest };
 * };
 *
 * // Behavior customization: add confirmation dialog to cancel form actions
 * const stepRenderInterceptorWithBehaviorCustomization: HaapiStepperStepUIStepRenderInterceptor = ({
 *  currentStep,
 *  nextStep,
 *  ...rest
 * }) => {
 *   const enhancedNextStep = (action, payload) => {
 *     if (action.kind === HAAPI_FORM_ACTION_KINDS.CANCEL && !confirm('Exit authentication?')) {
 *       return;
 *     }
 *
 *     nextStep(action, payload);
 *   };
 *
 *   return { currentStep, nextStep: enhancedNextStep, ...rest };
 * };
 * ```
 *
 * See more data, UI and behaviour customization examples in the [unit tests](./haapi-stepper/feature/steps/HaapiStepperStepUI.spec.tsx)
 */
export const HaapiStepperStepUI = ({
  loadingRenderInterceptor,
  errorRenderInterceptor,
  stepRenderInterceptor,
  actionsRenderInterceptor,
  formActionRenderInterceptor,
  formFieldRenderInterceptor,
  selectorActionRenderInterceptor,
  clientOperationActionRenderInterceptor,
  linkRenderInterceptor,
  messageRenderInterceptor,
  enableViewNameBuiltInUIs,
}: HaapiStepperStepUIProps) => {
  const haapiStepperAPI = useHaapiStepper();
  const loadingElement: ReactElement | null = getLoadingElement(haapiStepperAPI, loadingRenderInterceptor);

  if (!haapiStepperAPI.currentStep) {
    return loadingElement;
  }

  let haapiStepperUiAPI = haapiStepperAPI as HaapiStepperAPIWithRequiredCurrentStep;

  if (stepRenderInterceptor) {
    const stepRenderInterceptorResult = stepRenderInterceptor(haapiStepperUiAPI);

    if (isValidElement(stepRenderInterceptorResult)) {
      return stepRenderInterceptorResult;
    }

    if (stepRenderInterceptorResult === null || stepRenderInterceptorResult === undefined) {
      return null;
    }

    haapiStepperUiAPI = {
      ...stepRenderInterceptorResult,
      currentStep: formatNextStepData(stepRenderInterceptorResult.currentStep),
    };
  }

  const ViewNameBuiltInUI = getViewNameBuiltInUI(haapiStepperUiAPI, enableViewNameBuiltInUIs);

  if (ViewNameBuiltInUI) {
    return <ViewNameBuiltInUI {...haapiStepperUiAPI} />;
  }

  const { error, currentStep } = haapiStepperUiAPI;
  const errorElement: ReactElement | null = getErrorElement(haapiStepperUiAPI, errorRenderInterceptor);
  const linksToDisplay = getLinksToDisplay(error, currentStep);
  const messagesToDisplay = error?.input ? error.input.dataHelpers.messages : currentStep.dataHelpers.messages;

  const messagesElement = getMessagesElement(haapiStepperUiAPI, messagesToDisplay, messageRenderInterceptor);
  const actionsElement = getActionsElement(
    haapiStepperUiAPI,
    actionsRenderInterceptor,
    formActionRenderInterceptor,
    formFieldRenderInterceptor,
    selectorActionRenderInterceptor,
    clientOperationActionRenderInterceptor
  );
  const linksElement = getLinksElement(haapiStepperUiAPI, linksToDisplay, linkRenderInterceptor);

  return (
    <Well>
      {loadingElement}
      {errorElement}
      {messagesElement}
      {actionsElement}
      {linksElement}
    </Well>
  );
};

const getLoadingElement = (
  haapiStepperAPI: HaapiStepperAPI,
  loadingRenderInterceptor?: HaapiStepperStepUILoadingRenderInterceptor
): ReactElement | null => {
  const loadingElements = applyRenderInterceptor([haapiStepperAPI], loadingRenderInterceptor, ({ loading }) =>
    loading ? <Spinner width={48} height={48} mode="fullscreen" data-testid="loading-spinner" /> : null
  );

  return loadingElements.length > 0 ? loadingElements[0] : null;
};

const getErrorElement = (
  haapiStepperAPI: HaapiStepperAPIWithRequiredCurrentStep,
  errorRenderInterceptor?: HaapiStepperStepUIErrorRenderInterceptor
): ReactElement | null => {
  const errorElements = applyRenderInterceptor([haapiStepperAPI], errorRenderInterceptor, () => null);

  return errorElements[0] ?? null;
};

const getMessagesElement = (
  haapiStepperAPI: HaapiStepperAPIWithRequiredCurrentStep,
  messages: HaapiStepperUserMessage[] | undefined,
  messageRenderInterceptor?: HaapiStepperStepUIMessageRenderInterceptor
): ReactElement => {
  const renderInterceptor = messageRenderInterceptor
    ? (message: HaapiStepperUserMessage) => messageRenderInterceptor({ message, ...haapiStepperAPI })
    : undefined;

  return <HaapiStepperMessagesUI messages={messages} renderInterceptor={renderInterceptor} />;
};

const getActionsElement = (
  haapiStepperAPI: HaapiStepperAPIWithRequiredCurrentStep,
  actionsRenderInterceptor?: HaapiStepperStepUIActionsRenderInterceptor,
  formActionRenderInterceptor?: HaapiStepperStepUIFormActionRenderInterceptor,
  formFieldRenderInterceptor?: HaapiStepperFormFieldRenderInterceptor,
  selectorActionRenderInterceptor?: HaapiStepperStepUISelectorActionRenderInterceptor,
  clientOperationActionRenderInterceptor?: HaapiStepperStepUIClientOperationActionRenderInterceptor
): ReactElement | null => {
  const defaultActionsElementFactory = (haapiStepperAPI: HaapiStepperAPIWithRequiredCurrentStep) => {
    const actions = haapiStepperAPI.currentStep.dataHelpers.actions?.all;

    if (!actions?.length) {
      return null;
    }

    const formActionInterceptor = formActionRenderInterceptor
      ? (action: HaapiStepperFormAction) => formActionRenderInterceptor({ action, ...haapiStepperAPI })
      : undefined;

    const selectorActionInterceptor = selectorActionRenderInterceptor
      ? (action: HaapiStepperSelectorAction) => selectorActionRenderInterceptor({ action, ...haapiStepperAPI })
      : undefined;

    const clientOperationActionInterceptor = clientOperationActionRenderInterceptor
      ? (action: HaapiStepperClientOperationAction) =>
          clientOperationActionRenderInterceptor({ action, ...haapiStepperAPI })
      : undefined;

    return (
      <HaapiStepperActionsUI
        actions={actions}
        onAction={haapiStepperAPI.nextStep}
        formActionRenderInterceptor={formActionInterceptor}
        formFieldRenderInterceptor={formFieldRenderInterceptor}
        selectorActionRenderInterceptor={selectorActionInterceptor}
        clientOperationActionRenderInterceptor={clientOperationActionInterceptor}
      />
    );
  };

  const actionsElements = applyRenderInterceptor(
    [haapiStepperAPI],
    actionsRenderInterceptor,
    defaultActionsElementFactory
  );

  return actionsElements[0] ?? null;
};

const getLinksElement = (
  haapiStepperAPI: HaapiStepperAPIWithRequiredCurrentStep,
  links: HaapiStepperLink[] | undefined,
  linkRenderInterceptor?: HaapiStepperStepUILinkRenderInterceptor
): ReactElement => {
  const renderInterceptor = linkRenderInterceptor
    ? (link: HaapiStepperLink) => linkRenderInterceptor({ link, ...haapiStepperAPI })
    : undefined;

  return <HaapiStepperLinksUI links={links} onClick={haapiStepperAPI.nextStep} renderInterceptor={renderInterceptor} />;
};

const getLinksToDisplay = (
  error: HaapiStepperAPI['error'],
  currentStep: HaapiStepperStep
): HaapiStepperLink[] | undefined => {
  return error?.input?.dataHelpers.links.length ? error.input.dataHelpers.links : currentStep.dataHelpers.links;
};

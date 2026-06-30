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

import { isValidElement, ReactElement } from 'react';
import { formatNextStepData } from '../stepper/data-formatters/format-next-step-data';
import { getViewNameBuiltInUI } from '../viewnames';
import type { HaapiStepperAPIWithRequiredCurrentStep } from '../stepper/haapi-stepper.types';
import { useHaapiStepper } from '../stepper/HaapiStepperHook';
import {
  getActionsElement,
  getErrorElement,
  getLinksElement,
  getLinksToDisplay,
  getLoadingElement,
  getMessagesElement,
} from './step-element-factories';
import type { HaapiStepperStepUIProps } from './typings';

/**
 * @description
 *
 * `HaapiStepperStepUI` is the default UI for HAAPI authentication flows: drop it inside a `HaapiStepper` and it renders every step — out of the box and ready to customize.
 *
 * ## Built-in HAAPI authentication flow support
 *
 * Used together with the `HaapiStepper`, the `HaapiStepperStepUI` renders a proper user interface (UI) for every
 * HAAPI authentication flow out of the box — making it the fastest and easiest way to get HAAPI up and running
 * in your application, with minimal setup.
 *
 * ```tsx
 * <HaapiStepper>
 *  <HaapiStepperStepUI />
 * </HaapiStepper>
 * ```
 * {@see_example docs/examples/DefaultRendering.tsx Default rendering example}
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
 * ### View name built-in UIs
 *
 * The HaapiStepperStepUI ships built-in UIs for specific HAAPI `viewName`s (`step.metadata.viewName`) that need a
 * more tailored UI than the generic step shell can provide (e.g. the BankID requires the QR link to be lifted
 * above the actions). They are displayed by default and can be customized like any other step by using render
 * interceptors.
 *
 * ## Customization
 *
 * The `HaapiStepperStepUI` is highly customizable and granular: you can customize some aspects (via render
 * interceptors) while keeping the defaults for the rest, making it the best way to apply partial customizations
 * to the default UI.
 *
 * ### Customization dimensions
 *
 * The `HaapiStepperStepUI` component allows the customization of the HAAPI Authentication flows in 3 dimensions:
 * 1. Data (e.g., modify action titles)
 *    Only customizations applied to the original HaapiStep data (`actions`, `messages`, etc.) will be persisted.
 *    The HaapiStepperStep-specific data (`dataHelpers`) will be rebuilt from the HaapiStep data returned by the
 *    interceptor each time.
 * 2. UI (e.g., show custom spinner when loading)
 * 3. Behaviour/Logic (e.g., trigger a confirmation dialog on cancel actions)
 *
 * ### Customizable elements (components)
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
 * ### Render interceptors
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
 * #### Render interceptors types
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
 * ### Customization examples
 *
 * #### Loading element customization example
 *
 * Data customization: show loading only for specific template areas.
 *
 * ```tsx
 * const loadingRenderInterceptor: HaapiStepperStepUILoadingRenderInterceptor = ({ loading, currentStep, ...rest }) => {
 *   return { loading: loading && currentStep?.metadata?.templateArea !== 'lwa', currentStep, ...rest };
 * };
 * ```
 * {@see_example docs/examples/LoadingDataRenderInterceptorExample.tsx Loading customization (data)}
 *
 * UI customization: show a custom loading component for the select authenticator step and delegate to default rendering otherwise.
 *
 * ```tsx
 * const customLoadingRenderInterceptor: HaapiStepperStepUILoadingRenderInterceptor = ({ loading, currentStep, ...rest }) => {
 *   if (loading && currentStep?.metadata?.viewName?.includes('select-authenticator')) {
 *     return <div data-testid="custom-loading">Authenticating...</div>;
 *   }
 *
 *   return { loading, currentStep, ...rest };
 * };
 * ```
 * {@see_example docs/examples/LoadingRenderInterceptorExample.tsx Loading customization (UI)}
 *
 * Behaviour customization: trigger an analytics event when loading starts.
 *
 * ```tsx
 * const loadingRenderInterceptorWithAnalytics: HaapiStepperStepUILoadingRenderInterceptor = ({ loading, currentStep, ...rest }) => {
 *   if (loading) {
 *     analyticsTracker('loading_started', { hasStep: !!currentStep });
 *   }
 *   return { loading, currentStep, ...rest };
 * };
 * ```
 * {@see_example docs/examples/LoadingBehaviorRenderInterceptorExample.tsx Loading customization (behaviour)}
 *
 * #### Step element customization example
 *
 * Data customization: modify the step's message and link data before default rendering.
 *
 * ```tsx
 * const customStepRenderInterceptor: HaapiStepperStepUIStepRenderInterceptor = ({ currentStep, ...rest }) => ({
 *  currentStep: {
 *    ...currentStep,
 *    messages: currentStep.dataHelpers?.messages?.map(message => ({ ...message, text: `Modified ${message.text}` })),
 *    links: currentStep.dataHelpers?.links?.map(link => ({ ...link, title: `Modified ${link.title}` })),
 *  },
 *  ...rest,
 *});
 * ```
 * {@see_example docs/examples/StepDataRenderInterceptorExample.tsx Step customization (data)}
 *
 * UI customization: display the select-authenticator step as a custom card grid, and delegate every other step to
 * default rendering.
 *
 * ```tsx
 * const customStepRenderInterceptor: HaapiStepperStepUIStepRenderInterceptor = ({ currentStep, nextStep, ...rest }) => {
 *   if (currentStep.metadata?.viewName !== 'views/select-authenticator/index') {
 *     return { currentStep, nextStep, ...rest };
 *   }
 *
 *   const options = currentStep.dataHelpers.actions?.selector?.[0]?.model.options ?? [];
 *
 *   return (
 *     <section>
 *       <h2>How would you like to sign in?</h2>
 *       {options.map(option => (
 *         <button key={option.id} onClick={() => nextStep(option)}>{option.title}</button>
 *       ))}
 *     </section>
 *   );
 * };
 * ```
 * {@see_example docs/examples/StepRenderInterceptorExample.tsx Step customization (UI)}
 *
 * Behaviour customization: add a confirmation dialog to cancel form actions.
 *
 * ```tsx
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
 * {@see_example docs/examples/StepBehaviorRenderInterceptorExample.tsx Step customization (behaviour)}
 *
 * See more data, UI and behaviour customization examples in the [unit tests](./haapi-stepper/feature/steps/HaapiStepperStepUI.spec.tsx)
 */
export const HaapiStepperStepUI = (props: HaapiStepperStepUIProps) => {
  const {
    /**
     * The default loadingRenderInterceptor factory renders a spinner whenever `currentStep` is a
     * polling step in `HAAPI_POLLING_STATUS.PENDING`.
     *
     * Consumers replacing this interceptor take over that signal entirely: returning a React element
     * based on some other condition (e.g. `loading === true`) will hide the polling-pending progress
     * indicator for the cases the default factory would have handled. Either check `currentStep`
     * explicitly, or return the pass-through `HaapiStepperAPI` data to delegate to the default factory
     * for the cases you don't want to handle.
     */
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
  } = props;
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

  const { error, currentStep } = haapiStepperUiAPI;
  const linksToDisplay = getLinksToDisplay(error, currentStep);
  const messagesToDisplay = error?.input ? error.input.dataHelpers.messages : currentStep.dataHelpers.messages;

  const stepElements = {
    loadingElement,
    errorElement: getErrorElement(haapiStepperUiAPI, errorRenderInterceptor),
    messagesElement: getMessagesElement(haapiStepperUiAPI, messagesToDisplay, messageRenderInterceptor),
    actionsElement: getActionsElement(
      haapiStepperUiAPI,
      actionsRenderInterceptor,
      formActionRenderInterceptor,
      formFieldRenderInterceptor,
      selectorActionRenderInterceptor,
      clientOperationActionRenderInterceptor
    ),
    linksElement: getLinksElement(haapiStepperUiAPI, linksToDisplay, linkRenderInterceptor),
  };

  const ViewNameBuiltInUI = getViewNameBuiltInUI(haapiStepperUiAPI);

  if (ViewNameBuiltInUI) {
    return <ViewNameBuiltInUI {...props} {...haapiStepperUiAPI} {...stepElements} />;
  }

  return (
    <>
      {stepElements.loadingElement}
      {stepElements.errorElement}
      {stepElements.messagesElement}
      {stepElements.actionsElement}
      {stepElements.linksElement}
    </>
  );
};

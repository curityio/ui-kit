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

import { ReactElement } from 'react';
import { HAAPI_POLLING_STATUS, HAAPI_STEPS } from '../../data-access/types/haapi-step.types';
import { HaapiStepperActionsUI } from '../../ui/actions/HaapiStepperActionsUI';
import { HaapiStepperLinksUI } from '../../ui/links/HaapiStepperLinksUI';
import { HaapiStepperMessagesUI } from '../../ui/messages/HaapiStepperMessagesUI';
import { applyRenderInterceptor } from '../../util/generic-render-interceptor';
import type {
  HaapiStepperAPI,
  HaapiStepperAPIWithRequiredCurrentStep,
  HaapiStepperClientOperationAction,
  HaapiStepperFormAction,
  HaapiStepperFormFieldRenderInterceptor,
  HaapiStepperLink,
  HaapiStepperSelectorAction,
  HaapiStepperStep,
  HaapiStepperStepUIActionsRenderInterceptor,
  HaapiStepperStepUIClientOperationActionRenderInterceptor,
  HaapiStepperStepUIErrorRenderInterceptor,
  HaapiStepperStepUIFormActionRenderInterceptor,
  HaapiStepperStepUILinkRenderInterceptor,
  HaapiStepperStepUILoadingRenderInterceptor,
  HaapiStepperStepUIMessageRenderInterceptor,
  HaapiStepperStepUISelectorActionRenderInterceptor,
  HaapiStepperUserMessage,
} from '../stepper/haapi-stepper.types';
import { Spinner } from '../../../shared/ui/spinner/Spinner';

export const getLoadingElement = (
  haapiStepperAPI: HaapiStepperAPI,
  loadingRenderInterceptor?: HaapiStepperStepUILoadingRenderInterceptor
): ReactElement | null => {
  const loadingElements = applyRenderInterceptor(
    [haapiStepperAPI],
    loadingRenderInterceptor,
    ({ loading, currentStep }) => {
      const isPollingPending =
        currentStep?.type === HAAPI_STEPS.POLLING && currentStep.properties.status === HAAPI_POLLING_STATUS.PENDING;
      const showSpinner = loading || isPollingPending;

      return showSpinner ? <Spinner width={48} height={48} mode="fullscreen" data-testid="loading-spinner" /> : null;
    }
  );

  return loadingElements.length > 0 ? loadingElements[0] : null;
};

export const getErrorElement = (
  haapiStepperAPI: HaapiStepperAPIWithRequiredCurrentStep,
  errorRenderInterceptor?: HaapiStepperStepUIErrorRenderInterceptor
): ReactElement | null => {
  const errorElements = applyRenderInterceptor([haapiStepperAPI], errorRenderInterceptor, () => null);

  return errorElements[0] ?? null;
};

export const getMessagesElement = (
  haapiStepperAPI: HaapiStepperAPIWithRequiredCurrentStep,
  messages: HaapiStepperUserMessage[] | undefined,
  messageRenderInterceptor?: HaapiStepperStepUIMessageRenderInterceptor
): ReactElement => {
  const renderInterceptor = messageRenderInterceptor
    ? (message: HaapiStepperUserMessage) => messageRenderInterceptor({ message, ...haapiStepperAPI })
    : undefined;

  return <HaapiStepperMessagesUI messages={messages} renderInterceptor={renderInterceptor} />;
};

export const getActionsElement = (
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

export const getLinksElement = (
  haapiStepperAPI: HaapiStepperAPIWithRequiredCurrentStep,
  links: HaapiStepperLink[] | undefined,
  linkRenderInterceptor?: HaapiStepperStepUILinkRenderInterceptor
): ReactElement => {
  const renderInterceptor = linkRenderInterceptor
    ? (link: HaapiStepperLink) => linkRenderInterceptor({ link, ...haapiStepperAPI })
    : undefined;

  return <HaapiStepperLinksUI links={links} onClick={haapiStepperAPI.nextStep} renderInterceptor={renderInterceptor} />;
};

export const getLinksToDisplay = (
  error: HaapiStepperAPI['error'],
  currentStep: HaapiStepperStep
): HaapiStepperLink[] | undefined => {
  return error?.input?.dataHelpers.links.length ? error.input.dataHelpers.links : currentStep.dataHelpers.links;
};

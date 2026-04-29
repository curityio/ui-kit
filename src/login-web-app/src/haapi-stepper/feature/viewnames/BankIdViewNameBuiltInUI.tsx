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

import { Spinner } from '../../../shared/ui/Spinner';
import { Well } from '../../ui/well/Well';
import { HaapiStepperMessagesUI } from '../../ui/messages/HaapiStepperMessagesUI';
import { HaapiStepperActionsUI } from '../../ui/actions/HaapiStepperActionsUI';
import { HaapiStepperLinksUI } from '../../ui/links/HaapiStepperLinksUI';
import { HAAPI_POLLING_STATUS, HAAPI_STEPS } from '../../data-access/types/haapi-step.types';
import { HaapiStepperAPIWithRequiredCurrentStep, HaapiStepperLink } from '../stepper/haapi-stepper.types';

/**
 * Built-in UI for the BankID viewName (`HaapiStepperViewNameBuiltInUI.BANKID`).
 *
 *  - Renders a spinner while the polling status is `pending` (independent of the `loading` flag,
 *    which only covers the time the LWA is fetching the next step). Once the polling resolves
 *    to `done` or `failed`, the spinner is dropped.
 *  - Lifts the QR code link above the actions so it's the primary element on the screen.
 */
export const BankIdViewNameBuiltInUI = ({ currentStep, nextStep }: HaapiStepperAPIWithRequiredCurrentStep) => {
  const { messages, actions, links } = currentStep.dataHelpers;
  const isQrLink = (link: HaapiStepperLink) => link.subtype?.startsWith('image/') ?? false;
  const qrLink = links.find(isQrLink);
  const nonQrLinks = links.filter(link => !isQrLink(link));
  const isPollingPending =
    currentStep.type === HAAPI_STEPS.POLLING && currentStep.properties.status === HAAPI_POLLING_STATUS.PENDING;

  return (
    <Well>
      {isPollingPending && <Spinner width={48} height={48} mode="fullscreen" data-testid="bankid-spinner" />}
      <HaapiStepperMessagesUI messages={messages} />
      {qrLink && <HaapiStepperLinksUI links={[qrLink]} onClick={nextStep} />}
      <HaapiStepperActionsUI actions={actions?.all} onAction={nextStep} />
      {nonQrLinks.length > 0 && <HaapiStepperLinksUI links={nonQrLinks} onClick={nextStep} />}
    </Well>
  );
};

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

import { Well } from '../../ui/well/Well';
import { isQrCodeLink } from '../../util/isQrCodeLink';
import { getLinksElement } from '../steps/step-element-factories';
import type { ViewNameBuiltInUIProps } from './typings';

/**
 * Built-in UI for the BankID viewName (`HaapiStepperViewNameBuiltInUI.BANKID`).
 *
 *  - Lifts the QR code link above the actions so it's the primary element on the screen.
 */
export const BankIdViewNameBuiltInUI = (props: ViewNameBuiltInUIProps) => {
  const { currentStep, linkRenderInterceptor, loadingElement, errorElement, messagesElement, actionsElement } = props;
  const { links } = currentStep.dataHelpers;
  const qrLink = links.find(isQrCodeLink);
  const nonQrLinks = links.filter(link => !isQrCodeLink(link));

  return (
    <>
      {loadingElement}
      {errorElement}
      {messagesElement}
      {qrLink && getLinksElement(props, [qrLink], linkRenderInterceptor)}
      {actionsElement}
      {nonQrLinks.length > 0 && getLinksElement(props, nonQrLinks, linkRenderInterceptor)}
    </>
  );
};

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

import { IconGeneralCheckmarkCircled } from '@curity/ui-kit-icons';

import type { HaapiStepperStep } from '../stepper/haapi-stepper.types';
import type { ViewNameBuiltInUIProps } from './typings';

/**
 * Built-in UI for the User Consent view (`HaapiStepperViewNameBuiltInUI.USER_CONSENT`).
 *
 *  - Adds top section with company <-> client logo association.
 *  - Renders everything else as-is.
 */
export const UserConsentViewNameBuiltInUI = (props: ViewNameBuiltInUIProps) => {
  const { currentStep, config, loadingElement, errorElement, messagesElement, actionsElement, linksElement } = props;
  const companyLogo = config.bootstrap.theme.logo?.path;
  const clientLogo = getClientLogo(currentStep);

  return (
    <>
      {companyLogo && clientLogo && (
        <div className="haapi-stepper-consent-logos" data-testid="consent-logos">
          <ConsentLogo src={companyLogo} alt="Logo" />
          <span className="haapi-stepper-consent-logos-checkmark">
            <IconGeneralCheckmarkCircled aria-hidden="true" focusable="false" />
          </span>
          <ConsentLogo src={clientLogo} alt="Client logo" isClient />
        </div>
      )}
      {loadingElement}
      {errorElement}
      {messagesElement}
      {actionsElement}
      {linksElement}
    </>
  );
};

const ConsentLogo = ({ src, alt, isClient }: { src: string; alt: string; isClient?: boolean }) => (
  <span className="haapi-stepper-consent-logo">
    <span className="haapi-stepper-consent-logo-circle">
      <img
        className={`haapi-stepper-consent-logo-image${isClient ? ' haapi-stepper-consent-logo-image-client' : ''}`}
        src={src}
        alt={alt}
      />
    </span>
  </span>
);

function getClientLogo(step: HaapiStepperStep): string | undefined {
  const logo = step.metadata?.viewData?.clientLogo;
  return typeof logo === 'string' ? logo : undefined;
}

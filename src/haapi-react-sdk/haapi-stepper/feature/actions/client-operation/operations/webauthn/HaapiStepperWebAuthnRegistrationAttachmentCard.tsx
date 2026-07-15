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

import { HaapiStepperWebAuthnAnyDeviceRegistrationAction } from '../../../../stepper/haapi-stepper.types';
import { useHaapiStepper } from '../../../../stepper/HaapiStepperHook';
import { getWebAuthnRegistrationAttachment } from './webauthn-registration-attachment';
import { REGISTRATION_ATTACHMENT_ICON } from './webauthn-registration-attachment-icon-map';

export interface HaapiStepperWebAuthnRegistrationAttachmentCardProps {
  /** The (split) any-device `webauthn-registration` action this option advances the flow with. */
  action: HaapiStepperWebAuthnAnyDeviceRegistrationAction;
  /** Disables the card (e.g. when the required authenticator capability is unavailable). */
  disabled?: boolean;
  onClick: () => void;
}

/**
 * A single WebAuthn registration attachment-selection option, rendered as a clickable card
 * (icon + bold title + description).
 *
 * Exported so consumers building a custom WebAuthn registration UI can reuse it.
 */
export const HaapiStepperWebAuthnRegistrationAttachmentCard = ({
  action,
  disabled,
  onClick,
}: HaapiStepperWebAuthnRegistrationAttachmentCardProps) => {
  const { currentStep } = useHaapiStepper();
  const { kind, title, description } = getWebAuthnRegistrationAttachment(
    action,
    currentStep?.metadata?.viewData?.messages
  );

  return (
    <button
      type="button"
      className="haapi-stepper-webauthn-registration-attachment"
      data-testid="webauthn-registration-attachment-card"
      disabled={disabled}
      onClick={onClick}
    >
      <span className="haapi-stepper-webauthn-registration-attachment-icon" aria-hidden="true">
        {REGISTRATION_ATTACHMENT_ICON[kind]}
      </span>
      <span className="haapi-stepper-webauthn-registration-attachment-text">
        <strong className="haapi-stepper-webauthn-registration-attachment-title">{title}</strong>
        {description && (
          <span className="haapi-stepper-webauthn-registration-attachment-description">{description}</span>
        )}
      </span>
    </button>
  );
};

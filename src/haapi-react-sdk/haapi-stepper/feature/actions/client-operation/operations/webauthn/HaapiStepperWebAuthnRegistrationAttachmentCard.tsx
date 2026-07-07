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
import { REGISTRATION_ATTACHMENT_ICON } from './webauthn-registration-attachment-icon-map';

export interface HaapiStepperWebAuthnRegistrationAttachmentCardProps {
  /** The any-device `webauthn-registration` action this option advances the flow with. */
  action: HaapiStepperWebAuthnAnyDeviceRegistrationAction;
  /** Disables the card (e.g. when the required authenticator capability is unavailable). */
  disabled?: boolean;
  onClick: () => void;
}

/**
 * A single WebAuthn registration attachment-selection option, rendered as a clickable card
 * (icon + bold title + description). Resolves the localized copy and icon from the action's
 * `attachment` and wires `onClick` to advance the flow.
 *
 * Exported so consumers building a custom WebAuthn registration UI can reuse it.
 */
export const HaapiStepperWebAuthnRegistrationAttachmentCard = ({
  action,
  disabled,
  onClick,
}: HaapiStepperWebAuthnRegistrationAttachmentCardProps) => {
  const registrationAttachment = action.webauthn?.registrationAttachment;
  if (!registrationAttachment) {
    return null;
  }

  return (
    <button
      type="button"
      className="haapi-stepper-webauthn-registration-attachment"
      data-testid="webauthn-registration-attachment-card"
      disabled={disabled}
      onClick={onClick}
    >
      <span className="haapi-stepper-webauthn-registration-attachment-icon" aria-hidden="true">
        {REGISTRATION_ATTACHMENT_ICON[registrationAttachment.kind]}
      </span>
      <span className="haapi-stepper-webauthn-registration-attachment-text">
        <strong className="haapi-stepper-webauthn-registration-attachment-title">{registrationAttachment.title}</strong>
        {registrationAttachment.description && (
          <span className="haapi-stepper-webauthn-registration-attachment-description">
            {registrationAttachment.description}
          </span>
        )}
      </span>
    </button>
  );
};

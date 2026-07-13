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

import { HaapiWebAuthnAnyDeviceRegistrationAction } from '../../../data-access/types/haapi-action.types';
import { HaapiStepperWebAuthnData, WebAuthnRegistrationAttachmentKind } from '../haapi-stepper.types';
import { getWebAuthnRegistrationAttachmentKind } from '../../actions/client-operation/operations/webauthn';

const ATTACHMENT_VIEW_MARKERS = ['.view.button.', '.view.authenticator-attachment.'];

/**
 * Builds the `webauthn` data of a (split) any-device `webauthn-registration` action — its
 * `registrationAttachment`:
 *
 *  - `kind` — the attachment the action carries, derived from its `model.arguments`.
 *  - `title` / `description` — the attachment option copy resolved from the messages, with the
 *    action title as the `title` fallback.
 */
export function getWebAuthnData(
  action: HaapiWebAuthnAnyDeviceRegistrationAction,
  viewDataMessages?: Record<string, string>
): HaapiStepperWebAuthnData {
  const messageEntries = Object.entries(viewDataMessages ?? {}).filter(([key]) =>
    ATTACHMENT_VIEW_MARKERS.some(marker => key.includes(marker))
  );
  const messages = messageEntries.length > 0 ? Object.fromEntries(messageEntries) : undefined;
  // The exact keys the webauthn authenticator uses for the attachment-selection copy
  // (see `WebauthnRegistrationRepresentationFunction` in the server).
  const attachmentKey = (property: 'button' | 'authenticator-attachment', kind: WebAuthnRegistrationAttachmentKind) =>
    `authenticator.webauthn.register.view.${property}.${kind}`;

  const kind = getWebAuthnRegistrationAttachmentKind(action);
  const title = messages?.[attachmentKey('button', kind)] ?? action.title;
  const description = messages?.[attachmentKey('authenticator-attachment', kind)];

  return {
    registrationAttachment: {
      kind,
      ...(title !== undefined && { title }),
      ...(description !== undefined && { description }),
    },
  };
}

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

import { HaapiWebAuthnAnyDeviceRegistrationAction } from '../../../../../data-access/types/haapi-action.types';
import {
  HaapiStepperWebAuthnRegistrationAttachment,
  WebAuthnRegistrationAttachmentKind,
} from '../../../../stepper/haapi-stepper.types';
import { getWebAuthnRegistrationAttachmentKind } from './utils';

/**
 * Builds the registration attachment of a (split) any-device `webauthn-registration` action:
 *
 *  - `kind` — the attachment the action carries, derived from its `model.arguments`.
 *  - `title` / `description` — the attachment option copy looked up from `metadata.viewData.messages`,
 *    with the action title as the `title` fallback.
 */
export function getWebAuthnRegistrationAttachment(
  action: HaapiWebAuthnAnyDeviceRegistrationAction,
  viewDataMessages?: Record<string, string>
): HaapiStepperWebAuthnRegistrationAttachment {
  // The exact keys the webauthn authenticator uses for the attachment-selection copy.
  const attachmentKey = (property: 'button' | 'authenticator-attachment', kind: WebAuthnRegistrationAttachmentKind) =>
    `authenticator.webauthn.register.view.${property}.${kind}`;

  const kind = getWebAuthnRegistrationAttachmentKind(action);
  const title = viewDataMessages?.[attachmentKey('button', kind)] ?? action.title;
  const description = viewDataMessages?.[attachmentKey('authenticator-attachment', kind)];

  return {
    kind,
    ...(title !== undefined && { title }),
    ...(description !== undefined && { description }),
  };
}

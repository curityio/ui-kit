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

import type { ReactNode } from 'react';

import { WebAuthnRegistrationAttachmentKind } from './utils';
import { IconWebAuthnCrossPlatform, IconWebAuthnPlatform } from './webauthn-registration-attachment-icons';

/**
 * Maps each WebAuthn attachment kind to its inline icon. Kept apart from the icon component module
 * so that file only exports components (react-refresh constraint).
 */
export const REGISTRATION_ATTACHMENT_ICON: Record<WebAuthnRegistrationAttachmentKind, ReactNode> = {
  [WebAuthnRegistrationAttachmentKind.PLATFORM]: <IconWebAuthnPlatform />,
  [WebAuthnRegistrationAttachmentKind.CROSS_PLATFORM]: <IconWebAuthnCrossPlatform />,
};

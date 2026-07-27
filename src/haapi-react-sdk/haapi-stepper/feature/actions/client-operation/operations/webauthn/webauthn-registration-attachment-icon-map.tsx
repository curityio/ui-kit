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
import { IconAuthenticatorWebauthnCrossPlatform, IconAuthenticatorWebauthnPlatform } from '@curity/ui-kit-icons';

import { WebAuthnRegistrationAttachmentKind } from '../../../../stepper/haapi-stepper.types';

/**
 * Maps each WebAuthn attachment kind to its icon from the shared `@curity/ui-kit-icons` package.
 * The icons use `currentColor`, so their color follows the surrounding text color.
 */
export const REGISTRATION_ATTACHMENT_ICON: Record<WebAuthnRegistrationAttachmentKind, ReactNode> = {
  [WebAuthnRegistrationAttachmentKind.PLATFORM]: <IconAuthenticatorWebauthnPlatform />,
  [WebAuthnRegistrationAttachmentKind.CROSS_PLATFORM]: <IconAuthenticatorWebauthnCrossPlatform />,
};

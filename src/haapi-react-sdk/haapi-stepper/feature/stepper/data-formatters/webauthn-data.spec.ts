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

import { describe, expect, it } from 'vitest';

import {
  createMockWebAuthnCrossPlatformOnlyAnyDeviceAction,
  createMockWebAuthnPlatformOnlyAnyDeviceAction,
  webAuthnPlatformOnlyAnyDeviceActionTitle,
} from '../../../util/tests/mocks';
import { WebAuthnRegistrationAttachmentKind } from '../haapi-stepper.types';
import { getWebAuthnData } from './webauthn-data';

const MESSAGE_PREFIX = 'authenticator.webauthn.register.view.';
const VIEW_DATA_MESSAGES = {
  [`${MESSAGE_PREFIX}button.platform`]: 'Built-in',
  [`${MESSAGE_PREFIX}button.cross-platform`]: 'Security key',
  [`${MESSAGE_PREFIX}authenticator-attachment.platform`]: 'A non-removable built-in device.',
  [`${MESSAGE_PREFIX}authenticator-attachment.cross-platform`]: 'A security key.',
};

describe('getWebAuthnData', () => {
  it('resolves the kind, localized title and description, and the attachment messages (keys untouched)', () => {
    const result = getWebAuthnData(createMockWebAuthnPlatformOnlyAnyDeviceAction(), {
      ...VIEW_DATA_MESSAGES,
      'authenticator.webauthn.register.page.title': 'Register a device',
    });

    expect(result).toEqual({
      registrationAttachment: {
        kind: WebAuthnRegistrationAttachmentKind.PLATFORM,
        messages: VIEW_DATA_MESSAGES,
        title: 'Built-in',
        description: 'A non-removable built-in device.',
      },
    });
  });

  it('resolves the cross-platform copy for a cross-platform action', () => {
    const result = getWebAuthnData(createMockWebAuthnCrossPlatformOnlyAnyDeviceAction(), VIEW_DATA_MESSAGES);

    expect(result).toEqual({
      registrationAttachment: {
        kind: WebAuthnRegistrationAttachmentKind.CROSS_PLATFORM,
        messages: VIEW_DATA_MESSAGES,
        title: 'Security key',
        description: 'A security key.',
      },
    });
  });

  it('falls back to the action title when there are no messages', () => {
    const result = getWebAuthnData(createMockWebAuthnPlatformOnlyAnyDeviceAction(), undefined);

    expect(result).toEqual({
      registrationAttachment: {
        kind: WebAuthnRegistrationAttachmentKind.PLATFORM,
        title: webAuthnPlatformOnlyAnyDeviceActionTitle,
      },
    });
  });
});

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
} from '../../../../../util/tests/mocks';
import { WebAuthnRegistrationAttachmentKind } from '../../../../stepper/haapi-stepper.types';
import { getWebAuthnRegistrationAttachment } from './webauthn-registration-attachment';

const PREFIX = 'authenticator.webauthn.register.view.';
const PLATFORM_TITLE = 'Built-in';
const PLATFORM_DESCRIPTION = 'A non-removable built-in device.';
const CROSS_PLATFORM_TITLE = 'Security key';
const CROSS_PLATFORM_DESCRIPTION = 'A security key.';
const VIEW_DATA_MESSAGES = {
  [`${PREFIX}button.platform`]: PLATFORM_TITLE,
  [`${PREFIX}button.cross-platform`]: CROSS_PLATFORM_TITLE,
  [`${PREFIX}authenticator-attachment.platform`]: PLATFORM_DESCRIPTION,
  [`${PREFIX}authenticator-attachment.cross-platform`]: CROSS_PLATFORM_DESCRIPTION,
};

describe('getWebAuthnRegistrationAttachment', () => {
  it('resolves the platform kind, localized title and description from the view-data messages', () => {
    const result = getWebAuthnRegistrationAttachment(createMockWebAuthnPlatformOnlyAnyDeviceAction(), {
      ...VIEW_DATA_MESSAGES,
      'authenticator.webauthn.register.page.title': 'Register a device',
    });

    expect(result).toEqual({
      kind: WebAuthnRegistrationAttachmentKind.PLATFORM,
      title: PLATFORM_TITLE,
      description: PLATFORM_DESCRIPTION,
    });
  });

  it('resolves the cross-platform copy for a cross-platform action', () => {
    const result = getWebAuthnRegistrationAttachment(
      createMockWebAuthnCrossPlatformOnlyAnyDeviceAction(),
      VIEW_DATA_MESSAGES
    );

    expect(result).toEqual({
      kind: WebAuthnRegistrationAttachmentKind.CROSS_PLATFORM,
      title: CROSS_PLATFORM_TITLE,
      description: CROSS_PLATFORM_DESCRIPTION,
    });
  });

  it('falls back to the action title and omits the description when there are no messages', () => {
    const result = getWebAuthnRegistrationAttachment(createMockWebAuthnPlatformOnlyAnyDeviceAction(), undefined);

    expect(result).toEqual({
      kind: WebAuthnRegistrationAttachmentKind.PLATFORM,
      title: webAuthnPlatformOnlyAnyDeviceActionTitle,
    });
  });
});

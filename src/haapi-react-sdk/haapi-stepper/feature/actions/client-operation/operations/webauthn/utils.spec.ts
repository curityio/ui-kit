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
  createMockWebAuthnAnyDeviceBothOptionsAction,
  createMockWebAuthnAuthenticationAction,
  createMockWebAuthnCrossPlatformOnlyAnyDeviceAction,
  createMockWebAuthnPlatformOnlyAnyDeviceAction,
  createMockWebAuthnRegistrationAction,
} from '../../../../../util/tests/mocks';
import { getWebAuthnRegistrationAttachmentKind, isAnyDeviceWebAuthnRegistrationClientOperation } from './utils';

describe('isAnyDeviceWebAuthnRegistrationClientOperation', () => {
  it('is true for any-device registration actions (platform-only, cross-platform-only, both options)', () => {
    expect(isAnyDeviceWebAuthnRegistrationClientOperation(createMockWebAuthnPlatformOnlyAnyDeviceAction())).toBe(true);
    expect(isAnyDeviceWebAuthnRegistrationClientOperation(createMockWebAuthnCrossPlatformOnlyAnyDeviceAction())).toBe(
      true
    );
    expect(isAnyDeviceWebAuthnRegistrationClientOperation(createMockWebAuthnAnyDeviceBothOptionsAction())).toBe(true);
  });

  it('is false for a passkeys-mode registration action', () => {
    expect(isAnyDeviceWebAuthnRegistrationClientOperation(createMockWebAuthnRegistrationAction())).toBe(false);
  });

  it('is false for a non-registration (authentication) action', () => {
    expect(isAnyDeviceWebAuthnRegistrationClientOperation(createMockWebAuthnAuthenticationAction())).toBe(false);
  });
});

describe('getWebAuthnRegistrationAttachmentKind', () => {
  it('returns "platform" for a platform-only any-device action', () => {
    expect(getWebAuthnRegistrationAttachmentKind(createMockWebAuthnPlatformOnlyAnyDeviceAction())).toBe('platform');
  });

  it('returns "cross-platform" for a cross-platform-only any-device action', () => {
    expect(getWebAuthnRegistrationAttachmentKind(createMockWebAuthnCrossPlatformOnlyAnyDeviceAction())).toBe(
      'cross-platform'
    );
  });

  it('returns "platform" for a both-options any-device action (platform takes precedence)', () => {
    expect(getWebAuthnRegistrationAttachmentKind(createMockWebAuthnAnyDeviceBothOptionsAction())).toBe('platform');
  });
});

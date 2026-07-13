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

import { HAAPI_STEPS } from '../../../data-access/types/haapi-step.types';
import {
  createMockExternalBrowserFlowAction,
  createMockStep,
  createMockWebAuthnAnyDeviceBothOptionsAction,
  webAuthnAnyDeviceActionTitle,
} from '../../../util/tests/mocks';
import { WebAuthnRegistrationAttachmentKind } from '../haapi-stepper.types';

const REGISTER_VIEW_NAME = 'authenticator/webauthn/register/get';
const MESSAGE_PREFIX = 'authenticator.webauthn.register.view.';
const VIEW_DATA_MESSAGES = {
  [`${MESSAGE_PREFIX}button.platform`]: 'Built-in',
  [`${MESSAGE_PREFIX}button.cross-platform`]: 'Security key',
  [`${MESSAGE_PREFIX}authenticator-attachment.platform`]: 'A non-removable built-in device.',
  [`${MESSAGE_PREFIX}authenticator-attachment.cross-platform`]: 'A security key.',
};

describe('formatNextStepData — webauthn data', () => {
  it('adds the resolved webauthn data to the split webauthn client-operation actions', () => {
    const step = createMockStep(HAAPI_STEPS.REGISTRATION, {
      actions: [createMockWebAuthnAnyDeviceBothOptionsAction()],
      metadata: {
        viewName: REGISTER_VIEW_NAME,
        viewData: {
          messages: { ...VIEW_DATA_MESSAGES, 'authenticator.webauthn.register.page.title': 'Register a device' },
        },
      },
    });

    const clientOperations = step.dataHelpers.actions?.clientOperation ?? [];

    expect(clientOperations).toHaveLength(2);
    expect(clientOperations[0].webauthn).toEqual({
      registrationAttachment: {
        kind: WebAuthnRegistrationAttachmentKind.PLATFORM,
        title: 'Built-in',
        description: 'A non-removable built-in device.',
      },
    });
    expect(clientOperations[1].webauthn).toEqual({
      registrationAttachment: {
        kind: WebAuthnRegistrationAttachmentKind.CROSS_PLATFORM,
        title: 'Security key',
        description: 'A security key.',
      },
    });
  });

  it('falls back to the split action titles when the step carries no viewData', () => {
    const step = createMockStep(HAAPI_STEPS.REGISTRATION, {
      actions: [createMockWebAuthnAnyDeviceBothOptionsAction()],
      metadata: { viewName: REGISTER_VIEW_NAME },
    });

    const clientOperations = step.dataHelpers.actions?.clientOperation ?? [];

    expect(clientOperations).toHaveLength(2);
    expect(clientOperations[0].webauthn).toEqual({
      registrationAttachment: {
        kind: WebAuthnRegistrationAttachmentKind.PLATFORM,
        title: `${webAuthnAnyDeviceActionTitle} (Built-in)`,
      },
    });
    expect(clientOperations[1].webauthn).toEqual({
      registrationAttachment: {
        kind: WebAuthnRegistrationAttachmentKind.CROSS_PLATFORM,
        title: `${webAuthnAnyDeviceActionTitle} (Security key)`,
      },
    });
  });

  it('does not add webauthn data to other client operations', () => {
    const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
      actions: [createMockExternalBrowserFlowAction()],
      metadata: { viewName: REGISTER_VIEW_NAME, viewData: { messages: VIEW_DATA_MESSAGES } },
    });

    expect(step.dataHelpers.actions?.clientOperation[0].webauthn).toBeUndefined();
  });
});

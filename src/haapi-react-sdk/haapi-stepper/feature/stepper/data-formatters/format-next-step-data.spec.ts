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
import { createMockStep, createMockWebAuthnAnyDeviceBothOptionsAction } from '../../../util/tests/mocks';
import { WebAuthnRegistrationAttachmentKind } from '../haapi-stepper.types';

const REGISTER_VIEW_NAME = 'authenticator/webauthn/register/get';
const MESSAGE_PREFIX = 'authenticator.webauthn.register.view.';
const PLATFORM_TITLE = 'Built-in';
const PLATFORM_DESCRIPTION = 'A non-removable built-in device.';
const CROSS_PLATFORM_TITLE = 'Security key';
const CROSS_PLATFORM_DESCRIPTION = 'A security key.';
const VIEW_DATA_MESSAGES = {
  [`${MESSAGE_PREFIX}button.platform`]: PLATFORM_TITLE,
  [`${MESSAGE_PREFIX}button.cross-platform`]: CROSS_PLATFORM_TITLE,
  [`${MESSAGE_PREFIX}authenticator-attachment.platform`]: PLATFORM_DESCRIPTION,
  [`${MESSAGE_PREFIX}authenticator-attachment.cross-platform`]: CROSS_PLATFORM_DESCRIPTION,
};

describe('formatNextStepData — WebAuthn attachment enrichment', () => {
  it('attaches localized attachment copy to the split any-device registration actions when viewData messages are present', () => {
    const step = createMockStep(HAAPI_STEPS.REGISTRATION, {
      actions: [createMockWebAuthnAnyDeviceBothOptionsAction()],
      metadata: { viewName: REGISTER_VIEW_NAME, viewData: { messages: VIEW_DATA_MESSAGES } },
    });

    const clientOperations = step.dataHelpers.actions?.clientOperation ?? [];

    expect(clientOperations).toHaveLength(2);
    expect(clientOperations[0].webauthn?.registrationAttachment).toEqual({
      kind: WebAuthnRegistrationAttachmentKind.PLATFORM,
      title: PLATFORM_TITLE,
      description: PLATFORM_DESCRIPTION,
    });
    expect(clientOperations[1].webauthn?.registrationAttachment).toEqual({
      kind: WebAuthnRegistrationAttachmentKind.CROSS_PLATFORM,
      title: CROSS_PLATFORM_TITLE,
      description: CROSS_PLATFORM_DESCRIPTION,
    });
  });

  it('does not attach copy when the step carries no viewData messages', () => {
    const step = createMockStep(HAAPI_STEPS.REGISTRATION, {
      actions: [createMockWebAuthnAnyDeviceBothOptionsAction()],
      metadata: { viewName: REGISTER_VIEW_NAME },
    });

    const clientOperations = step.dataHelpers.actions?.clientOperation ?? [];

    expect(clientOperations).toHaveLength(2);
    expect(clientOperations.every(action => action.webauthn === undefined)).toBe(true);
  });
});

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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';

import {
  createMockWebAuthnCrossPlatformOnlyAnyDeviceAction,
  createMockWebAuthnPlatformOnlyAnyDeviceAction,
  webAuthnPlatformOnlyAnyDeviceActionTitle,
} from '../../../../../util/tests/mocks';
import { HaapiStepperWebAuthnRegistrationAttachmentCard } from './HaapiStepperWebAuthnRegistrationAttachmentCard';
import { useHaapiStepper } from '../../../../stepper/HaapiStepperHook';
import type { HaapiStepperStep } from '../../../../stepper/haapi-stepper.types';

vi.mock('../../../../stepper/HaapiStepperHook', () => ({ useHaapiStepper: vi.fn() }));

const PLATFORM_ICON_VIEW_BOX = '0 0 64.2 83.9';
const CROSS_PLATFORM_ICON_VIEW_BOX = '0 0 49 72.6';
const PREFIX = 'authenticator.webauthn.register.view.';
const PLATFORM_TITLE = 'Built-in';
const PLATFORM_DESCRIPTION = 'A non-removable built-in device.';
const CROSS_PLATFORM_TITLE = 'Security key';

// The card resolves its copy from the current step's viewData messages via `useHaapiStepper`.
const mockCurrentStepMessages = (messages?: Record<string, string>) =>
  vi.mocked(useHaapiStepper).mockReturnValue({
    currentStep: (messages ? { metadata: { viewData: { messages } } } : null) as HaapiStepperStep | null,
  } as ReturnType<typeof useHaapiStepper>);

// Safe default so a test that forgets to configure the hook gets a clear assertion
// failure rather than an opaque "cannot destructure currentStep" crash.
beforeEach(() => mockCurrentStepMessages(undefined));

afterEach(() => vi.mocked(useHaapiStepper).mockReset());

describe('HaapiStepperWebAuthnRegistrationAttachmentCard', () => {
  it("renders the title, description and matching icon from the step's data", () => {
    mockCurrentStepMessages({
      [`${PREFIX}button.platform`]: PLATFORM_TITLE,
      [`${PREFIX}authenticator-attachment.platform`]: PLATFORM_DESCRIPTION,
    });

    const { container } = render(
      <HaapiStepperWebAuthnRegistrationAttachmentCard
        action={createMockWebAuthnPlatformOnlyAnyDeviceAction()}
        onClick={vi.fn()}
      />
    );

    expect(screen.getByText(PLATFORM_TITLE)).toBeInTheDocument();
    expect(screen.getByText(PLATFORM_DESCRIPTION)).toBeInTheDocument();
    expect(container.querySelector('.haapi-stepper-webauthn-registration-attachment-icon svg')).toHaveAttribute(
      'viewBox',
      PLATFORM_ICON_VIEW_BOX
    );
  });

  it('omits the description when the step has no description message, still rendering the icon', () => {
    mockCurrentStepMessages({ [`${PREFIX}button.cross-platform`]: CROSS_PLATFORM_TITLE });

    const { container } = render(
      <HaapiStepperWebAuthnRegistrationAttachmentCard
        action={createMockWebAuthnCrossPlatformOnlyAnyDeviceAction()}
        onClick={vi.fn()}
      />
    );

    const card = screen.getByTestId('webauthn-registration-attachment-card');
    expect(screen.getByText(CROSS_PLATFORM_TITLE)).toBeInTheDocument();
    expect(card.querySelector('.haapi-stepper-webauthn-registration-attachment-description')).toBeNull();
    expect(container.querySelector('.haapi-stepper-webauthn-registration-attachment-icon svg')).toHaveAttribute(
      'viewBox',
      CROSS_PLATFORM_ICON_VIEW_BOX
    );
  });

  it('falls back to the action title when the step carries no view-data', () => {
    mockCurrentStepMessages(undefined);

    render(
      <HaapiStepperWebAuthnRegistrationAttachmentCard
        action={createMockWebAuthnPlatformOnlyAnyDeviceAction()}
        onClick={vi.fn()}
      />
    );

    expect(screen.getByText(webAuthnPlatformOnlyAnyDeviceActionTitle)).toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    mockCurrentStepMessages(undefined);

    render(
      <HaapiStepperWebAuthnRegistrationAttachmentCard
        action={createMockWebAuthnPlatformOnlyAnyDeviceAction()}
        onClick={onClick}
      />
    );

    await user.click(screen.getByTestId('webauthn-registration-attachment-card'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

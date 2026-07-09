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
import { describe, expect, it, vi } from 'vitest';

import {
  createMockWebAuthnCrossPlatformOnlyAnyDeviceAction,
  createMockWebAuthnPlatformOnlyAnyDeviceAction,
} from '../../../../../util/tests/mocks';
import { HaapiStepperWebAuthnRegistrationAttachmentCard } from './HaapiStepperWebAuthnRegistrationAttachmentCard';
import { WebAuthnRegistrationAttachmentKind } from './utils';

const PLATFORM_ICON_VIEW_BOX = '0 0 64.2 83.9';
const CROSS_PLATFORM_ICON_VIEW_BOX = '0 0 49 72.6';

describe('HaapiStepperWebAuthnRegistrationAttachmentCard', () => {
  it('renders the title, description and matching icon resolved in the action webauthn data', () => {
    const action = {
      ...createMockWebAuthnPlatformOnlyAnyDeviceAction(),
      webauthn: {
        registrationAttachment: {
          kind: WebAuthnRegistrationAttachmentKind.PLATFORM,
          title: 'Built-in',
          description: 'A non-removable built-in device.',
        },
      },
    };

    const { container } = render(
      <HaapiStepperWebAuthnRegistrationAttachmentCard
        registrationAttachment={action.webauthn.registrationAttachment}
        onClick={vi.fn()}
      />
    );

    expect(screen.getByText('Built-in')).toBeInTheDocument();
    expect(screen.getByText('A non-removable built-in device.')).toBeInTheDocument();
    expect(container.querySelector('.haapi-stepper-webauthn-registration-attachment-icon svg')).toHaveAttribute(
      'viewBox',
      PLATFORM_ICON_VIEW_BOX
    );
  });

  it('omits the description when the webauthn data has none, still rendering the icon', () => {
    const action = {
      ...createMockWebAuthnCrossPlatformOnlyAnyDeviceAction(),
      webauthn: {
        registrationAttachment: { kind: WebAuthnRegistrationAttachmentKind.CROSS_PLATFORM, title: 'Security key' },
      },
    };

    const { container } = render(
      <HaapiStepperWebAuthnRegistrationAttachmentCard
        registrationAttachment={action.webauthn.registrationAttachment}
        onClick={vi.fn()}
      />
    );

    const card = screen.getByTestId('webauthn-registration-attachment-card');
    expect(screen.getByText('Security key')).toBeInTheDocument();
    expect(card.querySelector('.haapi-stepper-webauthn-registration-attachment-description')).toBeNull();
    expect(container.querySelector('.haapi-stepper-webauthn-registration-attachment-icon svg')).toHaveAttribute(
      'viewBox',
      CROSS_PLATFORM_ICON_VIEW_BOX
    );
  });

  it('calls onClick when the card is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    const action = {
      ...createMockWebAuthnPlatformOnlyAnyDeviceAction(),
      webauthn: { registrationAttachment: { kind: WebAuthnRegistrationAttachmentKind.PLATFORM, title: 'Built-in' } },
    };

    render(
      <HaapiStepperWebAuthnRegistrationAttachmentCard
        registrationAttachment={action.webauthn.registrationAttachment}
        onClick={onClick}
      />
    );

    await user.click(screen.getByTestId('webauthn-registration-attachment-card'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

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

import { createMockWebAuthnPlatformOnlyAnyDeviceAction } from '../../../../../util/tests/mocks';
import {
  HaapiStepperWebAuthnAnyDeviceRegistrationAction,
  HaapiWebAuthnRegistrationAttachment,
  WebAuthnRegistrationAttachmentKind,
} from '../../../../stepper/haapi-stepper.types';
import { HaapiStepperWebAuthnRegistrationAttachmentCard } from './HaapiStepperWebAuthnRegistrationAttachmentCard';

const PLATFORM_TITLE = 'Built-in';
const PLATFORM_DESCRIPTION = 'A non-removable built-in device.';
const PLATFORM_ICON_VIEW_BOX = '0 0 64.2 83.9';
const CROSS_PLATFORM_TITLE = 'Security key';
const CROSS_PLATFORM_ICON_VIEW_BOX = '0 0 49 72.6';

const actionWith = (
  registrationAttachment?: HaapiWebAuthnRegistrationAttachment
): HaapiStepperWebAuthnAnyDeviceRegistrationAction => ({
  ...createMockWebAuthnPlatformOnlyAnyDeviceAction(),
  webauthn: registrationAttachment ? { registrationAttachment } : undefined,
});

describe('HaapiStepperWebAuthnRegistrationAttachmentCard', () => {
  it('renders the title, description and icon resolved from the action attachment', () => {
    const { container } = render(
      <HaapiStepperWebAuthnRegistrationAttachmentCard
        action={actionWith({
          kind: WebAuthnRegistrationAttachmentKind.PLATFORM,
          title: PLATFORM_TITLE,
          description: PLATFORM_DESCRIPTION,
        })}
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

  it('omits the description when the attachment has none, still rendering the icon', () => {
    const { container } = render(
      <HaapiStepperWebAuthnRegistrationAttachmentCard
        action={actionWith({ kind: WebAuthnRegistrationAttachmentKind.CROSS_PLATFORM, title: CROSS_PLATFORM_TITLE })}
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

  it('renders nothing when the action carries no attachment', () => {
    render(<HaapiStepperWebAuthnRegistrationAttachmentCard action={actionWith()} onClick={vi.fn()} />);

    expect(screen.queryByTestId('webauthn-registration-attachment-card')).not.toBeInTheDocument();
  });

  it('calls onClick when the card is clicked', async () => {
    const user = userEvent.setup();
    const onClick = vi.fn();
    render(
      <HaapiStepperWebAuthnRegistrationAttachmentCard
        action={actionWith({ kind: WebAuthnRegistrationAttachmentKind.PLATFORM, title: PLATFORM_TITLE })}
        onClick={onClick}
      />
    );

    await user.click(screen.getByTestId('webauthn-registration-attachment-card'));
    expect(onClick).toHaveBeenCalledOnce();
  });
});

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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';

import { HAAPI_STEPS } from '../../../data-access/types/haapi-step.types';
import {
  createMockExternalBrowserFlowAction,
  createMockStep,
  createMockWebAuthnAnyDeviceBothOptionsAction,
  createMockWebAuthnCrossPlatformOnlyAnyDeviceAction,
  createMockWebAuthnPlatformOnlyAnyDeviceAction,
  createMockWebAuthnRegistrationAction,
  externalBrowserFlowActionTitle,
  webAuthnAnyDeviceActionTitle,
  webAuthnRegistrationActionTitle,
} from '../../../util/tests/mocks';
import { HaapiStepperActionsUI } from '../../../ui/actions/HaapiStepperActionsUI';
import { HaapiStepperClientOperationUI } from './HaapiStepperClientOperationUI';
import type { HaapiStepperStep } from '../../stepper/haapi-stepper.types';
import { useHaapiStepper } from '../../stepper/HaapiStepperHook';
import { useIsWebAuthnPlatformAuthenticatorAvailable } from './operations/webauthn/useIsWebAuthnPlatformAuthenticatorAvailable';

const PLATFORM_TITLE = 'Built-in';
const PLATFORM_DESCRIPTION = 'A non-removable built-in device.';
const PLATFORM_ICON_VIEW_BOX = '0 0 64.2 83.9';
const CROSS_PLATFORM_TITLE = 'Security key';
const CROSS_PLATFORM_DESCRIPTION =
  'A security key, such as a portable key attached through USB or wirelessly through NFC.';
const CROSS_PLATFORM_ICON_VIEW_BOX = '0 0 49 72.6';
const MESSAGE_PREFIX = 'authenticator.webauthn.register.view.';
const VIEW_DATA_MESSAGES = {
  [`${MESSAGE_PREFIX}button.platform`]: PLATFORM_TITLE,
  [`${MESSAGE_PREFIX}button.cross-platform`]: CROSS_PLATFORM_TITLE,
  [`${MESSAGE_PREFIX}authenticator-attachment.platform`]: PLATFORM_DESCRIPTION,
  [`${MESSAGE_PREFIX}authenticator-attachment.cross-platform`]: CROSS_PLATFORM_DESCRIPTION,
};

vi.mock('./operations/webauthn/useIsWebAuthnPlatformAuthenticatorAvailable', () => ({
  useIsWebAuthnPlatformAuthenticatorAvailable: vi.fn(() => undefined),
}));

// The attachment card resolves its copy from the current step's viewData messages via
// `useHaapiStepper`; tests drive that copy through the mocked hook.
vi.mock('../../stepper/HaapiStepperHook', () => ({ useHaapiStepper: vi.fn() }));

const mockCurrentStepMessages = (messages?: Record<string, string>) =>
  vi.mocked(useHaapiStepper).mockReturnValue({
    currentStep: (messages ? { metadata: { viewData: { messages } } } : null) as HaapiStepperStep | null,
  } as ReturnType<typeof useHaapiStepper>);

describe('HaapiStepperClientOperationUI', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    mockCurrentStepMessages(VIEW_DATA_MESSAGES);
  });

  afterEach(() => {
    vi.mocked(useHaapiStepper).mockReset();
  });

  describe('Default rendering', () => {
    it('renders the action title as an enabled button', () => {
      const action = createMockExternalBrowserFlowAction();

      render(<HaapiStepperClientOperationUI action={action} onAction={vi.fn()} />);

      expect(screen.getByRole('button', { name: externalBrowserFlowActionTitle })).toBeEnabled();
    });

    it('does not render a progress bar when the action has no remaining wait time', () => {
      const action = createMockExternalBrowserFlowAction();

      render(<HaapiStepperClientOperationUI action={action} onAction={vi.fn()} />);

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });

    it('forwards the action to onAction when clicked', async () => {
      const action = createMockExternalBrowserFlowAction();
      const onAction = vi.fn();

      render(<HaapiStepperClientOperationUI action={action} onAction={onAction} />);

      await user.click(screen.getByRole('button', { name: externalBrowserFlowActionTitle }));

      expect(onAction).toHaveBeenCalledTimes(1);
      expect(onAction).toHaveBeenCalledWith(action);
    });
  });

  describe('WebAuthn', () => {
    afterEach(() => {
      vi.unstubAllGlobals();
      vi.mocked(useIsWebAuthnPlatformAuthenticatorAvailable).mockReset();
    });

    it('enables the button when the WebAuthn API is available', () => {
      vi.stubGlobal('PublicKeyCredential', stubPublicKeyCredential());
      const action = createMockWebAuthnRegistrationAction();

      render(<HaapiStepperClientOperationUI action={action} onAction={vi.fn()} />);

      expect(screen.getByRole('button', { name: webAuthnRegistrationActionTitle })).toBeEnabled();
    });

    it('disables the button when the WebAuthn API is unavailable', () => {
      // jsdom does not expose `PublicKeyCredential`, so `isWebAuthnApiSupported()` returns false
      // and the gate disables WebAuthn buttons.
      const action = createMockWebAuthnRegistrationAction();

      render(<HaapiStepperClientOperationUI action={action} onAction={vi.fn()} />);

      expect(screen.getByRole('button', { name: webAuthnRegistrationActionTitle })).toBeDisabled();
    });

    it('renders a default button (not a card) for passkeys-mode registration', () => {
      const action = createMockWebAuthnRegistrationAction();

      render(<HaapiStepperClientOperationUI action={action} onAction={vi.fn()} />);

      expect(screen.queryByTestId('webauthn-registration-attachment-card')).not.toBeInTheDocument();
      expect(screen.getByRole('button', { name: webAuthnRegistrationActionTitle })).toBeInTheDocument();
    });

    it('disables a platform-only any-device registration when no platform authenticator is available', () => {
      vi.stubGlobal('PublicKeyCredential', stubPublicKeyCredential());
      vi.mocked(useIsWebAuthnPlatformAuthenticatorAvailable).mockReturnValue(false);
      const action = createMockWebAuthnPlatformOnlyAnyDeviceAction();

      render(<HaapiStepperClientOperationUI action={action} onAction={vi.fn()} />);

      expect(screen.getByTestId('webauthn-registration-attachment-card')).toBeDisabled();
    });

    describe('WebAuthn registration attachment card (any device mode (platform/cross-platform))', () => {
      it.each([
        {
          name: 'platform',
          makeAction: createMockWebAuthnPlatformOnlyAnyDeviceAction,
          title: PLATFORM_TITLE,
          description: PLATFORM_DESCRIPTION,
          iconViewBox: PLATFORM_ICON_VIEW_BOX,
        },
        {
          name: 'cross-platform',
          makeAction: createMockWebAuthnCrossPlatformOnlyAnyDeviceAction,
          title: CROSS_PLATFORM_TITLE,
          description: CROSS_PLATFORM_DESCRIPTION,
          iconViewBox: CROSS_PLATFORM_ICON_VIEW_BOX,
        },
      ])(
        'renders the $name attachment option as a card (title, description and matching icon)',
        ({ makeAction, title, description, iconViewBox }) => {
          const { container } = render(<HaapiStepperClientOperationUI action={makeAction()} onAction={vi.fn()} />);

          expect(screen.getByTestId('webauthn-registration-attachment-card')).toBeInTheDocument();
          expect(screen.getByText(title)).toBeInTheDocument();
          expect(screen.getByText(description)).toBeInTheDocument();
          expect(container.querySelector('.haapi-stepper-webauthn-registration-attachment-icon svg')).toHaveAttribute(
            'viewBox',
            iconViewBox
          );
        }
      );

      it('renders one card per option for a both-options any-device registration', () => {
        const step = createMockStep(HAAPI_STEPS.REGISTRATION, {
          actions: [createMockWebAuthnAnyDeviceBothOptionsAction()],
        });

        render(<HaapiStepperActionsUI actions={step.dataHelpers.actions?.all} onAction={vi.fn()} />);

        expect(screen.getAllByTestId('webauthn-registration-attachment-card')).toHaveLength(2);
        expect(screen.getByText(PLATFORM_TITLE)).toBeInTheDocument();
        expect(screen.getByText(CROSS_PLATFORM_TITLE)).toBeInTheDocument();
      });

      it('renders the cards with the split action titles as fallback when the step carries no messages', () => {
        mockCurrentStepMessages(undefined);
        const step = createMockStep(HAAPI_STEPS.REGISTRATION, {
          actions: [createMockWebAuthnAnyDeviceBothOptionsAction()],
        });

        render(<HaapiStepperActionsUI actions={step.dataHelpers.actions?.all} onAction={vi.fn()} />);

        const cards = screen.getAllByTestId('webauthn-registration-attachment-card');
        expect(cards).toHaveLength(2);
        expect(screen.getByText(`${webAuthnAnyDeviceActionTitle} (Built-in)`)).toBeInTheDocument();
        expect(screen.getByText(`${webAuthnAnyDeviceActionTitle} (Security key)`)).toBeInTheDocument();
        expect(cards[0].querySelector('.haapi-stepper-webauthn-registration-attachment-description')).toBeNull();
        expect(cards[1].querySelector('.haapi-stepper-webauthn-registration-attachment-description')).toBeNull();
      });
    });
  });
});

/**
 * Minimal stand-in for the static `PublicKeyCredential` interface — enough for
 * `isWebAuthnApiSupported()` to return true and for the platform-authenticator hook to resolve.
 * jsdom doesn't expose `PublicKeyCredential`, so tests stub it to emulate a WebAuthn-capable
 * browser without reaching into the real `navigator.credentials` API.
 */
const stubPublicKeyCredential = () =>
  Object.assign(vi.fn(), {
    parseCreationOptionsFromJSON: vi.fn(),
    parseRequestOptionsFromJSON: vi.fn(),
    isUserVerifyingPlatformAuthenticatorAvailable: vi.fn(() => Promise.resolve(true)),
  });

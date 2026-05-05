/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
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
  createMockBankIdAction,
  createMockExternalBrowserFlowAction,
  createMockStep,
  createMockWebAuthnAnyDeviceBothOptionsAction,
  createMockWebAuthnPlatformOnlyAnyDeviceAction,
  createMockWebAuthnRegistrationAction,
  externalBrowserFlowActionTitle,
  webAuthnAnyDeviceActionTitle,
  webAuthnPlatformOnlyAnyDeviceActionTitle,
  webAuthnRegistrationActionTitle,
} from '../../../util/tests/mocks';
import { HaapiStepperActionsUI } from '../../../ui/actions/HaapiStepperActionsUI';
import { HaapiStepperClientOperationUI } from './HaapiStepperClientOperationUI';
import { useIsWebAuthnPlatformAuthenticatorAvailable } from './operations/webauthn';

vi.mock('./operations/webauthn', async () => {
  const actual = await vi.importActual('./operations/webauthn');
  return {
    ...(actual as object),
    useIsWebAuthnPlatformAuthenticatorAvailable: vi.fn(() => undefined),
  };
});

describe('HaapiStepperClientOperationUI', () => {
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
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

  describe('BankID polling progress', () => {
    it('renders a progress bar reflecting the session remaining time', () => {
      const action = createMockBankIdAction({ maxWaitTime: 60, maxWaitRemainingTime: 30 });

      render(<HaapiStepperClientOperationUI action={action} onAction={vi.fn()} />);

      const progress = screen.getByRole('progressbar');
      expect(progress).toHaveAttribute('value', '30');
      expect(progress).toHaveAttribute('max', '60');
    });

    it('hides the progress bar when showBankIdSessionTimeLeft is false', () => {
      const action = createMockBankIdAction({ maxWaitTime: 60, maxWaitRemainingTime: 30 });

      render(<HaapiStepperClientOperationUI action={action} onAction={vi.fn()} showBankIdSessionTimeLeft={false} />);

      expect(screen.queryByRole('progressbar')).not.toBeInTheDocument();
    });
  });

  describe('WebAuthn registration', () => {
    describe('when the WebAuthn API is available', () => {
      beforeEach(() => {
        vi.stubGlobal('PublicKeyCredential', stubPublicKeyCredential());
      });

      afterEach(() => {
        vi.unstubAllGlobals();
      });

      it('enables the button', () => {
        const action = createMockWebAuthnRegistrationAction();

        render(<HaapiStepperClientOperationUI action={action} onAction={vi.fn()} />);

        expect(screen.getByRole('button', { name: webAuthnRegistrationActionTitle })).toBeEnabled();
      });

      it('disables the button for platform-only any-device registration when platform authenticator is unavailable', () => {
        vi.mocked(useIsWebAuthnPlatformAuthenticatorAvailable).mockReturnValue(false);
        const action = createMockWebAuthnPlatformOnlyAnyDeviceAction();

        render(<HaapiStepperClientOperationUI action={action} onAction={vi.fn()} />);

        expect(screen.getByRole('button', { name: webAuthnPlatformOnlyAnyDeviceActionTitle })).toBeDisabled();
      });
    });

    it('disables the button when the WebAuthn API is not available', () => {
      // PublicKeyCredential is not stubbed — WebAuthn API unavailable
      const action = createMockWebAuthnRegistrationAction();

      render(<HaapiStepperClientOperationUI action={action} onAction={vi.fn()} />);

      expect(screen.getByRole('button', { name: webAuthnRegistrationActionTitle })).toBeDisabled();
    });
  });

  describe('WebAuthn any-device split (integration)', () => {
    it('renders one button per credential option when both are offered, suffixing the original title', () => {
      const action = createMockWebAuthnAnyDeviceBothOptionsAction();
      const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, { actions: [action] });

      render(<HaapiStepperActionsUI actions={step.dataHelpers.actions?.all} onAction={vi.fn()} />);

      expect(screen.getByRole('button', { name: `${webAuthnAnyDeviceActionTitle} (This device)` })).toBeInTheDocument();
      expect(
        screen.getByRole('button', { name: `${webAuthnAnyDeviceActionTitle} (Another device)` })
      ).toBeInTheDocument();
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

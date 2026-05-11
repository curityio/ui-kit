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
import { runWebAuthnAuthentication, runWebAuthnRegistration } from './webauthn';
import {
  createMockWebAuthnAuthenticationAction,
  createMockWebAuthnCrossPlatformOnlyAnyDeviceAction,
  createMockWebAuthnPlatformOnlyAnyDeviceAction,
  createMockWebAuthnRegistrationAction,
} from '../../../../../util/tests/mocks';

describe('webauthn', () => {
  const abortSignal = new AbortController().signal;

  beforeEach(() => {
    vi.clearAllMocks();
    vi.stubGlobal('PublicKeyCredential', stubPublicKeyCredential());
    installNavigatorCredentials();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreNavigatorCredentials();
  });

  describe('runWebAuthnRegistration', () => {
    it('throws when WebAuthn API is not supported', async () => {
      vi.unstubAllGlobals();
      const action = createMockWebAuthnRegistrationAction();

      await expect(runWebAuthnRegistration(action, abortSignal)).rejects.toMatchObject({
        message: 'WebAuthn API is not supported in this browser',
      });
    });

    it('throws when navigator.credentials.create returns null', async () => {
      mockCredentialsCreate.mockResolvedValue(null);
      const action = createMockWebAuthnRegistrationAction();

      await expect(runWebAuthnRegistration(action, abortSignal)).rejects.toMatchObject({
        message: 'Could not create credential',
      });
    });

    describe('passkey', () => {
      it('parses credentialCreationOptions, creates a credential, and returns a continuation under "credential"', async () => {
        const parsedOptions = { challenge: 'parsed' };
        const credentialJSON = { id: 'passkey-cred', type: 'public-key' };

        mockParseCreationOptionsFromJSON.mockReturnValue(parsedOptions);
        mockCredentialsCreate.mockResolvedValue(mockCredential(credentialJSON));

        const action = createMockWebAuthnRegistrationAction();
        const result = await runWebAuthnRegistration(action, abortSignal);

        expect(mockParseCreationOptionsFromJSON).toHaveBeenCalledWith(
          action.model.arguments.credentialCreationOptions.publicKey
        );
        expect(mockCredentialsCreate).toHaveBeenCalledWith({ publicKey: parsedOptions, signal: abortSignal });
        expect(result).toEqual({
          action: action.model.continueActions[0],
          payload: { credential: credentialJSON },
        });
      });
    });

    describe('any-device', () => {
      it('platform-only: parses platformCredentialCreationOptions, creates a credential, and returns a continuation under "platformCredential"', async () => {
        const parsedOptions = { challenge: 'platform' };
        const credentialJSON = { id: 'platform-cred', type: 'public-key' };

        mockParseCreationOptionsFromJSON.mockReturnValue(parsedOptions);
        mockCredentialsCreate.mockResolvedValue(mockCredential(credentialJSON));

        const action = createMockWebAuthnPlatformOnlyAnyDeviceAction();
        const result = await runWebAuthnRegistration(action, abortSignal);

        expect(mockParseCreationOptionsFromJSON).toHaveBeenCalledWith(
          action.model.arguments.platformCredentialCreationOptions?.publicKey
        );
        expect(mockCredentialsCreate).toHaveBeenCalledWith({ publicKey: parsedOptions, signal: abortSignal });
        expect(result).toEqual({
          action: action.model.continueActions[0],
          payload: { platformCredential: credentialJSON },
        });
      });

      it('cross-platform-only: parses crossPlatformCredentialCreationOptions, creates a credential, and returns a continuation under "crossPlatformCredential"', async () => {
        const parsedOptions = { challenge: 'cross-platform' };
        const credentialJSON = { id: 'cross-platform-cred', type: 'public-key' };

        mockParseCreationOptionsFromJSON.mockReturnValue(parsedOptions);
        mockCredentialsCreate.mockResolvedValue(mockCredential(credentialJSON));

        const action = createMockWebAuthnCrossPlatformOnlyAnyDeviceAction();
        const result = await runWebAuthnRegistration(action, abortSignal);

        expect(mockParseCreationOptionsFromJSON).toHaveBeenCalledWith(
          action.model.arguments.crossPlatformCredentialCreationOptions?.publicKey
        );
        expect(mockCredentialsCreate).toHaveBeenCalledWith({ publicKey: parsedOptions, signal: abortSignal });
        expect(result).toEqual({
          action: action.model.continueActions[0],
          payload: { crossPlatformCredential: credentialJSON },
        });
      });
    });
  });

  describe('runWebAuthnAuthentication', () => {
    it('throws when WebAuthn API is not supported', async () => {
      vi.unstubAllGlobals();
      const action = createMockWebAuthnAuthenticationAction();

      await expect(runWebAuthnAuthentication(action, abortSignal)).rejects.toMatchObject({
        message: 'WebAuthn API is not supported in this browser',
      });
    });

    it('throws when navigator.credentials.get returns null', async () => {
      mockCredentialsGet.mockResolvedValue(null);
      const action = createMockWebAuthnAuthenticationAction();

      await expect(runWebAuthnAuthentication(action, abortSignal)).rejects.toMatchObject({
        message: 'Could not get credential',
      });
    });

    it('parses credentialRequestOptions, gets a credential, and returns a continuation under "credential"', async () => {
      const parsedOptions = { challenge: 'auth' };
      const credentialJSON = { id: 'auth-cred', type: 'public-key' };

      mockParseRequestOptionsFromJSON.mockReturnValue(parsedOptions);
      mockCredentialsGet.mockResolvedValue(mockCredential(credentialJSON));

      const action = createMockWebAuthnAuthenticationAction();
      const result = await runWebAuthnAuthentication(action, abortSignal);

      expect(mockParseRequestOptionsFromJSON).toHaveBeenCalledWith(
        action.model.arguments.credentialRequestOptions.publicKey
      );
      expect(mockCredentialsGet).toHaveBeenCalledWith({ publicKey: parsedOptions, signal: abortSignal });
      expect(result).toEqual({
        action: action.model.continueActions[0],
        payload: { credential: credentialJSON },
      });
    });
  });
});

const mockParseCreationOptionsFromJSON = vi.fn();
const mockParseRequestOptionsFromJSON = vi.fn();
const mockCredentialsCreate = vi.fn();
const mockCredentialsGet = vi.fn();

const stubPublicKeyCredential = () =>
  Object.assign(vi.fn(), {
    parseCreationOptionsFromJSON: mockParseCreationOptionsFromJSON,
    parseRequestOptionsFromJSON: mockParseRequestOptionsFromJSON,
  });

const installNavigatorCredentials = () => {
  Object.defineProperty(navigator, 'credentials', {
    configurable: true,
    value: { create: mockCredentialsCreate, get: mockCredentialsGet },
  });
};

const restoreNavigatorCredentials = () => {
  Reflect.deleteProperty(navigator, 'credentials');
};

const mockCredential = (toJSONResult: unknown = { id: 'cred-id', type: 'public-key' }) => ({
  toJSON: vi.fn(() => toJSONResult),
});

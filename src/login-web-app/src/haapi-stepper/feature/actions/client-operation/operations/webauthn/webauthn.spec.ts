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
import { HAAPI_PROBLEM_STEPS, HAAPI_STEPS, HaapiStep } from '../../../../../data-access/types/haapi-step.types';
import {
  createMockStep,
  createMockWebAuthnAuthenticationAction,
  createMockWebAuthnCrossPlatformOnlyAnyDeviceAction,
  createMockWebAuthnPlatformOnlyAnyDeviceAction,
  createMockWebAuthnRegistrationAction,
} from '../../../../../util/tests/mocks';

describe('webauthn', () => {
  const abortSignal = new AbortController().signal;
  const stepWithoutMetadata: HaapiStep | null = null;

  beforeEach(() => {
    vi.clearAllMocks();
    mockParseCreationOptionsFromJSON.mockReset();
    mockParseRequestOptionsFromJSON.mockReset();
    mockCredentialsCreate.mockReset();
    mockCredentialsGet.mockReset();
    vi.stubGlobal('PublicKeyCredential', stubPublicKeyCredential());
    installNavigatorCredentials();
  });

  afterEach(() => {
    vi.unstubAllGlobals();
    restoreNavigatorCredentials();
  });

  describe('runWebAuthnRegistration', () => {
    describe('success', () => {
      describe('passkey', () => {
        it('parses credentialCreationOptions, creates a credential, and returns a continuation under "credential"', async () => {
          const parsedOptions = { challenge: 'parsed' };
          const credentialJSON = { id: 'passkey-cred', type: 'public-key' };

          mockParseCreationOptionsFromJSON.mockReturnValue(parsedOptions);
          mockCredentialsCreate.mockResolvedValue(mockCredential(credentialJSON));

          const action = createMockWebAuthnRegistrationAction();
          const result = await runWebAuthnRegistration(action, abortSignal, stepWithoutMetadata);

          expect(mockParseCreationOptionsFromJSON).toHaveBeenCalledWith(
            action.model.arguments.credentialCreationOptions.publicKey
          );
          expect(mockCredentialsCreate).toHaveBeenCalledWith({ publicKey: parsedOptions, signal: abortSignal });
          expect(result).toEqual({
            clientOperationData: {
              action: action.model.continueActions[0],
              payload: { credential: credentialJSON },
            },
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
          const result = await runWebAuthnRegistration(action, abortSignal, stepWithoutMetadata);

          expect(mockParseCreationOptionsFromJSON).toHaveBeenCalledWith(
            action.model.arguments.platformCredentialCreationOptions?.publicKey
          );
          expect(mockCredentialsCreate).toHaveBeenCalledWith({ publicKey: parsedOptions, signal: abortSignal });
          expect(result).toEqual({
            clientOperationData: {
              action: action.model.continueActions[0],
              payload: { platformCredential: credentialJSON },
            },
          });
        });

        it('cross-platform-only: parses crossPlatformCredentialCreationOptions, creates a credential, and returns a continuation under "crossPlatformCredential"', async () => {
          const parsedOptions = { challenge: 'cross-platform' };
          const credentialJSON = { id: 'cross-platform-cred', type: 'public-key' };

          mockParseCreationOptionsFromJSON.mockReturnValue(parsedOptions);
          mockCredentialsCreate.mockResolvedValue(mockCredential(credentialJSON));

          const action = createMockWebAuthnCrossPlatformOnlyAnyDeviceAction();
          const result = await runWebAuthnRegistration(action, abortSignal, stepWithoutMetadata);

          expect(mockParseCreationOptionsFromJSON).toHaveBeenCalledWith(
            action.model.arguments.crossPlatformCredentialCreationOptions?.publicKey
          );
          expect(mockCredentialsCreate).toHaveBeenCalledWith({ publicKey: parsedOptions, signal: abortSignal });
          expect(result).toEqual({
            clientOperationData: {
              action: action.model.continueActions[0],
              payload: { crossPlatformCredential: credentialJSON },
            },
          });
        });
      });
    });

    describe('error', () => {
      const cancelStep = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
        metadata: {
          viewData: {
            error: { clientOperation: { webauthn: { cancelOrTimeout: 'You cancelled the registration.' } } },
          },
        },
      });
      const failedStep = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
        metadata: {
          viewData: { error: { clientOperation: { webauthn: { registration: 'Registration failed.' } } } },
        },
      });

      it('WebAuthn API not supported → registrationError copy', async () => {
        vi.unstubAllGlobals();

        await expect(
          runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, failedStep)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: failedStep.metadata?.viewData?.error?.clientOperation?.webauthn?.registration }],
            },
          },
        });
      });

      it('navigator.credentials.create returns null → cancelOrTimeoutError copy', async () => {
        mockCredentialsCreate.mockResolvedValue(null);

        await expect(
          runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, cancelStep)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: cancelStep.metadata?.viewData?.error?.clientOperation?.webauthn?.cancelOrTimeout }],
            },
          },
        });
      });

      describe('parseCreationOptionsFromJSON throws', () => {
        it.each(['EncodingError', 'SecurityError'] as const)(
          '%s → registrationError copy (failed bucket)',
          async errorName => {
            mockParseCreationOptionsFromJSON.mockImplementation(() => {
              throw new DOMException(`${errorName} message`, errorName);
            });

            await expect(
              runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, failedStep)
            ).resolves.toMatchObject({
              clientOperationError: {
                app: {
                  type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                  messages: [{ text: failedStep.metadata?.viewData?.error?.clientOperation?.webauthn?.registration }],
                },
              },
            });
          }
        );
      });

      describe('navigator.credentials.create throws', () => {
        it.each([
          ['NotAllowedError', new DOMException('user cancelled', 'NotAllowedError')],
          ['AbortError (non-caller-triggered, signal not aborted)', new DOMException('internal timeout', 'AbortError')],
        ] as const)('%s → cancelOrTimeoutError copy', async (_label, error) => {
          mockCredentialsCreate.mockRejectedValue(error);

          await expect(
            runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, cancelStep)
          ).resolves.toMatchObject({
            clientOperationError: {
              app: {
                type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                messages: [{ text: cancelStep.metadata?.viewData?.error?.clientOperation?.webauthn?.cancelOrTimeout }],
              },
            },
          });
        });

        it.each([
          ['TypeError', new TypeError('bad options')],
          ['arbitrary non-DOMException', new Error('something else')],
        ] as const)('%s → registrationError copy (failed bucket)', async (_label, error) => {
          mockCredentialsCreate.mockRejectedValue(error);

          await expect(
            runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, failedStep)
          ).resolves.toMatchObject({
            clientOperationError: {
              app: {
                type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                messages: [{ text: failedStep.metadata?.viewData?.error?.clientOperation?.webauthn?.registration }],
              },
            },
          });
        });
      });

      it('falls back to no message when the matching metadata key is absent (BE has not emitted it yet)', async () => {
        mockCredentialsCreate.mockResolvedValue(null);
        const step = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
          metadata: { templateArea: 'lwa', viewName: 'unrelated' },
        });

        await expect(
          runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, step)
        ).resolves.toMatchObject({
          clientOperationError: { app: { type: HAAPI_PROBLEM_STEPS.UNEXPECTED, messages: [] } },
        });
      });

      it('falls back to no message when currentStep is null', async () => {
        mockCredentialsCreate.mockResolvedValue(null);

        await expect(
          runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, null)
        ).resolves.toMatchObject({
          clientOperationError: { app: { type: HAAPI_PROBLEM_STEPS.UNEXPECTED, messages: [] } },
        });
      });
    });
  });

  describe('runWebAuthnAuthentication', () => {
    it('parses credentialRequestOptions, gets a credential, and returns a continuation under "credential"', async () => {
      const parsedOptions = { challenge: 'auth' };
      const credentialJSON = { id: 'auth-cred', type: 'public-key' };

      mockParseRequestOptionsFromJSON.mockReturnValue(parsedOptions);
      mockCredentialsGet.mockResolvedValue(mockCredential(credentialJSON));

      const action = createMockWebAuthnAuthenticationAction();
      const result = await runWebAuthnAuthentication(action, abortSignal, stepWithoutMetadata);

      expect(mockParseRequestOptionsFromJSON).toHaveBeenCalledWith(
        action.model.arguments.credentialRequestOptions.publicKey
      );
      expect(mockCredentialsGet).toHaveBeenCalledWith({ publicKey: parsedOptions, signal: abortSignal });
      expect(result).toEqual({
        clientOperationData: {
          action: action.model.continueActions[0],
          payload: { credential: credentialJSON },
        },
      });
    });

    describe('error', () => {
      const cancelStep = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
        metadata: {
          viewData: { error: { clientOperation: { webauthn: { cancelOrTimeout: 'You cancelled the sign-in.' } } } },
        },
      });
      const failedStep = createMockStep(HAAPI_STEPS.AUTHENTICATION, {
        metadata: {
          viewData: { error: { clientOperation: { webauthn: { authentication: 'Authentication failed.' } } } },
        },
      });

      it('WebAuthn API not supported → authenticationError copy (failed bucket)', async () => {
        vi.unstubAllGlobals();

        await expect(
          runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, failedStep)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: failedStep.metadata?.viewData?.error?.clientOperation?.webauthn?.authentication }],
            },
          },
        });
      });

      it('navigator.credentials.get returns null → cancelOrTimeoutError copy', async () => {
        mockCredentialsGet.mockResolvedValue(null);

        await expect(
          runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, cancelStep)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: cancelStep.metadata?.viewData?.error?.clientOperation?.webauthn?.cancelOrTimeout }],
            },
          },
        });
      });

      it('parseRequestOptionsFromJSON throws SecurityError → authenticationError copy', async () => {
        mockParseRequestOptionsFromJSON.mockImplementation(() => {
          throw new DOMException('rp id mismatch', 'SecurityError');
        });

        await expect(
          runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, failedStep)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: failedStep.metadata?.viewData?.error?.clientOperation?.webauthn?.authentication }],
            },
          },
        });
      });

      describe('navigator.credentials.get throws', () => {
        it.each(['NotAllowedError', 'AbortError'])('%s → cancelOrTimeoutError copy', async errorName => {
          mockCredentialsGet.mockRejectedValue(new DOMException(`${errorName} message`, errorName));

          await expect(
            runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, cancelStep)
          ).resolves.toMatchObject({
            clientOperationError: {
              app: {
                type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                messages: [{ text: cancelStep.metadata?.viewData?.error?.clientOperation?.webauthn?.cancelOrTimeout }],
              },
            },
          });
        });

        it.each(['TimeoutError', 'NetworkError', 'IdentityCredentialError', 'SecurityError'])(
          '%s → authenticationError copy (failed bucket)',
          async errorName => {
            mockCredentialsGet.mockRejectedValue(new DOMException(`${errorName} message`, errorName));

            await expect(
              runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, failedStep)
            ).resolves.toMatchObject({
              clientOperationError: {
                app: {
                  type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                  messages: [{ text: failedStep.metadata?.viewData?.error?.clientOperation?.webauthn?.authentication }],
                },
              },
            });
          }
        );
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

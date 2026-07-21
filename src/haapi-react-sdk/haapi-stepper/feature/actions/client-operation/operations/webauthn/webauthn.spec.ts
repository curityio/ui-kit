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
import { runWebAuthnAuthentication, runWebAuthnRegistration, WEBAUTHN_ERROR_MESSAGES } from './webauthn';
import { HAAPI_PROBLEM_STEPS, HaapiStep } from '../../../../../data-access/types/haapi-step.types';
import {
  createMockWebAuthnAuthenticationAction,
  createMockWebAuthnCrossPlatformOnlyAnyDeviceAction,
  createMockWebAuthnPlatformOnlyAnyDeviceAction,
  createMockWebAuthnRegistrationAction,
} from '../../../../../util/tests/mocks';

describe('webauthn', () => {
  const abortSignal = new AbortController().signal;
  const stepWithoutMetadata: HaapiStep | null = null;

  const stepWithMessages = (messages: Record<string, string>): HaapiStep =>
    ({ metadata: { viewData: { messages } } }) as HaapiStep;

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
      it('WebAuthn API not supported → notSupported copy', async () => {
        vi.unstubAllGlobals();

        await expect(
          runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, stepWithoutMetadata)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: WEBAUTHN_ERROR_MESSAGES.notSupported }],
            },
          },
        });

        // passkeys prefix — the suffix match resolves the copy regardless of the authenticator prefix
        const localizedErrorMessage = 'Passkeys stöds inte i denna webbläsare.';
        const localizedStep = stepWithMessages({
          'authenticator.passkeys.register.view.error.not-supported': localizedErrorMessage,
        });
        await expect(
          runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, localizedStep)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: localizedErrorMessage }],
            },
          },
        });
      });

      it('navigator.credentials.create returns null → registration copy', async () => {
        mockCredentialsCreate.mockResolvedValue(null);

        await expect(
          runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, stepWithoutMetadata)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: WEBAUTHN_ERROR_MESSAGES.registration }],
            },
          },
        });

        const localizedErrorMessage = 'Kunde inte registrera enheten.';
        const localizedStep = stepWithMessages({
          'authenticator.webauthn.register.view.error.registration': localizedErrorMessage,
        });
        await expect(
          runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, localizedStep)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: localizedErrorMessage }],
            },
          },
        });
      });

      it('falls back to the English copy when the server message is an empty string', async () => {
        mockCredentialsCreate.mockResolvedValue(null);
        const stepWithEmptyMessage = stepWithMessages({
          'authenticator.webauthn.register.view.error.registration': '',
        });

        await expect(
          runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, stepWithEmptyMessage)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: WEBAUTHN_ERROR_MESSAGES.registration }],
            },
          },
        });
      });

      describe('parseCreationOptionsFromJSON throws', () => {
        it.each(['EncodingError', 'SecurityError'] as const)(
          '%s → registration copy (failed bucket)',
          async errorName => {
            mockParseCreationOptionsFromJSON.mockImplementation(() => {
              throw new DOMException(`${errorName} message`, errorName);
            });

            await expect(
              runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, stepWithoutMetadata)
            ).resolves.toMatchObject({
              clientOperationError: {
                app: {
                  type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                  messages: [{ text: WEBAUTHN_ERROR_MESSAGES.registration }],
                },
              },
            });

            const localizedErrorMessage = 'Kunde inte registrera enheten.';
            const localizedStep = stepWithMessages({
              'authenticator.webauthn.register.view.error.registration': localizedErrorMessage,
            });
            await expect(
              runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, localizedStep)
            ).resolves.toMatchObject({
              clientOperationError: {
                app: {
                  type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                  messages: [{ text: localizedErrorMessage }],
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
        ] as const)('%s → cancelOrTimeout copy', async (_label, error) => {
          mockCredentialsCreate.mockRejectedValue(error);

          await expect(
            runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, stepWithoutMetadata)
          ).resolves.toMatchObject({
            clientOperationError: {
              app: {
                type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                messages: [{ text: WEBAUTHN_ERROR_MESSAGES.cancelOrTimeout }],
              },
            },
          });

          const localizedErrorMessage = 'Avbröts eller tog för lång tid.';
          const localizedStep = stepWithMessages({
            'authenticator.webauthn.register.view.error.cancel-or-timeout': localizedErrorMessage,
          });
          await expect(
            runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, localizedStep)
          ).resolves.toMatchObject({
            clientOperationError: {
              app: {
                type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                messages: [{ text: localizedErrorMessage }],
              },
            },
          });
        });

        it.each([
          ['TypeError', new TypeError('bad options')],
          ['arbitrary non-DOMException', new Error('something else')],
        ] as const)(
          '%s → rethrows so the React error boundary catches the programming bug (does not map to "Registration failed")',
          async (_label, error) => {
            mockCredentialsCreate.mockRejectedValue(error);

            await expect(
              runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, stepWithoutMetadata)
            ).rejects.toBe(error);
          }
        );
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
      it('WebAuthn API not supported → notSupported copy', async () => {
        vi.unstubAllGlobals();

        await expect(
          runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, stepWithoutMetadata)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: WEBAUTHN_ERROR_MESSAGES.notSupported }],
            },
          },
        });

        const localizedErrorMessage = 'Passkeys stöds inte i denna webbläsare.';
        const localizedStep = stepWithMessages({
          'authenticator.passkeys.authenticate-device.view.error.not-supported': localizedErrorMessage,
        });
        await expect(
          runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, localizedStep)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: localizedErrorMessage }],
            },
          },
        });
      });

      it('navigator.credentials.get returns null → authentication copy', async () => {
        mockCredentialsGet.mockResolvedValue(null);

        await expect(
          runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, stepWithoutMetadata)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: WEBAUTHN_ERROR_MESSAGES.authentication }],
            },
          },
        });

        const localizedErrorMessage = 'Kunde inte autentisera.';
        const localizedStep = stepWithMessages({
          'authenticator.webauthn.authenticate-device.view.error.authentication': localizedErrorMessage,
        });
        await expect(
          runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, localizedStep)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: localizedErrorMessage }],
            },
          },
        });
      });

      it('parseRequestOptionsFromJSON throws SecurityError → authentication copy', async () => {
        mockParseRequestOptionsFromJSON.mockImplementation(() => {
          throw new DOMException('rp id mismatch', 'SecurityError');
        });

        await expect(
          runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, stepWithoutMetadata)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: WEBAUTHN_ERROR_MESSAGES.authentication }],
            },
          },
        });

        const localizedErrorMessage = 'Kunde inte autentisera.';
        const localizedStep = stepWithMessages({
          'authenticator.webauthn.authenticate-device.view.error.authentication': localizedErrorMessage,
        });
        await expect(
          runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, localizedStep)
        ).resolves.toMatchObject({
          clientOperationError: {
            app: {
              type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
              messages: [{ text: localizedErrorMessage }],
            },
          },
        });
      });

      describe('navigator.credentials.get throws', () => {
        it.each(['NotAllowedError', 'AbortError'])('%s → cancelOrTimeout copy', async errorName => {
          mockCredentialsGet.mockRejectedValue(new DOMException(`${errorName} message`, errorName));

          await expect(
            runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, stepWithoutMetadata)
          ).resolves.toMatchObject({
            clientOperationError: {
              app: {
                type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                messages: [{ text: WEBAUTHN_ERROR_MESSAGES.cancelOrTimeout }],
              },
            },
          });

          const localizedErrorMessage = 'Avbröts eller tog för lång tid.';
          const localizedStep = stepWithMessages({
            'authenticator.webauthn.authenticate-device.view.error.cancel-or-timeout': localizedErrorMessage,
          });
          await expect(
            runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, localizedStep)
          ).resolves.toMatchObject({
            clientOperationError: {
              app: {
                type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                messages: [{ text: localizedErrorMessage }],
              },
            },
          });
        });

        it.each(['TimeoutError', 'NetworkError', 'IdentityCredentialError', 'SecurityError'])(
          '%s → authentication copy (failed bucket)',
          async errorName => {
            mockCredentialsGet.mockRejectedValue(new DOMException(`${errorName} message`, errorName));

            await expect(
              runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, stepWithoutMetadata)
            ).resolves.toMatchObject({
              clientOperationError: {
                app: {
                  type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                  messages: [{ text: WEBAUTHN_ERROR_MESSAGES.authentication }],
                },
              },
            });

            const localizedErrorMessage = 'Kunde inte autentisera.';
            const localizedStep = stepWithMessages({
              'authenticator.webauthn.authenticate-device.view.error.authentication': localizedErrorMessage,
            });
            await expect(
              runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, localizedStep)
            ).resolves.toMatchObject({
              clientOperationError: {
                app: {
                  type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
                  messages: [{ text: localizedErrorMessage }],
                },
              },
            });
          }
        );

        it.each([
          ['TypeError', new TypeError('bad options')],
          ['arbitrary non-DOMException', new Error('something else')],
        ] as const)(
          '%s → rethrows so the React error boundary catches the programming bug (does not map to "Authentication failed")',
          async (_label, error) => {
            mockCredentialsGet.mockRejectedValue(error);

            await expect(
              runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, stepWithoutMetadata)
            ).rejects.toBe(error);
          }
        );
      });
    });
  });

  describe('selects the matching error copy from a full view-data message set', () => {
    const registrationErrors = (prefix: string) => ({
      [`${prefix}.register.view.error.registration`]: `${prefix} registration failed`,
      [`${prefix}.register.view.error.cancel-or-timeout`]: `${prefix} registration cancelled`,
      [`${prefix}.register.view.error.not-supported`]: `${prefix} registration not supported`,
    });
    const authenticationErrors = (prefix: string) => ({
      [`${prefix}.authenticate-device.view.error.authentication`]: `${prefix} authentication failed`,
      [`${prefix}.authenticate-device.view.error.cancel-or-timeout`]: `${prefix} authentication cancelled`,
      [`${prefix}.authenticate-device.view.error.not-supported`]: `${prefix} authentication not supported`,
    });

    it.each(['authenticator.webauthn', 'authenticator.passkeys'])('registration errors (%s)', async prefix => {
      const messages = registrationErrors(prefix);
      const step = stepWithMessages(messages);
      const expectRegistrationError = (text: string) =>
        expect(
          runWebAuthnRegistration(createMockWebAuthnRegistrationAction(), abortSignal, step)
        ).resolves.toMatchObject({ clientOperationError: { app: { messages: [{ text }] } } });

      mockCredentialsCreate.mockResolvedValue(null);
      await expectRegistrationError(messages[`${prefix}.register.view.error.registration`]);

      mockCredentialsCreate.mockRejectedValue(new DOMException('cancelled', 'NotAllowedError'));
      await expectRegistrationError(messages[`${prefix}.register.view.error.cancel-or-timeout`]);

      vi.unstubAllGlobals();
      await expectRegistrationError(messages[`${prefix}.register.view.error.not-supported`]);
    });

    it.each(['authenticator.webauthn', 'authenticator.passkeys'])('authentication errors (%s)', async prefix => {
      const messages = authenticationErrors(prefix);
      const step = stepWithMessages(messages);
      const expectAuthenticationError = (text: string) =>
        expect(
          runWebAuthnAuthentication(createMockWebAuthnAuthenticationAction(), abortSignal, step)
        ).resolves.toMatchObject({ clientOperationError: { app: { messages: [{ text }] } } });

      mockCredentialsGet.mockResolvedValue(null);
      await expectAuthenticationError(messages[`${prefix}.authenticate-device.view.error.authentication`]);

      mockCredentialsGet.mockRejectedValue(new DOMException('cancelled', 'NotAllowedError'));
      await expectAuthenticationError(messages[`${prefix}.authenticate-device.view.error.cancel-or-timeout`]);

      vi.unstubAllGlobals();
      await expectAuthenticationError(messages[`${prefix}.authenticate-device.view.error.not-supported`]);
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

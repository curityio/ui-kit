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

import {
  HAAPI_POLLING_STATUS,
  HAAPI_PROBLEM_STEPS,
  HAAPI_STEPS,
  HaapiActionStep,
  HaapiAuthenticationFailedProblemStep,
  HaapiErrorStep,
  HaapiInputValidationProblemStep,
  HaapiStep,
} from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';
import {
  HAAPI_ACTION_CLIENT_OPERATIONS,
  HAAPI_ACTION_TYPES,
  HAAPI_FORM_ACTION_KINDS,
} from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-action.types';
import {
  HAAPI_FORM_FIELDS,
  HTTP_METHODS,
} from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import { MEDIA_TYPES } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/media.types';

/**
 * The single source of truth for the docs' canned HAAPI example data. Every example the docs render —
 * the browsable step showcase (the "Step to display" selector) and the steps pinned by the
 * customization examples — is declared once here, keyed by {@link HAAPI_EXAMPLE}.
 *
 * This module owns the data outright: the step objects are copied in verbatim (it does not import them
 * from the previewer), so the docs site is standalone. It only depends on `@curity/haapi-react-sdk`
 * type/enum exports. Consumers:
 * - the web-driver mock serves `EXAMPLES[key].step` for the booted example (and `errorOnSubmit` on a
 *   submit),
 * - `StepSelect` lists the `kind: 'step'` entries, grouped by `section`,
 * - `bootstrapForStep` / `ExamplePreviewer` carry the example key in the bootstrap URL,
 * - `build-sandpack-sdk.mjs` emits `catalog.json` / `examples.json` from it.
 */

// ── Step data: browsable showcase (Authenticators) ───────────────────────────

const authenticatorHtmlFormLogin: HaapiActionStep = {
  links: [
    {
      href: '/authentication/authenticate/user-pwd/forgot-password',
      rel: 'forgot-password',
      title: 'Forgot your password?',
    },
    {
      href: '/authentication/authenticate/user-pwd/forgot-account-id',
      rel: 'forgot-account-id',
      title: 'Forgot your username?',
    },
    {
      href: '/authentication/register/create/htmlSql',
      rel: 'register-create',
      title: 'Create account',
    },
  ],
  metadata: {
    viewName: 'authenticator/html-form/authenticate/get',
  },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
      title: 'Login',
      model: {
        href: '/authentication/authenticate/htmlSql',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Login',
        fields: [
          {
            name: 'userName',
            type: HAAPI_FORM_FIELDS.USERNAME,
            label: 'Username',
          },
          {
            name: 'password',
            type: HAAPI_FORM_FIELDS.PASSWORD,
            label: 'Password',
          },
        ],
      },
    },
  ],
};

const authenticatorHtmlFormAccountCreatedHyperlink: HaapiActionStep = {
  messages: [
    {
      text: 'Your account has been created!',
      classList: ['heading'],
    },
    {
      text: 'An email with an activation link has been sent to you.',
      classList: [],
    },
    {
      text: 'If you did not receive an email, check your spam folder.',
      classList: [],
    },
  ],
  metadata: {
    viewName: 'authenticator/html-form/create-account/post',
  },
  type: HAAPI_STEPS.REGISTRATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.CONTINUE,
      model: {
        href: '/authentication/authenticate/user-pwd',
        method: HTTP_METHODS.GET,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Return to login',
      },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: 'user-register',
      model: {
        href: '/authentication/register/create/user-pwd/resend-activation-email',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Send a new activation email',
      },
    },
  ],
};

const authenticatorHtmlFormOtpActivation: HaapiActionStep = {
  messages: [
    {
      text: 'Activate Account',
      classList: ['heading'],
    },
    {
      text: 'An email with a one time password has been sent to you.',
      classList: ['info'],
    },
    {
      text: 'If you did not receive an email, check your spam folder.',
      classList: ['info'],
    },
  ],
  metadata: {
    viewName: 'authenticator/html-form/account-activation/otp',
  },
  type: HAAPI_STEPS.REGISTRATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: 'user-register',
      model: {
        actionTitle: 'Activate',
        href: '/authentication/register/create/user-pwd/otp',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        fields: [
          {
            name: 'otp',
            type: HAAPI_FORM_FIELDS.TEXT,
            label: 'Enter one time password',
            kind: 'number',
            minLength: 6,
            maxLength: 6,
          },
        ],
      },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: 'user-register',
      model: {
        actionTitle: 'Send a new activation email',
        href: '/authentication/register/create/user-pwd/otp',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        fields: [
          {
            name: 'resend',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'true',
          },
        ],
      },
    },
  ],
};

const authenticatorWebauthnRegistrationAnyDevice: HaapiActionStep = {
  links: [
    {
      href: '/authentication/authenticate/webauthn',
      rel: 'restart',
      title: 'Return to login',
    },
  ],
  metadata: {
    viewName: 'authenticator/webauthn/register/get',
  },
  type: HAAPI_STEPS.REGISTRATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.CLIENT_OPERATION,
      kind: 'device-register',
      title: 'Register new device',
      model: {
        name: HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_REGISTRATION,
        arguments: {
          crossPlatformCredentialCreationOptions: {
            publicKey: {
              rp: { name: 'se.curity', id: 'localhost' },
              user: {
                name: 'john',
                displayName: 'john',
                id: 'rl3rgi4NcZkpAEcacZnQ2VuOfJ0FxAqCRaKB_SwdZoQ',
              },
              challenge: 'Gwo3GzyJ25yPXd9bZc_h6HcjkamZ5Ye0eRyFjGrOOEg',
              pubKeyCredParams: [
                { alg: -7, type: 'public-key' },
                { alg: -8, type: 'public-key' },
                { alg: -35, type: 'public-key' },
                { alg: -36, type: 'public-key' },
                { alg: -257, type: 'public-key' },
                { alg: -258, type: 'public-key' },
                { alg: -259, type: 'public-key' },
              ],
              hints: [],
              excludeCredentials: [],
              authenticatorSelection: {
                authenticatorAttachment: 'cross-platform',
                requireResidentKey: false,
                residentKey: 'preferred',
                userVerification: 'preferred',
              },
              attestation: 'none',
              extensions: {},
            },
          },
          platformCredentialCreationOptions: {
            publicKey: {
              rp: { name: 'se.curity', id: 'localhost' },
              user: {
                name: 'john',
                displayName: 'john',
                id: 'rl3rgi4NcZkpAEcacZnQ2VuOfJ0FxAqCRaKB_SwdZoQ',
              },
              challenge: 'dKRGJIGkHwuSuPlpMe867RVLywin8-LtMjX7yqX2nTo',
              pubKeyCredParams: [
                { alg: -7, type: 'public-key' },
                { alg: -8, type: 'public-key' },
                { alg: -35, type: 'public-key' },
                { alg: -36, type: 'public-key' },
                { alg: -257, type: 'public-key' },
                { alg: -258, type: 'public-key' },
                { alg: -259, type: 'public-key' },
              ],
              hints: [],
              excludeCredentials: [],
              authenticatorSelection: {
                authenticatorAttachment: 'platform',
                requireResidentKey: false,
                residentKey: 'preferred',
                userVerification: 'preferred',
              },
              attestation: 'none',
              extensions: {},
            },
          },
        },
        continueActions: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.CONTINUE,
            title: 'Register new device',
            model: {
              href: 'https://localhost:8443/authentication/register/create/webauthn',
              method: HTTP_METHODS.POST,
              type: MEDIA_TYPES.JSON,
              fields: [
                { name: 'platformCredential', type: HAAPI_FORM_FIELDS.CONTEXT },
                { name: 'crossPlatformCredential', type: HAAPI_FORM_FIELDS.CONTEXT },
              ],
            },
          },
        ],
        errorActions: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.REDIRECT,
            model: {
              href: '/authentication/authenticate/webauthn?_force_external_browser_flow=true',
              method: HTTP_METHODS.GET,
            },
          },
        ],
      },
    },
  ],
};

const authenticatorWebauthnRegistrationPasskeys: HaapiActionStep = {
  links: [
    {
      href: '/authentication/authenticate/webauthn',
      rel: 'restart',
      title: 'Return to login',
    },
  ],
  metadata: {
    viewName: 'authenticator/webauthn/register/get',
  },
  type: HAAPI_STEPS.REGISTRATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.CLIENT_OPERATION,
      kind: 'device-register',
      title: 'Register new device',
      model: {
        name: HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_REGISTRATION,
        arguments: {
          credentialCreationOptions: {
            publicKey: {
              rp: { name: 'se.curity', id: 'localhost' },
              user: {
                name: 'john',
                displayName: 'john',
                id: 'rl6rgi9NcZkpAEcacZnQ2VuOfJ0FxAqCRaKB_SwdZoQ',
              },
              challenge: 'EvdQtJxjTOEHT3fhLNZDVbfA5p2aThQDeAIq6BY3aHw',
              pubKeyCredParams: [
                { alg: -7, type: 'public-key' },
                { alg: -8, type: 'public-key' },
                { alg: -35, type: 'public-key' },
                { alg: -36, type: 'public-key' },
                { alg: -257, type: 'public-key' },
                { alg: -258, type: 'public-key' },
                { alg: -259, type: 'public-key' },
              ],
              hints: [],
              excludeCredentials: [],
              authenticatorSelection: {
                requireResidentKey: false,
                residentKey: 'preferred',
                userVerification: 'required',
              },
              attestation: 'none',
              extensions: {},
            },
          },
        },
        continueActions: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.CONTINUE,
            title: 'Register new device',
            model: {
              href: 'https://localhost:8443/authentication/register/create/webauthn',
              method: HTTP_METHODS.POST,
              type: MEDIA_TYPES.JSON,
              fields: [{ name: 'credential', type: HAAPI_FORM_FIELDS.CONTEXT }],
            },
          },
        ],
        errorActions: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.REDIRECT,
            model: {
              href: '/authentication/authenticate/webauthn?_force_external_browser_flow=true',
              method: HTTP_METHODS.GET,
            },
          },
        ],
      },
    },
  ],
};

const authenticatorWebauthnRegistrationCompleted: HaapiActionStep = {
  messages: [
    {
      text: 'Your device has been registered!',
      classList: ['heading'],
    },
  ],
  metadata: {
    viewName: 'authenticator/webauthn/register/post',
  },
  type: HAAPI_STEPS.REGISTRATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.CONTINUE,
      model: {
        href: '/authentication/authenticate/webauthn',
        method: HTTP_METHODS.GET,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Return to login',
      },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: 'continue-auto-login',
      title: 'Proceed to login as testuser',
      model: {
        href: '/authentication/anonymous/webauthn/auto-login',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Proceed to login as testuser',
        fields: [
          {
            name: 'alsk',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'xDyzBWCaRrTVntzfz5oBQf3txVM1IVfm',
          },
        ],
      },
    },
  ],
};

const authenticatorDuoSelectDevice: HaapiActionStep = {
  links: [
    {
      href: '/authentication/anonymous/duo/info',
      rel: 'register-create',
      title: 'Register new device',
    },
  ],
  metadata: {
    viewName: 'authenticator/duo/authenticate/select-device',
  },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.SELECTOR,
      kind: 'device-selector',
      title: 'Device selection',
      model: {
        options: ['Phone 1 (+XX XXX XXX 204)', 'Phone 2 (+XX XXX XXX 305)'].map(title => ({
          template: HAAPI_ACTION_TYPES.SELECTOR,
          kind: 'device-option',
          title,
          model: {
            options: [
              {
                template: HAAPI_ACTION_TYPES.FORM,
                kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
                title: 'Let Duo choose (push or phone)',
                model: {
                  href: '/authentication/authenticate/duo/select-device',
                  method: HTTP_METHODS.POST,
                  type: MEDIA_TYPES.FORM_URLENCODED,
                  actionTitle: 'Auto',
                  fields: [
                    {
                      name: 'device',
                      type: HAAPI_FORM_FIELDS.HIDDEN,
                      value: 'DPL9ZB1RC5I7DI4ANGW4',
                    },
                    {
                      name: 'factor',
                      type: HAAPI_FORM_FIELDS.HIDDEN,
                      value: 'auto',
                    },
                  ],
                },
              },
              {
                template: HAAPI_ACTION_TYPES.FORM,
                kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
                title: 'Send push notification',
                model: {
                  href: '/authentication/authenticate/duo/select-device',
                  method: HTTP_METHODS.POST,
                  type: MEDIA_TYPES.FORM_URLENCODED,
                  actionTitle: 'Send notification to device',
                  fields: [
                    {
                      name: 'device',
                      type: HAAPI_FORM_FIELDS.HIDDEN,
                      value: 'DPL9ZB1RC5I7DI4ANGW4',
                    },
                    {
                      name: 'factor',
                      type: HAAPI_FORM_FIELDS.HIDDEN,
                      value: 'push',
                    },
                  ],
                },
              },
              {
                template: HAAPI_ACTION_TYPES.FORM,
                kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
                title: 'Receive passcode via SMS',
                model: {
                  href: '/authentication/authenticate/duo/select-device',
                  method: HTTP_METHODS.POST,
                  type: MEDIA_TYPES.FORM_URLENCODED,
                  actionTitle: 'Submit',
                  fields: [
                    {
                      name: 'device',
                      type: HAAPI_FORM_FIELDS.HIDDEN,
                      value: 'DPL9ZB1RC5I7DI4ANGW4',
                    },
                    {
                      name: 'factor',
                      type: HAAPI_FORM_FIELDS.HIDDEN,
                      value: 'sms',
                    },
                  ],
                  continueActions: [
                    {
                      template: HAAPI_ACTION_TYPES.FORM,
                      kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
                      title: 'Authenticate with passcode',
                      model: {
                        href: '/authentication/authenticate/duo/select-device',
                        method: HTTP_METHODS.POST,
                        type: MEDIA_TYPES.FORM_URLENCODED,
                        actionTitle: 'Submit',
                        fields: [
                          {
                            name: 'device',
                            type: HAAPI_FORM_FIELDS.HIDDEN,
                            value: 'DPL9ZB1RC5I7DI4ANGW4',
                          },
                          {
                            name: 'factor',
                            type: HAAPI_FORM_FIELDS.HIDDEN,
                            value: 'passcode',
                          },
                          {
                            name: 'passcode',
                            type: HAAPI_FORM_FIELDS.TEXT,
                            label: 'Passcode',
                          },
                        ],
                      },
                    },
                  ],
                },
              },
              {
                template: HAAPI_ACTION_TYPES.FORM,
                kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
                title: 'Authenticate with passcode',
                model: {
                  href: '/authentication/authenticate/duo/select-device',
                  method: HTTP_METHODS.POST,
                  type: MEDIA_TYPES.FORM_URLENCODED,
                  actionTitle: 'Submit',
                  fields: [
                    {
                      name: 'device',
                      type: HAAPI_FORM_FIELDS.HIDDEN,
                      value: 'DPL9ZB1RC5I7DI4ANGW4',
                    },
                    {
                      name: 'factor',
                      type: HAAPI_FORM_FIELDS.HIDDEN,
                      value: 'passcode',
                    },
                    {
                      name: 'passcode',
                      type: HAAPI_FORM_FIELDS.TEXT,
                      label: 'Passcode',
                    },
                  ],
                },
              },
            ],
          },
        })),
      },
    },
  ],
};

const authenticatorEmailLinkWait: HaapiActionStep = {
  messages: [
    {
      text: 'Please authenticate using the email sent to: xxxx@xxxxple.com',
      classList: [],
    },
  ],
  metadata: {
    viewName: 'authenticator/email/link-wait/index',
  },
  type: HAAPI_STEPS.POLLING,
  properties: {
    recipientOfCommunication: 'xxxx@xxxxple.com',
    status: HAAPI_POLLING_STATUS.PENDING,
  },
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: 'poll',
      model: {
        href: '/authentication/authenticate/email/link-wait',
        method: HTTP_METHODS.GET,
      },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.CANCEL,
      title: 'Restart the process',
      model: {
        href: '/authentication/authenticate/email',
        method: HTTP_METHODS.GET,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Restart the process',
      },
    },
  ],
};

const authenticatorEmailOtp: HaapiActionStep = {
  messages: [
    {
      text: 'The OTP code was sent to the following recipient: xxxx@xxxxple.com',
      classList: [],
    },
  ],
  links: [
    {
      href: '/authentication/authenticate/email',
      rel: 'restart',
      title: 'Restart',
    },
  ],
  metadata: {
    viewName: 'authenticator/email/enter-otp/index',
  },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
      title: 'Enter the OTP code',
      model: {
        href: 'https://localhost:8443/authentication/authenticate/email/enter-otp',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Verify',
        fields: [
          {
            name: 'otp',
            type: HAAPI_FORM_FIELDS.TEXT,
            label: 'OTP code',
            kind: 'number',
            minLength: 8,
            maxLength: 8,
          },
        ],
      },
    },
  ],
};

// ── Step data: browsable showcase (Authentication Actions) ───────────────────

const authenticationActionRequestAck: HaapiActionStep = {
  messages: [
    {
      text: 'Proceed?',
      classList: ['heading'],
    },
  ],
  metadata: {
    viewName: 'authentication-action/request-acknowledgement/index',
  },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.CONTINUE,
      model: {
        href: '/authentication/_action/req-ack',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'OK',
        fields: [
          {
            name: 'response',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'true',
          },
        ],
      },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.CANCEL,
      model: {
        href: '/authentication/_action/req-ack',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Cancel',
        fields: [
          {
            name: 'response',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'false',
          },
        ],
      },
    },
  ],
};

const authenticationActionResetPassword: HaapiActionStep = {
  type: HAAPI_STEPS.AUTHENTICATION,
  metadata: {
    viewName: 'authentication-action/reset-password/index',
  },
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: 'password-reset',
      title: 'A password reset is required.',
      model: {
        href: '/authentication/_action/reset-pwd',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Submit',
        fields: [
          {
            name: 'password',
            type: HAAPI_FORM_FIELDS.PASSWORD,
            label: 'Password',
          },
          {
            name: 'password2',
            type: HAAPI_FORM_FIELDS.PASSWORD,
            label: 'Verify Password',
          },
        ],
      },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.CONTINUE,
      model: {
        href: '/authentication/_action/reset-pwd',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Skip',
        fields: [
          {
            name: '_skip',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'true',
          },
        ],
      },
    },
  ],
};

const authenticationActionOptInMfaSetup: HaapiActionStep = {
  messages: [
    {
      text: 'Setup 2-step verification',
      classList: ['heading'],
    },
    {
      text: 'Increase security by adding a second factor',
      classList: ['info'],
    },
  ],
  metadata: {
    viewName: 'authentication-action/opt-in-mfa/setup',
  },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.SELECTOR,
      kind: HAAPI_FORM_ACTION_KINDS.AUTHENTICATOR_SELECTOR,
      title: 'Available methods',
      model: {
        options: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.AUTHENTICATOR_SELECTOR_OPTION,
            title: 'Username and password',
            properties: {
              authenticatorType: 'html-form',
            },
            model: {
              href: '/authentication/_action/opt-in/setup',
              method: HTTP_METHODS.POST,
              type: MEDIA_TYPES.FORM_URLENCODED,
              fields: [
                {
                  name: 'acr',
                  type: HAAPI_FORM_FIELDS.HIDDEN,
                  value: 'urn:se:curity:authentication:html-form:htmlSql',
                },
              ],
            },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.AUTHENTICATOR_SELECTOR_OPTION,
            title: 'Email magic link',
            properties: {
              authenticatorType: 'email',
            },
            model: {
              href: '/authentication/_action/opt-in-1/setup',
              method: HTTP_METHODS.POST,
              type: MEDIA_TYPES.FORM_URLENCODED,
              fields: [
                {
                  name: 'acr',
                  type: HAAPI_FORM_FIELDS.HIDDEN,
                  value: 'urn:se:curity:authentication:email:email1',
                },
              ],
            },
          },
        ],
      },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
      title: 'Skip setting up 2-step verification. This will make your account less secure.',
      model: {
        href: '/dev/authn/authenticate/_action/opt-in-1/setup',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Skip',
        fields: [
          {
            name: 'optOut',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'true',
          },
        ],
      },
    },
  ],
};

const authenticationActionOptInMfaSetupConfirm: HaapiActionStep = {
  messages: [
    {
      text: 'Confirm setup of 2-step verification, using method: Username and password',
      classList: ['heading'],
    },
    {
      text: 'These recovery codes can be used to manage the 2-step verification methods. Keep these codes somewhere safe but accessible. Each code can be used only once. You can generate new codes at any point.',
      classList: ['info'],
    },
    { text: '45971393', classList: ['info', 'userCode'] },
    { text: '72615246', classList: ['info', 'userCode'] },
    { text: '21410037', classList: ['info', 'userCode'] },
    { text: '30506519', classList: ['info', 'userCode'] },
    { text: '06308798', classList: ['info', 'userCode'] },
    { text: '97952895', classList: ['info', 'userCode'] },
    { text: '78603802', classList: ['info', 'userCode'] },
    { text: '98246710', classList: ['info', 'userCode'] },
    { text: '46775720', classList: ['info', 'userCode'] },
    { text: '39896367', classList: ['info', 'userCode'] },
  ],
  metadata: {
    viewName: 'authentication-action/opt-in-mfa/setup-confirm',
  },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
      model: {
        href: '/authentication/_action/opt-in/setup-confirm',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Confirm',
        fields: [
          {
            name: 'recoveryCodesBatchId',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: '003e9cb1-b77e-413f-b4d4-ed64bb6ee975',
          },
          {
            name: 'confirm',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'on',
          },
        ],
      },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.CANCEL,
      model: {
        href: '/authentication/_action/opt-in/setup-confirm',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Cancel',
        fields: [
          {
            name: 'cancel',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'true',
          },
        ],
      },
    },
  ],
};

const authenticationActionOptInMfaSelect: HaapiActionStep = {
  messages: [
    {
      text: 'Login',
      classList: ['heading'],
    },
    {
      text: 'Choose one of the methods below to continue login.',
      classList: [],
    },
  ],
  links: [
    {
      href: '/authentication/authenticate/_action/opt-in/select-to-manage',
      rel: 'manage',
      title: 'Manage',
    },
  ],
  metadata: {
    viewName: 'authentication-action/opt-in-mfa/select',
  },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.SELECTOR,
      kind: HAAPI_FORM_ACTION_KINDS.AUTHENTICATOR_SELECTOR,
      title: 'Available methods',
      model: {
        options: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'Username and password',
            properties: {
              authenticatorType: 'html-form',
            },
            model: {
              href: '/authentication/authenticate/_action/opt-in/select',
              method: HTTP_METHODS.POST,
              type: MEDIA_TYPES.FORM_URLENCODED,
              fields: [
                {
                  name: 'acr',
                  type: HAAPI_FORM_FIELDS.HIDDEN,
                  value: 'urn:se:curity:authentication:html-form:htmlSql',
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

const authenticationActionSelector: HaapiActionStep = {
  metadata: {
    viewName: 'authentication-action/selector/index',
  },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.SELECTOR,
      kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
      title: 'Select an option',
      model: {
        options: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.CONTINUE,
            title: 'One',
            model: {
              href: '/authentication/_action/selector',
              method: HTTP_METHODS.POST,
              type: MEDIA_TYPES.FORM_URLENCODED,
              fields: [
                {
                  name: 'selectedId',
                  type: HAAPI_FORM_FIELDS.HIDDEN,
                  value: '2573473',
                },
              ],
            },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.CONTINUE,
            title: 'Two',
            model: {
              href: '/authentication/_action/selector',
              method: HTTP_METHODS.POST,
              type: MEDIA_TYPES.FORM_URLENCODED,
              fields: [
                {
                  name: 'selectedId',
                  type: HAAPI_FORM_FIELDS.HIDDEN,
                  value: '2736481',
                },
              ],
            },
          },
        ],
      },
    },
  ],
};

const authenticationActionSignUp: HaapiActionStep = {
  metadata: {
    viewName: 'authentication-action/signup/get',
  },
  type: HAAPI_STEPS.REGISTRATION, // adapted from "registration-step"
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: 'user-register',
      title: 'Create Account',
      model: {
        href: '/authentication/_action/signup',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Create Account',
        fields: [
          {
            name: 'username',
            type: HAAPI_FORM_FIELDS.USERNAME,
            label: 'Username',
          },
          {
            name: 'primaryEmail',
            type: HAAPI_FORM_FIELDS.TEXT,
            label: 'Email',
            kind: 'email',
          },
          {
            name: 'primaryPhoneNumber',
            type: HAAPI_FORM_FIELDS.TEXT,
            label: 'Phone Number',
            required: false,
            kind: 'tel',
          },
          {
            name: 'password',
            type: HAAPI_FORM_FIELDS.PASSWORD,
            label: 'Password',
          },
        ],
      },
    },
  ],
};

// ── Step data: browsable showcase (Authentication) ───────────────────────────

const authenticationSelectAuthenticator: HaapiActionStep = {
  metadata: {
    viewName: 'views/select-authenticator/index',
  },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.SELECTOR,
      kind: 'authenticator-selector',
      title: 'Login',
      model: {
        options: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'Google',
            properties: {
              authenticatorType: 'google',
            },
            model: {
              href: '/authentication/authenticate/google',
              method: HTTP_METHODS.GET,
            },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'TOTP',
            properties: {
              authenticatorType: 'totp',
            },
            model: {
              href: '/authentication/authenticate/totp',
              method: HTTP_METHODS.GET,
            },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'Username/password',
            properties: {
              authenticatorType: 'html-form',
            },
            model: {
              href: '/authentication/authenticate/user-pwd',
              method: HTTP_METHODS.GET,
            },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'Email',
            properties: {
              authenticatorType: 'email',
            },
            model: {
              href: '/authentication/authenticate/email',
              method: HTTP_METHODS.GET,
            },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'SMS',
            properties: {
              authenticatorType: 'sms',
            },
            model: {
              href: '/authentication/authenticate/sms',
              method: HTTP_METHODS.GET,
            },
          },
        ],
      },
    },
  ],
};

// ── Step data: browsable showcase (OAuth) ────────────────────────────────────

const oauthUserConsent: HaapiActionStep = {
  messages: [
    {
      text: 'Haapi Public Client',
      classList: ['heading'],
    },
    {
      text: 'wants to access your account:',
      classList: [],
    },
    {
      text: 'testuser',
      classList: ['userName'],
    },
    {
      text: 'The following permissions are requested by the above app. Please review these and consent if it is OK.',
      classList: [],
    },
  ],
  metadata: {
    viewName: 'views/oauth/consent',
  },
  type: HAAPI_STEPS.USER_CONSENT,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: 'user-consent',
      model: {
        href: '/oauth/authorize',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Submit Consent',
        fields: [
          {
            name: 'state',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'R_1qKGdC0yOlxxpq1JTpcdDeqpReGOAZz4',
          },
          {
            name: 'submit_consent',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'submit_consent',
          },
          {
            name: 'consent.claim.sub',
            type: HAAPI_FORM_FIELDS.CHECKBOX,
            label: 'User ID',
            checked: true,
            readonly: true,
          },
          {
            name: 'consent.scope.read',
            type: HAAPI_FORM_FIELDS.CHECKBOX,
            label: 'read',
            checked: true,
            readonly: true,
          },
        ],
      },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.CANCEL,
      model: {
        href: '/oauth/authorize',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Cancel',
        fields: [
          {
            name: 'state',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'R_1qKGdC0yOlxxpq1JTpcdDeqpReGOAZz4',
          },
          {
            name: 'cancel_consent',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'cancel_consent',
          },
        ],
      },
    },
  ],
};

// ── Step data: browsable showcase (Forms) ────────────────────────────────────

const formStepWithDifferentInputs: HaapiActionStep = {
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.REDIRECT,
      title: 'Login',
      model: {
        href: '/postback',
        method: HTTP_METHODS.POST,
        fields: [
          {
            type: HAAPI_FORM_FIELDS.SELECT,
            name: 'character',
            label: 'Character',
            options: [
              {
                label: 'Bart',
                value: 'bart',
              },
              {
                label: 'Lisa',
                value: 'lisa',
                selected: true,
              },
            ],
          },
          {
            type: HAAPI_FORM_FIELDS.TEXT,
            name: 'something',
            label: 'Something',
            value: 'foo',
          },
          {
            type: HAAPI_FORM_FIELDS.CHECKBOX,
            name: 'accept',
            label: 'Accept',
            value: 'yes',
          },
          {
            type: HAAPI_FORM_FIELDS.CHECKBOX,
            name: 'always-checked',
            label: 'No option',
            value: 'yes',
            checked: true,
            readonly: true,
          },
        ],
        actionTitle: 'Submit',
      },
    },
  ],
};

const formStepWithUsernamePassword: HaapiActionStep = {
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.REDIRECT,
      title: 'Login',
      model: {
        href: '/postback',
        method: HTTP_METHODS.POST,
        fields: [
          {
            type: HAAPI_FORM_FIELDS.USERNAME,
            name: 'user',
            label: 'Username',
            placeholder: 'Enter your username',
          },
          {
            type: HAAPI_FORM_FIELDS.PASSWORD,
            name: 'password',
          },
        ],
        actionTitle: 'Submit',
      },
    },
  ],
};

const formStepWithHiddenField: HaapiActionStep = {
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.REDIRECT,
      title: 'Form with hidden field',
      model: {
        href: '/postback',
        method: HTTP_METHODS.POST,
        fields: [
          {
            name: 'secret',
            type: HAAPI_FORM_FIELDS.HIDDEN,
            value: 'value',
          },
        ],
        actionTitle: 'Submit',
      },
    },
  ],
};

// ── Step data: customization-pinned steps ────────────────────────────────────

// A compact HTML-form login used by customization examples (render interceptors / UI composition).
const htmlFormLogin: HaapiActionStep = {
  links: [
    {
      href: '/authentication/authenticate/user-pwd/forgot-password',
      rel: 'forgot-password',
      title: 'Forgot your password?',
    },
    {
      href: '/authentication/authenticate/user-pwd/forgot-account-id',
      rel: 'forgot-account-id',
      title: 'Forgot your username?',
    },
    { href: '/authentication/register/create/htmlSql', rel: 'register-create', title: 'Create account' },
  ],
  metadata: { viewName: 'authenticator/html-form/authenticate/get' },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
      title: 'Login',
      model: {
        href: '/authentication/authenticate/htmlSql',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Login',
        fields: [
          { name: 'userName', type: HAAPI_FORM_FIELDS.USERNAME, label: 'Username' },
          { name: 'password', type: HAAPI_FORM_FIELDS.PASSWORD, label: 'Password' },
        ],
      },
    },
  ],
};

const selectAuthenticator: HaapiActionStep = {
  metadata: { viewName: 'views/select-authenticator/index' },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.SELECTOR,
      kind: 'authenticator-selector',
      title: 'Login',
      model: {
        options: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'Google',
            properties: { authenticatorType: 'google' },
            model: { href: '/authentication/authenticate/google', method: HTTP_METHODS.GET },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'TOTP',
            properties: { authenticatorType: 'totp' },
            model: { href: '/authentication/authenticate/totp', method: HTTP_METHODS.GET },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'Username/password',
            properties: { authenticatorType: 'html-form' },
            model: { href: '/authentication/authenticate/user-pwd', method: HTTP_METHODS.GET },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'Email',
            properties: { authenticatorType: 'email' },
            model: { href: '/authentication/authenticate/email', method: HTTP_METHODS.GET },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'SMS',
            properties: { authenticatorType: 'sms' },
            model: { href: '/authentication/authenticate/sms', method: HTTP_METHODS.GET },
          },
        ],
      },
    },
  ],
};

const emailOtp: HaapiActionStep = {
  messages: [{ text: 'The OTP code was sent to the following recipient: xxxx@xxxxple.com', classList: [] }],
  links: [{ href: '/authentication/authenticate/email', rel: 'restart', title: 'Restart' }],
  metadata: { viewName: 'authenticator/email/enter-otp/index' },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
      title: 'Enter the OTP code',
      model: {
        href: 'https://localhost:8443/authentication/authenticate/email/enter-otp',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Verify',
        fields: [
          { name: 'otp', type: HAAPI_FORM_FIELDS.TEXT, label: 'OTP code', kind: 'number', minLength: 8, maxLength: 8 },
        ],
      },
    },
  ],
};

// A login form whose field name (`user`) matches the validation error below, so the inline field
// error renders when the form is submitted.
const usernamePasswordForm: HaapiActionStep = {
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.REDIRECT,
      title: 'Login',
      model: {
        href: '/postback',
        method: HTTP_METHODS.POST,
        fields: [
          // Not required, so an empty submit reaches the mock and triggers the validation error.
          {
            type: HAAPI_FORM_FIELDS.USERNAME,
            name: 'user',
            label: 'Username',
            placeholder: 'Enter your username',
            required: false,
          },
          { type: HAAPI_FORM_FIELDS.PASSWORD, name: 'password', required: false },
        ],
        actionTitle: 'Submit',
      },
    },
  ],
};

const formWithDifferentInputs: HaapiActionStep = {
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.REDIRECT,
      title: 'Login',
      model: {
        href: '/postback',
        method: HTTP_METHODS.POST,
        fields: [
          {
            type: HAAPI_FORM_FIELDS.SELECT,
            name: 'character',
            label: 'Character',
            options: [
              { label: 'Bart', value: 'bart' },
              { label: 'Lisa', value: 'lisa', selected: true },
            ],
          },
          { type: HAAPI_FORM_FIELDS.TEXT, name: 'something', label: 'Something', value: 'foo' },
          { type: HAAPI_FORM_FIELDS.CHECKBOX, name: 'accept', label: 'Accept', value: 'yes' },
          {
            type: HAAPI_FORM_FIELDS.CHECKBOX,
            name: 'always-checked',
            label: 'No option',
            value: 'yes',
            checked: true,
            readonly: true,
          },
        ],
        actionTitle: 'Submit',
      },
    },
  ],
};

// A polling step (e.g. email-link wait) — stays PENDING so the loading interceptor is visible.
const emailLinkWaitPolling: HaapiActionStep = {
  messages: [{ text: 'Please authenticate using the email sent to: john@example.com', classList: [] }],
  metadata: { viewName: 'authenticator/email/link-wait/index' },
  type: HAAPI_STEPS.POLLING,
  properties: { recipientOfCommunication: 'john@example.com', status: HAAPI_POLLING_STATUS.PENDING },
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: 'poll',
      model: { href: '/authentication/authenticate/email/link-wait', method: HTTP_METHODS.GET },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.CANCEL,
      title: 'Restart the process',
      model: {
        href: '/authentication/authenticate/email',
        method: HTTP_METHODS.GET,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Restart the process',
      },
    },
  ],
};

// A WebAuthn step carrying a client-operation action (rendered as a button; autostart is disabled in
// the previewer's stepper config so it doesn't try to invoke WebAuthn).
const webauthnClientOperation: HaapiActionStep = {
  links: [{ href: '/authentication/authenticate/webauthn', rel: 'restart', title: 'Return to login' }],
  metadata: { viewName: 'authenticator/webauthn/register/get' },
  type: HAAPI_STEPS.REGISTRATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.CLIENT_OPERATION,
      kind: 'device-register',
      title: 'Register new device',
      model: {
        name: HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_REGISTRATION,
        arguments: {
          credentialCreationOptions: {
            publicKey: {
              rp: { name: 'se.curity', id: 'localhost' },
              user: { name: 'john', displayName: 'john', id: 'rl6rgi9NcZkpAEcacZnQ2VuOfJ0FxAqCRaKB_SwdZoQ' },
              challenge: 'EvdQtJxjTOEHT3fhLNZDVbfA5p2aThQDeAIq6BY3aHw',
              pubKeyCredParams: [
                { alg: -7, type: 'public-key' },
                { alg: -257, type: 'public-key' },
              ],
              hints: [],
              excludeCredentials: [],
              authenticatorSelection: {
                requireResidentKey: false,
                residentKey: 'preferred',
                userVerification: 'required',
              },
              attestation: 'none',
              extensions: {},
            },
          },
        },
        continueActions: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.CONTINUE,
            title: 'Register new device',
            model: {
              href: 'https://localhost:8443/authentication/register/create/webauthn',
              method: HTTP_METHODS.POST,
              type: MEDIA_TYPES.JSON,
              fields: [{ name: 'credential', type: HAAPI_FORM_FIELDS.CONTEXT }],
            },
          },
        ],
        errorActions: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.REDIRECT,
            model: {
              href: '/authentication/authenticate/webauthn?_force_external_browser_flow=true',
              method: HTTP_METHODS.GET,
            },
          },
        ],
      },
    },
  ],
};

// A "group" authenticator step (templateArea `html1`) whose selector contains a PingFederate option
// alongside the rest — used by the group-authenticator custom-UI example.
const groupAuthenticator: HaapiActionStep = {
  metadata: { templateArea: 'html1', viewName: 'authenticator/group/authenticate/get' },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.SELECTOR,
      kind: 'authenticator-selector',
      title: 'Choose how to authenticate',
      model: {
        options: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'PingFederate',
            properties: { authenticatorType: 'pingfederate' },
            model: { href: '/authentication/authenticate/pingfederate', method: HTTP_METHODS.GET },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'Username/password',
            properties: { authenticatorType: 'html-form' },
            model: { href: '/authentication/authenticate/user-pwd', method: HTTP_METHODS.GET },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'Email',
            properties: { authenticatorType: 'email' },
            model: { href: '/authentication/authenticate/email', method: HTTP_METHODS.GET },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: 'select-authenticator',
            title: 'SMS',
            properties: { authenticatorType: 'sms' },
            model: { href: '/authentication/authenticate/sms', method: HTTP_METHODS.GET },
          },
        ],
      },
    },
  ],
};

// An authenticator-selector step (templateArea `lwa-dev`) whose options include BankID — used by the
// tabbed authenticator-selector custom-UI example.
const customAuthenticatorSelect: HaapiActionStep = {
  metadata: { templateArea: 'lwa-dev', viewName: 'views/select-authenticator/index' },
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [
    {
      template: HAAPI_ACTION_TYPES.SELECTOR,
      kind: HAAPI_FORM_ACTION_KINDS.AUTHENTICATOR_SELECTOR,
      title: 'Login',
      model: {
        options: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.AUTHENTICATOR_SELECTOR_OPTION,
            title: 'BankID',
            properties: { authenticatorType: HAAPI_ACTION_CLIENT_OPERATIONS.BANKID },
            model: { href: '/authentication/authenticate/bankid', method: HTTP_METHODS.GET },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.AUTHENTICATOR_SELECTOR_OPTION,
            title: 'Username/password',
            properties: { authenticatorType: 'html-form' },
            model: { href: '/authentication/authenticate/user-pwd', method: HTTP_METHODS.GET },
          },
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.AUTHENTICATOR_SELECTOR_OPTION,
            title: 'Email',
            properties: { authenticatorType: 'email' },
            model: { href: '/authentication/authenticate/email', method: HTTP_METHODS.GET },
          },
        ],
      },
    },
  ],
};

// QR code the BankID wait step exposes as an image-typed link. HAAPI delivers QR codes this way (a link
// whose media `type` starts with `image/`), so the SDK renders it as a scannable figure rather than a
// text link. This is a representative placeholder pattern for the docs preview, not a scannable code.
const BANKID_QR_CODE =
  'data:image/svg+xml;base64,PHN2ZyB4bWxucz0iaHR0cDovL3d3dy53My5vcmcvMjAwMC9zdmciIHdpZHRoPSIxOTIiIGhlaWdodD0iMTkyIiB2aWV3Qm94PSIwIDAgMTkyIDE5MiI+PHJlY3Qgd2lkdGg9IjE5MiIgaGVpZ2h0PSIxOTIiIGZpbGw9IiNmZmYiLz48cGF0aCBkPSJNMTIgMTJoOHY4aC04ek0yMCAxMmg4djhoLTh6TTI4IDEyaDh2OGgtOHpNMzYgMTJoOHY4aC04ek00NCAxMmg4djhoLTh6TTUyIDEyaDh2OGgtOHpNNjAgMTJoOHY4aC04ek04NCAxMmg4djhoLTh6TTEwMCAxMmg4djhoLTh6TTEyNCAxMmg4djhoLTh6TTEzMiAxMmg4djhoLTh6TTE0MCAxMmg4djhoLTh6TTE0OCAxMmg4djhoLTh6TTE1NiAxMmg4djhoLTh6TTE2NCAxMmg4djhoLTh6TTE3MiAxMmg4djhoLTh6TTEyIDIwaDh2OGgtOHpNNjAgMjBoOHY4aC04ek03NiAyMGg4djhoLTh6TTg0IDIwaDh2OGgtOHpNMTI0IDIwaDh2OGgtOHpNMTcyIDIwaDh2OGgtOHpNMTIgMjhoOHY4aC04ek0yOCAyOGg4djhoLTh6TTM2IDI4aDh2OGgtOHpNNDQgMjhoOHY4aC04ek02MCAyOGg4djhoLTh6TTg0IDI4aDh2OGgtOHpNMTAwIDI4aDh2OGgtOHpNMTI0IDI4aDh2OGgtOHpNMTQwIDI4aDh2OGgtOHpNMTQ4IDI4aDh2OGgtOHpNMTU2IDI4aDh2OGgtOHpNMTcyIDI4aDh2OGgtOHpNMTIgMzZoOHY4aC04ek0yOCAzNmg4djhoLTh6TTM2IDM2aDh2OGgtOHpNNDQgMzZoOHY4aC04ek02MCAzNmg4djhoLTh6TTEwMCAzNmg4djhoLTh6TTEyNCAzNmg4djhoLTh6TTE0MCAzNmg4djhoLTh6TTE0OCAzNmg4djhoLTh6TTE1NiAzNmg4djhoLTh6TTE3MiAzNmg4djhoLTh6TTEyIDQ0aDh2OGgtOHpNMjggNDRoOHY4aC04ek0zNiA0NGg4djhoLTh6TTQ0IDQ0aDh2OGgtOHpNNjAgNDRoOHY4aC04ek05MiA0NGg4djhoLTh6TTEwMCA0NGg4djhoLTh6TTEyNCA0NGg4djhoLTh6TTE0MCA0NGg4djhoLTh6TTE0OCA0NGg4djhoLTh6TTE1NiA0NGg4djhoLTh6TTE3MiA0NGg4djhoLTh6TTEyIDUyaDh2OGgtOHpNNjAgNTJoOHY4aC04ek03NiA1Mmg4djhoLTh6TTEwMCA1Mmg4djhoLTh6TTEwOCA1Mmg4djhoLTh6TTEyNCA1Mmg4djhoLTh6TTE3MiA1Mmg4djhoLTh6TTEyIDYwaDh2OGgtOHpNMjAgNjBoOHY4aC04ek0yOCA2MGg4djhoLTh6TTM2IDYwaDh2OGgtOHpNNDQgNjBoOHY4aC04ek01MiA2MGg4djhoLTh6TTYwIDYwaDh2OGgtOHpNOTIgNjBoOHY4aC04ek0xMDggNjBoOHY4aC04ek0xMjQgNjBoOHY4aC04ek0xMzIgNjBoOHY4aC04ek0xNDAgNjBoOHY4aC04ek0xNDggNjBoOHY4aC04ek0xNTYgNjBoOHY4aC04ek0xNjQgNjBoOHY4aC04ek0xNzIgNjBoOHY4aC04ek03NiA2OGg4djhoLTh6TTEwMCA2OGg4djhoLTh6TTEwOCA2OGg4djhoLTh6TTEyIDc2aDh2OGgtOHpNMjAgNzZoOHY4aC04ek0zNiA3Nmg4djhoLTh6TTc2IDc2aDh2OGgtOHpNOTIgNzZoOHY4aC04ek0xMDAgNzZoOHY4aC04ek0xMjQgNzZoOHY4aC04ek0xMzIgNzZoOHY4aC04ek0xNTYgNzZoOHY4aC04ek0xNzIgNzZoOHY4aC04ek0yMCA4NGg4djhoLTh6TTM2IDg0aDh2OGgtOHpNNTIgODRoOHY4aC04ek02MCA4NGg4djhoLTh6TTc2IDg0aDh2OGgtOHpNODQgODRoOHY4aC04ek05MiA4NGg4djhoLTh6TTEwMCA4NGg4djhoLTh6TTE2NCA4NGg4djhoLTh6TTE3MiA4NGg4djhoLTh6TTEyIDkyaDh2OGgtOHpNMjAgOTJoOHY4aC04ek01MiA5Mmg4djhoLTh6TTYwIDkyaDh2OGgtOHpNNjggOTJoOHY4aC04ek03NiA5Mmg4djhoLTh6TTg0IDkyaDh2OGgtOHpNOTIgOTJoOHY4aC04ek0xMjQgOTJoOHY4aC04ek0xNDAgOTJoOHY4aC04ek0xNzIgOTJoOHY4aC04ek01MiAxMDBoOHY4aC04ek04NCAxMDBoOHY4aC04ek0xMDAgMTAwaDh2OGgtOHpNMTA4IDEwMGg4djhoLTh6TTE0MCAxMDBoOHY4aC04ek0xNDggMTAwaDh2OGgtOHpNMTY0IDEwMGg4djhoLTh6TTQ0IDEwOGg4djhoLTh6TTY4IDEwOGg4djhoLTh6TTc2IDEwOGg4djhoLTh6TTg0IDEwOGg4djhoLTh6TTkyIDEwOGg4djhoLTh6TTEwMCAxMDhoOHY4aC04ek0xMTYgMTA4aDh2OGgtOHpNMTY0IDEwOGg4djhoLTh6TTE3MiAxMDhoOHY4aC04ek03NiAxMTZoOHY4aC04ek05MiAxMTZoOHY4aC04ek0xMDAgMTE2aDh2OGgtOHpNMTA4IDExNmg4djhoLTh6TTExNiAxMTZoOHY4aC04ek0xNDggMTE2aDh2OGgtOHpNMTY0IDExNmg4djhoLTh6TTEyIDEyNGg4djhoLTh6TTIwIDEyNGg4djhoLTh6TTI4IDEyNGg4djhoLTh6TTM2IDEyNGg4djhoLTh6TTQ0IDEyNGg4djhoLTh6TTUyIDEyNGg4djhoLTh6TTYwIDEyNGg4djhoLTh6TTExNiAxMjRoOHY4aC04ek0xNTYgMTI0aDh2OGgtOHpNMTY0IDEyNGg4djhoLTh6TTE3MiAxMjRoOHY4aC04ek0xMiAxMzJoOHY4aC04ek02MCAxMzJoOHY4aC04ek03NiAxMzJoOHY4aC04ek04NCAxMzJoOHY4aC04ek0xMDggMTMyaDh2OGgtOHpNMTE2IDEzMmg4djhoLTh6TTEzMiAxMzJoOHY4aC04ek0xNDggMTMyaDh2OGgtOHpNMTU2IDEzMmg4djhoLTh6TTE3MiAxMzJoOHY4aC04ek0xMiAxNDBoOHY4aC04ek0yOCAxNDBoOHY4aC04ek0zNiAxNDBoOHY4aC04ek00NCAxNDBoOHY4aC04ek02MCAxNDBoOHY4aC04ek03NiAxNDBoOHY4aC04ek0xMDAgMTQwaDh2OGgtOHpNMTA4IDE0MGg4djhoLTh6TTExNiAxNDBoOHY4aC04ek0xMjQgMTQwaDh2OGgtOHpNMTMyIDE0MGg4djhoLTh6TTE1NiAxNDBoOHY4aC04ek0xNjQgMTQwaDh2OGgtOHpNMTIgMTQ4aDh2OGgtOHpNMjggMTQ4aDh2OGgtOHpNMzYgMTQ4aDh2OGgtOHpNNDQgMTQ4aDh2OGgtOHpNNjAgMTQ4aDh2OGgtOHpNNzYgMTQ4aDh2OGgtOHpNOTIgMTQ4aDh2OGgtOHpNMTQ4IDE0OGg4djhoLTh6TTEyIDE1Nmg4djhoLTh6TTI4IDE1Nmg4djhoLTh6TTM2IDE1Nmg4djhoLTh6TTQ0IDE1Nmg4djhoLTh6TTYwIDE1Nmg4djhoLTh6TTg0IDE1Nmg4djhoLTh6TTkyIDE1Nmg4djhoLTh6TTExNiAxNTZoOHY4aC04ek0xMjQgMTU2aDh2OGgtOHpNMTMyIDE1Nmg4djhoLTh6TTE1NiAxNTZoOHY4aC04ek0xNzIgMTU2aDh2OGgtOHpNMTIgMTY0aDh2OGgtOHpNNjAgMTY0aDh2OGgtOHpNNzYgMTY0aDh2OGgtOHpNMTA4IDE2NGg4djhoLTh6TTEzMiAxNjRoOHY4aC04ek0xNjQgMTY0aDh2OGgtOHpNMTcyIDE2NGg4djhoLTh6TTEyIDE3Mmg4djhoLTh6TTIwIDE3Mmg4djhoLTh6TTI4IDE3Mmg4djhoLTh6TTM2IDE3Mmg4djhoLTh6TTQ0IDE3Mmg4djhoLTh6TTUyIDE3Mmg4djhoLTh6TTYwIDE3Mmg4djhoLTh6TTkyIDE3Mmg4djhoLTh6TTEwMCAxNzJoOHY4aC04ek0xMjQgMTcyaDh2OGgtOHpNMTMyIDE3Mmg4djhoLTh6TTE0OCAxNzJoOHY4aC04ek0xNTYgMTcyaDh2OGgtOHoiIGZpbGw9IiMxMTE4MjciLz48L3N2Zz4=';

// A BankID "waiting" polling step (the step fetched after selecting the BankID authenticator). Stays
// PENDING and carries a cancel action so the tabbed selector can cancel it when switching tabs. The QR
// code is exposed as an image-typed link, matching how HAAPI delivers BankID QR codes.
const bankidWaitStep: HaapiActionStep = {
  messages: [{ text: 'Start the BankID app and scan the QR code to authenticate.', classList: [] }],
  links: [{ href: BANKID_QR_CODE, rel: 'activate', type: 'image/svg+xml', title: 'Scan with the BankID app' }],
  metadata: { viewName: 'authenticator/bankid/wait/index' },
  type: HAAPI_STEPS.POLLING,
  properties: { status: HAAPI_POLLING_STATUS.PENDING },
  actions: [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: 'poll',
      model: { href: '/authentication/authenticate/bankid/wait', method: HTTP_METHODS.GET },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.CANCEL,
      title: 'Cancel',
      model: {
        href: '/authentication/authenticate/bankid/cancel',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
        actionTitle: 'Cancel',
      },
    },
  ],
};

// ── Errors returned on form submit (see `errorOnSubmit`) ─────────────────────

const authenticationFailedError: HaapiAuthenticationFailedProblemStep = {
  type: HAAPI_PROBLEM_STEPS.INCORRECT_CREDENTIALS,
  title: 'Authentication Failed',
  messages: [{ text: 'The username or password you entered is incorrect', classList: ['is-error'] }],
  links: [{ href: '/forgot-password', rel: 'forgot-password', title: 'Forgot Password?' }],
};

const inputValidationError: HaapiInputValidationProblemStep = {
  type: HAAPI_PROBLEM_STEPS.INVALID_INPUT,
  title: 'Invalid Input',
  messages: [{ text: 'Please correct the errors below', classList: ['is-error'] }],
  invalidFields: [{ name: 'user', reason: 'missing', detail: 'Username is required' }],
  links: [{ href: '/forgot-password', rel: 'forgot-password', title: 'Forgot Password?' }],
};

/**
 * Returned after a submitted action so a flow always lands on a real "completed" screen instead of
 * erroring. Also the body of the COMPLETED example.
 */
export const completedSuccessStep: HaapiStep = {
  type: HAAPI_STEPS.COMPLETED_WITH_SUCCESS,
  properties: {},
  messages: [{ text: 'You are now signed in.', classList: [] }],
};

// ── Catalog ──────────────────────────────────────────────────────────────────

/** A single example entry: the step the mock serves plus its display metadata and kind. */
export interface ExampleEntry {
  title: string;
  /** The catalog section this example belongs to (used to group the "Step to display" selector). */
  section: string;
  step: HaapiStep;
  /** When set, the mock returns this problem step on a submitted action, so the form shows the error. */
  errorOnSubmit?: HaapiErrorStep;
  /**
   * Submit the step on mount so its post-submit state shows by default. Set for examples whose whole
   * point is the result of submitting (e.g. an authentication or validation error) — not for plain forms
   * that merely carry an `errorOnSubmit` (those should open showing the form).
   */
  autoSubmit?: boolean;
  /**
   * `'step'` — a browsable step showcase, listed in the "Step to display" selector. `'customization'` —
   * a step pinned by a customization example (not browsable; omitted from the selector).
   */
  kind: 'step' | 'customization';
}

/**
 * Every example the docs can render, keyed by a stable, url-safe slug. The slug travels in the
 * bootstrap URL (`/${key}`) and the mock maps it back to the entry's step (longest key wins, so a
 * nested slug beats a substring of a shorter one).
 */
export enum HAAPI_EXAMPLE {
  // Browsable showcase — Authenticators
  AUTHENTICATORS_HTML_FORM_LOGIN = 'authenticators/html-form/login',
  AUTHENTICATORS_HTML_FORM_ACCOUNT_CREATED = 'authenticators/html-form/account-created-hyperlink',
  AUTHENTICATORS_HTML_FORM_ACTIVATE_OTP = 'authenticators/html-form/activate-otp',
  AUTHENTICATORS_WEBAUTHN_SELECT_DEVICE = 'authenticators/webauthn/registration-select-device',
  AUTHENTICATORS_WEBAUTHN_PASSKEY = 'authenticators/webauthn/registration-passkey',
  AUTHENTICATORS_WEBAUTHN_COMPLETED = 'authenticators/webauthn/registration-completed',
  AUTHENTICATORS_DUO_SELECT_DEVICE = 'authenticators/duo-select-device',
  AUTHENTICATORS_EMAIL_LINK_WAIT = 'authenticators/email/link-wait',
  AUTHENTICATORS_EMAIL_OTP = 'authenticators/email/otp',
  // Browsable showcase — Authentication Actions
  AUTHENTICATION_ACTIONS_REQUEST_ACK = 'authentication-actions/request-acknowledgement',
  AUTHENTICATION_ACTIONS_RESET_PASSWORD = 'authentication-actions/reset-password',
  AUTHENTICATION_ACTIONS_OPT_IN_MFA_SETUP = 'authentication-actions/opt-in-mfa/setup',
  AUTHENTICATION_ACTIONS_OPT_IN_MFA_SETUP_CONFIRM = 'authentication-actions/opt-in-mfa/setup-confirm',
  AUTHENTICATION_ACTIONS_OPT_IN_MFA_SELECT = 'authentication-actions/opt-in-mfa/select',
  AUTHENTICATION_ACTIONS_SELECTOR = 'authentication-actions/selector',
  AUTHENTICATION_ACTIONS_SIGN_UP = 'authentication-actions/sign-up',
  // Browsable showcase — Authentication
  AUTHENTICATION_SELECT_AUTHENTICATOR = 'authentication/select-authenticator',
  // Browsable showcase — OAuth
  OAUTH_USER_CONSENT = 'oauth/user-consent',
  // Browsable showcase — Forms
  FORMS_DIFFERENT_INPUTS = 'forms/form-with-different-inputs',
  FORMS_AUTHENTICATION_ERROR = 'forms/form-with-authentication-error',
  FORMS_VALIDATION_ERROR = 'forms/form-with-validation-error',
  FORMS_HIDDEN_FIELD = 'forms/form-with-hidden-field',
  // Customization-pinned steps (not browsable)
  HTML_FORM_LOGIN = 'html-form-login',
  SELECT_AUTHENTICATOR = 'select-authenticator',
  EMAIL_OTP = 'email-otp',
  LOGIN_WITH_VALIDATION = 'login-with-validation',
  DIFFERENT_INPUTS = 'different-inputs',
  POLLING = 'polling',
  CLIENT_OPERATION = 'client-operation',
  GROUP_AUTHENTICATOR = 'group-authenticator',
  CUSTOM_AUTHENTICATOR_SELECT = 'custom-authenticator-select',
  BANKID_WAIT = 'bankid-wait',
  COMPLETED = 'completed',
}

/** The single source of truth: every example's step data, display metadata, and kind. */
export const EXAMPLES: Record<HAAPI_EXAMPLE, ExampleEntry> = {
  // Browsable showcase — Authenticators
  [HAAPI_EXAMPLE.AUTHENTICATORS_HTML_FORM_LOGIN]: {
    title: 'Login',
    section: 'Authenticators',
    step: authenticatorHtmlFormLogin,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATORS_HTML_FORM_ACCOUNT_CREATED]: {
    title: 'Account Created (hyperlink)',
    section: 'Authenticators',
    step: authenticatorHtmlFormAccountCreatedHyperlink,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATORS_HTML_FORM_ACTIVATE_OTP]: {
    title: 'Activate (OTP)',
    section: 'Authenticators',
    step: authenticatorHtmlFormOtpActivation,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATORS_WEBAUTHN_SELECT_DEVICE]: {
    title: 'Registration (select device)',
    section: 'Authenticators',
    step: authenticatorWebauthnRegistrationAnyDevice,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATORS_WEBAUTHN_PASSKEY]: {
    title: 'Registration (Passkey)',
    section: 'Authenticators',
    step: authenticatorWebauthnRegistrationPasskeys,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATORS_WEBAUTHN_COMPLETED]: {
    title: 'Registration Completed',
    section: 'Authenticators',
    step: authenticatorWebauthnRegistrationCompleted,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATORS_DUO_SELECT_DEVICE]: {
    title: 'Duo - Select Device',
    section: 'Authenticators',
    step: authenticatorDuoSelectDevice,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATORS_EMAIL_LINK_WAIT]: {
    title: 'Link Wait',
    section: 'Authenticators',
    step: authenticatorEmailLinkWait,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATORS_EMAIL_OTP]: {
    title: 'OTP',
    section: 'Authenticators',
    step: authenticatorEmailOtp,
    kind: 'step',
  },
  // Browsable showcase — Authentication Actions
  [HAAPI_EXAMPLE.AUTHENTICATION_ACTIONS_REQUEST_ACK]: {
    title: 'Request Acknowledgement',
    section: 'Authentication Actions',
    step: authenticationActionRequestAck,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATION_ACTIONS_RESET_PASSWORD]: {
    title: 'Reset Password',
    section: 'Authentication Actions',
    step: authenticationActionResetPassword,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATION_ACTIONS_OPT_IN_MFA_SETUP]: {
    title: 'Setup',
    section: 'Authentication Actions',
    step: authenticationActionOptInMfaSetup,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATION_ACTIONS_OPT_IN_MFA_SETUP_CONFIRM]: {
    title: 'Setup confirm',
    section: 'Authentication Actions',
    step: authenticationActionOptInMfaSetupConfirm,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATION_ACTIONS_OPT_IN_MFA_SELECT]: {
    title: 'Select',
    section: 'Authentication Actions',
    step: authenticationActionOptInMfaSelect,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATION_ACTIONS_SELECTOR]: {
    title: 'Selector',
    section: 'Authentication Actions',
    step: authenticationActionSelector,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.AUTHENTICATION_ACTIONS_SIGN_UP]: {
    title: 'Sign Up',
    section: 'Authentication Actions',
    step: authenticationActionSignUp,
    kind: 'step',
  },
  // Browsable showcase — Authentication
  [HAAPI_EXAMPLE.AUTHENTICATION_SELECT_AUTHENTICATOR]: {
    title: 'Select Authenticator',
    section: 'Authentication',
    step: authenticationSelectAuthenticator,
    kind: 'step',
  },
  // Browsable showcase — OAuth
  [HAAPI_EXAMPLE.OAUTH_USER_CONSENT]: { title: 'User Consent', section: 'OAuth', step: oauthUserConsent, kind: 'step' },
  // Browsable showcase — Forms
  [HAAPI_EXAMPLE.FORMS_DIFFERENT_INPUTS]: {
    title: 'Form with Different Inputs',
    section: 'Forms',
    step: formStepWithDifferentInputs,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.FORMS_AUTHENTICATION_ERROR]: {
    title: 'Form with Authentication Error',
    section: 'Forms',
    step: formStepWithUsernamePassword,
    errorOnSubmit: authenticationFailedError,
    autoSubmit: true,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.FORMS_VALIDATION_ERROR]: {
    title: 'Form with Validation Error',
    section: 'Forms',
    step: formStepWithUsernamePassword,
    errorOnSubmit: inputValidationError,
    autoSubmit: true,
    kind: 'step',
  },
  [HAAPI_EXAMPLE.FORMS_HIDDEN_FIELD]: {
    title: 'Form with Hidden Field',
    section: 'Forms',
    step: formStepWithHiddenField,
    kind: 'step',
  },
  // Customization-pinned steps
  [HAAPI_EXAMPLE.HTML_FORM_LOGIN]: {
    title: 'HTML Form Login',
    section: 'Customizations',
    step: htmlFormLogin,
    errorOnSubmit: authenticationFailedError,
    kind: 'customization',
  },
  [HAAPI_EXAMPLE.SELECT_AUTHENTICATOR]: {
    title: 'Select Authenticator',
    section: 'Customizations',
    step: selectAuthenticator,
    kind: 'customization',
  },
  [HAAPI_EXAMPLE.EMAIL_OTP]: { title: 'Email OTP', section: 'Customizations', step: emailOtp, kind: 'customization' },
  [HAAPI_EXAMPLE.LOGIN_WITH_VALIDATION]: {
    title: 'Login with Validation',
    section: 'Customizations',
    step: usernamePasswordForm,
    errorOnSubmit: inputValidationError,
    autoSubmit: true,
    kind: 'customization',
  },
  [HAAPI_EXAMPLE.DIFFERENT_INPUTS]: {
    title: 'Form with Different Inputs',
    section: 'Customizations',
    step: formWithDifferentInputs,
    kind: 'customization',
  },
  [HAAPI_EXAMPLE.POLLING]: {
    title: 'Polling',
    section: 'Customizations',
    step: emailLinkWaitPolling,
    kind: 'customization',
  },
  [HAAPI_EXAMPLE.CLIENT_OPERATION]: {
    title: 'Client Operation',
    section: 'Customizations',
    step: webauthnClientOperation,
    kind: 'customization',
  },
  [HAAPI_EXAMPLE.GROUP_AUTHENTICATOR]: {
    title: 'Group Authenticator',
    section: 'Customizations',
    step: groupAuthenticator,
    kind: 'customization',
  },
  [HAAPI_EXAMPLE.CUSTOM_AUTHENTICATOR_SELECT]: {
    title: 'Custom Authenticator Select',
    section: 'Customizations',
    step: customAuthenticatorSelect,
    kind: 'customization',
  },
  [HAAPI_EXAMPLE.BANKID_WAIT]: {
    title: 'BankID Wait',
    section: 'Customizations',
    step: bankidWaitStep,
    kind: 'customization',
  },
  [HAAPI_EXAMPLE.COMPLETED]: {
    title: 'Completed',
    section: 'Customizations',
    step: completedSuccessStep,
    kind: 'customization',
  },
};

/** The example the browsable selector opens on (the first `kind: 'step'` entry). */
export const DEFAULT_EXAMPLE: HAAPI_EXAMPLE = (Object.keys(EXAMPLES) as HAAPI_EXAMPLE[]).find(
  key => EXAMPLES[key].kind === 'step'
)!;

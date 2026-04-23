import {
  HAAPI_POLLING_STATUS,
  HAAPI_STEPS,
  HaapiActionStep,
} from '../src/haapi-stepper/data-access/types/haapi-step.types';
import {
  HAAPI_ACTION_CLIENT_OPERATIONS,
  HAAPI_ACTION_TYPES,
  HAAPI_FORM_ACTION_KINDS,
} from '../src/haapi-stepper/data-access/types/haapi-action.types';
import { HAAPI_FORM_FIELDS, HTTP_METHODS } from '../src/haapi-stepper/data-access/types/haapi-form.types';
import { MEDIA_TYPES } from '../src/shared/util/types/media.types';
import { PreviewItemData } from './examples';

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
      title: 'Send a new activation email',
      model: {
        href: '/authentication/register/create/user-pwd/resend-activation-email',
        method: HTTP_METHODS.POST,
        type: MEDIA_TYPES.FORM_URLENCODED,
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

export const authenticatorExamples: PreviewItemData[] = [
  {
    title: 'HTML Form',
    items: [
      {
        title: 'Login',
        step: authenticatorHtmlFormLogin,
      },
      {
        title: 'Account Created (hyperlink)',
        step: authenticatorHtmlFormAccountCreatedHyperlink,
      },
      {
        title: 'Activate (OTP)',
        step: authenticatorHtmlFormOtpActivation,
      },
    ],
  },
  {
    title: 'WebAuthn',
    items: [
      {
        title: 'Registration (select device)',
        step: authenticatorWebauthnRegistrationAnyDevice,
      },
      {
        title: 'Registration (Passkey)',
        step: authenticatorWebauthnRegistrationPasskeys,
      },
      {
        title: 'Registration Completed',
        step: authenticatorWebauthnRegistrationCompleted,
      },
    ],
  },
  {
    title: 'Duo - Select Device',
    step: authenticatorDuoSelectDevice,
  },
  {
    title: 'Email',
    items: [
      {
        title: 'Link Wait',
        step: authenticatorEmailLinkWait,
      },
      {
        title: 'OTP',
        step: authenticatorEmailOtp,
      },
    ],
  },
];

import { PreviewItemData } from './examples';
import { HAAPI_STEPS, HaapiActionStep } from '../src/haapi-stepper/data-access/types/haapi-step.types';
import { HAAPI_ACTION_TYPES, HAAPI_FORM_ACTION_KINDS } from '../src/haapi-stepper/data-access/types/haapi-action.types';
import { HAAPI_FORM_FIELDS, HTTP_METHODS } from '../src/haapi-stepper/data-access/types/haapi-form.types';
import { MEDIA_TYPES } from '../src/shared/util/types/media.types';

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
      title: 'Confirm',
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
      title: 'Cancel',
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

export const authenticationActionExamples: PreviewItemData[] = [
  {
    title: 'Request Acknowledgement',
    step: authenticationActionRequestAck,
  },
  {
    title: 'Reset Password',
    step: authenticationActionResetPassword,
  },
  {
    title: 'Opt-In MFA',
    items: [
      {
        title: 'Setup',
        step: authenticationActionOptInMfaSetup,
      },
      {
        title: 'Setup confirm',
        step: authenticationActionOptInMfaSetupConfirm,
      },
      {
        title: 'Select',
        step: authenticationActionOptInMfaSelect,
      },
    ],
  },
  {
    title: 'Selector',
    step: authenticationActionSelector,
  },
  {
    title: 'Sign Up',
    step: authenticationActionSignUp,
  },
];

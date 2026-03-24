import { HAAPI_ACTION_TYPES } from '../src/haapi-stepper/data-access/types/haapi-action.types';
import { HTTP_METHODS } from '../src/haapi-stepper/data-access/types/haapi-form.types';
import { HAAPI_STEPS, HaapiActionStep } from '../src/haapi-stepper/data-access/types/haapi-step.types';
import { PreviewItemData } from './examples';

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

export const authenticationExamples: PreviewItemData[] = [
  {
    title: 'Select Authenticator',
    step: authenticationSelectAuthenticator,
  },
];

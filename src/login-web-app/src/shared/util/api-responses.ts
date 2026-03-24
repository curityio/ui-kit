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

import {
  HaapiCompletedWithSuccessStep,
  HAAPI_POLLING_STATUS,
  HAAPI_STEPS,
  HaapiPollingStep,
  HaapiRedirectionStep,
  HaapiActionStep,
  HAAPI_PROBLEM_STEPS,
  HaapiErrorStep,
  HaapiInputValidationProblemStep,
  HaapiAuthenticationFailedProblemStep,
  HaapiUnrecoverableProblemStep,
  HaapiUnexpectedProblemStep,
  HaapiCompletedWithErrorStep,
  HaapiContinueSameStep,
} from '../../haapi-stepper/data-access/types/haapi-step.types';
import {
  HAAPI_ACTION_TYPES,
  HAAPI_ACTION_CLIENT_OPERATIONS,
  HAAPI_FORM_ACTION_KINDS,
} from '../../haapi-stepper/data-access/types/haapi-action.types';
import { HAAPI_FORM_FIELDS, HTTP_METHODS } from '../../haapi-stepper/data-access/types/haapi-form.types';
import { MEDIA_TYPES } from './types/media.types';

export function redirectionStep(redirectUrl: string): HaapiRedirectionStep {
  return {
    type: HAAPI_STEPS.REDIRECTION,
    actions: [
      {
        template: HAAPI_ACTION_TYPES.FORM,
        kind: HAAPI_FORM_ACTION_KINDS.REDIRECT,
        model: {
          href: redirectUrl,
          method: HTTP_METHODS.GET,
        },
      },
    ],
    metadata: {
      viewName: '/templates/redirect',
    },
  } as HaapiRedirectionStep;
}

export function authenticationStep(postbackUrl: string): HaapiActionStep {
  return {
    type: HAAPI_STEPS.AUTHENTICATION,
    actions: [
      {
        template: HAAPI_ACTION_TYPES.FORM,
        kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
        title: 'Login',
        model: {
          href: postbackUrl,
          method: HTTP_METHODS.POST,
          type: MEDIA_TYPES.FORM_URLENCODED,
          fields: [
            {
              name: 'username',
              type: 'username',
              value: 'user' + Math.random().toString(),
            },
          ],
        },
      },
    ],
    messages: [
      {
        text: 'Please enter your username to authenticate.',
        classList: ['authentication-message'],
      },
    ],
    metadata: {
      viewName: 'authenticator/username/authenticate/get',
    },
  } as HaapiActionStep;
}

export function createRegistrationStep(): HaapiActionStep {
  return {
    type: HAAPI_STEPS.REGISTRATION,
    actions: [
      {
        template: HAAPI_ACTION_TYPES.FORM,
        kind: HAAPI_FORM_ACTION_KINDS.USER_REGISTER,
        title: 'Create Account',
        model: {
          href: 'https://localhost:8443/dev/authn/register/create/htmlSql',
          method: HTTP_METHODS.POST,
          type: MEDIA_TYPES.FORM_URLENCODED,
          actionTitle: 'Create Account',
          fields: [
            {
              name: 'name.givenName',
              type: HAAPI_FORM_FIELDS.TEXT,
              label: 'First name',
            },
            {
              name: 'name.familyName',
              type: HAAPI_FORM_FIELDS.TEXT,
              label: 'Last name',
            },
          ],
        },
      },
    ],
    messages: [
      {
        text: 'With a Curity account, you can login using strong authentication methods.',
        classList: [],
      },
    ],
    metadata: {
      templateArea: 'lwa-dev',
      viewName: 'authenticator/html-form/create-account/get',
    },
  };
}

export function continueSameStep(withContinueActions = false): HaapiContinueSameStep {
  return {
    type: HAAPI_STEPS.CONTINUE_SAME,
    messages: [
      {
        text: withContinueActions
          ? 'Message from Continue Same Step with continueActions'
          : 'Message from Continue Same Step without continueActions',
        classList: withContinueActions ? ['info'] : ['warning'],
      },
    ],
    metadata: {
      viewName: 'templates/continue-same',
    },
  } as HaapiContinueSameStep;
}

export function pollingPendingStep(
  pollUrl: string,
  status: HAAPI_POLLING_STATUS = HAAPI_POLLING_STATUS.PENDING
): HaapiPollingStep {
  const pollingPendingActions = [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.POLL,
      model: {
        href: pollUrl,
        method: HTTP_METHODS.GET,
      },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.CANCEL,
      title: 'Restart',
      model: {
        href: `${pollUrl}/cancel`,
        method: HTTP_METHODS.GET,
        actionTitle: 'Restart',
      },
    },
  ];
  const pollingDoneActions = [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.AUTHENTICATOR_SELECTOR,
      model: {
        href: pollUrl,
        method: HTTP_METHODS.GET,
      },
    },
  ];

  return {
    type: HAAPI_STEPS.POLLING,
    properties: {
      recipientOfCommunication: 'xxxxxx7890',
      status,
    },
    actions: status === HAAPI_POLLING_STATUS.PENDING ? pollingPendingActions : pollingDoneActions,
    messages: [
      {
        text: 'Please authenticate using the SMS sent to: xxxxxx7890',
        classList: [],
      },
    ],
    links: [
      {
        href: '/dev/authn/anonymous/sms1',
        rel: 'register-create',
        title: 'Register or change phone number',
      },
    ],
    metadata: {
      viewName: 'authenticator/sms/link-wait/get',
    },
  } as HaapiPollingStep;
}

export function pollingBankIdStep(
  pollUrl: string,
  status: HAAPI_POLLING_STATUS = HAAPI_POLLING_STATUS.PENDING
): HaapiPollingStep {
  const pollingPendingActions = [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.POLL,
      model: {
        href: pollUrl,
        method: HTTP_METHODS.GET,
      },
    },
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.CANCEL,
      title: 'Cancel',
      model: {
        href: `${pollUrl}/cancel`,
        method: HTTP_METHODS.GET,
        actionTitle: 'Cancel',
      },
    },
    {
      template: HAAPI_ACTION_TYPES.CLIENT_OPERATION,
      kind: 'login',
      title: 'Start BankID',
      model: {
        name: HAAPI_ACTION_CLIENT_OPERATIONS.BANKID,
        arguments: {
          href: 'bankid:///?autostarttoken=test-token',
          autoStartToken: 'test-token',
        },
        continueActions: [
          {
            template: HAAPI_ACTION_TYPES.FORM,
            kind: HAAPI_FORM_ACTION_KINDS.CONTINUE,
            model: {
              href: `${pollUrl}/continue`,
              method: HTTP_METHODS.POST,
            },
          },
        ],
      },
    },
  ];

  const pollingDoneActions = [
    {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: HAAPI_FORM_ACTION_KINDS.AUTHENTICATOR_SELECTOR,
      model: {
        href: pollUrl,
        method: HTTP_METHODS.GET,
      },
    },
  ];

  return {
    type: HAAPI_STEPS.POLLING,
    properties: {
      status,
    },
    actions: status === HAAPI_POLLING_STATUS.PENDING ? pollingPendingActions : pollingDoneActions,
    messages: [
      {
        text: 'Scan the QR code with your BankID app',
        classList: [],
      },
    ],
    links: [
      {
        href: 'https://example.com/qr-code.svg',
        rel: 'qr-code',
        title: 'QR Code',
        type: 'image/svg+xml',
      },
    ],
    metadata: {
      viewName: 'authenticator/bankid/wait',
    },
  } as HaapiPollingStep;
}

export const completedWithSuccessStep = {
  type: HAAPI_STEPS.COMPLETED_WITH_SUCCESS,
  links: [
    {
      href: 'http://client-callback',
      rel: 'authorization-response',
    },
  ],
  metadata: {
    viewName: 'templates/oauth/success-authorization-response',
  },
  properties: {
    code: 'ziQUB25BIR9xbMLnCK0vetFEsVfYsrl8',
    iss: 'https://localhost:8443/dev/oauth/anonymous',
    state: 'foo',
  },
} as HaapiCompletedWithSuccessStep;

export const completedWithErrorStep = {
  type: HAAPI_PROBLEM_STEPS.COMPLETED_WITH_ERROR,
  title: 'Authorization Error',
  messages: [
    {
      text: 'The authorization process completed with an error.',
      classList: ['error'],
    },
  ],
  error: 'server_error',
  error_description: 'An error occurred during authorization',
} as HaapiCompletedWithErrorStep;

/**
 * Create a ProblemStep instance by problem type with proper typing
 */
export function createProblemStep(
  problemType: HAAPI_PROBLEM_STEPS.INVALID_INPUT,
  overrides?: Partial<HaapiInputValidationProblemStep>
): HaapiInputValidationProblemStep;
export function createProblemStep(
  problemType: HAAPI_PROBLEM_STEPS.INCORRECT_CREDENTIALS,
  overrides?: Partial<HaapiAuthenticationFailedProblemStep>
): HaapiAuthenticationFailedProblemStep;
export function createProblemStep(
  problemType:
    | HAAPI_PROBLEM_STEPS.AUTHENTICATION_FAILED
    | HAAPI_PROBLEM_STEPS.TOO_MANY_ATTEMPTS
    | HAAPI_PROBLEM_STEPS.GENERIC_USER_ERROR,
  overrides?: Partial<HaapiUnrecoverableProblemStep>
): HaapiUnrecoverableProblemStep;
export function createProblemStep(
  problemType: HAAPI_PROBLEM_STEPS.UNEXPECTED | HAAPI_PROBLEM_STEPS.SESSION_TOKEN_MISMATCH,
  overrides?: Partial<HaapiUnexpectedProblemStep>
): HaapiUnexpectedProblemStep;
export function createProblemStep(problemType: HAAPI_PROBLEM_STEPS, overrides?: Partial<HaapiErrorStep>) {
  const baseStep = {
    type: problemType,
    metadata: {
      viewName: 'templates/error',
    },
    ...overrides,
  };

  switch (problemType) {
    case HAAPI_PROBLEM_STEPS.INVALID_INPUT:
      return {
        ...baseStep,
        type: HAAPI_PROBLEM_STEPS.INVALID_INPUT,
        title: 'Invalid Input',
        messages: [
          {
            text: 'Some of the provided information is invalid. Please check and try again.',
            classList: ['error'],
          },
        ],
        invalidFields: [
          {
            name: 'username',
            reason: 'missing',
            detail: 'Username is required and cannot be empty',
          },
          {
            name: 'email',
            reason: 'invalidValue',
            detail: 'Please enter a valid email address',
          },
          {
            name: 'password',
            reason: 'invalidValue',
            detail: 'Password must be at least 8 characters long and contain at least one number',
          },
        ],
        ...overrides,
      } as HaapiInputValidationProblemStep;

    case HAAPI_PROBLEM_STEPS.INCORRECT_CREDENTIALS:
      return {
        ...baseStep,
        type: HAAPI_PROBLEM_STEPS.INCORRECT_CREDENTIALS,
        title: 'Incorrect Credentials',
        messages: [
          {
            text: 'The username or password you entered is incorrect. Please try again.',
            classList: ['error'],
          },
        ],
        ...overrides,
      } as HaapiAuthenticationFailedProblemStep;

    case HAAPI_PROBLEM_STEPS.AUTHENTICATION_FAILED:
    case HAAPI_PROBLEM_STEPS.TOO_MANY_ATTEMPTS:
    case HAAPI_PROBLEM_STEPS.GENERIC_USER_ERROR:
      return {
        ...baseStep,
        type: problemType,
        title: getUnrecoverableProblemTitle(problemType),
        messages: [
          {
            text: getUnrecoverableProblemDescription(problemType),
            classList: ['error'],
          },
        ],
        ...overrides,
      } as HaapiUnrecoverableProblemStep;

    case HAAPI_PROBLEM_STEPS.UNEXPECTED:
    case HAAPI_PROBLEM_STEPS.SESSION_TOKEN_MISMATCH:
      return {
        ...baseStep,
        type: problemType,
        title: getUnexpectedProblemTitle(problemType),
        messages: [
          {
            text: getUnexpectedProblemDescription(problemType),
            classList: ['error'],
          },
        ],
        ...overrides,
      } as HaapiUnexpectedProblemStep;
  }
}

function getUnrecoverableProblemTitle(type: HAAPI_PROBLEM_STEPS): string {
  switch (type) {
    case HAAPI_PROBLEM_STEPS.AUTHENTICATION_FAILED:
      return 'Authentication Failed';
    case HAAPI_PROBLEM_STEPS.TOO_MANY_ATTEMPTS:
      return 'Too Many Attempts';
    case HAAPI_PROBLEM_STEPS.GENERIC_USER_ERROR:
      return 'User Error';
    default:
      return 'Error';
  }
}

function getUnrecoverableProblemDescription(type: HAAPI_PROBLEM_STEPS): string {
  switch (type) {
    case HAAPI_PROBLEM_STEPS.AUTHENTICATION_FAILED:
      return 'The authentication process failed. Please try again or contact support.';
    case HAAPI_PROBLEM_STEPS.TOO_MANY_ATTEMPTS:
      return 'You have exceeded the maximum number of attempts. Please try again later.';
    case HAAPI_PROBLEM_STEPS.GENERIC_USER_ERROR:
      return 'There was an error with your request. Please check your input and try again.';
    default:
      return 'An error occurred.';
  }
}

function getUnexpectedProblemTitle(type: HAAPI_PROBLEM_STEPS): string {
  switch (type) {
    case HAAPI_PROBLEM_STEPS.UNEXPECTED:
      return 'Unexpected Error';
    case HAAPI_PROBLEM_STEPS.SESSION_TOKEN_MISMATCH:
      return 'Session Mismatch';
    default:
      return 'Error';
  }
}

function getUnexpectedProblemDescription(type: HAAPI_PROBLEM_STEPS): string {
  switch (type) {
    case HAAPI_PROBLEM_STEPS.UNEXPECTED:
      return 'An unexpected error occurred. Please try again or contact support.';
    case HAAPI_PROBLEM_STEPS.SESSION_TOKEN_MISMATCH:
      return 'Your session has become invalid. Please restart the authentication process.';
    default:
      return 'An error occurred.';
  }
}

import {
  HAAPI_PROBLEM_STEPS,
  HAAPI_STEPS,
  HaapiActionStep,
  HaapiAuthenticationFailedProblemStep,
  HaapiInputValidationProblemStep,
} from '../src/haapi-stepper/data-access/types/haapi-step.types';
import {
  HaapiFormAction,
  HAAPI_ACTION_TYPES,
  HAAPI_FORM_ACTION_KINDS,
} from '../src/haapi-stepper/data-access/types/haapi-action.types';
import { HAAPI_FORM_FIELDS, HTTP_METHODS } from '../src/haapi-stepper/data-access/types/haapi-form.types';
import { PreviewItemData } from './examples';

const formWithHiddenField: HaapiFormAction = {
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
};

const formWithUsernamePasswordFields: HaapiFormAction = {
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
};

const formWithDifferentInputs: HaapiFormAction = {
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
};

const stepWithHiddenField: HaapiActionStep = {
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [formWithHiddenField],
};

const stepWithUsernamePassword: HaapiActionStep = {
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [formWithUsernamePasswordFields],
};

const stepWithDifferentInputs: HaapiActionStep = {
  type: HAAPI_STEPS.AUTHENTICATION,
  actions: [formWithDifferentInputs],
};

// Example with a validation error
const inputValidationError: HaapiInputValidationProblemStep = {
  type: HAAPI_PROBLEM_STEPS.INVALID_INPUT,
  title: 'Invalid Input',
  messages: [
    {
      text: 'Please correct the errors below',
      classList: ['is-error'],
    },
  ],
  invalidFields: [
    {
      name: 'user',
      reason: 'missing',
      detail: 'Username is required',
    },
  ],
  links: [
    {
      href: '/forgot-password',
      rel: 'forgot-password',
      title: 'Forgot Password?',
    },
  ],
};

// Example authentication failed error
const authenticationFailedError: HaapiAuthenticationFailedProblemStep = {
  type: HAAPI_PROBLEM_STEPS.INCORRECT_CREDENTIALS,
  title: 'Authentication Failed',
  messages: [
    {
      text: 'The username or password you entered is incorrect',
      classList: ['is-error'],
    },
  ],
  links: [
    {
      href: '/forgot-password',
      rel: 'forgot-password',
      title: 'Forgot Password?',
    },
  ],
};

export const formExamples: PreviewItemData[] = [
  {
    title: 'Form with Different Inputs',
    step: stepWithDifferentInputs,
  },
  {
    title: 'Form with Authentication Error',
    step: stepWithUsernamePassword,
    error: authenticationFailedError,
  },
  {
    title: 'Form with Validation Error',
    step: stepWithUsernamePassword,
    error: inputValidationError,
  },
  {
    title: 'Form with Hidden Field',
    step: stepWithHiddenField,
  },
];

import { HAAPI_ACTION_TYPES, HAAPI_FORM_ACTION_KINDS } from '../src/haapi-stepper/data-access/types/haapi-action.types';
import { HAAPI_FORM_FIELDS, HTTP_METHODS } from '../src/haapi-stepper/data-access/types/haapi-form.types';
import { MEDIA_TYPES } from '../src/shared/util/types/media.types';
import { HAAPI_STEPS, HaapiActionStep } from '../src/haapi-stepper/data-access/types/haapi-step.types';
import { PreviewItemData } from './examples';

const userConsent: HaapiActionStep = {
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

export const oauthExamples: PreviewItemData[] = [
  {
    title: 'User Consent',
    step: userConsent,
  },
];

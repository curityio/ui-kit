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
  HAAPI_ACTION_TYPES,
  HAAPI_FORM_ACTION_KINDS,
} from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-action.types';
import {
  HAAPI_FORM_FIELDS,
  HTTP_METHODS,
} from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import { MEDIA_TYPES } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/media.types';
import { HAAPI_STEPS, HaapiActionStep } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';
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
    viewData: {
      clientLogo:
        'data:image/svg+xml;base64,PD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0iVVRGLTgiPz4KPHN2ZyB3aWR0aD0iMTI3cHgiIGhlaWdodD0iMTI5cHgiIHZpZXdCb3g9IjAgMCAxMjcgMTI5IiB2ZXJzaW9uPSIxLjEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiPgogICAgPCEtLSBHZW5lcmF0b3I6IFNrZXRjaCA0OC4yICg0NzMyNykgLSBodHRwOi8vd3d3LmJvaGVtaWFuY29kaW5nLmNvbS9za2V0Y2ggLS0+CiAgICA8dGl0bGU+Y3ViZTwvdGl0bGU+CiAgICA8ZGVzYz5DcmVhdGVkIHdpdGggU2tldGNoLjwvZGVzYz4KICAgIDxkZWZzPjwvZGVmcz4KICAgIDxnIGlkPSJQYWdlLTEiIHN0cm9rZT0ibm9uZSIgc3Ryb2tlLXdpZHRoPSIxIiBmaWxsPSJub25lIiBmaWxsLXJ1bGU9ImV2ZW5vZGQiPgogICAgICAgIDxnIGlkPSJjdWJlIiBmaWxsPSIjNjI2RDg3IiBmaWxsLXJ1bGU9Im5vbnplcm8iPgogICAgICAgICAgICA8ZyB0cmFuc2Zvcm09InRyYW5zbGF0ZSg4LjAwMDAwMCwgOS4wMDAwMDApIiBpZD0iU2hhcGUiPgogICAgICAgICAgICAgICAgPHBhdGggZD0iTTEwOC44MjUyNSwzMy45NDUyMjk0IEMxMDguMzc0LDMzLjk0NTIyOTQgMTA3Ljk0NjI1LDM0LjAyNzI5NjIgMTA3LjU1Nzc1LDM0LjE4NTE5MzggTDEwNi45ODc1LDM0LjQ3MjA1MzUgTDY0LjExODc1LDU2LjY1NzAzMzQgTDYzLjE0Njc1LDU3LjE1NDkyMiBDNjMuMTQ2NzUsNTcuMTU0OTIyIDYzLjEzMzc1LDU3LjE2MDY1OTIgNjMuMTMzNzUsNTcuMTY2NjQ1OSBDNjEuMjQzNzUsNTguMzMxMDQ2OCA2MCw2MC4yODYxODI2IDYwLDYyLjUxMDk2NjYgTDYwLDEwOC44NzA5ODQgQzYwLDExMC40NjI5MzEgNjEuNDEyMjUsMTExLjc1MDU1NyA2My4xNzI1LDExMS43NTA1NTcgQzYzLjcxNywxMTEuNzUwNTU3IDY0LjIzNTI1LDExMS42MjI1OTIgNjQuNjg4NzUsMTExLjQwMDMzOSBDNjQuNzI3NSwxMTEuMzc2NjQxIDY0Ljc3OTUsMTExLjM1MzQ0MyA2NC44MTg1LDExMS4zMjk5OTYgTDEwOC41MDEyNSw4OC4yMDgxMDY5IEwxMDguNTY2LDg4LjE3MjkzNTQgQzExMC42MjYyNSw4Ny4wNDk0NDMyIDExMS45OTk3NSw4NC45OTQ1MzAxIDExMS45OTk3NSw4Mi42NTg5OTMzIEwxMTEuOTk5NzUsMzYuODEzMzI3NCBDMTEyLDM1LjIyNzExOCAxMTAuNTc0NzUsMzMuOTQ1MjI5NCAxMDguODI1MjUsMzMuOTQ1MjI5NCBaIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNMTA1LjU2ODI1LDIxLjU4MjA3NTcgTDYwLjE0MzI1LDEuMTk0ODMyOTYgQzYwLjE0MzI1LDEuMTk0ODMyOTYgNTcuNDc4NSwxLjQyMTA4NTQ3ZS0xNCA1NS45OTksMS40MjEwODU0N2UtMTQgQzU0LjUxOTUsMS40MjEwODU0N2UtMTQgNTEuODY3NSwxLjE5NDgzMjk2IDUxLjg2NzUsMS4xOTQ4MzI5NiBMNi40MDM1LDIxLjU4MjA3NTcgQzYuNDAzNSwyMS41ODIwNzU3IDQuNDA2MjUsMjIuNDAzMjQyOCA0LjQwNjI1LDIzLjk0NjU0NzkgQzQuNDA2MjUsMjUuNTgzMzk0MiA2LjQ4MTI1LDI2LjgxNTE0NDggNi40ODEyNSwyNi44MTUxNDQ4IEw1Mi4xMjY3NSw1MC44NTQyMzYxIEw1Mi44NTIyNSw1MS4yMjMxNjI2IEM1My43OTgyNSw1MS42NDM5NzMzIDU0Ljg3MTUsNTEuODgzOTM3NiA1NS45OTksNTEuODgzOTM3NiBDNTcuMTM5MjUsNTEuODgzOTM3NiA1OC4yMjc3NSw1MS42NDM3MjM4IDU5LjE4NDUsNTEuMjExNDM4OCBMNTkuODE5MjUsNTAuODgzNDIwOSBMMTA1LjU0MjUsMjYuODAzMTcxNSBDMTA1LjU0MjUsMjYuODAzMTcxNSAxMDcuNDE5NSwyNS43OTY0MTg3IDEwNy40MTk1LDIzLjk0NjI5ODQgQzEwNy40MTk1LDIyLjMyNTE2NyAxMDUuNTY4MjUsMjEuNTgyMDc1NyAxMDUuNTY4MjUsMjEuNTgyMDc1NyBaIj48L3BhdGg+CiAgICAgICAgICAgICAgICA8cGF0aCBkPSJNNDguODY2NSw1Ny4xNjY4OTUzIEw0Ny44Njg1LDU2LjY1NzI4MjkgTDUuMDEwNSwzNC40NzIzMDI5IEw0LjQ0MDUsMzQuMTg1NDQzMiBDNC4wNjY3NSwzNC4wMjcyOTYyIDMuNjI2LDMzLjk0NTQ3ODggMy4xNzI3NSwzMy45NDU0Nzg4IEMxLjQyMzUsMzMuOTQ1NDc4OCAwLjAwMDI1LDM1LjIyNzExOCAwLjAwMDI1LDM2LjgxMzMyNzQgTDAuMDAwMjUsODIuNjU4OTkzMyBDMC4wMDAyNSw4NS4wMDA3NjYxIDEuMzcxNSw4Ny4wNDk2OTI3IDMuNDMyLDg4LjE3MjkzNTQgTDMuNDg0LDg4LjIwODEwNjkgTDQ3LjE2ODc1LDExMS4zMjk5OTYgQzQ3LjY0ODI1LDExMS41OTkzOTQgNDguMjE4NSwxMTEuNzUwODA2IDQ4LjgyNzc1LDExMS43NTA4MDYgQzUwLjU3NSwxMTEuNzUwODA2IDUyLjAwMDI1LDExMC40NjMxOCA1Mi4wMDAyNSwxMDguODcxMjM0IEw1Mi4wMDAyNSw2Mi41MTEyMTYgQzUyLDYwLjI4NjQzMjEgNTAuNzU2LDU4LjMzMTI5NjIgNDguODY2NSw1Ny4xNjY4OTUzIFoiPjwvcGF0aD4KICAgICAgICAgICAgPC9nPgogICAgICAgIDwvZz4KICAgIDwvZz4KPC9zdmc+',
    },
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

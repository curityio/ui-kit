import { MEDIA_TYPES } from '../../../shared/util/types/media.types';
import { HAAPI_FORM_FIELDS, HTTP_METHODS } from '../../data-access/types/haapi-form.types';
import type {
  HaapiStepperStep,
  HaapiStepperFormAction,
  HaapiStepperSelectorAction,
  HaapiStepperClientOperationAction,
  HaapiStepperUserMessage,
  HaapiStepperLink,
  HaapiStepperAPI,
  HaapiStepperWebAuthnAnyDeviceRegistrationAction,
  HaapiStepperWebAuthnAuthenticationClientOperationAction,
  HaapiStepperWebAuthnPasskeysRegistrationAction,
} from '../../feature/stepper/haapi-stepper.types';
import { formatNextStepData } from '../../feature/stepper/data-formatters/format-next-step-data';
import { HaapiStepperViewNameBuiltInUI } from '../../feature/viewnames';
import {
  HAAPI_ACTION_CLIENT_OPERATIONS,
  HAAPI_ACTION_TYPES,
  HAAPI_FORM_ACTION_KINDS,
  HAAPI_POLLING_STATUS,
  HAAPI_STEPPER_ELEMENT_TYPES,
  HAAPI_STEPS,
} from '../../data-access';

export const mockNextStep = vi.fn();
export const MockMessageText = 'Step Message';
export const MockLinkText = 'Step Link';
export const MockActionTitle = 'Step Action';
export const MockMessageClassList = 'message-classlist';

export const createMockStep = (type: HAAPI_STEPS, overrides = {}): HaapiStepperStep => {
  const mockMessage = createMockMessage({ text: MockMessageText });
  const mockLink = createMockLink({ title: MockLinkText });
  const mockAction = createMockFormAction({ title: MockActionTitle });

  const step = {
    type,
    messages: [mockMessage],
    links: [mockLink],
    actions: [mockAction],
    metadata: {
      templateArea: 'lwa',
      viewName: 'views/select-authenticator/index',
    },
    dataHelpers: {
      messages: [mockMessage],
      links: [mockLink],
    },
    ...overrides,
  } as HaapiStepperStep;

  return formatNextStepData(step);
};

export const createMockFormAction = (overrides: Partial<HaapiStepperFormAction> = {}): HaapiStepperFormAction => ({
  id: crypto.randomUUID(),
  type: HAAPI_STEPPER_ELEMENT_TYPES.ACTION,
  subtype: HAAPI_ACTION_TYPES.FORM,
  kind: 'form',
  title: 'Login Form',
  template: HAAPI_ACTION_TYPES.FORM,
  model: {
    href: '/login',
    method: HTTP_METHODS.POST,
    type: MEDIA_TYPES.FORM_URLENCODED,
    fields: [
      {
        id: crypto.randomUUID(),
        type: HAAPI_FORM_FIELDS.USERNAME,
        name: 'username',
        label: 'Username',
      },
      {
        id: crypto.randomUUID(),
        type: HAAPI_FORM_FIELDS.PASSWORD,
        name: 'password',
        label: 'Password',
      },
    ],
    ...overrides.model,
  },
  ...overrides,
});

export const createMockSelectorAction = (
  overrides: Partial<HaapiStepperSelectorAction> = {}
): HaapiStepperSelectorAction => ({
  id: crypto.randomUUID(),
  type: HAAPI_STEPPER_ELEMENT_TYPES.ACTION,
  subtype: HAAPI_ACTION_TYPES.SELECTOR,
  kind: 'selector',
  title: 'Choose Option',
  template: HAAPI_ACTION_TYPES.SELECTOR,
  model: {
    options: [createMockFormAction({ title: 'Option 1' }), createMockFormAction({ title: 'Option 2' })],
    ...overrides.model,
  },
  ...overrides,
});

export const createMockClientOperationAction = (
  overrides: Partial<HaapiStepperClientOperationAction> = {}
): HaapiStepperClientOperationAction => ({
  id: crypto.randomUUID(),
  type: HAAPI_STEPPER_ELEMENT_TYPES.ACTION,
  subtype: HAAPI_ACTION_TYPES.CLIENT_OPERATION,
  kind: 'client-operation',
  title: 'External Browser',
  template: HAAPI_ACTION_TYPES.CLIENT_OPERATION,
  model: {
    name: HAAPI_ACTION_CLIENT_OPERATIONS.EXTERNAL_BROWSER_FLOW,
    arguments: {
      href: '/external-browser',
    },
    continueActions: [createMockFormAction({ title: 'Continue' })],
    ...overrides.model,
  },
  ...overrides,
});

export const createMockMessage = (overrides = {}): HaapiStepperUserMessage => ({
  text: 'Test message',
  classList: [MockMessageClassList],
  id: crypto.randomUUID(),
  type: HAAPI_STEPPER_ELEMENT_TYPES.MESSAGE,
  ...overrides,
});

export const createMockLink = (overrides = {}): HaapiStepperLink => ({
  rel: 'help',
  title: 'Help',
  href: '/help',
  id: crypto.randomUUID(),
  type: HAAPI_STEPPER_ELEMENT_TYPES.LINK,
  subtype: 'help',
  ...overrides,
});

export const createHaapiStepperApiMock = (overrides: Partial<HaapiStepperAPI> = {}): HaapiStepperAPI => ({
  ...defaultStepperAPI,
  ...overrides,
});

export const defaultStepperAPI: HaapiStepperAPI = {
  currentStep: createMockStep(HAAPI_STEPS.AUTHENTICATION),
  loading: false,
  error: null,
  history: [],
  nextStep: mockNextStep,
};

// ============================================================================
// Client-operation action factories
// ============================================================================

export const externalBrowserFlowActionTitle = 'Continue in browser';
export const bankIdActionTitle = 'Open BankID';
export const webAuthnRegistrationActionTitle = 'Register a passkey';
export const webAuthnAnyDeviceActionTitle = 'Register device';
export const webAuthnPlatformOnlyAnyDeviceActionTitle = 'Register device (This device)';
export const webAuthnCrossPlatformOnlyAnyDeviceActionTitle = 'Register device (Another device)';
export const webAuthnAuthenticationActionTitle = 'Use passkey';

const continueAction = createMockFormAction({
  kind: HAAPI_FORM_ACTION_KINDS.CONTINUE,
  title: 'Continue',
});

const WEBAUTHN_PUBLIC_KEY = {
  challenge: 'c',
  rp: { name: 'r' },
  user: { id: 'u', name: 'n', displayName: 'd' },
  pubKeyCredParams: [],
} as never;

export const createMockExternalBrowserFlowAction = (
  overrides: Partial<HaapiStepperClientOperationAction> = {}
): HaapiStepperClientOperationAction =>
  createMockClientOperationAction({
    title: externalBrowserFlowActionTitle,
    model: {
      name: HAAPI_ACTION_CLIENT_OPERATIONS.EXTERNAL_BROWSER_FLOW,
      arguments: { href: '/external-browser' },
      continueActions: [continueAction],
    },
    ...overrides,
  });

export const createMockBankIdAction = (
  overrides: Partial<HaapiStepperClientOperationAction> = {}
): HaapiStepperClientOperationAction =>
  createMockClientOperationAction({
    title: bankIdActionTitle,
    kind: 'bankid',
    model: {
      name: HAAPI_ACTION_CLIENT_OPERATIONS.BANKID,
      arguments: { href: '/bankid', autoStartToken: 'token' },
      continueActions: [continueAction],
    },
    ...overrides,
  });

const PUBLIC_KEY = { publicKey: WEBAUTHN_PUBLIC_KEY };

const webAuthnActionMetadata = {
  type: HAAPI_STEPPER_ELEMENT_TYPES.ACTION,
  subtype: HAAPI_ACTION_TYPES.CLIENT_OPERATION,
  template: HAAPI_ACTION_TYPES.CLIENT_OPERATION,
} as const;

const createMockWebAuthnAction = <K extends string, M>(title: string, kind: K, model: M) => ({
  ...webAuthnActionMetadata,
  id: crypto.randomUUID(),
  title,
  kind,
  model,
});

export const createMockWebAuthnRegistrationAction = (): HaapiStepperWebAuthnPasskeysRegistrationAction =>
  createMockWebAuthnAction(webAuthnRegistrationActionTitle, 'device-register', {
    name: HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_REGISTRATION,
    arguments: { credentialCreationOptions: PUBLIC_KEY },
    continueActions: [continueAction],
  });

export const createMockWebAuthnAnyDeviceBothOptionsAction = (): HaapiStepperWebAuthnAnyDeviceRegistrationAction =>
  createMockWebAuthnAction(webAuthnAnyDeviceActionTitle, 'device-register', {
    name: HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_REGISTRATION,
    arguments: {
      platformCredentialCreationOptions: PUBLIC_KEY,
      crossPlatformCredentialCreationOptions: PUBLIC_KEY,
    },
    continueActions: [continueAction],
  });

export const createMockWebAuthnPlatformOnlyAnyDeviceAction = (): HaapiStepperWebAuthnAnyDeviceRegistrationAction =>
  createMockWebAuthnAction(webAuthnPlatformOnlyAnyDeviceActionTitle, 'device-register', {
    name: HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_REGISTRATION,
    arguments: { platformCredentialCreationOptions: PUBLIC_KEY },
    continueActions: [continueAction],
  });

export const createMockWebAuthnCrossPlatformOnlyAnyDeviceAction = (): HaapiStepperWebAuthnAnyDeviceRegistrationAction =>
  createMockWebAuthnAction(webAuthnCrossPlatformOnlyAnyDeviceActionTitle, 'device-register', {
    name: HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_REGISTRATION,
    arguments: { crossPlatformCredentialCreationOptions: PUBLIC_KEY },
    continueActions: [continueAction],
  });

export const createMockWebAuthnAuthenticationAction = (): HaapiStepperWebAuthnAuthenticationClientOperationAction =>
  createMockWebAuthnAction(webAuthnAuthenticationActionTitle, 'device-authn', {
    name: HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_AUTHENTICATION,
    arguments: { credentialRequestOptions: PUBLIC_KEY },
    continueActions: [continueAction],
  });
export const createBankIdPollingStep = (
  overrides: { status?: HAAPI_POLLING_STATUS; links?: HaapiStepperLink[]; viewName?: string } = {}
) => {
  return createMockStep(HAAPI_STEPS.POLLING, {
    metadata: {
      templateArea: 'lwa',
      viewName: overrides.viewName ?? HaapiStepperViewNameBuiltInUI.BANKID,
    },
    properties: { status: overrides.status ?? HAAPI_POLLING_STATUS.PENDING },
    ...(overrides.links !== undefined && { links: overrides.links }),
  });
};

export const createMockQrLink = (overrides: Partial<HaapiStepperLink> = {}) => {
  return createMockLink({
    rel: 'activation',
    title: 'QR Code',
    href: 'data:image/svg+xml;base64,abc',
    type: 'image/svg+xml',
    ...overrides,
  });
};

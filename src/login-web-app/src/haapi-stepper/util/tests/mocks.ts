import { MEDIA_TYPES } from '../../../shared/util/types/media.types';
import { HAAPI_STEPPER_ELEMENT_TYPES, HAAPI_STEPS } from '../../data-access/types/haapi-step.types';
import { HAAPI_ACTION_TYPES, HAAPI_ACTION_CLIENT_OPERATIONS } from '../../data-access/types/haapi-action.types';
import { HAAPI_FORM_FIELDS, HTTP_METHODS } from '../../data-access/types/haapi-form.types';
import type {
  HaapiStepperStep,
  HaapiStepperFormAction,
  HaapiStepperSelectorAction,
  HaapiStepperClientOperationAction,
  HaapiStepperUserMessage,
  HaapiStepperLink,
  HaapiStepperAPI,
} from '../../feature/stepper/haapi-stepper.types';
import { formatNextStepData } from '../../feature/stepper/data-formatters/format-next-step-data';

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

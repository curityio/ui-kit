import { ReactElement } from 'react';
import {
  HAAPI_ACTION_TYPES,
  HAAPI_FORM_ACTION_KINDS,
  HaapiClientOperationAction,
  HaapiFormAction,
  HaapiSelectorAction,
} from '../../data-access/types/haapi-action.types';
import {
  HAAPI_STEPPER_ELEMENT_TYPES,
  HaapiUserMessage,
  HaapiLink,
  HaapiActionStep,
  HaapiCompletedStep,
  HaapiAuthenticationStep,
  HaapiRegistrationStep,
  HaapiUserConsentStep,
  HaapiConsentorStep,
  HaapiPollingStep,
  HaapiCompletedWithSuccessStep,
  HaapiCompletedWithErrorStep,
  HaapiAppError,
  HaapiUnrecoverableProblemStep,
  HaapiUnexpectedProblemStep,
  HaapiInputError,
  HaapiInputValidationProblemStep,
  HaapiAuthenticationFailedProblemStep,
} from '../../data-access/types/haapi-step.types';
import { HaapiFetchPayload } from '../../data-access/types/haapi-fetch.types';
import {
  HaapiCheckboxFormField,
  HaapiContextFormField,
  HaapiFormField,
  HaapiHiddenFormField,
  HaapiPasswordFormField,
  HaapiSelectFormField,
  HaapiTextFormField,
  HaapiUsernameFormField,
} from '../../data-access';

/**
 * Public API provided by the `HaapiStepper`, accessed via the `useHaapiStepper` hook.
 */
export interface HaapiStepperAPI {
  // Current step in the flow
  currentStep: HaapiStepperStep | null;
  // Loading state during step transitions
  loading: boolean;
  // Error information if something goes wrong
  error: HaapiStepperError | null;
  // Advance to the next step with optional form data
  nextStep: HaapiStepperNextStep;
  // Complete history of all steps and actions taken
  history: HaapiStepperHistoryEntry[];
}

/*
 * STEP TYPINGS
 */
export type HaapiStepperStep = (HaapiActionStep | HaapiCompletedStep) & HaapiStepperDataHelpers;

export type HaapiStepperActionStep = HaapiActionStep & HaapiStepperDataHelpers;
export type HaapiStepperAuthenticationStep = HaapiAuthenticationStep & HaapiStepperDataHelpers;
export type HaapiStepperRegistrationStep = HaapiRegistrationStep & HaapiStepperDataHelpers;
export type HaapiStepperUserConsentStep = HaapiUserConsentStep & HaapiStepperDataHelpers;
export type HaapiStepperConsentorStep = HaapiConsentorStep & HaapiStepperDataHelpers;
export type HaapiStepperPollingStep = HaapiPollingStep & HaapiStepperDataHelpers;

export type HaapiStepperCompletedStep = HaapiCompletedStep & HaapiStepperDataHelpers;
export type HaapiStepperCompletedWithSuccessStep = HaapiCompletedWithSuccessStep & HaapiStepperDataHelpers;
export type HaapiStepperCompletedWithErrorStep = HaapiCompletedWithErrorStep & HaapiStepperDataHelpers;

export type HaapiStepperAppError = HaapiAppError & HaapiStepperDataHelpers;
export type HaapiStepperUnrecoverableProblemStep = HaapiUnrecoverableProblemStep & HaapiStepperDataHelpers;
export type HaapiStepperUnexpectedProblemStep = HaapiUnexpectedProblemStep & HaapiStepperDataHelpers;

export type HaapiStepperInputError = HaapiInputError & HaapiStepperDataHelpers;
export type HaapiStepperInputValidationProblemStep = HaapiInputValidationProblemStep & HaapiStepperDataHelpers;
export type HaapiStepperAuthenticationFailedProblemStep = HaapiAuthenticationFailedProblemStep &
  HaapiStepperDataHelpers;

/*
 * STEP ACTION TYPINGS
 */
export type HaapiStepperAction =
  | HaapiStepperFormAction
  | HaapiStepperSelectorAction
  | HaapiStepperClientOperationAction;
export type HaapiStepperFormAction = Omit<HaapiFormAction, 'model'> &
  HaapiStepperDataHelpersDetails<HAAPI_STEPPER_ELEMENT_TYPES.ACTION, HAAPI_ACTION_TYPES.FORM> & {
    model: Omit<HaapiFormAction['model'], 'fields'> & {
      fields?: HaapiStepperFormField[];
    };
  };
export type HaapiStepperSelectorAction = Omit<HaapiSelectorAction, 'model'> &
  HaapiStepperDataHelpersDetails<HAAPI_STEPPER_ELEMENT_TYPES.ACTION, HAAPI_ACTION_TYPES.SELECTOR> & {
    model: {
      options: HaapiStepperAction[];
    };
  };
export type HaapiStepperClientOperationAction = HaapiClientOperationAction &
  HaapiStepperDataHelpersDetails<HAAPI_STEPPER_ELEMENT_TYPES.ACTION, HAAPI_ACTION_TYPES.CLIENT_OPERATION> & {
    /** Polling session maximum time in seconds before the session expires. */
    maxWaitTime?: number;
    /** Polling session remaining time in seconds before the session expires. */
    maxWaitRemainingTime?: number;
  };

/*
 * STEP MESSAGE TYPINGS
 */
export type HaapiStepperUserMessage = HaapiUserMessage &
  HaapiStepperDataHelpersDetails<HAAPI_STEPPER_ELEMENT_TYPES.MESSAGE>;

/*
 * STEP LINK TYPINGS
 */
export type HaapiStepperLink = HaapiLink & HaapiStepperDataHelpersDetails<HAAPI_STEPPER_ELEMENT_TYPES.LINK>;

/*
 * ERROR TYPINGS
 */
export interface HaapiStepperError {
  app?: HaapiStepperAppError | null;
  input?: HaapiStepperInputError | null;
}

/*
 * NEXT STEP TYPINGS
 */
export type HaapiStepperNextStep<T extends HaapiStepperNextStepAction = HaapiStepperNextStepAction> = (
  action: T,
  payload?: T extends HaapiStepperLink ? never : HaapiStepperNextStepPayload
) => void;

export type HaapiStepperNextStepAsync = (
  action: HaapiStepperNextStepAction,
  payload?: HaapiStepperNextStepPayload
) => Promise<void>;

export type HaapiStepperNextStepAction = HaapiStepperFormAction | HaapiStepperClientOperationAction | HaapiStepperLink;
export type HaapiStepperNextStepPayload = HaapiFetchPayload;

/*
 * HISTORY TYPINGS
 */
export interface HaapiStepperHistoryEntry<T extends HaapiStepperStep = HaapiStepperStep> {
  step: T;
  triggeredByAction: HaapiStepperNextStepAction;
  triggeredByPayload?: HaapiStepperNextStepPayload;
  timestamp: Date;
}

/*
 * FORM TYPINGS
 */
export type HaapiStepperFormField = HaapiFormField & HaapiStepperFormFieldDataHelpers;
export type HaapiStepperVisibleFormField = Exclude<
  HaapiStepperFormField,
  HaapiStepperHiddenFormField | HaapiStepperContextFormField
>;
export type HaapiStepperTextFormField = HaapiTextFormField & HaapiStepperFormFieldDataHelpers;
export type HaapiStepperPasswordFormField = HaapiPasswordFormField & HaapiStepperFormFieldDataHelpers;
export type HaapiStepperUsernameFormField = HaapiUsernameFormField & HaapiStepperFormFieldDataHelpers;
export type HaapiStepperSelectFormField = HaapiSelectFormField & HaapiStepperFormFieldDataHelpers;
export type HaapiStepperCheckboxFormField = HaapiCheckboxFormField & HaapiStepperFormFieldDataHelpers;
export type HaapiStepperHiddenFormField = HaapiHiddenFormField & HaapiStepperFormFieldDataHelpers;
export type HaapiStepperContextFormField = HaapiContextFormField & HaapiStepperFormFieldDataHelpers;

export interface HaapiStepperFormFieldDataHelpers {
  id: string;
}

export interface HaapiStepperFormAPI {
  fields: HaapiStepperVisibleFormField[];
  formState: HaapiStepperFormState;
}

export type HaapiStepperFormChildrenRenderInterceptor = (
  props: HaapiStepperFormAPI
) => ReactElement | HaapiStepperFormAPI | null | undefined;

export type HaapiStepperFormFieldRenderInterceptor = (
  field: HaapiStepperVisibleFormField,
  formState: HaapiStepperFormState,
  index: number
) => ReactElement | HaapiStepperVisibleFormField | null | undefined;

export interface HaapiStepperFormState {
  readonly values: ReadonlyMap<string, string>;

  get(field: HaapiStepperCheckboxFormField): boolean;

  get(field: Exclude<HaapiStepperFormField, HaapiStepperCheckboxFormField>): string;

  set(field: HaapiStepperCheckboxFormField, value: boolean): void;

  set(field: Exclude<HaapiStepperFormField, HaapiStepperCheckboxFormField>, value: string): void;
}

/*
 * HELPER TYPINGS
 */
export interface HaapiStepperDataHelpers {
  dataHelpers: {
    actions?: HaapiStepperDataHelpersActionsMap;
    messages: HaapiStepperUserMessage[];
    links: HaapiStepperLink[];
  };
}
export type HaapiStepperDataHelpersDetails<
  T,
  ST extends T extends HAAPI_STEPPER_ELEMENT_TYPES.ACTION
    ? HAAPI_ACTION_TYPES
    : T extends HAAPI_STEPPER_ELEMENT_TYPES.LINK
      ? HaapiLink['type']
      : never = never,
> = {
  id: string;
  type: T;
} & (T extends HAAPI_STEPPER_ELEMENT_TYPES.ACTION
  ? { subtype: ST }
  : T extends HAAPI_STEPPER_ELEMENT_TYPES.LINK
    ? { subtype: HaapiLink['type'] }
    : { subtype?: never });
export interface HaapiStepperDataHelpersActionsMap {
  all: HaapiStepperAction[];
  form: HaapiStepperFormAction[];
  formByKind: HaapiStepperFormActionsByKind;
  selector: HaapiStepperSelectorAction[];
  clientOperation: HaapiStepperClientOperationAction[];
}
export type HaapiStepperFormActionsByKind = Partial<Record<HAAPI_FORM_ACTION_KINDS, HaapiStepperFormAction[]>> &
  Record<string, HaapiStepperFormAction[] | undefined>;

/*
 * STEP UI COMPONENT RENDER INTERCEPTOR TYPINGS
 */
export interface HaapiStepperAPIWithRequiredCurrentStep extends HaapiStepperAPI {
  currentStep: HaapiStepperStep;
}

export type HaapiStepperStepUIActionsRenderInterceptor = (
  props: HaapiStepperAPIWithRequiredCurrentStep
) => ReactElement | HaapiStepperAPIWithRequiredCurrentStep | null | undefined;
export type HaapiStepperStepUIFormActionRenderInterceptor = (
  props: HaapiStepperAPIWithRequiredCurrentStep & { action: HaapiStepperFormAction }
) => ReactElement | HaapiStepperFormAction | null | undefined;
export type HaapiStepperStepUISelectorActionRenderInterceptor = (
  props: HaapiStepperAPIWithRequiredCurrentStep & { action: HaapiStepperSelectorAction }
) => ReactElement | HaapiStepperSelectorAction | null | undefined;
export type HaapiStepperStepUIClientOperationActionRenderInterceptor = (
  props: HaapiStepperAPIWithRequiredCurrentStep & { action: HaapiStepperClientOperationAction }
) => ReactElement | HaapiStepperClientOperationAction | null | undefined;
export type HaapiStepperStepUILinkRenderInterceptor = (
  props: HaapiStepperAPIWithRequiredCurrentStep & { link: HaapiStepperLink }
) => ReactElement | HaapiStepperLink | null | undefined;
export type HaapiStepperStepUIMessageRenderInterceptor = (
  props: HaapiStepperAPIWithRequiredCurrentStep & { message: HaapiStepperUserMessage }
) => ReactElement | HaapiStepperUserMessage | null | undefined;
export type HaapiStepperStepUIStepRenderInterceptor = (
  props: HaapiStepperAPIWithRequiredCurrentStep
) => ReactElement | HaapiStepperAPIWithRequiredCurrentStep | null | undefined;
export type HaapiStepperStepUILoadingRenderInterceptor = (
  props: HaapiStepperAPI
) => ReactElement | HaapiStepperAPI | null | undefined;
export type HaapiStepperStepUIErrorRenderInterceptor = (
  props: HaapiStepperAPI
) => ReactElement | HaapiStepperAPI | null | undefined;
export type HaapiStepperActionsActionRenderInterceptor<T extends HaapiStepperAction> = (
  action: T
) => ReactElement | T | null | undefined;

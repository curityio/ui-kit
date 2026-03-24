import { HaapiContinueSameStep } from '../../../data-access/types/haapi-step.types';
import {
  HaapiFormAction,
  HaapiClientOperationAction,
  HAAPI_ACTION_TYPES,
} from '../../../data-access/types/haapi-action.types';
import { HaapiStepperStep } from '../haapi-stepper.types';
import { formatNextStepData } from './format-next-step-data';

export function formatContinueSameStepData(
  continueSameNextStepTriggerAction: HaapiFormAction | HaapiClientOperationAction,
  continueSameNextStep: HaapiContinueSameStep,
  currentStep: HaapiStepperStep | null
): HaapiStepperStep {
  if (!currentStep) {
    throw new Error('Can not continue to the same step on initial load (no current step)');
  }
  const continueFormActions = getContinueFormActions(continueSameNextStepTriggerAction);

  if (continueFormActions) {
    return formatNextStepData({
      ...currentStep,
      ...{ actions: continueFormActions },
      messages: [...(continueSameNextStep.messages ?? []), ...(currentStep.messages ?? [])],
    });
  } else {
    return formatNextStepData({
      ...currentStep,
      ...{ actions: [] },
      messages: continueSameNextStep.messages ?? [],
    });
  }
}

function getContinueFormActions(
  continueSameNextStepTriggerAction: HaapiFormAction | HaapiClientOperationAction
): HaapiFormAction[] | null {
  if (!('model' in continueSameNextStepTriggerAction)) {
    return null;
  }

  const continueFormActions = continueSameNextStepTriggerAction.model.continueActions?.filter(
    action => action.template === HAAPI_ACTION_TYPES.FORM
  );

  return continueFormActions?.length ? continueFormActions : null;
}

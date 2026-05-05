import { RefObject } from 'react';
import { HaapiPollingStep, HAAPI_POLLING_STATUS, HAAPI_STEPS } from '../../../data-access/types/haapi-step.types';
import type {
  HaapiStepperNextStep,
  HaapiStepperError,
  HaapiStepperStep,
  HaapiStepperHistoryEntry,
} from '../haapi-stepper.types';
import { HaapiStepperConfig } from '../HaapiStepper';
import { formatNextStepData } from './format-next-step-data';
import { HAAPI_FORM_ACTION_KINDS } from '../../../data-access/types/haapi-action.types';
import { isBankIdClientOperation, openBankIdApp } from '../../actions/client-operation/operations/bankid';
import { HaapiStepperPollingStep } from '../haapi-stepper.types';

export function handlePollingStep(
  pollingStep: HaapiPollingStep,
  pendingOperation: RefObject<AbortController | NodeJS.Timeout | null>,
  nextStep: HaapiStepperNextStep,
  config: HaapiStepperConfig,
  history: HaapiStepperHistoryEntry[] = []
): {
  nextStepData?: HaapiStepperStep;
  nextStepError?: HaapiStepperError;
} {
  const formattedPollingStep = formatNextStepData(pollingStep);
  const pollingStatus = pollingStep.properties.status;
  const pollingInterval = pollingStep.properties.interval
    ? Number(pollingStep.properties.interval)
    : config.pollingInterval;

  switch (pollingStatus) {
    case HAAPI_POLLING_STATUS.DONE: {
      const doneAction = formattedPollingStep.dataHelpers.actions?.form[0];

      if (doneAction) {
        nextStep(doneAction);
      }

      return { nextStepData: formattedPollingStep };
    }
    case HAAPI_POLLING_STATUS.FAILED: {
      return { nextStepData: formattedPollingStep };
    }
    case HAAPI_POLLING_STATUS.PENDING: {
      const pollingAction = formattedPollingStep.dataHelpers.actions?.formByKind.poll?.[0];

      if (!pollingAction) {
        throw new Error('Polling step must have a poll action when status is pending');
      }

      const stepWithoutPollingAction = {
        ...pollingStep,
        actions: pollingStep.actions.filter(action => action.kind !== HAAPI_FORM_ACTION_KINDS.POLL),
      };

      const formattedNextStepData = formatNextStepData(stepWithoutPollingAction);

      if (isBankIdPollingSession(formattedPollingStep)) {
        if (config.bankIdAutostart) {
          manageBankIdAutoStart(pollingStep, history);
        }
      }

      pendingOperation.current = setTimeout(() => {
        nextStep(pollingAction);
      }, pollingInterval);

      return { nextStepData: formattedNextStepData };
    }
  }
}

function isBankIdPollingSession(pollingStep: HaapiStepperPollingStep): boolean {
  return !!pollingStep.actions.find(isBankIdClientOperation);
}

const manageBankIdAutoStart = (pollingStep: HaapiPollingStep, history: HaapiStepperHistoryEntry[]) => {
  const wasAlreadyPolling = history[history.length - 1]?.step.type === HAAPI_STEPS.POLLING;

  if (wasAlreadyPolling) {
    return;
  }

  const bankIdAction = pollingStep.actions.find(isBankIdClientOperation);

  if (bankIdAction) {
    openBankIdApp(bankIdAction);
  }
};

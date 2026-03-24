import { HAAPI_PROBLEM_STEPS, HaapiErrorStep } from '../../../data-access/types/haapi-step.types';
import { HaapiStepperAppError, HaapiStepperInputError } from '../haapi-stepper.types';
import type { HaapiStepperError } from '../haapi-stepper.types';
import { getElementWithDataHelpers } from './format-next-step-data';

export function formatErrorStepData(step: HaapiErrorStep): HaapiStepperError {
  let appError: HaapiStepperAppError | null = null;
  let inputError: HaapiStepperInputError | null = null;
  const dataHelpers = {
    messages: step.messages?.map(message => getElementWithDataHelpers(message)) ?? [],
    links: step.links?.map(link => getElementWithDataHelpers(link)) ?? [],
  };

  switch (step.type) {
    case HAAPI_PROBLEM_STEPS.INVALID_INPUT:
    case HAAPI_PROBLEM_STEPS.TOO_MANY_ATTEMPTS:
    case HAAPI_PROBLEM_STEPS.INCORRECT_CREDENTIALS:
    case HAAPI_PROBLEM_STEPS.AUTHENTICATION_FAILED:
      inputError = {
        ...step,
        dataHelpers,
      };
      break;
    case HAAPI_PROBLEM_STEPS.UNEXPECTED:
    case HAAPI_PROBLEM_STEPS.SESSION_TOKEN_MISMATCH:
    case HAAPI_PROBLEM_STEPS.GENERIC_USER_ERROR:
      appError = {
        ...step,
        dataHelpers,
      };
      break;
  }

  return {
    app: appError,
    input: inputError,
  };
}

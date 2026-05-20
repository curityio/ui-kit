import { HaapiFetchFormAction } from '../../../../../data-access';
import { HaapiStepperError } from '../../../../stepper/haapi-stepper.types';

export enum WEBAUTHN_ERROR_TYPE {
  CANCEL_OR_TIMEOUT = 'cancelOrTimeout',
  FAILED = 'failed',
}

export enum WEBAUTHN_OPERATION {
  REGISTRATION = 'registration',
  AUTHENTICATION = 'authentication',
}

export type ClientOperationResult =
  | { clientOperationData: HaapiFetchFormAction; clientOperationError?: undefined }
  | { clientOperationData?: undefined; clientOperationError: HaapiStepperError };

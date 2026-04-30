import { HaapiStepperUserMessage } from '../../feature/stepper/haapi-stepper.types';
import { HaapiStepperMessageUI } from './HaapiStepperMessageUI';

export const defaultHaapiStepperMessageElementFactory = (message: HaapiStepperUserMessage) => (
  <HaapiStepperMessageUI message={message} />
);

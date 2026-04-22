import { HaapiStepperLink } from '../../feature/stepper/haapi-stepper.types';
import { HaapiStepperLinkUI } from './HaapiStepperLinkUI';

export const defaultHaapiStepperLinkElementFactory = (
  link: HaapiStepperLink,
  onClick: (link: HaapiStepperLink) => void
) => <HaapiStepperLinkUI link={link} onClick={onClick} />;

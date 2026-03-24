import { HaapiStepperLink } from '../../feature/stepper/haapi-stepper.types';
import { Link } from './Link';

export const defaultHaapiStepperLinkElementFactory = (
  link: HaapiStepperLink,
  onClick: (link: HaapiStepperLink) => void
) => <Link link={link} onClick={onClick} />;

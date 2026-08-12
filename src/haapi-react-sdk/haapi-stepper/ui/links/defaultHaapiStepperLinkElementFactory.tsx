/*
 * Copyright (C) 2026 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { HaapiStepperLink } from '../../feature/stepper/haapi-stepper.types';
import { HaapiStepperLinkUI } from './HaapiStepperLinkUI';

export const defaultHaapiStepperLinkElementFactory = (
  link: HaapiStepperLink,
  onClick: (link: HaapiStepperLink) => void
) => <HaapiStepperLinkUI link={link} onClick={onClick} />;

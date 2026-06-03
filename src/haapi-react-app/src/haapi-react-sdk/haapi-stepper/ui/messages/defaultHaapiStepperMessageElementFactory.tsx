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

import { HaapiStepperUserMessage } from '../../feature/stepper/haapi-stepper.types';
import { HaapiStepperMessageUI } from './HaapiStepperMessageUI';

export const defaultHaapiStepperMessageElementFactory = (message: HaapiStepperUserMessage) => (
  <HaapiStepperMessageUI message={message} />
);

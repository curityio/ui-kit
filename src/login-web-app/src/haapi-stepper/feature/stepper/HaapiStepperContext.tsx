/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { createContext } from 'react';
import type { HaapiStepperAPI } from './haapi-stepper.types';

export const HaapiStepperContext = createContext<HaapiStepperAPI | null>(null);

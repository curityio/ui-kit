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

import type { ReactElement } from 'react';
import type { HaapiStepperAPIWithRequiredCurrentStep } from '../stepper/haapi-stepper.types';
import type { HaapiStepperStepUIProps } from '../steps/typings';

/**
 * Props every viewName built-in UI receives. It's `HaapiStepperStepUIProps` (so the consumer's
 * element-level interceptors are visible) plus the API plus the already-rendered element slots
 * (so the built-in can reuse them for any slot it doesn't modify). Helpers like `getLinksElement`
 * are exported from `step-element-factories` for built-ins that need to render filtered subsets.
 */
export type ViewNameBuiltInUIProps = HaapiStepperAPIWithRequiredCurrentStep &
  HaapiStepperStepUIProps & {
    loadingElement: ReactElement | null;
    errorElement: ReactElement | null;
    messagesElement: ReactElement;
    actionsElement: ReactElement | null;
    linksElement: ReactElement;
    pageSymbolElement: ReactElement;
  };

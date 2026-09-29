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

import { useHaapiStepperHistoryNavigation } from './useHaapiStepperHistoryNavigation';

/**
 * Headless component that wires the browser's back/forward buttons to the HAAPI stepper history.
 * Must be rendered inside `<HaapiStepper>` so it can access the stepper via `useHaapiStepper`.
 */
export function HaapiStepperHistoryNavigation() {
  useHaapiStepperHistoryNavigation();
  return null;
}

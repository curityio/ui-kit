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

import { use } from 'react';
import { HaapiStepperContext } from './HaapiStepperContext';

/**
 * Hook to access the HAAPI Stepper context.
 *
 * Provides access to:
 * - `currentStep`: The current authentication step
 * - `history`: Complete history of all steps and actions taken
 * - `loading`: Loading state during transitions
 * - `error`: Current error state (app or input validation errors)
 * - `nextStep`: Function to navigate to the next step
 *
 * @throws {Error} If used outside of HaapiStepper
 *
 * ```tsx
 * function MyComponent() {
 *   const { currentStep, history, loading, error, nextStep } = useHaapiStepper();
 *
 *   if (loading) return <div>Loading...</div>;
 *   if (error?.app) return <div>Error: {error.app.title}</div>;
 *
 *   return (
 *     <div>
 *       <h2>Current Step: {currentStep?.type}</h2>
 *       <p>Steps taken: {history.length}</p>
 *     </div>
 *   );
 * }
 * ```
 * {@see_example docs/examples/UseHaapiStepperHook.tsx useHaapiStepper hook}
 */
export function useHaapiStepper() {
  const haapiStepperContext = use(HaapiStepperContext);

  if (!haapiStepperContext) {
    throw new Error('useHaapiStepper must be used inside HaapiStepper');
  }

  return haapiStepperContext;
}

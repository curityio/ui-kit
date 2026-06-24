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

import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { useHaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepperHook';
import { HaapiStepperFormUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormUI';
import type {
  HaapiStepperFormAction,
  HaapiStepperNextStep,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from './ExamplePreviewer';

/**
 * Behaviour override around submission: wrap `onSubmit` to run your own logic (here a confirmation prompt;
 * could be analytics or pre-submit validation) before delegating to `nextStep`. The default form UI and
 * state management are untouched.
 */
function LoginForm() {
  const { currentStep, nextStep } = useHaapiStepper();
  const formAction = currentStep?.dataHelpers.actions?.form?.[0];

  if (!formAction) {
    return null;
  }

  const handleSubmit: HaapiStepperNextStep<HaapiStepperFormAction> = (action, payload) => {
    if (confirm('Submit the login form?')) {
      nextStep(action, payload);
    }
  };

  return <HaapiStepperFormUI action={formAction} onSubmit={handleSubmit} />;
}

export default function App() {
  return (
    <ExamplePreviewer>
      <HaapiStepper>
        <LoginForm />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

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
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * Conditional customization: replace one step with a fully custom UI (matched by its metadata) and fall
 * back to the default `HaapiStepperStepUI` for every other step.
 */
function ConditionalCustomization() {
  const { currentStep, loading, error } = useHaapiStepper();

  if (loading || !currentStep) {
    return <div>Loading authentication…</div>;
  }

  if (error?.app) {
    return <div>Error: {error.app.title}</div>;
  }

  if (
    currentStep.metadata?.templateArea === 'lwa-dev' &&
    currentStep.metadata?.viewName === 'views/select-authenticator/index'
  ) {
    return (
      <div>
        <h1>Custom Select Authenticator</h1>
        <p>This is a custom UI for the select authenticator step.</p>
      </div>
    );
  }

  // Fall back to the default UI for all other steps.
  return <HaapiStepperStepUI />;
}

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.CUSTOM_AUTHENTICATOR_SELECT}>
      <HaapiStepper>
        <ConditionalCustomization />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

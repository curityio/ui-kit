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
import type { HaapiStepperFormAction } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from '../../_harness/ExamplePreviewer';
import { HAAPI_EXAMPLE } from '../../_harness/catalog';

/**
 * Conditional customization: replace one step with a fully custom UI (matched by its metadata) and fall
 * back to the default `HaapiStepperStepUI` for every other step. The custom UI renders the step's
 * authenticator options as a plain HTML select and advances the flow with `nextStep`.
 */
function ConditionalCustomization() {
  const { currentStep, loading, error, nextStep } = useHaapiStepper();

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
    const selectorAction = currentStep.dataHelpers.actions?.selector[0];
    const options = (selectorAction?.model.options ?? []) as HaapiStepperFormAction[];

    return (
      <div>
        <h1>Custom Select Authenticator</h1>
        <p>Pick how you want to authenticate:</p>
        <select defaultValue="" onChange={event => nextStep(options[Number(event.target.value)])}>
          <option value="" disabled>
            Choose an authenticator…
          </option>
          {options.map((option, index) => (
            <option key={index} value={index}>
              {option.title}
            </option>
          ))}
        </select>
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

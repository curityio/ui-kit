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
import { HaapiStepperSelectorUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/selector/HaapiStepperSelectorUI';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * Render a step's authenticator selector with the `HaapiStepperSelectorUI` building block: read the
 * selector action from `dataHelpers` and pass it, plus `nextStep`, to the component. Picking an option
 * advances the flow.
 */
function SelectorStep() {
  const { currentStep, nextStep } = useHaapiStepper();
  const selectorAction = currentStep?.dataHelpers.actions?.selector?.[0];

  if (!selectorAction) {
    return null;
  }

  return <HaapiStepperSelectorUI action={selectorAction} onSubmit={nextStep} />;
}

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.SELECT_AUTHENTICATOR}>
      <HaapiStepper>
        <SelectorStep />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

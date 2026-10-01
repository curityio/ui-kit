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
import { HaapiStepperActionsUI } from '@curity/haapi-react-sdk/haapi-stepper/ui/actions/HaapiStepperActionsUI';
import { ExamplePreviewer } from '../../../_harness/ExamplePreviewer';
import { HAAPI_EXAMPLE } from '../../../_harness/catalog';

/**
 * Render a step's actions (form, selector, and client-operation) with the `HaapiStepperActionsUI`
 * building block: read `actions.all` from `dataHelpers` and pass it, plus `nextStep`, to the component —
 * each action renders with the default UI for its subtype.
 */
function StepActions() {
  const { currentStep, nextStep } = useHaapiStepper();
  const actions = currentStep?.dataHelpers.actions?.all;

  return <HaapiStepperActionsUI actions={actions} onAction={nextStep} />;
}

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.SELECT_AUTHENTICATOR}>
      <HaapiStepper>
        <StepActions />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

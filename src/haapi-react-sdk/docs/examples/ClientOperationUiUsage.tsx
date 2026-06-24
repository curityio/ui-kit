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
import { HaapiStepperClientOperationUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/client-operation/HaapiStepperClientOperationUI';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * Render a step's client-operation action (e.g. WebAuthn, BankID) with the `HaapiStepperClientOperationUI`
 * building block: read the action from `dataHelpers` and pass it, plus `nextStep`, to the component.
 */
function ClientOperationStep() {
  const { currentStep, nextStep } = useHaapiStepper();
  const clientOperationAction = currentStep?.dataHelpers.actions?.clientOperation?.[0];

  if (!clientOperationAction) {
    return null;
  }

  return <HaapiStepperClientOperationUI action={clientOperationAction} onAction={nextStep} />;
}

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.CLIENT_OPERATION}>
      <HaapiStepper>
        <ClientOperationStep />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

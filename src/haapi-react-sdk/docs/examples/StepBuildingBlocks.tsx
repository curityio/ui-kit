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
import { HaapiStepperMessagesUI } from '@curity/haapi-react-sdk/haapi-stepper/ui/messages/HaapiStepperMessagesUI';
import { HaapiStepperActionsUI } from '@curity/haapi-react-sdk/haapi-stepper/ui/actions/HaapiStepperActionsUI';
import { HaapiStepperLinksUI } from '@curity/haapi-react-sdk/haapi-stepper/ui/links/HaapiStepperLinksUI';
import { ExamplePreviewer } from './ExamplePreviewer';

/**
 * Building blocks: `HaapiStepper` runs the flow while you render the step from the SDK's collection UI
 * components — `HaapiStepperMessagesUI`, `HaapiStepperActionsUI`, `HaapiStepperLinksUI` — driving each
 * with the data from `currentStep.dataHelpers` and advancing with `nextStep`.
 */
function Step() {
  const { currentStep, nextStep } = useHaapiStepper();
  if (!currentStep) {
    return null;
  }

  const { actions, messages, links } = currentStep.dataHelpers;

  return (
    <>
      <HaapiStepperMessagesUI messages={messages} />
      <HaapiStepperActionsUI actions={actions?.all} onAction={nextStep} />
      <HaapiStepperLinksUI links={links} onClick={nextStep} />
    </>
  );
}

export default function App() {
  return (
    <ExamplePreviewer showStepSelect>
      <HaapiStepper>
        <Step />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

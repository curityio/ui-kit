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
import { HaapiStepperLinksUI } from '@curity/haapi-react-sdk/haapi-stepper/ui/links/HaapiStepperLinksUI';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * Render a step's links (e.g. "Forgot password?", "Create account") with the `HaapiStepperLinksUI`
 * building block: read `links` from `dataHelpers` and pass them, plus `nextStep`, to the component.
 */
function StepLinks() {
  const { currentStep, nextStep } = useHaapiStepper();
  const links = currentStep?.dataHelpers.links;

  if (!links?.length) {
    return null;
  }

  return <HaapiStepperLinksUI links={links} onClick={nextStep} />;
}

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.HTML_FORM_LOGIN}>
      <HaapiStepper>
        <StepLinks />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

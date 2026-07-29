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
import { HaapiStepperLinkUI } from '@curity/haapi-react-sdk/haapi-stepper/ui/links/HaapiStepperLinkUI';
import { ExamplePreviewer } from '../../../_harness/ExamplePreviewer';
import { HAAPI_EXAMPLE } from '../../../_harness/catalog';

/**
 * Render each of a step's links yourself with the `HaapiStepperLinkUI` building block — here inside a
 * custom `<nav>` — instead of delegating the whole collection to `HaapiStepperLinksUI`.
 */
function StepLinks() {
  const { currentStep, nextStep } = useHaapiStepper();
  const links = currentStep?.dataHelpers.links;

  if (!links?.length) {
    return null;
  }

  return (
    <nav aria-label="Helpful links">
      {links.map(link => (
        <HaapiStepperLinkUI key={link.href} link={link} onClick={nextStep} />
      ))}
    </nav>
  );
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

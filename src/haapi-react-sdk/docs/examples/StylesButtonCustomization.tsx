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
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * Styles customization: restyle the default UI with CSS only — no code changes. The SDK components emit
 * plain `.haapi-stepper-*` class names, so overriding `.haapi-stepper-button` is enough to give the submit
 * button a custom colour, shape and size. Edit the CSS to see the button update live.
 */
const customButtonStyles = `
  .haapi-stepper-button {
    background: #6200ee;
    border-radius: 999px;
    padding-block: 0.85rem;
    letter-spacing: 0.02em;
  }
  .haapi-stepper-button:hover {
    background: #4b00b5;
  }
`;

export default function App() {
  return (
    <>
      <style>{customButtonStyles}</style>
      <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.HTML_FORM_LOGIN}>
        <HaapiStepper>
          <HaapiStepperStepUI />
        </HaapiStepper>
      </ExamplePreviewer>
    </>
  );
}

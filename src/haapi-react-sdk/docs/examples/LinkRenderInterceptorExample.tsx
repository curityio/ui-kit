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
import type { HaapiStepperStepUILinkRenderInterceptor } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from './ExamplePreviewer';

/**
 * UI Customization with render interceptor: render each step link as a default button via
 * `linkRenderInterceptor` (instead of the default anchor). Clicking it follows the link through `nextStep`.
 */
const linkRenderInterceptor: HaapiStepperStepUILinkRenderInterceptor = ({ link, nextStep }) => (
  <button type="button" className="haapi-stepper-button" onClick={() => nextStep(link)}>
    {link.title}
  </button>
);

export default function App() {
  return (
    <ExamplePreviewer>
      <HaapiStepper>
        <HaapiStepperStepUI linkRenderInterceptor={linkRenderInterceptor} />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

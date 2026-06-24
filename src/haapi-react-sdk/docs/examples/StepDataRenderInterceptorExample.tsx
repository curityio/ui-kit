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
import type { HaapiStepperStepUIStepRenderInterceptor } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from './ExamplePreviewer';

/**
 * Data Customization with render interceptor: return the (modified) step data instead of a React element,
 * so the default UI still renders but with the message and link titles the interceptor rewrote. Only
 * changes to the original HaapiStep data persist — the step's `dataHelpers` are rebuilt from it on each
 * render.
 */
const stepRenderInterceptor: HaapiStepperStepUIStepRenderInterceptor = stepperApi => ({
  ...stepperApi,
  currentStep: {
    ...stepperApi.currentStep,
    messages: stepperApi.currentStep.dataHelpers?.messages?.map(message => ({
      ...message,
      text: `Modified ${message.text}`,
    })),
    links: stepperApi.currentStep.dataHelpers?.links?.map(link => ({ ...link, title: `Modified ${link.title}` })),
  },
});

export default function App() {
  return (
    <ExamplePreviewer showStepSelect>
      <HaapiStepper>
        <HaapiStepperStepUI stepRenderInterceptor={stepRenderInterceptor} />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

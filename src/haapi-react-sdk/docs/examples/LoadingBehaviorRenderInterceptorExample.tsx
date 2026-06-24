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
import type { HaapiStepperStepUILoadingRenderInterceptor } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * Behaviour Customization with render interceptor: run a side effect (e.g. analytics) when loading
 * starts, then return the loading data unchanged to delegate to the default loading UI.
 */
const loadingRenderInterceptor: HaapiStepperStepUILoadingRenderInterceptor = stepperApi => {
  if (stepperApi.loading) {
    // Replace with your analytics tracker; logged here so the side effect is visible in the console.
    console.log('loading_started', { viewName: stepperApi.currentStep?.metadata?.viewName });
  }

  // Delegate to default loading UI
  return stepperApi;
};

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.POLLING}>
      <HaapiStepper>
        <HaapiStepperStepUI loadingRenderInterceptor={loadingRenderInterceptor} />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

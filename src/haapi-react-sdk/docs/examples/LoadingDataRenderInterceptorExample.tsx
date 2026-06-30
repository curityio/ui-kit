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
 * Data Customization with render interceptor: return the (modified) loading data instead of a React
 * element, delegating to the default loading UI but suppressing it for the `lwa` template area.
 */
const loadingRenderInterceptor: HaapiStepperStepUILoadingRenderInterceptor = stepperApi => ({
  ...stepperApi,
  loading: stepperApi.loading && stepperApi.currentStep?.metadata?.templateArea !== 'lwa',
});

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.POLLING}>
      <HaapiStepper>
        <HaapiStepperStepUI loadingRenderInterceptor={loadingRenderInterceptor} />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

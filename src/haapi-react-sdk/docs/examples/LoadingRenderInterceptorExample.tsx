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
import { HAAPI_STEPS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * UI Customization with render interceptor: replace the default loading element with a custom component
 * while a polling step is pending, and delegate to the default loading UI for any other step.
 */
const loadingRenderInterceptor: HaapiStepperStepUILoadingRenderInterceptor = stepperApi => {
  if (stepperApi.currentStep?.type === HAAPI_STEPS.POLLING) {
    return (
      <div data-testid="custom-loading" style={{ padding: '2rem', textAlign: 'center', color: '#d35b9c' }}>
        Authenticating…
      </div>
    );
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

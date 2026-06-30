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
import type {
  HaapiStepperNextStep,
  HaapiStepperStepUIStepRenderInterceptor,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { HAAPI_FORM_ACTION_KINDS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-action.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * Behaviour Customization with render interceptor: keep the default UI but wrap `nextStep` so a cancel
 * action asks for confirmation before the flow advances.
 */
const stepRenderInterceptor: HaapiStepperStepUIStepRenderInterceptor = stepperApi => {
  const enhancedNextStep: HaapiStepperNextStep = (action, payload) => {
    const isCancel = 'kind' in action && action.kind === HAAPI_FORM_ACTION_KINDS.CANCEL;

    if (isCancel && !confirm('Exit authentication?')) {
      return;
    }

    stepperApi.nextStep(action, payload);
  };

  return { ...stepperApi, nextStep: enhancedNextStep };
};

export default function App() {
  return (
    <ExamplePreviewer showStepSelect defaultStep={HAAPI_EXAMPLE.POLLING}>
      <HaapiStepper>
        <HaapiStepperStepUI stepRenderInterceptor={stepRenderInterceptor} />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

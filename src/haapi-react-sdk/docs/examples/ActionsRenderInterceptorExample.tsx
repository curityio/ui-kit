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

import type { CSSProperties } from 'react';
import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { HaapiStepperActionsUI } from '@curity/haapi-react-sdk/haapi-stepper/ui';
import type { HaapiStepperStepUIActionsRenderInterceptor } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * UI Customization with render interceptor: wrap the whole actions block with `actionsRenderInterceptor`.
 * The step's actions render inside your own container (here a bordered panel with a heading) via the
 * `HaapiStepperActionsUI` building block; return the stepper API to delegate when there's nothing to wrap.
 */
const actionsRenderInterceptor: HaapiStepperStepUIActionsRenderInterceptor = stepperApi => {
  const actions = stepperApi.currentStep.dataHelpers.actions?.all ?? [];

  if (!actions.length) {
    // Delegate to default actions rendering
    return stepperApi;
  }

  return (
    <div style={actionsPanelStyle}>
      <p style={{ margin: '0 0 0.75rem', fontWeight: 600 }}>Choose how to continue</p>
      <HaapiStepperActionsUI actions={actions} onAction={stepperApi.nextStep} />
    </div>
  );
};

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.SELECT_AUTHENTICATOR}>
      <HaapiStepper>
        <HaapiStepperStepUI actionsRenderInterceptor={actionsRenderInterceptor} />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

const actionsPanelStyle: CSSProperties = {
  padding: '1rem',
  border: '1px solid #d0d5dd',
  borderRadius: '0.75rem',
  background: '#f9fafb',
};

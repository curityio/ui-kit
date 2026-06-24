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
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * UI Customization with render interceptor: replace one step (matched by its `viewName`) with a fully
 * custom component, and delegate every other step to the default rendering by returning the stepper API.
 *
 * The authenticator selector is rebuilt as a custom card grid from the step's own selector options;
 * picking one drives the flow forward through `nextStep`, exactly like the built-in UI would.
 */
export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.SELECT_AUTHENTICATOR}>
      <HaapiStepper>
        <HaapiStepperStepUI
          stepRenderInterceptor={stepperApi => {
            if (stepperApi.currentStep.metadata?.viewName !== 'views/select-authenticator/index') {
              // Delegate to default rendering
              return stepperApi;
            }

            const { nextStep } = stepperApi;
            const selector = stepperApi.currentStep.dataHelpers.actions?.selector?.[0];
            const options = selector?.model.options ?? [];

            return (
              <section>
                <h2 style={{ marginTop: 0 }}>How would you like to sign in?</h2>
                <div
                  style={{
                    display: 'grid',
                    gap: '0.75rem',
                    gridTemplateColumns: 'repeat(auto-fit, minmax(150px, 1fr))',
                  }}
                >
                  {options.map(option => (
                    <button key={option.id} type="button" onClick={() => nextStep(option)} style={authenticatorButtonStyle}>
                      {option.title}
                    </button>
                  ))}
                </div>
              </section>
            );
          }}
        />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

const authenticatorButtonStyle: CSSProperties = {
  padding: '1rem',
  border: '1px solid #d0d5dd',
  borderRadius: '0.5rem',
  background: '#fff',
  font: 'inherit',
  cursor: 'pointer',
};

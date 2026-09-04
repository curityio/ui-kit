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

import { type CSSProperties } from 'react';
import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { HaapiStepperFormUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormUI';
import { HaapiStepperFormFieldUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/fields/HaapiStepperFormFieldUI';
import { HaapiStepperFormSubmitButton } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormSubmitButton';
import { HAAPI_PROBLEM_STEPS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';
import type {
  HaapiStepperError,
  HaapiStepperStepUIFormActionRenderInterceptor,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from '../../../../_harness/ExamplePreviewer';
import { HAAPI_EXAMPLE } from '../../../../_harness/catalog';

/**
 * UI Customization with a render interceptor: move the error *inside the form, above the input fields*
 * with `formActionRenderInterceptor`. It composes the form from `HaapiStepperFormUI` children — one error
 * banner between the title and the inputs — dropping the default per-field error wrappers.
 */
const formActionRenderInterceptor: HaapiStepperStepUIFormActionRenderInterceptor = ({ action, nextStep, error }) => (
  <HaapiStepperFormUI action={action} onSubmit={nextStep}>
    {({ fields }) => (
      <>
        <ErrorBanner error={error} />
        {fields.map(field => (
          <HaapiStepperFormFieldUI key={field.name} field={field} />
        ))}
        <HaapiStepperFormSubmitButton />
      </>
    )}
  </HaapiStepperFormUI>
);

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.LOGIN_WITH_VALIDATION} autoSubmit>
      <HaapiStepper>
        <HaapiStepperStepUI formActionRenderInterceptor={formActionRenderInterceptor} />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

function ErrorBanner({ error }: { error: HaapiStepperError | null }) {
  const appError = error?.app;
  const inputError = error?.input;
  if (!appError && !inputError) {
    return null;
  }

  return (
    <div style={errorBannerStyle} role="alert">
      <strong>⚠ There was a problem</strong>
      {appError?.title && <p style={{ margin: '0.25rem 0 0' }}>{appError.title}</p>}
      {inputError?.title && <p style={{ margin: '0.25rem 0 0' }}>{inputError.title}</p>}
      {inputError?.type === HAAPI_PROBLEM_STEPS.INVALID_INPUT && (
        <ul style={{ margin: '0.25rem 0 0' }}>
          {inputError.invalidFields.map(field => (
            <li key={field.name}>
              <strong>{field.name}</strong>: {field.detail ?? field.reason}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

const errorBannerStyle: CSSProperties = {
  background: '#fde8e8',
  border: '2px solid #e02424',
  borderLeft: '6px solid #e02424',
  borderRadius: '8px',
  padding: '0.75rem 1rem',
  margin: '0 0 1rem',
  color: '#9b1c1c',
};

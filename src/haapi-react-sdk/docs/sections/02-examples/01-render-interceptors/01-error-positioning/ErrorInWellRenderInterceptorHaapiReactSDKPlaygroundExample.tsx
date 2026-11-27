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
import { HAAPI_PROBLEM_STEPS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';
import type {
  HaapiStepperError,
  HaapiStepperStepUIErrorRenderInterceptor,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from '../../../../_harness/ExamplePreviewer';
import { HAAPI_EXAMPLE } from '../../../../_harness/catalog';

/**
 * UI Customization with a render interceptor: replace the step's default error with a custom banner, in
 * its usual place — the Well's error slot, inside the step, above the form. Use `errorRenderInterceptor`
 * when you only want to restyle the error, not move it.
 */
const errorRenderInterceptor: HaapiStepperStepUIErrorRenderInterceptor = ({ error }) => <ErrorBanner error={error} />;

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.LOGIN_WITH_VALIDATION} autoSubmit>
      <HaapiStepper>
        <HaapiStepperStepUI errorRenderInterceptor={errorRenderInterceptor} />
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
      <strong style={errorTitleStyle}>There was a problem</strong>
      {appError?.title && <p style={errorTextStyle}>{appError.title}</p>}
      {inputError?.title && <p style={errorTextStyle}>{inputError.title}</p>}
      {inputError?.type === HAAPI_PROBLEM_STEPS.INVALID_INPUT && (
        <ul style={errorListStyle}>
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
  backgroundColor: 'color-mix(in srgb, var(--color-danger) 7%, white)',
  border: '1px solid color-mix(in srgb, var(--color-danger) 25%, transparent)',
  borderRadius: '8px',
  padding: '0.875rem 1rem',
  margin: '0 0 1rem',
  color: 'var(--color-heading)',
  fontSize: '0.875rem',
  lineHeight: 1.5,
  textAlign: 'left',
};

const errorTitleStyle: CSSProperties = {
  display: 'block',
  fontFamily: 'var(--type-sans-medium)',
};

const errorTextStyle: CSSProperties = {
  margin: 0,
};

const errorListStyle: CSSProperties = {
  margin: '0.25rem 0 0',
  paddingLeft: '1.25rem',
};

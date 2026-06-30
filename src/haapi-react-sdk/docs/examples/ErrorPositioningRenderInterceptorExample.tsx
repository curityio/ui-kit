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

import { useState, type CSSProperties } from 'react';
import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { HaapiStepperFormUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormUI';
import { HaapiStepperFormFieldUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/fields/HaapiStepperFormFieldUI';
import { HaapiStepperFormSubmitButton } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormSubmitButton';
import { HAAPI_PROBLEM_STEPS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';
import type {
  HaapiStepperError,
  HaapiStepperStepUIErrorRenderInterceptor,
  HaapiStepperStepUIFormActionRenderInterceptor,
  HaapiStepperStepUIStepRenderInterceptor,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * UI Customization with render interceptor: move error messages around the screen — three ways, all
 * reusing one `ErrorBanner` component and none needing an `as any` cast. Pick an approach with the toggle;
 * submit fails validation on mount so the banner is visible by default. The banner is boldly styled so its
 * position is obvious as you switch between approaches.
 *
 *  - **In the Well's error slot** — `errorRenderInterceptor` renders it inside the step, where errors go.
 *  - **Above the step** — `stepRenderInterceptor` renders it above the whole step, then the default step.
 *  - **Above the form fields** — `formActionRenderInterceptor` + `HaapiStepperFormUI` children, replacing
 *    the default per-field error wrappers with a single block between the title and the inputs.
 */
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

const stepCardStyle: CSSProperties = {
  border: '1px dashed #9ca3af',
  borderRadius: '8px',
  padding: '1rem',
};

// Approach 1 — render the banner in the Well's error slot (default position).
const inWellInterceptor: HaapiStepperStepUIErrorRenderInterceptor = ({ error }) => <ErrorBanner error={error} />;

// Approach 2 — render the banner above the entire step. The step sits in a bordered card so the banner is
// clearly *outside* it, and the nested step suppresses its own default error to avoid a duplicate.
const aboveStepInterceptor: HaapiStepperStepUIStepRenderInterceptor = ({ error }) => (
  <>
    <ErrorBanner error={error} />
    <div style={stepCardStyle}>
      <HaapiStepperStepUI errorRenderInterceptor={() => null} />
    </div>
  </>
);

// Approach 3 — render the banner above the form fields via `HaapiStepperFormUI` children, dropping the
// default per-field error wrappers.
const aboveFormInterceptor: HaapiStepperStepUIFormActionRenderInterceptor = ({ action, nextStep, error }) => (
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

const APPROACHES = {
  step: {
    label: 'Above the step',
    hint: 'The banner renders above the entire step — the step is outlined below so you can see the banner sits outside it.',
    props: { stepRenderInterceptor: aboveStepInterceptor },
  },
  well: {
    label: 'In the Well error slot',
    hint: 'The banner replaces the default error, inside the step where errors normally appear (above the form).',
    props: { errorRenderInterceptor: inWellInterceptor },
  },
  form: {
    label: 'Above the form fields',
    hint: 'The banner renders inside the form, between the title and the input fields.',
    props: { formActionRenderInterceptor: aboveFormInterceptor },
  },
} as const;
type Approach = keyof typeof APPROACHES;

function ErrorPositioningDemo() {
  const [approach, setApproach] = useState<Approach>('step');

  return (
    <div>
      <div role="radiogroup" style={{ display: 'flex', gap: '0.5rem', marginBottom: '0.5rem', flexWrap: 'wrap' }}>
        {(Object.keys(APPROACHES) as Approach[]).map(key => (
          <button
            key={key}
            type="button"
            aria-pressed={key === approach}
            className={`button button-tiny ${key === approach ? 'button-primary' : 'button-primary-outline'}`}
            onClick={() => setApproach(key)}
          >
            {APPROACHES[key].label}
          </button>
        ))}
      </div>
      <p style={{ margin: '0 0 1rem', fontSize: '0.85rem', color: '#667085' }}>{APPROACHES[approach].hint}</p>
      <HaapiStepperStepUI {...APPROACHES[approach].props} />
    </div>
  );
}

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.LOGIN_WITH_VALIDATION} autoSubmit>
      <HaapiStepper>
        <ErrorPositioningDemo />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

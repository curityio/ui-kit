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
import { useHaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepperHook';
import { HaapiStepperFormUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormUI';
import type { HaapiStepperFormFieldRenderInterceptor } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { HAAPI_FORM_FIELDS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import { ExamplePreviewer } from './ExamplePreviewer';

/**
 * UI Customization with render interceptor: per-field customization with `formFieldRenderInterceptor` —
 * relabel the username field, replace the password field with a custom input wired to the built-in
 * `formState`, and delegate every other field to the default rendering.
 */
function LoginForm() {
  const { currentStep, nextStep } = useHaapiStepper();
  const formAction = currentStep?.dataHelpers.actions?.form?.[0];

  if (!formAction) {
    return null;
  }

  const formFieldRenderInterceptor: HaapiStepperFormFieldRenderInterceptor = (field, formState) => {
    if (field.type === HAAPI_FORM_FIELDS.USERNAME) {
      return { ...field, label: 'Account', placeholder: 'user@example.com' };
    }

    if (field.type === HAAPI_FORM_FIELDS.PASSWORD) {
      return (
        <label className="label block">
          Password:
          <input
            type="password"
            className="field w100"
            value={formState.get(field)}
            onChange={event => formState.set(field, event.target.value)}
          />
        </label>
      );
    }

    // Delegate to default field rendering
    return field;
  };

  return (
    <HaapiStepperFormUI
      action={formAction}
      onSubmit={nextStep}
      formFieldRenderInterceptor={formFieldRenderInterceptor}
    />
  );
}

export default function App() {
  return (
    <ExamplePreviewer>
      <HaapiStepper>
        <LoginForm />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

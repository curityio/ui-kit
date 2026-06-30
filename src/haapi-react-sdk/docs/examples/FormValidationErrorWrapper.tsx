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
import { HaapiStepperFormValidationErrorInputWrapper } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormValidationErrorInputWrapper';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * `HaapiStepperFormValidationErrorInputWrapper` renders server-side field validation errors beneath the
 * matching input. Submit the form — the mock returns a validation error for the `user` field, which the
 * wrapper shows under the username input (other fields are unaffected).
 */
function LoginForm() {
  const { currentStep, nextStep } = useHaapiStepper();
  const formAction = currentStep?.dataHelpers.actions?.form[0];

  if (!formAction) {
    return null;
  }

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        nextStep(formAction);
      }}
    >
      <HaapiStepperFormValidationErrorInputWrapper fieldName="user">
        <label className="label block">
          Username
          <input name="user" type="text" className="field w100" />
        </label>
      </HaapiStepperFormValidationErrorInputWrapper>

      <button type="submit" className="haapi-stepper-button">
        Sign in
      </button>
    </form>
  );
}

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.LOGIN_WITH_VALIDATION}>
      <HaapiStepper>
        <LoginForm />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

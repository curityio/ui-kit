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
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { HaapiStepperFormUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormUI';
import { HaapiStepperFormFieldUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/fields/HaapiStepperFormFieldUI';
import { ExamplePreviewer } from './ExamplePreviewer';

/**
 * UI Customization with UI composition: form customization with the `HaapiStepperFormUI` children render
 * prop — lay the fields out in your own markup (here a `<fieldset>`) while the built-in
 * `HaapiStepperFormFieldUI` still renders each field and `HaapiStepperFormUI` manages the form state and
 * submission. Steps without a form action fall back to the default `HaapiStepperStepUI`.
 */
function LoginForm() {
  const { currentStep, nextStep } = useHaapiStepper();
  const formAction = currentStep?.dataHelpers.actions?.form?.[0];

  if (!formAction) {
    // Not a form step — delegate to the default step UI.
    return <HaapiStepperStepUI />;
  }

  return (
    <HaapiStepperFormUI action={formAction} onSubmit={nextStep}>
      {({ fields }) => (
        <fieldset>
          <legend>Sign in</legend>
          {fields.map(field => (
            <HaapiStepperFormFieldUI key={field.name} field={field} />
          ))}
          <button type="submit" className="haapi-stepper-button">
            Sign in
          </button>
        </fieldset>
      )}
    </HaapiStepperFormUI>
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

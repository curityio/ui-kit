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
import { HaapiStepperFormFieldUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/fields/HaapiStepperFormFieldUI';
import { HaapiStepperTextFormFieldUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/fields/HaapiStepperTextFormFieldUI';
import { HAAPI_FORM_FIELDS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import { ExamplePreviewer } from './ExamplePreviewer';

/** Give the username field its own titled section with `HaapiStepperTextFormFieldUI`; keep the default for the rest. */
function LoginForm() {
  const { currentStep, nextStep } = useHaapiStepper();
  const formAction = currentStep?.dataHelpers.actions?.form?.[0];

  if (!formAction) {
    return null;
  }

  return (
    <HaapiStepperFormUI action={formAction} onSubmit={nextStep}>
      {({ fields }) => (
        <>
          {fields.map(field =>
            field.type === HAAPI_FORM_FIELDS.USERNAME ? (
              <section key={field.name}>
                <h2>Your account</h2>
                <HaapiStepperTextFormFieldUI field={field} />
              </section>
            ) : (
              <HaapiStepperFormFieldUI key={field.name} field={field} />
            )
          )}
          <button type="submit" className="haapi-stepper-button">
            Sign in
          </button>
        </>
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

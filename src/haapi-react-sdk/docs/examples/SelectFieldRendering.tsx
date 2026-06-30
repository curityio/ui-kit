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
import { HaapiStepperSelectFormFieldUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/fields/HaapiStepperSelectFormFieldUI';
import { HaapiStepperFormSubmitButton } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormSubmitButton';
import { HAAPI_FORM_FIELDS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/** Pair the select field with a hint using `HaapiStepperSelectFormFieldUI`; keep the default for the rest. */
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
            field.type === HAAPI_FORM_FIELDS.SELECT ? (
              <section key={field.name}>
                <HaapiStepperSelectFormFieldUI field={field} />
                <p className="hint">You can change this later in your settings.</p>
              </section>
            ) : (
              <HaapiStepperFormFieldUI key={field.name} field={field} />
            )
          )}
          <HaapiStepperFormSubmitButton />
        </>
      )}
    </HaapiStepperFormUI>
  );
}

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.DIFFERENT_INPUTS}>
      <HaapiStepper>
        <LoginForm />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

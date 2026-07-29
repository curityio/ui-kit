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
import { HaapiStepperFormSubmitButton } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormSubmitButton';
import { HaapiStepperFormFieldUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/fields/HaapiStepperFormFieldUI';
import { ExamplePreviewer } from '../../../../_harness/ExamplePreviewer';

/**
 * Compose your own form layout with the `children` render interceptor while keeping the SDK's submit
 * button: `HaapiStepperFormSubmitButton` reads the action from the form context, so it keeps the default
 * label, icon and styling — customize them via `label`, `icon`, `children` or any native `<button>` prop.
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
        <>
          {fields.map(field => (
            <HaapiStepperFormFieldUI key={field.name} field={field} />
          ))}
          <HaapiStepperFormSubmitButton label="Sign in" />
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

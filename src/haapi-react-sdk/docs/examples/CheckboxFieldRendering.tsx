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

import { Button } from 'antd';
import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { useHaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepperHook';
import { HaapiStepperFormUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormUI';
import { HaapiStepperFormFieldUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/fields/HaapiStepperFormFieldUI';
import { HaapiStepperCheckboxFormFieldUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/fields/HaapiStepperCheckboxFormFieldUI';
import { HAAPI_FORM_FIELDS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/** Pair the checkbox with a terms description using `HaapiStepperCheckboxFormFieldUI`; keep the default for the rest. */
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
            field.type === HAAPI_FORM_FIELDS.CHECKBOX ? (
              <section key={field.name}>
                <HaapiStepperCheckboxFormFieldUI field={field} />
                <small>
                  Read our <a href="/terms">terms and conditions</a>.
                </small>
              </section>
            ) : (
              <HaapiStepperFormFieldUI key={field.name} field={field} />
            )
          )}
          <Button type="primary" htmlType="submit" block>
            Submit
          </Button>
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

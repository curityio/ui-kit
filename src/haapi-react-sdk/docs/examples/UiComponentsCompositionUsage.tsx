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
import { HAAPI_FORM_FIELDS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import { ExamplePreviewer } from './ExamplePreviewer';

/**
 * Compose the building blocks: a `children` render function swaps in a custom username field and an Ant
 * Design submit button, while the built-in `HaapiStepperFormFieldUI` keeps rendering the rest and
 * `HaapiStepperFormUI` manages the values and submission.
 */
function LoginForm() {
  const { currentStep, nextStep } = useHaapiStepper();
  const formAction = currentStep?.dataHelpers.actions?.form?.[0];

  if (!formAction) {
    return null;
  }

  return (
    <HaapiStepperFormUI action={formAction} onSubmit={nextStep}>
      {({ fields, formState }) => {
        const username = fields.find(field => field.type === HAAPI_FORM_FIELDS.USERNAME);
        const otherFields = fields.filter(field => field !== username);

        return (
          <>
            {/* Custom username field, wired to the built-in form state. */}
            {username && (
              <label className="label block">
                Email
                <input
                  type="text"
                  className="field w100"
                  value={formState.get(username)}
                  onChange={event => formState.set(username, event.target.value)}
                />
              </label>
            )}

            {/* Remaining fields keep the default rendering. */}
            {otherFields.map(field => (
              <HaapiStepperFormFieldUI key={field.name} field={field} />
            ))}

            {/* Ant Design submit button (submits the form via htmlType="submit"). */}
            <Button type="primary" htmlType="submit" block>
              Sign in
            </Button>
          </>
        );
      }}
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

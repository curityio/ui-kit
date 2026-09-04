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
import { useHaapiStepperFormState } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormHook';
import { HAAPI_FORM_FIELDS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import type {
  HaapiStepperFormAction,
  HaapiStepperNextStep,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from '../../../../_harness/ExamplePreviewer';

/**
 * A fully custom form built on `useHaapiStepperFormState`: the hook seeds the state from the action's
 * fields and returns `get`/`set` helpers for the inputs plus the `values` map the action expects as its
 * submission payload — so you own the markup while the SDK owns the form state.
 */
function CustomLoginForm({
  action,
  onSubmit,
}: {
  action: HaapiStepperFormAction;
  onSubmit: HaapiStepperNextStep<HaapiStepperFormAction>;
}) {
  const fields = action.model.fields ?? [];
  const formState = useHaapiStepperFormState(fields);
  const username = fields.find(field => field.type === HAAPI_FORM_FIELDS.USERNAME)!;
  const password = fields.find(field => field.type === HAAPI_FORM_FIELDS.PASSWORD)!;

  return (
    <form
      onSubmit={event => {
        event.preventDefault();
        onSubmit(action, formState.values);
      }}
    >
      <label className="label block">
        Username:
        <input
          className="field w100"
          value={formState.get(username)}
          onChange={event => formState.set(username, event.target.value)}
        />
      </label>
      <label className="label block">
        Password:
        <input
          type="password"
          className="field w100"
          value={formState.get(password)}
          onChange={event => formState.set(password, event.target.value)}
        />
      </label>
      <button type="submit" className="haapi-stepper-button">
        Sign in
      </button>
    </form>
  );
}

function LoginForm() {
  const { currentStep, nextStep } = useHaapiStepper();
  const formAction = currentStep?.dataHelpers.actions?.form?.[0];

  if (!formAction) {
    // Not a form step — delegate to the default step UI.
    return <HaapiStepperStepUI />;
  }

  return <CustomLoginForm action={formAction} onSubmit={nextStep} />;
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

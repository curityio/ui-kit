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
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { HaapiStepperErrorNotifier } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepperErrorNotifier';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * `HaapiStepperErrorNotifier` wraps your app and surfaces HAAPI errors as a dismissible toast. Submit
 * the login form below — the mock rejects the credentials, and the resulting error pops up as a
 * notification while the step UI stays in place.
 */
export default function App() {
  return (
    <ExamplePreviewer autoSubmit defaultStep={HAAPI_EXAMPLE.HTML_FORM_LOGIN}>
      <HaapiStepper>
        <HaapiStepperErrorNotifier>
          <HaapiStepperStepUI />
        </HaapiStepperErrorNotifier>
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

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
import { ExamplePreviewer } from './ExamplePreviewer';

/**
 * A catalog of the HAAPI authentication steps' default UIs: pick a step to see how
 * `<HaapiStepperStepUI>` renders it out of the box.
 */
export default function App() {
  return (
    <ExamplePreviewer showStepSelect>
      <HaapiStepper>
        <HaapiStepperStepUI />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

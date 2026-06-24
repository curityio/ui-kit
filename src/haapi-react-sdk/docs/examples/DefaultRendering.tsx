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
 * Default step rendering: `<HaapiStepperStepUI>` renders the current HAAPI step out of the box. The
 * stepper runs in served mode — `<ExamplePreviewer showStepSelect>` supplies `window.__CONFIG__`, as the host app
 * does in production, so no `config` prop is needed.
 */
export default function App() {
  return (
    <ExamplePreviewer>
      <HaapiStepper>
        <HaapiStepperStepUI />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

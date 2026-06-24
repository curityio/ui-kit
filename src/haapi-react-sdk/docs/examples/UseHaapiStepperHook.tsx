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
import { ExamplePreviewer } from './ExamplePreviewer';

/** Read the ongoing flow's state from the `useHaapiStepper` hook. */
function MyComponent() {
  const { currentStep, history, loading, error } = useHaapiStepper();

  if (loading) {
    return <div>Loading…</div>;
  }

  if (error?.app) {
    return <div>Error: {error.app.title}</div>;
  }

  return (
    <div>
      <h2>Current step: {currentStep?.type}</h2>
      <p>Steps taken: {history.length}</p>
    </div>
  );
}

export default function App() {
  return (
    <ExamplePreviewer showStepSelect>
      <HaapiStepper>
        <MyComponent />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

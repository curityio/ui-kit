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

import type { CSSProperties } from 'react';
import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { useHaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepperHook';
import { HaapiStepperFormUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/form/HaapiStepperFormUI';
import { HaapiStepperSelectorUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/selector/HaapiStepperSelectorUI';
import { HaapiStepperClientOperationUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/actions/client-operation/HaapiStepperClientOperationUI';
import { HaapiStepperMessagesUI } from '@curity/haapi-react-sdk/haapi-stepper/ui/messages/HaapiStepperMessagesUI';
import { HaapiStepperLinksUI } from '@curity/haapi-react-sdk/haapi-stepper/ui/links/HaapiStepperLinksUI';
import { ExamplePreviewer } from './ExamplePreviewer';

/**
 * UI Customization with UI composition: full customization with the SDK's UI Components. Drive the flow
 * with the headless `HaapiStepper` + `useHaapiStepper` and render the actions yourself from the
 * building-block components (`HaapiStepperFormUI`, `HaapiStepperSelectorUI`, `HaapiStepperClientOperationUI`)
 * inside a custom layout, while messages and links keep the default `HaapiStepperMessagesUI` /
 * `HaapiStepperLinksUI` rendering.
 *
 * Note: this manual composition is exactly what `HaapiStepperStepUI` does for you — it exists to show how
 * the building blocks fit together. Reach for it only when you need a layout the render interceptors can't
 * express; otherwise prefer `HaapiStepperStepUI`.
 */
function CustomFlowUI() {
  const { currentStep, loading, error, nextStep } = useHaapiStepper();

  if (loading || !currentStep) {
    return <div>Loading authentication…</div>;
  }

  if (error?.app) {
    return <div>Error: {error.app.title}</div>;
  }

  const { actions, links, messages } = currentStep.dataHelpers;

  return (
    <>
      {/* Default message rendering */}
      <HaapiStepperMessagesUI messages={messages} />

      {/* Custom layout wrapping the action building blocks */}
      <div style={actionsLayoutStyle}>
        {actions?.form.map(action => (
          <HaapiStepperFormUI key={action.id} action={action} onSubmit={nextStep} />
        ))}
        {actions?.selector.map(action => (
          <HaapiStepperSelectorUI key={action.id} action={action} onSubmit={nextStep} />
        ))}
        {actions?.clientOperation.map(action => (
          <HaapiStepperClientOperationUI key={action.id} action={action} onAction={nextStep} />
        ))}
      </div>

      {/* Default link rendering */}
      <HaapiStepperLinksUI links={links} onClick={nextStep} />
    </>
  );
}

export default function App() {
  return (
    <ExamplePreviewer showStepSelect>
      <HaapiStepper>
        <CustomFlowUI />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

const actionsLayoutStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.75rem',
  padding: '1rem',
  margin: '1rem 0',
  border: '1px dashed #c7d2fe',
  borderRadius: '0.75rem',
  background: '#f5f7ff',
};

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
import { HaapiStepperMessageUI } from '@curity/haapi-react-sdk/haapi-stepper/ui/messages/HaapiStepperMessageUI';
import { ExamplePreviewer } from '../../../_harness/ExamplePreviewer';
import { HAAPI_EXAMPLE } from '../../../_harness/catalog';

/**
 * Render each of a step's messages yourself with the `HaapiStepperMessageUI` building block — here inside
 * a custom `<aside>` — instead of delegating the whole collection to `HaapiStepperMessagesUI`. The
 * message's `classList` still selects its presentation (heading, user code, user name, or paragraph).
 */
function StepMessages() {
  const { currentStep } = useHaapiStepper();
  const messages = currentStep?.dataHelpers.messages;

  if (!messages?.length) {
    return null;
  }

  return (
    <aside className="well">
      {messages.map(message => (
        <HaapiStepperMessageUI key={message.text} message={message} />
      ))}
    </aside>
  );
}

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.EMAIL_OTP}>
      <HaapiStepper>
        <StepMessages />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

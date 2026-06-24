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
import { HaapiStepperMessagesUI } from '@curity/haapi-react-sdk/haapi-stepper/ui/messages/HaapiStepperMessagesUI';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/** Render the current step's messages with the `HaapiStepperMessagesUI` building block. */
function Messages() {
  const { currentStep } = useHaapiStepper();
  const messages = currentStep?.dataHelpers.messages;

  return <HaapiStepperMessagesUI messages={messages} />;
}

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.EMAIL_OTP}>
      <HaapiStepper>
        <Messages />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

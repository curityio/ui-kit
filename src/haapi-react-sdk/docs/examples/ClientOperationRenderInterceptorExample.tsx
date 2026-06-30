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
import { PhoneOutlined } from '@ant-design/icons';
import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import type { HaapiStepperStepUIClientOperationActionRenderInterceptor } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * UI Customization with render interceptor: replace the client-operation action with a custom Ant Design
 * button (a phone icon, plus a description below it) via `clientOperationActionRenderInterceptor`. Clicking
 * it invokes the operation through `nextStep`.
 */
const clientOperationActionRenderInterceptor: HaapiStepperStepUIClientOperationActionRenderInterceptor = ({
  action,
  nextStep,
}) => (
  <div style={{ textAlign: 'center' }}>
    <Button type="primary" size="large" shape="round" icon={<PhoneOutlined />} onClick={() => nextStep(action)}>
      {action.title ?? 'Continue'}
    </Button>
    <p style={{ marginTop: '0.75rem', color: '#667085' }}>
      We'll guide you through the device operation to finish signing in.
    </p>
  </div>
);

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.CLIENT_OPERATION}>
      <HaapiStepper>
        <HaapiStepperStepUI clientOperationActionRenderInterceptor={clientOperationActionRenderInterceptor} />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

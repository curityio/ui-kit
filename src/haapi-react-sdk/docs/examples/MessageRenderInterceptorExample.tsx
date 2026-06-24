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
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * UI Customization with render interceptor: `messageRenderInterceptor` replaces how a step's messages
 * render. Here each message becomes a custom callout (icon + tinted box) instead of the default line of
 * text — a visible swap of just the message UI, while the rest of the step keeps the defaults.
 */
export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.EMAIL_OTP}>
      <HaapiStepper>
        <HaapiStepperStepUI
          messageRenderInterceptor={({ message }) => (
            <div style={calloutStyle}>
              <span aria-hidden>📨</span>
              <span>{message.text}</span>
            </div>
          )}
        />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

const calloutStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.5rem',
  padding: '0.75rem 1rem',
  marginBottom: '1rem',
  borderRadius: '8px',
  background: '#eef2ff',
  border: '1px solid #c7d2fe',
  color: '#3730a3',
};

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
import { HaapiStepperActionsUI } from '@curity/haapi-react-sdk/haapi-stepper/ui';
import { HaapiStepperLinksUI } from '@curity/haapi-react-sdk/haapi-stepper/ui/links/HaapiStepperLinksUI';
import { HaapiStepperMessagesUI } from '@curity/haapi-react-sdk/haapi-stepper/ui/messages/HaapiStepperMessagesUI';
import type { HaapiStepperStepUIStepRenderInterceptor } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { ExamplePreviewer } from './ExamplePreviewer';
import { HAAPI_EXAMPLE } from './catalog';

/**
 * UI Customization with render interceptor (mixed with UI composition): take over the whole step layout
 * from a `stepRenderInterceptor` and compose the building-block UIs into a custom design — a tinted hero
 * holding the messages, the actions in a card body, and the links as a footer bar. The API
 * (`currentStep`, `nextStep`) arrives as props, so no `useHaapiStepper()` hook is needed.
 */
const composedLayoutInterceptor: HaapiStepperStepUIStepRenderInterceptor = ({ currentStep, nextStep }) => {
  const { messages, links, actions } = currentStep.dataHelpers;

  return (
    <div style={cardStyle}>
      <header style={heroStyle}>
        <span aria-hidden style={{ fontSize: '1.5rem' }}>
          🔐
        </span>
        <div>
          <strong>Secure sign-in</strong>
          <HaapiStepperMessagesUI messages={messages} />
        </div>
      </header>

      <div style={{ padding: '1.25rem' }}>
        <HaapiStepperActionsUI actions={actions?.all ?? []} onAction={nextStep} />
      </div>

      {links.length > 0 && (
        <footer style={footerStyle}>
          <HaapiStepperLinksUI links={links} onClick={nextStep} />
        </footer>
      )}
    </div>
  );
};

export default function App() {
  return (
    <ExamplePreviewer defaultStep={HAAPI_EXAMPLE.HTML_FORM_LOGIN}>
      <HaapiStepper>
        <HaapiStepperStepUI stepRenderInterceptor={composedLayoutInterceptor} />
      </HaapiStepper>
    </ExamplePreviewer>
  );
}

const cardStyle: CSSProperties = {
  border: '1px solid #e5e7eb',
  borderRadius: '0.75rem',
  overflow: 'hidden',
  boxShadow: '0 1px 3px rgba(0, 0, 0, 0.08)',
};

const heroStyle: CSSProperties = {
  display: 'flex',
  alignItems: 'center',
  gap: '0.75rem',
  padding: '1rem 1.25rem',
  background: 'linear-gradient(135deg, #eef2ff, #e0e7ff)',
  color: '#3730a3',
};

const footerStyle: CSSProperties = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: '0.5rem',
  padding: '0.75rem 1.25rem',
  borderTop: '1px solid #e5e7eb',
  background: '#f9fafb',
};

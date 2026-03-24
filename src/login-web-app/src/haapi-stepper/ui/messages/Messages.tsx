/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { ReactElement } from 'react';
import { HaapiStepperUserMessage } from '../../feature/stepper/haapi-stepper.types';
import { applyRenderInterceptor } from '../../util/generic-render-interceptor';
import { defaultMessageElementFactory } from './defaultHaapiStepperMessageElementFactory';

interface MessagesProps {
  messages?: HaapiStepperUserMessage[];
  renderInterceptor?: (message: HaapiStepperUserMessage) => ReactElement | HaapiStepperUserMessage | null | undefined;
}

/**
 * @description
 * # MESSAGES COMPONENT
 *
 * Renders HAAPI user messages and supports optional render interception
 * so callers can tweak or fully override individual items.
 *
 * @param messages - Array of HAAPI user messages to display
 * @param renderInterceptor - Optional function to customize message rendering
 *
 * @example
 * ```tsx
 * function HaapiComponentExample() {
 *   const { currentStep } = useHaapiStepper();
 *   const messages = currentStep?.dataHelpers.messages;
 *
 *   return <Messages messages={messages} />;
 * }
 *
 * <HaapiStepper>
 *   <HaapiComponentExample />
 * </HaapiStepper>
 * ```
 */
export function Messages({ messages, renderInterceptor }: MessagesProps) {
  const messageElements = applyRenderInterceptor(messages, renderInterceptor, defaultMessageElementFactory);

  return messageElements.length ? (
    <div className="haapi-stepper-messages" data-testid="messages">
      {messageElements}
    </div>
  ) : null;
}

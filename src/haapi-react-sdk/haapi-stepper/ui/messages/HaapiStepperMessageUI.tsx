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

import { HaapiStepperUserMessage } from '../../feature/stepper/haapi-stepper.types';

/**
 * @description
 * # Message component
 *
 * Renders a single HAAPI user message. The message's `classList` selects the presentation: `heading`
 * renders an `<h1 className="haapi-stepper-heading">`, `userCode` a `<code>` inside
 * `.haapi-stepper-userCode` (e.g. recovery codes), `userName` an emphasized `.haapi-stepper-userName`,
 * and everything else a plain paragraph. The original `classList` is always preserved on the element so
 * it can be targeted with CSS.
 *
 * Use `HaapiStepperMessagesUI` to render a step's whole message collection; reach for this component
 * when you render a single message yourself.
 *
 * @param message - The HAAPI user message to render
 */
export const HaapiStepperMessageUI = ({ message }: { message: HaapiStepperUserMessage }) => {
  const className = message.classList?.join(' ');
  const isHeading = message.classList?.includes('heading');
  const isUserCode = message.classList?.includes('userCode');
  const isUserName = message.classList?.includes('userName');

  if (isHeading) {
    return (
      <h1 className={[className, 'haapi-stepper-heading'].filter(Boolean).join(' ')} data-testid="message">
        {message.text}
      </h1>
    );
  }

  if (isUserCode) {
    return (
      <div className={[className, 'haapi-stepper-userCode'].filter(Boolean).join(' ')} data-testid="message">
        <code>{message.text}</code>
      </div>
    );
  }

  if (isUserName) {
    return (
      <p className={[className, 'haapi-stepper-userName'].filter(Boolean).join(' ')} data-testid="message">
        <strong>{message.text}</strong>
      </p>
    );
  }

  return (
    <p className={[className].filter(Boolean).join(' ')} data-testid="message">
      {message.text}
    </p>
  );
};

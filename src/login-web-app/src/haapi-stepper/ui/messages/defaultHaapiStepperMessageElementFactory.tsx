import { HaapiStepperUserMessage } from '../../feature/stepper/haapi-stepper.types';

export const defaultMessageElementFactory = (message: HaapiStepperUserMessage) => {
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

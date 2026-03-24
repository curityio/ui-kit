import { IconGeneralClose } from '@icons';
import { ReactNode, useEffect, useState } from 'react';
import styles from '../../feature/stepper/haapi-error-notifier.module.css';
import { useHaapiStepper } from './HaapiStepperHook';
import { HaapiStepperAppError, HaapiStepperInputError } from './haapi-stepper.types';

interface HaapiErrorNotifierProps {
  children: ReactNode;
  showInputErrorNotifications?: boolean;
  notificationDuration?: number;
  errorFormatter?: (error: HaapiStepperAppError | HaapiStepperInputError) => string;
}

export function HaapiStepperErrorNotifier({
  children,
  showInputErrorNotifications = true,
  notificationDuration = 10000,
  errorFormatter = error => error.title ?? 'An error occurred',
}: HaapiErrorNotifierProps) {
  const { error } = useHaapiStepper();
  const [notificationError, setNotificationError] = useState<HaapiStepperAppError | HaapiStepperInputError | null>();
  const [isNotificationVisible, setIsNotificationVisible] = useState(false);

  useEffect(() => {
    const notificationError = error?.app ?? (showInputErrorNotifications ? error?.input : null);

    if (notificationError) {
      setNotificationError(notificationError);
      setIsNotificationVisible(true);

      const timer = setTimeout(() => {
        setIsNotificationVisible(false);
        setNotificationError(null);
      }, notificationDuration);

      return () => clearTimeout(timer);
    }
  }, [error?.app, error?.input, showInputErrorNotifications, notificationDuration]);

  const handleDismiss = () => {
    setIsNotificationVisible(false);
  };

  return (
    <>
      {isNotificationVisible && notificationError && (
        <div className={styles['haapi-error-notifier-toast']} data-testid="haapi-error-toast" role="alert">
          <div>
            <div className="flex flex-gap-2 flex-center justify-between">
              <h4 className="m0" data-testid="haapi-error-haapi-error-notifier-toast-title">
                {errorFormatter(notificationError)}
              </h4>

              <button
                type="button"
                onClick={handleDismiss}
                className="button button-tiny button-danger-outline"
                data-testid="haapi-error-haapi-error-notifier-toast-dismiss"
                aria-label="Dismiss error"
              >
                <IconGeneralClose width={16} height={16} />
              </button>
            </div>

            {notificationError.dataHelpers.messages.length && (
              <div data-testid="haapi-error-haapi-error-notifier-toast-messages">
                {notificationError.dataHelpers.messages.map(message => (
                  <p key={message.id}>{message.text}</p>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {children}
    </>
  );
}

import { IconGeneralClose } from '@curity/ui-kit-icons';
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
  errorFormatter = defaultErrorFormatter,
}: HaapiErrorNotifierProps) {
  const { error } = useHaapiStepper();
  const currentError = error?.app ?? (showInputErrorNotifications ? error?.input : null);
  const [dismissedError, setDismissedError] = useState<HaapiStepperAppError | HaapiStepperInputError | null>(null);

  useEffect(() => {
    if (!currentError) {
      return;
    }

    const timeout = setTimeout(() => {
      setDismissedError(currentError);
    }, notificationDuration);

    return () => clearTimeout(timeout);
  }, [currentError, notificationDuration]);

  const isNotificationVisible = currentError && dismissedError !== currentError;
  const notificationMessages = currentError?.dataHelpers.messages ?? [];
  const handleDismiss = () => {
    setDismissedError(currentError ?? null);
  };

  return (
    <>
      {isNotificationVisible && (
        <div className={styles['haapi-error-notifier-toast']} data-testid="haapi-error-toast" role="alert">
          <div>
            <div className="flex flex-gap-2 flex-center justify-between">
              <h4 className="m0" data-testid="haapi-error-haapi-error-notifier-toast-title">
                {errorFormatter(currentError)}
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

            {notificationMessages.length > 0 && (
              <div data-testid="haapi-error-haapi-error-notifier-toast-messages">
                {notificationMessages.map(message => (
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

const defaultErrorFormatter = (error: HaapiStepperAppError | HaapiStepperInputError) =>
  error.title ?? 'An error occurred';

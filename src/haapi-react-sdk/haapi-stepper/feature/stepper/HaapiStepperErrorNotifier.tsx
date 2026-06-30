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

import { IconGeneralClose } from '@curity/ui-kit-icons';
import { ReactNode, useEffect, useState } from 'react';
import { createPortal } from 'react-dom';
import { useHaapiStepper } from './HaapiStepperHook';
import { HaapiStepperAppError, HaapiStepperInputError } from './haapi-stepper.types';

interface HaapiErrorNotifierProps {
  children: ReactNode;
  showInputErrorNotifications?: boolean;
  notificationDuration?: number;
  errorFormatter?: (error: HaapiStepperAppError | HaapiStepperInputError) => string;
}

/**
 * @description
 *
 * Toast-based notification UI for HAAPI `AppError`s (and, optionally, `InputError`s). Wrap your app so
 * unrecoverable problems surface as dismissible toasts without each step having to handle them.
 *
 * ```tsx
 * <HaapiStepperErrorNotifier>
 *   <YourApplication />
 * </HaapiStepperErrorNotifier>
 * ```
 * {@see_example docs/examples/ErrorNotifierExample.tsx Error notifier}
 *
 * **Features**
 * - Automatically shows notifications for `AppError` and, optionally, `InputError`.
 * - Auto-dismisses after a timeout, and manually via a close button.
 */
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
      {isNotificationVisible &&
        createPortal(
          <div className="haapi-error-notifier-toast" data-testid="haapi-error-toast" role="alert">
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
          </div>,
          document.body
        )}

      {children}
    </>
  );
}

const defaultErrorFormatter = (error: HaapiStepperAppError | HaapiStepperInputError) =>
  error.title ?? 'An error occurred';

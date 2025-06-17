import { Dialog as ReachDialog, DialogProps } from '@reach/dialog';
import { ReactNode } from 'react';
import { useTranslation } from 'react-i18next';
import styles from './Dialog.module.css';
import { Button } from '@/shared/ui/Button';
import { IconGeneralClose } from '@icons';

export interface CurityDialogProps {
  isOpen: boolean;
  title?: string;
  subTitle?: string;
  showHeader?: boolean;
  showFooter?: boolean;
  showCloseButton?: boolean;
  closeDialogOnActionButtonClick?: boolean;
  closeCallback?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  closeDialogOnCancelButtonClick?: boolean;
  showActionButton?: boolean;
  actionButtonText?: string;
  isActionButtonDisabled?: boolean;
  closeDialogOnButtonClick?: boolean;
  actionButtonCallback?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  showCancelButton?: boolean;
  cancelButtonText?: string;
  cancelButtonCallback?: (event: React.MouseEvent<HTMLButtonElement>) => void;
  settings?: Pick<DialogProps, 'initialFocusRef' | 'allowPinchZoom'>;
  children?: ReactNode;
}

export type DialogConfig = CurityDialogProps;

export const Dialog = ({
  isOpen,
  title,
  subTitle,
  showHeader = true,
  showFooter = true,
  showCloseButton = true,
  closeDialogOnActionButtonClick = true,
  closeDialogOnCancelButtonClick = true,
  closeCallback,
  showActionButton = false,
  actionButtonText,
  isActionButtonDisabled = false,
  actionButtonCallback,
  showCancelButton = false,
  cancelButtonText,
  cancelButtonCallback,
  settings,
  children,
}: CurityDialogProps) => {
  const { t } = useTranslation();
  const closeDialog = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (closeCallback) {
      closeCallback(event);
    }
  };

  actionButtonText = actionButtonText || t('Confirm');
  cancelButtonText = cancelButtonText || t('Cancel');

  const handleActionButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (actionButtonCallback) {
      actionButtonCallback(event);
    }

    if (closeDialogOnActionButtonClick) {
      closeDialog(event);
    }
  };

  const handleCancelButtonClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (cancelButtonCallback) {
      cancelButtonCallback(event);
    }

    if (closeDialogOnCancelButtonClick) {
      closeDialog(event);
    }
  };

  const closeButtonElement = (
    <Button
      icon={<IconGeneralClose width={18} height={18} />}
      onClick={closeDialog}
      aria-label={t('Close dialog')}
      className="button-tiny button-link"
      data-testid="dialog-close-button"
    />
  );
  const cancelButtonElement = (
    <Button
      className="button-small button-primary-outline"
      onClick={event => handleCancelButtonClick(event)}
      title={cancelButtonText}
      data-testid="dialog-cancel-button"
    />
  );
  const actionButtonElement = (
    <Button
      className="button-small button-primary"
      onClick={handleActionButtonClick}
      title={actionButtonText}
      disabled={isActionButtonDisabled}
      data-testid="dialog-action-button"
    />
  );

  return (
    <>
      <ReachDialog isOpen={isOpen} {...settings} onDismiss={closeDialog} className={styles.dialog} data-testid="dialog">
        {showHeader && (
          <header className="flex justify-between p2 border-bottom-light w100" data-testid="dialog-header">
            {title && (
              <p className="m0" data-testid="dialog-title">
                {title}
              </p>
            )}
            {showCloseButton && closeButtonElement}
          </header>
        )}
        <main className="center flex flex-column justify-center p3" data-testid="dialog-content">
          {subTitle && (
            <h2 className="mt0" data-testid="dialog-subtitle">
              {subTitle}
            </h2>
          )}
          {children}
        </main>
        {showFooter && (
          <footer
            className={`${styles['dialog-footer']} flex flex-gap-2 flex-center justify-end p2 bg-light-grey mt-auto w100`}
            data-testid="dialog-footer"
          >
            {showCancelButton && cancelButtonElement}
            {showActionButton && actionButtonElement}
          </footer>
        )}
      </ReachDialog>
    </>
  );
};

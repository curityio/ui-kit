/*
 * Copyright (C) 2024 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { Button } from '@curity/ui-kit-component-library';
import { Dialog, DialogConfig } from '@/shared/ui/dialog/Dialog';
import { ButtonHTMLAttributes, ReactElement, useState } from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: ReactElement;
  dialogMessage?: string;
  dialogConfig?: Omit<
    DialogConfig,
    | 'isOpen'
    | 'showHeader'
    | 'showFooter'
    | 'showActionButton'
    | 'closeDialogOnActionButtonClick'
    | 'showCancelButton'
    | 'actionButtonCallback'
    | 'cancelButtonCallback'
  >;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export const ConfirmButton = ({
  title,
  icon,
  dialogMessage,
  dialogConfig,
  onConfirm,
  onCancel,
  ...props
}: ConfirmButtonProps) => {
  const { t } = useTranslation();
  const [isOpen, setIsOpen] = useState(false);

  const defaultDialogConfig: DialogConfig = {
    isOpen,
    showHeader: true,
    title: `${t('confirm')} ${t('account.action')}`,
    showCloseButton: true,
    showFooter: true,
    showActionButton: true,
    actionButtonText: t('confirm'),
    isActionButtonDisabled: false,
    actionButtonCallback: onConfirm,
    closeDialogOnActionButtonClick: true,
    showCancelButton: true,
    cancelButtonText: t('cancel'),
    children: <h2 className="m0">{dialogMessage || t('confirm-proceed')}</h2>,
  };
  const dialogConfigResult = { ...defaultDialogConfig, ...dialogConfig };
  const closeCallback = (event: React.MouseEvent<HTMLButtonElement>) => {
    setIsOpen(false);
    onCancel?.();
    dialogConfig?.closeCallback?.(event);
  };
  const dialogConfigToApply = {
    ...dialogConfigResult,
    closeCallback,
    cancelButtonCallback: closeCallback,
  };

  return (
    <>
      <Button title={title} icon={icon} {...props} onClick={() => setIsOpen(true)} data-testid="confirm-button" />
      {isOpen && <Dialog {...dialogConfigToApply} />}
    </>
  );
};

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

import { Button } from '@components/Button';
import { Dialog, DialogConfig } from '@components/dialog/Dialog';
import { ButtonHTMLAttributes, ReactElement, useState } from 'react';
import { TranslationFunction } from '@/types/util.type.ts';

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
  t: TranslationFunction;
}

export const ConfirmButton = ({
  title,
  icon,
  dialogMessage,
  dialogConfig,
  onConfirm,
  onCancel,
  t,
  ...props
}: ConfirmButtonProps) => {
  const [isOpen, setIsOpen] = useState(false);

  const defaultDialogConfig: DialogConfig = {
    isOpen,
    showHeader: true,
    t,
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

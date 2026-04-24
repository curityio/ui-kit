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

import type { ComponentPropsWithRef, ReactElement, ReactNode } from 'react';

import { HAAPI_FORM_ACTION_KINDS } from '../../../data-access/types/haapi-action.types';
import { resolveAuthenticatorIcon } from '../../../../shared/ui/icons/authenticator-icons';
import { useHaapiStepperForm } from './HaapiStepperFormContext';

interface HaapiStepperFormSubmitButtonProps extends ComponentPropsWithRef<'button'> {
  label?: string;
  icon?: ReactNode;
}

export function HaapiStepperFormSubmitButton({
  label,
  icon,
  children,
  className,
  ref,
  ...buttonProps
}: HaapiStepperFormSubmitButtonProps): ReactElement {
  const { action } = useHaapiStepperForm();
  const isCancel = action.kind === HAAPI_FORM_ACTION_KINDS.CANCEL;
  const authenticatorType = action.properties?.authenticatorType;
  const submitButtonLabel = label ?? action.model.actionTitle ?? action.title ?? authenticatorType ?? '';
  const submitButtonIcon = icon ?? getDefaultSubmitButtonIcon(authenticatorType, isCancel);
  const submitButtonClassName = getSubmitButtonClassName(authenticatorType, isCancel, className);

  return (
    <button ref={ref} data-testid="form-submit-button" {...buttonProps} type="submit" className={submitButtonClassName}>
      {children ?? (
        <>
          {submitButtonIcon && (
            <span className="icon" aria-hidden="true">
              {submitButtonIcon}
            </span>
          )}
          {submitButtonLabel}
        </>
      )}
    </button>
  );
}

function getSubmitButtonClassName(
  authenticatorType: string | undefined,
  isCancel: boolean,
  extraClassName: string | undefined
): string {
  const baseClassName = isCancel
    ? 'haapi-stepper-button-outline'
    : authenticatorType
      ? `haapi-stepper-authenticator-button button-${authenticatorType}`
      : 'haapi-stepper-button';
  return [baseClassName, extraClassName].filter(Boolean).join(' ');
}

function getDefaultSubmitButtonIcon(authenticatorType: string | undefined, isCancel: boolean): ReactNode {
  if (isCancel || !authenticatorType) {
    return null;
  }
  const DefaultIcon = resolveAuthenticatorIcon(authenticatorType);
  return <DefaultIcon />;
}

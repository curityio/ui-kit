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

import type { ReactElement } from 'react';

import { HAAPI_FORM_ACTION_KINDS } from '../../../data-access/types/haapi-action.types';
import { useHaapiStepperForm } from './HaapiStepperFormContext';

interface HaapiStepperFormSubmitButtonProps {
  label?: string;
}

export function HaapiStepperFormSubmitButton({ label }: HaapiStepperFormSubmitButtonProps): ReactElement {
  const { action } = useHaapiStepperForm();
  const isCancel = action.kind === HAAPI_FORM_ACTION_KINDS.CANCEL;
  const submitLabel = label ?? action.model.actionTitle ?? action.title ?? '';
  const buttonClassName = isCancel ? 'haapi-stepper-button-outline' : 'haapi-stepper-button';

  return (
    <button data-testid="haapi-form-submit-button" className={buttonClassName} type="submit">
      {submitLabel}
    </button>
  );
}

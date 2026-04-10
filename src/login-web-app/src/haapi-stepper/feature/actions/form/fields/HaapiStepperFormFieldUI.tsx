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

import { HAAPI_FORM_FIELDS } from '../../../../data-access/types/haapi-form.types';
import type { HaapiStepperFormField, HaapiStepperTextFormField, HaapiStepperUsernameFormField } from '../../../stepper/haapi-stepper.types';
import { HaapiStepperCheckboxFormFieldUI } from './HaapiStepperCheckboxFormFieldUI';
import { HaapiStepperSelectFormFieldUI } from './HaapiStepperSelectFormFieldUI';
import { HaapiStepperTextFormFieldUI } from './HaapiStepperTextFormFieldUI';
import { HaapiStepperPasswordFormFieldUI } from './HaapiStepperPasswordFormFieldUI';

export function HaapiStepperFormFieldUI({ field }: { field: HaapiStepperFormField }): ReactElement {
  switch (field.type) {
    case HAAPI_FORM_FIELDS.SELECT:
      return <HaapiStepperSelectFormFieldUI field={field} />;
    case HAAPI_FORM_FIELDS.CHECKBOX:
      return <HaapiStepperCheckboxFormFieldUI field={field} />;
    case HAAPI_FORM_FIELDS.PASSWORD:
      return <HaapiStepperPasswordFormFieldUI field={field} />;
    default:
      return <HaapiStepperTextFormFieldUI field={field as HaapiStepperTextFormField | HaapiStepperUsernameFormField} />;
  }
}

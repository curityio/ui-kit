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

import { HaapiFormField, HAAPI_FORM_FIELDS } from '../../../../data-access/types/haapi-form.types';
import { HaapiStepperCheckboxFormField } from './HaapiStepperCheckboxFormField';
import { HaapiStepperSelectFormField } from './HaapiStepperSelectFormField';
import { HaapiStepperTextFormField } from './HaapiStepperTextFormField';
import { HaapiStepperPasswordFormField } from './HaapiStepperPasswordFormField';

export function HaapiStepperFormField({ field }: { field: HaapiFormField }): ReactElement {
  switch (field.type) {
    case HAAPI_FORM_FIELDS.SELECT:
      return <HaapiStepperSelectFormField field={field} />;
    case HAAPI_FORM_FIELDS.CHECKBOX:
      return <HaapiStepperCheckboxFormField field={field} />;
    case HAAPI_FORM_FIELDS.PASSWORD:
      return <HaapiStepperPasswordFormField field={field} />;
    default:
      return <HaapiStepperTextFormField field={field} />;
  }
}

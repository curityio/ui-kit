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

import { VisibleHaapiFormField } from '../../../../data-access';
import { HaapiStepperFormValidationErrorInputWrapper } from '../HaapiStepperFormValidationErrorInputWrapper';
import { HaapiStepperFormField } from './HaapiStepperFormField';

export const defaultHaapiStepperFormFieldElementFactory = (field: VisibleHaapiFormField) => {
  const fieldKey = `${field.name}-validation-error`;

  return (
    <HaapiStepperFormValidationErrorInputWrapper fieldName={field.name} key={fieldKey}>
      <HaapiStepperFormField field={field} />
    </HaapiStepperFormValidationErrorInputWrapper>
  );
};

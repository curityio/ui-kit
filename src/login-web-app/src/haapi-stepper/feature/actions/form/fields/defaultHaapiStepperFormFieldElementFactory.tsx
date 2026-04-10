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

import type { HaapiStepperVisibleFormField } from '../../../stepper/haapi-stepper.types';
import { HaapiStepperFormValidationErrorInputWrapper } from '../HaapiStepperFormValidationErrorInputWrapper';
import { HaapiStepperFormFieldUI } from './HaapiStepperFormFieldUI';

export const defaultHaapiStepperFormFieldElementFactory = (field: HaapiStepperVisibleFormField) => {
  const fieldKey = `${field.name}-validation-error`;

  return (
    <HaapiStepperFormValidationErrorInputWrapper fieldName={field.name} key={fieldKey}>
      <HaapiStepperFormFieldUI field={field} />
    </HaapiStepperFormValidationErrorInputWrapper>
  );
};

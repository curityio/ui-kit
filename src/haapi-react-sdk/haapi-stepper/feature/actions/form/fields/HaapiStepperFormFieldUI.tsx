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

import type { ReactElement } from 'react';

import { HAAPI_FORM_FIELDS } from '../../../../data-access/types/haapi-form.types';
import type { HaapiStepperVisibleFormField } from '../../../stepper/haapi-stepper.types';
import { HaapiStepperCheckboxFormFieldUI } from './HaapiStepperCheckboxFormFieldUI';
import { HaapiStepperSelectFormFieldUI } from './HaapiStepperSelectFormFieldUI';
import { HaapiStepperTextFormFieldUI } from './HaapiStepperTextFormFieldUI';
import { HaapiStepperPasswordFormFieldUI } from './HaapiStepperPasswordFormFieldUI';

/**
 * Renders the built-in UI for a single HAAPI form `field`, automatically choosing the right input for the
 * field type (text, password, checkbox or select).
 *
 * Must be used inside a `HaapiStepperFormUI` `children` render interceptor — it reads the field's value and
 * submission state from that form's context, so rendering it anywhere else throws. Reach for it when you want a
 * custom form layout but still want the default, state-managed inputs for the fields:
 *
 * ```tsx
 * <HaapiStepperFormUI action={action} onSubmit={nextStep}>
 *   {({ fields }) => (
 *     <fieldset>
 *       <legend>Sign in</legend>
 *       {fields.map(field => (
 *         <HaapiStepperFormFieldUI key={field.name} field={field} />
 *       ))}
 *     </fieldset>
 *   )}
 * </HaapiStepperFormUI>
 * ```
 * {@see_example docs/examples/FormUICompositionExample.tsx Custom field layout}
 *
 * To customize a single field, render its specific component ({@link HaapiStepperTextFormFieldUI},
 * {@link HaapiStepperPasswordFormFieldUI}, {@link HaapiStepperCheckboxFormFieldUI},
 * {@link HaapiStepperSelectFormFieldUI}) or your own input wired to the form's `formState`.
 */
export function HaapiStepperFormFieldUI({ field }: { field: HaapiStepperVisibleFormField }): ReactElement {
  switch (field.type) {
    case HAAPI_FORM_FIELDS.SELECT:
      return <HaapiStepperSelectFormFieldUI field={field} />;
    case HAAPI_FORM_FIELDS.CHECKBOX:
      return <HaapiStepperCheckboxFormFieldUI field={field} />;
    case HAAPI_FORM_FIELDS.PASSWORD:
      return <HaapiStepperPasswordFormFieldUI field={field} />;
    default:
      return <HaapiStepperTextFormFieldUI field={field} />;
  }
}

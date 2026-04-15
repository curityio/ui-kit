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

import type { InputHTMLAttributes, ReactElement, SelectHTMLAttributes } from 'react';

import { HAAPI_FORM_FIELDS } from '../../../../data-access/types/haapi-form.types';
import type {
  HaapiStepperFormField,
  HaapiStepperSelectFormField,
} from '../../../stepper/haapi-stepper.types';
import { HaapiStepperCheckboxFormFieldUI } from './HaapiStepperCheckboxFormFieldUI';
import { HaapiStepperSelectFormFieldUI } from './HaapiStepperSelectFormFieldUI';
import { HaapiStepperTextFormFieldUI } from './HaapiStepperTextFormFieldUI';
import { HaapiStepperPasswordFormFieldUI } from './HaapiStepperPasswordFormFieldUI';

type InputDataAttributes = Record<`data-${string}`, unknown>;

export type HaapiStepperSelectFormFieldInputProps = SelectHTMLAttributes<HTMLSelectElement> & InputDataAttributes;
export type HaapiStepperGenericFormFieldInputProps = InputHTMLAttributes<HTMLInputElement> & InputDataAttributes;

type InputPropsFor<F extends HaapiStepperFormField> = F extends HaapiStepperSelectFormField
  ? HaapiStepperSelectFormFieldInputProps
  : HaapiStepperGenericFormFieldInputProps;

interface HaapiStepperFormFieldUIProps<F extends HaapiStepperFormField> {
  field: F;
  inputProps?: InputPropsFor<F>;
}

/**
 * @description
 * # HAAPI STEPPER FORM FIELD
 *
 * Routes a {@link HaapiStepperVisibleFormField} to the appropriate field component based on its `type` discriminant:
 *
 * | Field type   | Component                           |
 * |--------------|-------------------------------------|
 * | `SELECT`     | `HaapiStepperSelectFormFieldUI`      |
 * | `CHECKBOX`   | `HaapiStepperCheckboxFormFieldUI`    |
 * | `PASSWORD`   | `HaapiStepperPasswordFormFieldUI`    |
 * | default      | `HaapiStepperTextFormFieldUI`        |
 *
 * ## Default usage
 *
 * When used inside {@link HaapiStepperForm} without customization, fields are rendered automatically —
 * no direct usage of this component is needed. [Tests](./HaapiStepperFormField.spec.tsx) cover the default
 * rendering for every field type.
 *
 * ## Custom rendering via `inputProps`
 *
 * Use the `inputProps` prop to pass additional HTML attributes to the underlying input or select element.
 * This is typically done through the {@link HaapiStepperFormFieldRenderInterceptor} on {@link HaapiStepperForm}.
 * [Tests](./HaapiStepperFormField.spec.tsx) cover the custom rendering patterns.
 *
 * The `inputProps` type is **narrowed based on the field type**: select fields accept
 * {@link HaapiStepperSelectFormFieldInputProps} (`SelectHTMLAttributes`), all other fields accept
 * {@link HaapiStepperGenericFormFieldInputProps} (`InputHTMLAttributes`). Both support `data-*` attributes.
 *
 * Managed props (`name`, `type`, `value`, `onChange`) cannot be overridden — they are always controlled by the
 * field component. The `className` prop is **merged** with the default class rather than replaced.
 *
 * @example
 * ```tsx
 * <HaapiStepperForm
 *   action={formAction}
 *   onSubmit={nextStep}
 *   formFieldRenderInterceptor={(field) => (
 *     <HaapiStepperFormFieldUI
 *       field={field}
 *       inputProps={{ 'data-testid': `custom-${field.name}`, className: 'my-custom-class' }}
 *     />
 *   )}
 * />
 * ```
 */
export function HaapiStepperFormFieldUI<F extends HaapiStepperFormField>({
  field,
  inputProps,
}: HaapiStepperFormFieldUIProps<F>): ReactElement {
  switch (field.type) {
    case HAAPI_FORM_FIELDS.SELECT:
      return <HaapiStepperSelectFormFieldUI field={field} inputProps={inputProps as HaapiStepperSelectFormFieldInputProps} />;
    case HAAPI_FORM_FIELDS.CHECKBOX:
      return <HaapiStepperCheckboxFormFieldUI field={field} inputProps={inputProps as HaapiStepperGenericFormFieldInputProps} />;
    case HAAPI_FORM_FIELDS.PASSWORD:
      return <HaapiStepperPasswordFormFieldUI field={field} inputProps={inputProps as HaapiStepperGenericFormFieldInputProps} />;
    default:
      return <HaapiStepperTextFormFieldUI field={field} inputProps={inputProps as HaapiStepperGenericFormFieldInputProps} />;
  }
}

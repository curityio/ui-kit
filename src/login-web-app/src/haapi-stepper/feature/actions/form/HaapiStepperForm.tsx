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

import { useCallback, useMemo } from 'react';
import { HAAPI_FORM_FIELDS } from '../../../data-access/types/haapi-form.types';
import { applyRenderInterceptor } from '../../../util/generic-render-interceptor';
import type {
  HaapiStepperFormAPI,
  HaapiStepperFormChildrenRenderInterceptor,
  HaapiStepperFormFieldRenderInterceptor,
  HaapiStepperFormState,
  HaapiStepperNextStep,
  HaapiStepperVisibleFormField,
} from '../../stepper/haapi-stepper.types';
import { HaapiStepperFormAction } from '../../stepper/haapi-stepper.types';
import { HaapiStepperFormContext } from './HaapiStepperFormContext';
import { useHaapiStepperFormState } from './HaapiStepperFormHook';
import { HaapiStepperFormSubmitButton } from './HaapiStepperFormSubmitButton';
import { defaultHaapiStepperFormFieldElementFactory } from './fields/defaultHaapiStepperFormFieldElementFactory';

interface HaapiStepperFormProps {
  action: HaapiStepperFormAction;
  onSubmit: HaapiStepperNextStep<HaapiStepperFormAction>;
  formFieldRenderInterceptor?: HaapiStepperFormFieldRenderInterceptor;
  children?: HaapiStepperFormChildrenRenderInterceptor;
}

/**
 * @description
 * # HAAPI STEPPER FORM FEATURES
 *
 * ## BUILT-IN HAAPI FORM ACTION SUPPORT
 *
 * Renders a HAAPI form action inside the stepper. Tests in
 * `haapi-stepper/feature/actions/form/HaapiStepperForm.spec.tsx` cover the supported usage patterns:
 *
 * @example
 * ```tsx
 * const onSubmit: HaapiStepperNextStep<HaapiStepperFormAction> = (action, payload) => nextStep(action, payload);
 *
 * <HaapiStepperForm action={loginAction} onSubmit={onSubmit} />
 * ```
 *
 * By default, the HaapiStepperForm:
 *
 * - Automatically renders all non-hidden fields with built-in HAAPI field components.
 * - Keeps hidden fields in the submission payload without rendering them.
 * - Submits the original action together with the current form values as payload (`Map<string, string>`).
 *
 * ## CUSTOMIZATION
 *
 * ### CUSTOMIZATION VIA INTERCEPTORS
 *
 * Use {@link HaapiStepperFormFieldRenderInterceptor} to adjust data, swap components, or omit fields while still
 * leveraging the built-in state management. The interceptor mirrors the “Data customization” and “UI
 * customization” tests.
 *
 * The `formFieldRenderInterceptor` is better suited for customization of form fields. For form-level customization
 * (e.g. adding elements between fields, field group customizations), consider using the `children` render interceptor
 * as described in the next section.
 *
 * @example
 * ```tsx
 * const formFieldRenderInterceptor: FormFieldRenderInterceptor = (field, formState) => {
 *   if (field.type === HAAPI_FORM_FIELDS.USERNAME) {
 *     // Data customization: modify data before delegating to the default renderer
 *     return { ...field, label: 'Account', placeholder: 'user@example.com' };
 *   }
 *
 *   if (field.type === HAAPI_FORM_FIELDS.PASSWORD) {
 *     // UI Customization: replace the default renderer with a custom element using the formState helpers
 *     return (
 *       <label className="label block">
 *         Password:
 *         <input
 *           type="password"
 *           className="field w100"
 *           value={formState.get(field)}
 *           onChange={event => formState.set(field, event.target.value)}
 *         />
 *       </label>
 *     );
 *   }
 *
 *   if (field.type === HAAPI_FORM_FIELDS.CHECKBOX) {
 *     // UI Customization: skip checkboxes entirely
 *     return null;
 *   }
 *
 *  // Fallback to default renderer
 *   return field;
 * };
 *
 * <HaapiStepperForm
 *   action={formAction}
 *   onSubmit={nextStep}
 *   formFieldRenderInterceptor={formFieldRenderInterceptor}
 * />
 * ```
 *
 * ### CUSTOMIZATION VIA COMPOSITION (CHILDREN RENDER INTERCEPTOR)
 *
 * Passing `children` to the `HaapiStepperForm` component disables the default renderer. Provide a render function
 * that receives the visible form `fields`, and the current `formState`. This pattern mirrors the scenarios covered
 * under “Via Composition (children render interceptor)” in the tests.
 *
 * This approach provides full control over the form content, while still leveraging the built-in state management
 * and submission handling. It is better suited for complex customizations, such as adding elements between fields,
 * changing the form layout, implementing custom field groupings, or customizing the submit button.
 *
 * Note that, as any other render interceptor, returning `null` or `undefined` from the children render interceptor
 * will prevent the form content from rendering. Also, returning the `HaapiStepperFormAPI` data allows you to
 * delegate back to the default form, optionally with customized data.
 *
 * @example
 * ```tsx
 * <HaapiStepperForm action={action} onSubmit={nextStep}>
 *   {({ fields, formState }) => {
 *      const delegateToDefaultRendering = currentStep.metadata?.viewName !== 'authenticator/html-form/authenticate/get';
 *
 *      if (delegateToDefaultRendering) {
 *        return { fields, formState };
 *      }
 *
 *     const usernameField = fields.find(field => field.type === HAAPI_FORM_FIELDS.USERNAME)!;
 *     const passwordField = fields.find(field => field.type === HAAPI_FORM_FIELDS.PASSWORD)!;
 *
 *     return (
 *       <>
 *         <fieldset>
 *           <legend>Login</legend>
 *           <HaapiStepperFormField field={usernameField} />
 *           <label>
 *             Password:
 *             <input
 *               type="password"
 *               name={passwordField?.name}
 *               value={formState.get(passwordField)}
 *               onChange={event => formState.set(passwordField, event.target.value)}
 *             />
 *           </label>
 *         </fieldset>
 *
 *         <div className="submit-button-container">
 *          <button type="submit">Login</button>
 *         </div>
 *       </>
 *     );
 *   }}
 * </HaapiStepperForm>
 * ```
 *
 * ### BEHAVIOUR OVERRIDES AROUND SUBMISSION
 *
 * Because `submit` is exposed through context, you can layer on additional behaviour (confirmation
 * prompts, analytics, pre-submit validation) before delegating to the incoming `onSubmit`. Tests under
 * “Behavior customization” illustrate this pattern.
 *
 * @example
 * ```tsx
 * const handleSubmit: HaapiStepperNextStep<HaapiStepperFormAction> = (action, payload) => {
 *   if (!window.confirm('Submit the form?')) {
 *     return;
 *   }
 *   nextStep(action, payload);
 * };
 *
 * <HaapiStepperForm action={loginAction} onSubmit={handleSubmit} />
 * ```
 */
export function HaapiStepperForm({ action, onSubmit, formFieldRenderInterceptor, children }: HaapiStepperFormProps) {
  const fields = action.model.fields ?? [];
  const formState = useHaapiStepperFormState(fields);
  const visibleFields = fields.filter(
    (field): field is HaapiStepperVisibleFormField =>
      field.type !== HAAPI_FORM_FIELDS.HIDDEN && field.type !== HAAPI_FORM_FIELDS.CONTEXT
  );
  const haapiStepperFormAPI: HaapiStepperFormAPI = { fields: visibleFields, formState };
  const submit = useCallback(() => {
    onSubmit(action, formState.values);
  }, [onSubmit, action, formState]);
  const formContextValue = useMemo(() => ({ formState, action, submit }), [formState, action, submit]);

  const formContentElements = applyRenderInterceptor(
    [haapiStepperFormAPI],
    children,
    defaultFormContentFactory(formFieldRenderInterceptor)
  );
  const formContentElement = formContentElements[0] ?? null;

  return (
    <HaapiStepperFormContext value={formContextValue}>
      <form
        data-testid="form-action"
        id={action.id}
        onSubmit={e => {
          e.preventDefault();
          submit();
        }}
      >
        {visibleFields.length > 0 && action.title && <h1 className="haapi-stepper-heading">{action.title}</h1>}
        {formContentElement}
      </form>
    </HaapiStepperFormContext>
  );
}

const defaultFormContentFactory =
  (formFieldRenderInterceptor?: HaapiStepperFormFieldRenderInterceptor) =>
  ({ fields, formState }: HaapiStepperFormAPI) => (
    <>
      {getFormFieldElements(fields, formState, formFieldRenderInterceptor)}
      <HaapiStepperFormSubmitButton />
    </>
  );

const getFormFieldElements = (
  fieldsToRender: HaapiStepperVisibleFormField[],
  formState: HaapiStepperFormState,
  formFieldRenderInterceptor?: HaapiStepperFormFieldRenderInterceptor
) =>
  applyRenderInterceptor(
    fieldsToRender,
    formFieldRenderInterceptor ? (field, index) => formFieldRenderInterceptor(field, formState, index) : undefined,
    defaultHaapiStepperFormFieldElementFactory
  );

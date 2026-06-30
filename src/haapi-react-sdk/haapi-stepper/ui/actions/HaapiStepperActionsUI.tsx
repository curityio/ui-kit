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

import { ElementType, Fragment, ReactElement } from 'react';
import { HAAPI_ACTION_TYPES } from '../../data-access/types/haapi-action.types';
import type {
  HaapiStepperAction,
  HaapiStepperActionsActionRenderInterceptor,
  HaapiStepperFormFieldRenderInterceptor,
  HaapiStepperClientOperationAction,
  HaapiStepperFormAction,
  HaapiStepperNextStep,
  HaapiStepperSelectorAction,
} from '../../feature/stepper/haapi-stepper.types';
import { applyRenderInterceptor } from '../../util/generic-render-interceptor';
import defaultHaapiStepperActionElementFactory from './defaultHaapiStepperActionElementFactory';

interface HaapiStepperActionsUIProps {
  actions?: HaapiStepperAction[];
  onAction: HaapiStepperNextStep<HaapiStepperFormAction | HaapiStepperClientOperationAction>;
  formActionRenderInterceptor?: HaapiStepperActionsActionRenderInterceptor<HaapiStepperFormAction>;
  formFieldRenderInterceptor?: HaapiStepperFormFieldRenderInterceptor;
  selectorActionRenderInterceptor?: HaapiStepperActionsActionRenderInterceptor<HaapiStepperSelectorAction>;
  clientOperationActionRenderInterceptor?: HaapiStepperActionsActionRenderInterceptor<HaapiStepperClientOperationAction>;
  container?: ElementType | null;
}

/**
 * @description
 * # Actions component
 *
 * Renders a HAAPI step's actions — form, selector, and client-operation — each with the default UI for
 * its subtype. Pass a per-subtype render interceptor (`formActionRenderInterceptor`,
 * `selectorActionRenderInterceptor`, `clientOperationActionRenderInterceptor`) to tweak or fully
 * override a single action kind, and `formFieldRenderInterceptor` to customize the fields inside form
 * actions. The wrapping element is a `<div className="haapi-stepper-actions">` by default; override it
 * with `container` (or `null` to render the actions without a wrapper).
 *
 * @param actions - The HAAPI actions to render (typically `currentStep.dataHelpers.actions.all`)
 * @param onAction - Callback to advance the flow when an action is submitted (usually `nextStep`)
 * @param formActionRenderInterceptor - Optional interceptor for form actions
 * @param formFieldRenderInterceptor - Optional interceptor for the fields inside form actions
 * @param selectorActionRenderInterceptor - Optional interceptor for selector actions
 * @param clientOperationActionRenderInterceptor - Optional interceptor for client-operation actions
 * @param container - Element type to wrap the actions in, or `null` for no wrapper
 *
 * ```tsx
 * function Step() {
 *   const { currentStep, nextStep } = useHaapiStepper();
 *   const actions = currentStep?.dataHelpers.actions.all;
 *
 *   return <HaapiStepperActionsUI actions={actions} onAction={nextStep} />;
 * }
 * ```
 */
export function HaapiStepperActionsUI({
  actions,
  onAction,
  formActionRenderInterceptor,
  formFieldRenderInterceptor,
  selectorActionRenderInterceptor,
  clientOperationActionRenderInterceptor,
  container,
}: HaapiStepperActionsUIProps) {
  if (!actions?.length) {
    return null;
  }

  const Container = container === null ? Fragment : (container ?? 'div');

  const actionInterceptor = (action: HaapiStepperAction): ReactElement | HaapiStepperAction | null | undefined => {
    if (action.subtype === HAAPI_ACTION_TYPES.FORM && formActionRenderInterceptor) {
      return formActionRenderInterceptor(action);
    }

    if (action.subtype === HAAPI_ACTION_TYPES.CLIENT_OPERATION && clientOperationActionRenderInterceptor) {
      return clientOperationActionRenderInterceptor(action);
    }

    if (action.subtype === HAAPI_ACTION_TYPES.SELECTOR && selectorActionRenderInterceptor) {
      return selectorActionRenderInterceptor(action);
    }

    return action;
  };

  const actionElements = applyRenderInterceptor(actions, actionInterceptor, (action: HaapiStepperAction) =>
    defaultHaapiStepperActionElementFactory(action, onAction, formFieldRenderInterceptor)
  );

  return actionElements.length ? (
    <Container className="haapi-stepper-actions" data-testid="actions">
      {actionElements}
    </Container>
  ) : null;
}

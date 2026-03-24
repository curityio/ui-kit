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

interface ActionsProps {
  actions?: HaapiStepperAction[];
  onAction: HaapiStepperNextStep<HaapiStepperFormAction | HaapiStepperClientOperationAction>;
  formActionRenderInterceptor?: HaapiStepperActionsActionRenderInterceptor<HaapiStepperFormAction>;
  formFieldRenderInterceptor?: HaapiStepperFormFieldRenderInterceptor;
  selectorActionRenderInterceptor?: HaapiStepperActionsActionRenderInterceptor<HaapiStepperSelectorAction>;
  clientOperationActionRenderInterceptor?: HaapiStepperActionsActionRenderInterceptor<HaapiStepperClientOperationAction>;
  container?: ElementType | null;
}

export function Actions({
  actions,
  onAction,
  formActionRenderInterceptor,
  formFieldRenderInterceptor,
  selectorActionRenderInterceptor,
  clientOperationActionRenderInterceptor,
  container,
}: ActionsProps) {
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

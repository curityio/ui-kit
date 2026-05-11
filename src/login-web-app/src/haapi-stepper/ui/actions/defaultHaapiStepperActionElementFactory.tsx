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

import { ReactElement } from 'react';
import { HAAPI_ACTION_TYPES } from '../../data-access/types/haapi-action.types';
import type {
  HaapiStepperAction,
  HaapiStepperFormAction,
  HaapiStepperClientOperationAction,
  HaapiStepperNextStep,
  HaapiStepperFormFieldRenderInterceptor,
} from '../../feature/stepper/haapi-stepper.types';
import { HaapiStepperFormUI } from '../../feature/actions/form/HaapiStepperFormUI';
import { HaapiStepperClientOperationUI } from '../../feature/actions/client-operation/HaapiStepperClientOperationUI';
import { HaapiStepperSelectorUI } from '../../feature/actions/selector/HaapiStepperSelectorUI';

export default function defaultHaapiStepperActionElementFactory(
  action: HaapiStepperAction,
  onAction: HaapiStepperNextStep<HaapiStepperFormAction | HaapiStepperClientOperationAction>,
  formFieldRenderInterceptor?: HaapiStepperFormFieldRenderInterceptor
): ReactElement {
  switch (action.subtype) {
    case HAAPI_ACTION_TYPES.FORM:
      return (
        <HaapiStepperFormUI
          key={`form-${action.model.href}`}
          action={action}
          onSubmit={onAction}
          formFieldRenderInterceptor={formFieldRenderInterceptor}
        />
      );

    case HAAPI_ACTION_TYPES.CLIENT_OPERATION:
      return <HaapiStepperClientOperationUI key={`clientop-${action.id}`} action={action} onAction={onAction} />;

    case HAAPI_ACTION_TYPES.SELECTOR:
      return <HaapiStepperSelectorUI key={`selector-${action.title ?? ''}`} action={action} onSubmit={onAction} />;
  }
}

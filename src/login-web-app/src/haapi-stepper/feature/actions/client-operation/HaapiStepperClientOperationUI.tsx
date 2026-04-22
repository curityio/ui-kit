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

import { ReactNode } from 'react';
import { HaapiStepperClientOperationAction, HaapiStepperFormAction } from '../../stepper/haapi-stepper.types';

interface HaapiStepperClientOperationUIProps {
  action: HaapiStepperClientOperationAction;
  onAction: (action: HaapiStepperClientOperationAction | HaapiStepperFormAction) => void;
  showBankIdSessionTimeLeft?: boolean;
  render?: (
    action: HaapiStepperClientOperationAction,
    onAction: (action: HaapiStepperClientOperationAction | HaapiStepperFormAction) => void,
    showBankIdSessionTimeLeft: boolean
  ) => ReactNode;
}

/**
 * @description
 * # CLIENT OPERATION ACTION COMPONENT
 *
 * Provides the default UI wrapper for HAAPI client-operation actions and exposes a render
 * prop to fully customise the look and feel while keeping the underlying behaviour intact.
 * It also forwards the client operation option clicked to the provided `onAction` handler.
 *
 * @example
 * ```tsx
 * function HaapiComponentExample() {
 *   const { currentStep, nextStep } = useHaapiStepper(); *
 *   const clientOperationAction = currentStep?.dataHelpers.clientOperationActions?.[0];
 *
 *   return { clientOperationAction && <HaapiStepperClientOperationUI action={clientOperationAction} onAction={nextStep} /> };
 * }
 *
 * <HaapiStepper>
 *   <HaapiComponentExample />
 * </HaapiStepper>
 * ```
 */
export function HaapiStepperClientOperationUI({
  action,
  onAction,
  showBankIdSessionTimeLeft = true,
  render = defaultRenderClientOperation,
}: HaapiStepperClientOperationUIProps) {
  return render(action, onAction, showBankIdSessionTimeLeft);
}

const defaultRenderClientOperation = (
  action: HaapiStepperClientOperationAction,
  onAction: (action: HaapiStepperClientOperationAction | HaapiStepperFormAction) => void,
  showBankIdSessionTimeLeft: boolean
) => (
  <div data-testid="client-operation-action">
    {showBankIdSessionTimeLeft && action.maxWaitRemainingTime !== undefined && (
      <progress
        className="haapi-stepper-polling-progress"
        value={action.maxWaitRemainingTime}
        max={action.maxWaitTime}
      />
    )}
    <button type="button" className="haapi-stepper-button" onClick={() => onAction(action)}>
      {action.title}
    </button>
  </div>
);

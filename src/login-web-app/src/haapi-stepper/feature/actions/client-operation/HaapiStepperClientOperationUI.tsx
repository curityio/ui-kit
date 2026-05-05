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

import { HaapiStepperClientOperationAction, HaapiStepperFormAction } from '../../stepper/haapi-stepper.types';
import { useIsClientOperationAvailable } from './useIsClientOperationAvailable';

interface HaapiStepperClientOperationUIProps {
  action: HaapiStepperClientOperationAction;
  onAction: (action: HaapiStepperClientOperationAction | HaapiStepperFormAction) => void;
  showBankIdSessionTimeLeft?: boolean;
}

/**
 * @description
 * # CLIENT OPERATION ACTION COMPONENT
 *
 * Renders the default UI for a HAAPI client-operation action and forwards the click to
 * `onAction`. The button is disabled when the action's runtime capability requirements are
 * not met (e.g. WebAuthn API missing, or platform authenticator unavailable for platform-only
 * WebAuthn registration).
 *
 * @example
 * ```tsx
 * function HaapiComponentExample() {
 *   const { currentStep, nextStep } = useHaapiStepper();
 *   const clientOperationAction = currentStep?.dataHelpers.clientOperationActions?.[0];
 *
 *   return clientOperationAction && (
 *     <HaapiStepperClientOperationUI action={clientOperationAction} onAction={nextStep} />
 *   );
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
}: HaapiStepperClientOperationUIProps) {
  const isAvailable = useIsClientOperationAvailable(action);

  return (
    <div data-testid="client-operation-action">
      {showBankIdSessionTimeLeft && action.maxWaitRemainingTime !== undefined && (
        <progress
          className="haapi-stepper-polling-progress"
          value={action.maxWaitRemainingTime}
          max={action.maxWaitTime}
        />
      )}
      <button
        type="button"
        className="haapi-stepper-button"
        disabled={!isAvailable}
        onClick={() => onAction(action)}
      >
        {action.title}
      </button>
    </div>
  );
}

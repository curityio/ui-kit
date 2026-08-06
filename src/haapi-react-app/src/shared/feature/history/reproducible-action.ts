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

import { HAAPI_ACTION_TYPES } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-action.types';
import { HTTP_METHODS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import { HAAPI_STEPS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';
import type {
  HaapiStepperHistoryEntry,
  HaapiStepperNextStepAction,
  HaapiStepperNextStepPayload,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { isLink } from '@curity/haapi-react-sdk/haapi-stepper/util/link-predicates';

/** A reproducible step: the action (and payload) that re-opens it when navigating back/forward. */
export interface ReproducibleStep {
  action: HaapiStepperNextStepAction;
  payload?: HaapiStepperNextStepPayload;
}

/**
 * Whether an action can be safely re-issued to reconstruct the step it produced when navigating the
 * history — i.e. whether the step it produced is a reproducible back/forward target:
 * - **Links** are always GET → reproducible.
 * - **Form actions** are reproducible only when their method is GET (a POST may have mutated backend
 *   state or consumed a one-time token).
 * - **Client operations** (BankID, WebAuthn, external-browser-flow) resolve to single-use POST
 *   continue-actions → never reproducible.
 *
 * Steps produced by non-reproducible actions are still recorded, but are skipped when navigating back/forward.
 */
export function isReproducibleAction(action: HaapiStepperNextStepAction): boolean {
  if (isLink(action)) {
    return true;
  }

  if (action.template === HAAPI_ACTION_TYPES.FORM) {
    return action.model.method === HTTP_METHODS.GET;
  }

  return false;
}

/**
 * Whether the step recorded in a history entry can be safely re-opened — i.e. whether the action that
 * produced it is reproducible (see {@link isReproducibleAction}).
 */
export function isReproducibleHistoryEntry(entry: HaapiStepperHistoryEntry): boolean {
  if (entry.step.type === HAAPI_STEPS.POLLING) {
    return false;
  }

  return isReproducibleAction(entry.triggeredByAction);
}

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

import { HTTP_METHODS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import { HAAPI_STEPS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';
import type { HaapiStepperHistoryEntry } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';

/**
 * Whether the step recorded in a history entry can be safely re-opened — i.e. whether the request that produced it
 * can be re-issued to reconstruct the step, making it a reproducible back/forward target.
 *
 * Only GET requests qualify: any other method may have mutated backend state or consumed a one-time token. This
 * covers links (always GET) and GET form actions as reproducible, and leaves out POST forms and client operations
 * (BankID, WebAuthn, external-browser-flow), which resolve to single-use POST continue-actions.
 *
 * Polling steps are the exception to the method rule: they are polled by the stepper on a timer, so even though
 * each tick is a GET they are never a navigation target.
 *
 * Steps produced by non-reproducible requests are still recorded, but are skipped when navigating back/forward.
 */
export function isReproducibleHistoryEntry(entry: HaapiStepperHistoryEntry): boolean {
  if (entry.step.type === HAAPI_STEPS.POLLING) {
    return false;
  }

  return entry.triggeredBy.request.init.method === HTTP_METHODS.GET;
}

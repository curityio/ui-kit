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

import { HAAPI_PROBLEM_STEPS, HaapiUserMessage } from '../../../../data-access/types/haapi-step.types';
import { HaapiStepperError } from '../../../stepper/haapi-stepper.types';
import { formatErrorStepData } from '../../../stepper/data-formatters/problem-step';

/**
 * Synthesises a {@link HaapiStepperError} for a client-operation failure (IS-11327).
 *
 * Client-operation failures (WebAuthn ceremony cancel / timeout / parse error / unsupported
 * API today; BankID / EBF on the same pattern when their per-operation error handling lands)
 * happen on the client and aren't part of the HAAPI response, so the stepper has no native
 * category for them. We treat them as `AppError`-class problems of the current step — building
 * a `HaapiUnexpectedProblemStep` via {@link formatErrorStepData} — so they surface via
 * `useHaapiStepper().error.app` like any server-driven problem and consumers handle them
 * through the same channel (e.g. `HaapiStepperErrorNotifier`).
 */
export function getHaapiStepperError(messageText: string | undefined): HaapiStepperError {
  const messages: HaapiUserMessage[] = messageText ? [{ text: messageText }] : [];
  return formatErrorStepData({
    type: HAAPI_PROBLEM_STEPS.UNEXPECTED,
    messages,
  });
}

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

import { HaapiFetchFormAction } from '../../../../data-access';
import { HaapiStepperError } from '../../../stepper/haapi-stepper.types';

/**
 * Discriminated-union return shape shared by all client-operation runners (WebAuthn,
 * external-browser-flow, BankID — as each ports onto this pattern per IS-11327).
 *
 * Runners always resolve. Success carries the continuation form action + payload; failure
 * carries a synthesised {@link HaapiStepperError} which `performClientOperation` forwards to the
 * stepper, which routes it through `setError` → `useHaapiStepper().error.app`. Programming
 * bugs / unexpected runtime errors are not represented here — those still throw and escape to
 * the React error boundary.
 */
export type ClientOperationResult =
  | { clientOperationData: HaapiFetchFormAction; clientOperationError?: undefined }
  | { clientOperationData?: undefined; clientOperationError: HaapiStepperError };

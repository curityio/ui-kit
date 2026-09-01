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

import { describe, expect, it } from 'vitest';
import { HTTP_METHODS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import { HAAPI_STEPS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';
import type { HaapiStepperHistoryEntry } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { isReproducibleHistoryEntry } from './reproducible-entry';

const entryFor = (method: HTTP_METHODS, stepType?: HAAPI_STEPS): HaapiStepperHistoryEntry =>
  ({
    step: { type: stepType ?? HAAPI_STEPS.AUTHENTICATION },
    triggeredBy: { request: { url: '/next', init: { method } } },
    timestamp: new Date(),
  }) as HaapiStepperHistoryEntry;

describe('isReproducibleHistoryEntry', () => {
  it('is reproducible when the step was produced by a GET — a link or a GET form action', () => {
    expect(isReproducibleHistoryEntry(entryFor(HTTP_METHODS.GET))).toBe(true);
  });

  it('is not reproducible when the step was produced by a non-GET request', () => {
    expect(isReproducibleHistoryEntry(entryFor(HTTP_METHODS.POST))).toBe(false);
    expect(isReproducibleHistoryEntry(entryFor(HTTP_METHODS.PUT))).toBe(false);
  });

  it('is not reproducible for a polling step even though its poll request is a GET', () => {
    expect(isReproducibleHistoryEntry(entryFor(HTTP_METHODS.GET, HAAPI_STEPS.POLLING))).toBe(false);
  });
});

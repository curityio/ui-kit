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
import { HAAPI_ACTION_TYPES } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-action.types';
import { HTTP_METHODS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import {
  HAAPI_STEPPER_ELEMENT_TYPES,
  HAAPI_STEPS,
} from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';
import type {
  HaapiStepperClientOperationAction,
  HaapiStepperFormAction,
  HaapiStepperHistoryEntry,
  HaapiStepperLink,
  HaapiStepperNextStepAction,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { isReproducibleAction, isReproducibleHistoryEntry } from './reproducible-action';

const link = { href: '/next', type: HAAPI_STEPPER_ELEMENT_TYPES.LINK } as HaapiStepperLink;
const formWith = (method: HTTP_METHODS) =>
  ({ template: HAAPI_ACTION_TYPES.FORM, model: { method } }) as HaapiStepperFormAction;
const clientOperation = { template: HAAPI_ACTION_TYPES.CLIENT_OPERATION } as HaapiStepperClientOperationAction;

describe('isReproducibleAction', () => {
  it('treats links as reproducible (always GET)', () => {
    expect(isReproducibleAction(link)).toBe(true);
  });

  it('treats GET form actions as reproducible', () => {
    expect(isReproducibleAction(formWith(HTTP_METHODS.GET))).toBe(true);
  });

  it('treats POST form actions as not reproducible', () => {
    expect(isReproducibleAction(formWith(HTTP_METHODS.POST))).toBe(false);
  });

  it('treats client operations as not reproducible', () => {
    expect(isReproducibleAction(clientOperation)).toBe(false);
  });
});

const entryFor = (action: HaapiStepperNextStepAction, stepType?: HAAPI_STEPS): HaapiStepperHistoryEntry =>
  ({ step: { type: stepType }, triggeredByAction: action, timestamp: new Date() }) as HaapiStepperHistoryEntry;

describe('isReproducibleHistoryEntry', () => {
  it('is reproducible when the entry was produced by a reproducible action', () => {
    expect(isReproducibleHistoryEntry(entryFor(link))).toBe(true);
    expect(isReproducibleHistoryEntry(entryFor(formWith(HTTP_METHODS.GET)))).toBe(true);
  });

  it('is not reproducible when the entry was produced by a non-reproducible action', () => {
    expect(isReproducibleHistoryEntry(entryFor(formWith(HTTP_METHODS.POST)))).toBe(false);
    expect(isReproducibleHistoryEntry(entryFor(clientOperation))).toBe(false);
  });

  it('is not reproducible for a polling step even though its poll action is a GET form', () => {
    expect(isReproducibleHistoryEntry(entryFor(formWith(HTTP_METHODS.GET), HAAPI_STEPS.POLLING))).toBe(false);
  });
});

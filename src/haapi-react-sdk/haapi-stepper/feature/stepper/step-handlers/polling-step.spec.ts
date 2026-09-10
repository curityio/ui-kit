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

import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { handlePollingStep } from './polling-step';
import { pollingPendingStep } from '../../../util/tests/api-responses';
import { defaultStepperAPI } from '../../../util/tests/mocks';
import type { HaapiPollingStep } from '../../../data-access/types/haapi-step.types';

const DEFAULT_POLLING_INTERVAL = 3000;
const config = { ...defaultStepperAPI.config, defaultPollingInterval: DEFAULT_POLLING_INTERVAL };

describe('handlePollingStep polling interval', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it('uses the server interval when the step carries one', () => {
    const stepPollingInterval = '500';
    const testPollingStep = getTestPollingStep(stepPollingInterval);

    expectNextPollScheduledAfter(stepPollingInterval, testPollingStep);
  });

  it('falls back to defaultPollingInterval when the step carries none', () => {
    const testPollingStep = getTestPollingStep();

    expectNextPollScheduledAfter(DEFAULT_POLLING_INTERVAL, testPollingStep);
  });

  it.each(['abc', '0', '-1', ''])(
    'falls back to defaultPollingInterval for a malformed server interval (%j)',
    stepPollingInterval => {
      const testPollingStep = getTestPollingStep(stepPollingInterval);

      expectNextPollScheduledAfter(DEFAULT_POLLING_INTERVAL, testPollingStep);
    }
  );
});

function getTestPollingStep(stepPollingInterval?: string): HaapiPollingStep {
  const step = pollingPendingStep('/poll');
  return {
    ...step,
    properties: { ...step.properties, ...(stepPollingInterval !== undefined && { interval: stepPollingInterval }) },
  };
}

function expectNextPollScheduledAfter(expectedInterval: string | number, pollingStep: HaapiPollingStep): void {
  const nextStep = vi.fn();
  handlePollingStep(pollingStep, { current: null }, nextStep, config);

  const ms = Number(expectedInterval);
  vi.advanceTimersByTime(ms - 1);
  expect(nextStep).not.toHaveBeenCalled();
  vi.advanceTimersByTime(1);
  expect(nextStep).toHaveBeenCalledTimes(1);
}

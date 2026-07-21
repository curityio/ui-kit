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
import { act, render, screen } from '@testing-library/react';

import { HaapiStepperBankIdPollingProgressUI } from './HaapiStepperBankIdPollingProgressUI';
import { createPollingStep } from '../../util/tests/mocks';
import { HAAPI_POLLING_STATUS } from '../../data-access/types/haapi-step.types';

const QR_MINUTES_LEFT_KEY = 'authenticator.bankid.launch.view.qr.minutes-left';
const QR_SECONDS_LEFT_KEY = 'authenticator.bankid.launch.view.qr.seconds-left';

describe('HaapiStepperBankIdPollingProgressUI', () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.clearAllTimers();
    vi.useRealTimers();
  });

  const tick = async (ms: number) => {
    await act(async () => {
      vi.advanceTimersByTime(ms);
      await Promise.resolve();
    });
  };

  it('renders a progress bar reflecting the session remaining time', () => {
    render(
      <HaapiStepperBankIdPollingProgressUI
        currentStep={createPollingStep({ maxWaitTime: '60', maxWaitRemainingTime: '30' })}
      />
    );

    const progress = screen.getByRole('progressbar', { hidden: true });
    expect(progress).toHaveAttribute('value', '30');
    expect(progress).toHaveAttribute('max', '60');
  });

  it('counts the remaining time down once per second, clamped at zero', async () => {
    render(
      <HaapiStepperBankIdPollingProgressUI
        currentStep={createPollingStep({ maxWaitTime: '60', maxWaitRemainingTime: '3' })}
      />
    );

    expect(screen.getByRole('progressbar', { hidden: true })).toHaveAttribute('value', '3');

    await tick(1000);
    expect(screen.getByRole('progressbar', { hidden: true })).toHaveAttribute('value', '2');

    await tick(5000);
    expect(screen.getByRole('progressbar', { hidden: true })).toHaveAttribute('value', '0');
  });

  it('counts down locally and ignores the server value on later polls', async () => {
    const { rerender } = render(
      <HaapiStepperBankIdPollingProgressUI
        currentStep={createPollingStep({ maxWaitTime: '60', maxWaitRemainingTime: '30' })}
      />
    );

    await tick(3000);
    expect(screen.getByRole('progressbar', { hidden: true })).toHaveAttribute('value', '27');

    // A later poll reporting a different remaining time must not disturb the local countdown,
    // whether it is lower or higher than the current local value.
    rerender(
      <HaapiStepperBankIdPollingProgressUI
        currentStep={createPollingStep({ maxWaitTime: '60', maxWaitRemainingTime: '20' })}
      />
    );
    expect(screen.getByRole('progressbar', { hidden: true })).toHaveAttribute('value', '27');

    rerender(
      <HaapiStepperBankIdPollingProgressUI
        currentStep={createPollingStep({ maxWaitTime: '60', maxWaitRemainingTime: '40' })}
      />
    );
    expect(screen.getByRole('progressbar', { hidden: true })).toHaveAttribute('value', '27');
  });

  // "1:00" at exactly 60s matches the Velocity reference (curity-ui.js _qrTimer).
  it.each([
    ['90', '1:30 minutes left'],
    ['65', '1:05 minutes left'],
    ['60', '1:00 minutes left'],
    ['600', '10:00 minutes left'],
    ['59', '59 seconds left'],
    ['24', '24 seconds left'],
    ['0', '0 seconds left'],
  ])('formats %s seconds remaining as "%s"', (maxWaitRemainingTime, expected) => {
    render(
      <HaapiStepperBankIdPollingProgressUI
        currentStep={createPollingStep({
          maxWaitTime: '600',
          maxWaitRemainingTime,
          viewDataMessages: { [QR_MINUTES_LEFT_KEY]: 'minutes left', [QR_SECONDS_LEFT_KEY]: 'seconds left' },
        })}
      />
    );

    expect(screen.getByTestId('polling-progress-duration')).toHaveTextContent(expected);
  });

  it('renders only the bar when the step has no unit labels', () => {
    render(
      <HaapiStepperBankIdPollingProgressUI
        currentStep={createPollingStep({ maxWaitTime: '30', maxWaitRemainingTime: '20' })}
      />
    );

    expect(screen.getByRole('progressbar', { hidden: true })).toBeInTheDocument();
    expect(screen.queryByTestId('polling-progress-duration')).not.toBeInTheDocument();
  });

  it('renders the readout but no bar when the step has no max wait time', () => {
    render(
      <HaapiStepperBankIdPollingProgressUI
        currentStep={createPollingStep({
          maxWaitRemainingTime: '20',
          viewDataMessages: { [QR_SECONDS_LEFT_KEY]: 'seconds left' },
        })}
      />
    );

    expect(screen.queryByRole('progressbar', { hidden: true })).not.toBeInTheDocument();
    expect(screen.getByTestId('polling-progress-duration')).toHaveTextContent('20 seconds left');
  });

  it('renders nothing when the polling step has no remaining wait time', () => {
    const { container } = render(
      <HaapiStepperBankIdPollingProgressUI currentStep={createPollingStep({ maxWaitTime: '60' })} />
    );

    expect(screen.queryByRole('progressbar', { hidden: true })).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });

  it.each([HAAPI_POLLING_STATUS.DONE, HAAPI_POLLING_STATUS.FAILED])('renders nothing for a %s polling step', status => {
    const { container } = render(
      <HaapiStepperBankIdPollingProgressUI
        currentStep={createPollingStep({ status, maxWaitTime: '60', maxWaitRemainingTime: '30' })}
      />
    );

    expect(screen.queryByRole('progressbar', { hidden: true })).not.toBeInTheDocument();
    expect(container).toBeEmptyDOMElement();
  });
});

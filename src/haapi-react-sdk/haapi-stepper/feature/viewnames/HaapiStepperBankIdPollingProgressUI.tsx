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

import { useEffect, useState } from 'react';
import { HAAPI_POLLING_STATUS } from '../../data-access/types/haapi-step.types';
import type { HaapiStepperPollingStep } from '../stepper/haapi-stepper.types';

interface HaapiStepperBankIdPollingProgressUIProps {
  /** The BankID polling step whose session time this bar reflects. */
  currentStep: HaapiStepperPollingStep;
}

// BankID emits the countdown unit labels under this namespace in `metadata.viewData.messages`
// (see `WaitBankIdRepresentationFunction` in the server) — the same namespace as the QR accessibility copy.
const qrMessageKey = (suffix: string) => `authenticator.bankid.launch.view.qr.${suffix}`;

const toSeconds = (value?: number | string): number | undefined => {
  if (value === undefined) {
    return undefined;
  }

  const seconds = Number(value);

  return Number.isFinite(seconds) ? seconds : undefined;
};

/**
 * @description
 * # BANKID POLLING PROGRESS COMPONENT
 *
 * Renders the BankID "authentication time" progress bar for a *pending* polling step. Done and failed
 * steps render nothing — they show their own outcome UI.
 *
 * The remaining time is seeded from the step's `maxWaitRemainingTime` once and counted down locally,
 * one second at a time, clamped at 0. It is not re-synced on each poll: the server's remaining time
 * can only arrive later/higher than the local count (poll cadence + latency), so re-syncing would only
 * ever jerk the bar backwards. The bar shows elapsed time (so it fills toward timeout, matching the
 * Velocity reference) while the readout counts remaining time down; the server decides when the session
 * actually ends by returning a failed polling step.
 *
 * Accessibility: the bar is decorative (`aria-hidden`) — the adjacent numeric readout carries the
 * remaining-time text for assistive tech, and only renders when the localized unit label is present in
 * the step's `metadata.viewData.messages` (`minutes-left` for a minute or more left, `seconds-left`
 * otherwise).
 */
export function HaapiStepperBankIdPollingProgressUI({ currentStep }: HaapiStepperBankIdPollingProgressUIProps) {
  const { maxWaitTime, maxWaitRemainingTime, status } = currentStep.properties;
  const viewDataMessages = currentStep.metadata?.viewData?.messages;
  const minutesLeftLabel = viewDataMessages?.[qrMessageKey('minutes-left')];
  const secondsLeftLabel = viewDataMessages?.[qrMessageKey('seconds-left')];

  const [remaining, setRemaining] = useState(() => toSeconds(maxWaitRemainingTime));

  const shouldCountDown = status === HAAPI_POLLING_STATUS.PENDING && remaining !== undefined && remaining > 0;

  useEffect(() => {
    if (!shouldCountDown) {
      return;
    }

    const intervalId = setInterval(() => {
      setRemaining(previous => (previous === undefined ? previous : Math.max(0, previous - 1)));
    }, 1000);

    return () => clearInterval(intervalId);
  }, [shouldCountDown]);

  if (remaining === undefined || status !== HAAPI_POLLING_STATUS.PENDING) {
    return null;
  }

  const maxValue = toSeconds(maxWaitTime);
  const totalSeconds = Math.floor(remaining);
  const showMinutes = totalSeconds >= 60;
  const readoutLabel = showMinutes ? minutesLeftLabel : secondsLeftLabel;
  const readoutValue = showMinutes
    ? `${String(Math.floor(totalSeconds / 60))}:${String(totalSeconds % 60).padStart(2, '0')}`
    : String(totalSeconds);

  return (
    <>
      {maxValue !== undefined && (
        <progress
          className="haapi-stepper-polling-progress-bar"
          value={maxValue - remaining}
          max={maxValue}
          aria-hidden="true"
        />
      )}
      {readoutLabel && (
        <p className="haapi-stepper-polling-progress-duration" data-testid="polling-progress-duration">
          <span>{readoutValue}</span> <span>{readoutLabel}</span>
        </p>
      )}
    </>
  );
}

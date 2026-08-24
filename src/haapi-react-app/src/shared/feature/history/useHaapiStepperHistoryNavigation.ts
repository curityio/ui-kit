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

import { type RefObject, useEffect, useRef } from 'react';
import { useHaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature';
import type {
  HaapiStepperAPI,
  HaapiStepperNextStepAction,
  HaapiStepperNextStepPayload,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { browserHistoryNavigation, type HistoryNavigation } from '../../util/browser-apis';
import { isReproducibleHistoryEntry } from './reproducible-action';

type BrowserHistoryEntry =
  | {
      reproducible: true;
      action: HaapiStepperNextStepAction;
      payload?: HaapiStepperNextStepPayload;
    }
  | {
      reproducible: false;
    };

/**
 * Wires the browser's navigation buttons (back/forward) with the HAAPI stepper: each step the stepper reaches is
 * recorded as a browser entry, and pressing back/forward re-opens the corresponding step via `nextStep`.
 *
 * Reproducible vs non-reproducible steps:
 * - A step is *reproducible* when the action that produced it can be safely re-issued to reconstruct it — a GET
 * link or a GET form.
 * - *Non-reproducible* steps (POST forms, client operations such as BankID / WebAuthn) can't be re-issued (they may
 * mutate state or consume single-use tokens), so back/forward must not re-open them.
 *
 * Circular effects:
 *
 * The two syncs (`syncBrowserHistoryOnStepperHistoryChange` and `syncStepperHistoryOnBrowserHistoryChange`) trigger each
 * other when navigating to a non-reproducible step, so each must no-op otherwise they loop and duplicate entries.
 * - browser navigation → `syncStepperHistoryOnBrowserHistoryChange` → stepper history changes (`nextStep` was invoked)
 * → `syncBrowserHistoryOnStepperHistoryChange`: same step is reached and ignored.
 */
export function useHaapiStepperHistoryNavigation(
  browserNavigation: HistoryNavigation = browserHistoryNavigation
): void {
  const haapiStepper = useHaapiStepper();
  const haapiStepperRef = useRef(haapiStepper);
  haapiStepperRef.current = haapiStepper;

  useEffect(() => {
    syncBrowserHistoryOnStepperHistoryChange(haapiStepperRef, browserNavigation);
  }, [haapiStepper.history, browserNavigation]);

  useEffect(() => {
    return browserNavigation.addEntryChangeListener(state =>
      syncStepperHistoryOnBrowserHistoryChange(state as BrowserHistoryEntry | null, haapiStepperRef, browserNavigation)
    );
  }, [browserNavigation]);
}

function syncBrowserHistoryOnStepperHistoryChange(
  haapiStepperRef: RefObject<HaapiStepperAPI>,
  browserNavigation: HistoryNavigation
): void {
  const stepperHistory = haapiStepperRef.current.history;
  if (stepperHistory.length === 0) {
    return;
  }

  const currentBrowserEntry = browserNavigation.getState() as BrowserHistoryEntry | undefined | null;
  const newStepperEntry = stepperHistory[stepperHistory.length - 1];

  const newBrowserHistoryEntry: BrowserHistoryEntry = isReproducibleHistoryEntry(newStepperEntry)
    ? {
        reproducible: true,
        action: newStepperEntry.triggeredByAction,
        payload: newStepperEntry.triggeredByPayload,
      }
    : {
        reproducible: false,
      };

  // If the current entry is reproducible (i.e. safe to navigate back to), push a new history entry.
  // If it's non-reproducible, replace it with the new one regardless of the new one being reproducible, i.e.
  // skip/hide non-reproducible steps, except for the last one (at most).
  if (currentBrowserEntry?.reproducible) {
    if (currentBrowserEntry.action.id === newStepperEntry.triggeredByAction.id) {
      return;
    }
    browserNavigation.pushEntry(newBrowserHistoryEntry);
  } else {
    browserNavigation.replaceEntry(newBrowserHistoryEntry);
  }
}

function syncStepperHistoryOnBrowserHistoryChange(
  currentBrowserHistoryEntry: BrowserHistoryEntry | null,
  haapiStepperRef: React.RefObject<HaapiStepperAPI>,
  browserNavigation: HistoryNavigation
): void {
  if (!currentBrowserHistoryEntry) {
    return;
  }

  if (currentBrowserHistoryEntry.reproducible) {
    haapiStepperRef.current.nextStep(currentBrowserHistoryEntry.action, currentBrowserHistoryEntry.payload);
  } else {
    // Non-reproducible step is always the last. If we bumped into one, take the user to where they came from.
    browserNavigation.go(-1);
  }
}

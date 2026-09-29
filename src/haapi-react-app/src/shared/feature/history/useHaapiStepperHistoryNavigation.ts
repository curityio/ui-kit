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
import { isReproducibleHistoryEntry } from './reproducible-entry';

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
        action: newStepperEntry.triggeredBy.action,
        payload: newStepperEntry.triggeredBy.payload,
      }
    : {
        reproducible: false,
      };

  const triggerUrl = newStepperEntry.triggeredBy.request.url;

  if (!currentBrowserEntry?.reproducible) {
    // Skip/hide non-reproducible steps, except for the last one (at most).
    // The URL is updated so that there's some user feedback. A refresh on the new URL most likely will fail, but
    // the same would happen in the previous URL after the non-reproducible action/step (server state change).
    browserNavigation.replaceEntry(newBrowserHistoryEntry, triggerUrl);
    return;
  }

  const changeIsDueToBrowserNavigation = currentBrowserEntry.action.id === newStepperEntry.triggeredBy.action.id;
  const targetsCurrentUrl = isEquivalentToCurrentUrl(triggerUrl, browserNavigation);

  if (changeIsDueToBrowserNavigation || targetsCurrentUrl) {
    return;
  }

  browserNavigation.pushEntry(newBrowserHistoryEntry, triggerUrl);
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

/**
 * Checks if a URL is the same as the current browser URL, accounting for relative URLs.
 */
function isEquivalentToCurrentUrl(url: string, browserNavigation: HistoryNavigation): boolean {
  const currentUrl = browserNavigation.currentUrl;
  return new URL(url, currentUrl).href === currentUrl;
}

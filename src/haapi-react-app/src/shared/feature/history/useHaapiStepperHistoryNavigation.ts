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
  HaapiStepperHistoryEntry,
  HaapiStepperNextStepAction,
  HaapiStepperNextStepPayload,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { browserHistoryNavigation, type HistoryNavigation } from '../../util/browser-apis';
import { isReproducibleHistoryEntry } from './reproducible-action';

interface BrowserHistoryEntryData {
  reproducible: boolean;
  action: HaapiStepperNextStepAction;
  payload?: HaapiStepperNextStepPayload;
}

interface BrowserHistoryEntryIndex {
  index: number;
}

interface BrowserHistory {
  entries: BrowserHistoryEntryData[];
  index: number;
}

/**
 * Wires the browser's navigation buttons (back/forward) with the HAAPI stepper: each step the stepper reaches is
 * recorded as a browser entry, and pressing back/forward re-opens the corresponding step via `nextStep`.
 *
 * Non-reproducible steps:
 * A step is *reproducible* when the action that produced it can be safely re-issued to reconstruct it — a GET
 * link or a GET form. *Non-reproducible* steps (POST forms, client operations such as BankID / WebAuthn) can't
 * be re-issued (they may mutate state or consume single-use tokens), so back/forward must not re-open them.
 * In order to match the browser navigation index with the `HaapiStepper` steps history (stored in `browserHistoryRef`),
 * the browser history keeps track of all the steps the user has reached, even if they are non-reproducible. As a result,
 * when navigating back/forward we have to skip over them to the nearest reproducible step in that direction, and sync
 * the browser history accordingly (`moveBrowserHistoryTo`).
 *
 * Circular effects:
 * The two syncs (`syncBrowserHistoryOnStepperHistoryChange` and `syncStepperHistoryOnBrowserHistoryChange`) trigger each
 * other, so each must no-op otherwise they loop and duplicate entries.
 * - browser navigation → `syncStepperHistoryOnBrowserHistoryChange` → `advanceHaapiStepperToTheNextStep` (re-open) →
 *   stepper history changes → `syncBrowserHistoryOnStepperHistoryChange`: same step is reached and ignored
 *   (`isSameStepperHistoryEntry`).
 * - stepper navigation → `syncBrowserHistoryOnStepperHistoryChange` → `moveBrowserHistoryTo` (`popstate`) →
 *   `syncStepperHistoryOnBrowserHistoryChange`: same step is reached and ignored (`isSameBrowserHistoryEntry`).
 */
export function useHaapiStepperHistoryNavigation(
  browserNavigation: HistoryNavigation = browserHistoryNavigation
): void {
  const haapiStepper = useHaapiStepper();
  const haapiStepperRef = useRef(haapiStepper);
  haapiStepperRef.current = haapiStepper;

  // Every Browser History entries and their corresponding index and `HaapiStepper` history data required to reproduce
  // the entry/step (action + optional payload).
  const browserHistoryRef = useRef<BrowserHistory>({ entries: [], index: -1 });

  useEffect(() => {
    syncBrowserHistoryOnStepperHistoryChange(haapiStepperRef, browserHistoryRef, browserNavigation);
  }, [haapiStepper.history, browserNavigation]);

  useEffect(() => {
    return browserNavigation.addEntryChangeListener(state =>
      syncStepperHistoryOnBrowserHistoryChange(
        state as BrowserHistoryEntryIndex | null,
        haapiStepperRef,
        browserHistoryRef,
        browserNavigation
      )
    );
  }, [browserNavigation]);
}

function syncBrowserHistoryOnStepperHistoryChange(
  haapiStepperRef: RefObject<HaapiStepperAPI>,
  browserHistoryRef: RefObject<BrowserHistory>,
  browserNavigation: HistoryNavigation
): void {
  const stepperHistory = haapiStepperRef.current.history;
  if (stepperHistory.length === 0) {
    return;
  }

  const currentStepperHistoryEntry = stepperHistory[stepperHistory.length - 1];
  const { entries: currentBrowserHistoryEntries, index: currentBrowserHistoryIndex } = browserHistoryRef.current;
  const currentBrowserHistoryEntry =
    currentBrowserHistoryIndex >= 0 ? currentBrowserHistoryEntries[currentBrowserHistoryIndex] : undefined;

  if (isSameStepperHistoryEntry(currentBrowserHistoryEntry, currentStepperHistoryEntry)) {
    return;
  }

  const nextBrowserHistoryIndex = currentBrowserHistoryIndex + 1;
  /*
   * If the user navigates back and then takes a new action, the browser drops those forward entries (steps).
   * We mirror it by keeping only the entries up to the current step before appending the new one.
   */
  const entriesUpToCurrentStep = currentBrowserHistoryEntries.slice(0, nextBrowserHistoryIndex);
  const nextBrowserHistoryEntry = {
    reproducible: isReproducibleHistoryEntry(currentStepperHistoryEntry),
    action: currentStepperHistoryEntry.triggeredByAction,
    payload: currentStepperHistoryEntry.triggeredByPayload,
  };
  browserHistoryRef.current = {
    entries: [...entriesUpToCurrentStep, nextBrowserHistoryEntry],
    index: nextBrowserHistoryIndex,
  };

  const browserHistoryEntryIndex = { index: nextBrowserHistoryIndex } satisfies BrowserHistoryEntryIndex;
  if (nextBrowserHistoryIndex === 0) {
    // The first step reuses the history entry the app was loaded with instead of pushing a new one.
    browserNavigation.replaceEntry(browserHistoryEntryIndex);
  } else {
    browserNavigation.pushEntry(browserHistoryEntryIndex);
  }
}

function syncStepperHistoryOnBrowserHistoryChange(
  currentBrowserHistoryEntry: BrowserHistoryEntryIndex | null,
  haapiStepperRef: RefObject<HaapiStepperAPI>,
  browserHistoryRef: RefObject<BrowserHistory>,
  browserNavigation: HistoryNavigation
): void {
  const currentBrowserHistoryIndex = currentBrowserHistoryEntry?.index ?? -1;
  const { entries: currentBrowserHistoryEntries, index: previousBrowserHistoryIndex } = browserHistoryRef.current;
  const isSameBrowserHistoryEntry = currentBrowserHistoryIndex === previousBrowserHistoryIndex;
  if (isSameBrowserHistoryEntry) {
    return;
  }

  const destinationBrowserHistoryIndex = findReproducibleBrowserHistoryEntryIndex(
    currentBrowserHistoryEntries,
    currentBrowserHistoryIndex,
    previousBrowserHistoryIndex
  );
  const reproducibleStep = destinationBrowserHistoryIndex !== -1;

  if (reproducibleStep) {
    advanceHaapiStepperToTheNextStep(
      haapiStepperRef.current,
      currentBrowserHistoryEntries[destinationBrowserHistoryIndex]
    );
    // If we skipped over non-reproducible entries, move the browser onto the step we actually re-opened.
    moveBrowserHistoryTo(destinationBrowserHistoryIndex, currentBrowserHistoryIndex, browserNavigation);
    browserHistoryRef.current = { ...browserHistoryRef.current, index: destinationBrowserHistoryIndex };
  } else {
    // Nothing reproducible in that direction (before the first step, or forward into a non-reproducible
    // step) — keep the user where they are.
    moveBrowserHistoryTo(previousBrowserHistoryIndex, currentBrowserHistoryIndex, browserNavigation);
  }
}

function isSameStepperHistoryEntry(
  browserHistoryEntry: BrowserHistoryEntryData | undefined,
  stepperHistoryEntry: HaapiStepperHistoryEntry
): boolean {
  return browserHistoryEntry?.action.id === stepperHistoryEntry.triggeredByAction.id;
}

function advanceHaapiStepperToTheNextStep(haapiStepper: HaapiStepperAPI, entry: BrowserHistoryEntryData): void {
  haapiStepper.nextStep(entry.action, entry.payload);
}

function moveBrowserHistoryTo(
  destinationIndex: number,
  currentIndex: number,
  browserNavigation: HistoryNavigation
): void {
  const delta = destinationIndex - currentIndex;
  if (delta !== 0) {
    browserNavigation.go(delta);
  }
}

function findReproducibleBrowserHistoryEntryIndex(
  browserHistoryEntries: BrowserHistoryEntryData[],
  currentIndex: number,
  fromIndex: number
): number {
  const direction = currentIndex < fromIndex ? -1 : 1;
  for (let i = currentIndex; i >= 0 && i < browserHistoryEntries.length; i += direction) {
    if (browserHistoryEntries[i].reproducible) {
      return i;
    }
  }
  return -1;
}

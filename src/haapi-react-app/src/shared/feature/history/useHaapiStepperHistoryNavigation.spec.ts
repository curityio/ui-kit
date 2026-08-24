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

import { renderHook } from '@testing-library/react';
import { beforeEach, describe, expect, it, vi } from 'vitest';
import { HAAPI_ACTION_TYPES } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-action.types';
import { HTTP_METHODS } from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-form.types';
import {
  HAAPI_STEPPER_ELEMENT_TYPES,
  HAAPI_STEPS,
} from '@curity/haapi-react-sdk/haapi-stepper/data-access/types/haapi-step.types';
import type {
  HaapiStepperFormAction,
  HaapiStepperHistoryEntry,
  HaapiStepperLink,
  HaapiStepperNextStepAction,
  HaapiStepperNextStepPayload,
} from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';
import { useHaapiStepperHistoryNavigation } from './useHaapiStepperHistoryNavigation';
import type { HistoryNavigation } from '../../util/browser-apis';

const mockUseHaapiStepper = vi.fn<() => { history: HaapiStepperHistoryEntry[]; nextStep: ReturnType<typeof vi.fn> }>();

vi.mock('@curity/haapi-react-sdk/haapi-stepper/feature', () => ({
  // eslint-disable-next-line @eslint-react/hooks-extra/no-unnecessary-use-prefix -- this is a mock of the useHaapiStepper hook
  useHaapiStepper: () => mockUseHaapiStepper(),
}));

const link = { id: 'link-1', href: '/next', type: HAAPI_STEPPER_ELEMENT_TYPES.LINK } as HaapiStepperLink;
const getForm = {
  id: 'get-form-1',
  template: HAAPI_ACTION_TYPES.FORM,
  model: { method: HTTP_METHODS.GET },
} as HaapiStepperFormAction;
const postForm = {
  id: 'post-form-1',
  template: HAAPI_ACTION_TYPES.FORM,
  model: { method: HTTP_METHODS.POST },
} as HaapiStepperFormAction;

const stepperEntry = (
  action: HaapiStepperNextStepAction,
  payload?: HaapiStepperNextStepPayload
): HaapiStepperHistoryEntry =>
  ({
    step: {},
    triggeredByAction: action,
    triggeredByPayload: payload,
    timestamp: new Date(),
  }) as HaapiStepperHistoryEntry;

// The browser state written by the hook: the step itself, not an index into a parallel structure.
const reproducibleBrowserEntry = (action: HaapiStepperNextStepAction, payload?: HaapiStepperNextStepPayload) => ({
  reproducible: true,
  action,
  payload,
});
const nonReproducibleBrowserEntry = { reproducible: false };

// A minimal in-memory model of the browser history stack; each position holds the state the hook stored.
function createFakeBrowser() {
  let entries: unknown[] = [];
  let pos = -1;
  let listener: ((state: unknown) => void) | undefined;

  const currentState = () => (pos >= 0 ? entries[pos] : null);
  const move = (delta: number) => {
    pos = Math.max(-1, Math.min(entries.length - 1, pos + delta));
    listener?.(currentState());
  };

  const nav = {
    initialUrl: 'https://localhost/',
    getState: () => currentState(),
    replaceEntry: vi.fn((state: unknown) => {
      if (pos < 0) {
        entries = [state];
        pos = 0;
      } else {
        entries = [...entries.slice(0, pos), state, ...entries.slice(pos + 1)];
      }
    }),
    pushEntry: vi.fn((state: unknown) => {
      entries = [...entries.slice(0, pos + 1), state];
      pos = entries.length - 1;
    }),
    go: vi.fn((delta: number) => {
      move(delta);
    }),
    addEntryChangeListener: (l: (state: unknown) => void) => {
      listener = l;
      return () => {
        listener = undefined;
      };
    },
  } satisfies HistoryNavigation;

  return {
    nav: nav as HistoryNavigation,
    raw: nav,
    position: () => pos,
    navigate: (delta: number) => {
      move(delta);
    },
  };
}

function setup() {
  const nextStep = vi.fn();
  let history: HaapiStepperHistoryEntry[] = [];
  mockUseHaapiStepper.mockImplementation(() => ({ history, nextStep }));

  const browser = createFakeBrowser();
  const { rerender } = renderHook(({ h }: { h: HistoryNavigation }) => useHaapiStepperHistoryNavigation(h), {
    initialProps: { h: browser.nav },
  });

  const reachStep = (action: HaapiStepperNextStepAction, payload?: HaapiStepperNextStepPayload) => {
    history = [...history, stepperEntry(action, payload)];
    rerender({ h: browser.nav });
  };

  // Simulates a polling tick: a POLLING step whose GET poll action carries a fresh id each time (as the SDK
  // stamps a new UUID per tick).
  const reachPollingStep = () => {
    const pollAction = {
      id: `poll-${String(history.length)}`,
      template: HAAPI_ACTION_TYPES.FORM,
      model: { method: HTTP_METHODS.GET },
    } as HaapiStepperNextStepAction;
    history = [
      ...history,
      {
        step: { type: HAAPI_STEPS.POLLING },
        triggeredByAction: pollAction,
        timestamp: new Date(),
      } as HaapiStepperHistoryEntry,
    ];
    rerender({ h: browser.nav });
  };

  return { nextStep, browser, reachStep, reachPollingStep };
}

describe('useHaapiStepperHistoryNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('reuses the entry the app was loaded with for the first step, then pushes one entry per reproducible step', () => {
    const { browser, reachStep } = setup();
    const payload: HaapiStepperNextStepPayload = { username: 'alice' };

    reachStep(link);
    reachStep(getForm, payload);

    expect(browser.raw.replaceEntry).toHaveBeenCalledTimes(1);
    expect(browser.raw.replaceEntry).toHaveBeenCalledWith(reproducibleBrowserEntry(link));
    expect(browser.raw.pushEntry).toHaveBeenCalledTimes(1);
    expect(browser.raw.pushEntry).toHaveBeenCalledWith(reproducibleBrowserEntry(getForm, payload));
    expect(browser.raw.pushEntry).toHaveBeenCalledAfter(browser.raw.replaceEntry);
  });

  it('keeps a non-reproducible step only while it is the last one, replacing it with the step that follows', () => {
    const { browser, reachStep } = setup();

    reachStep(postForm); // non-reproducible
    reachStep(postForm); // non-reproducible
    expect(browser.raw.replaceEntry).toHaveBeenCalledTimes(2);
    expect(browser.raw.replaceEntry).toHaveBeenNthCalledWith(1, nonReproducibleBrowserEntry);
    expect(browser.raw.replaceEntry).toHaveBeenNthCalledWith(2, nonReproducibleBrowserEntry);
    expect(browser.raw.pushEntry).not.toHaveBeenCalled();

    browser.raw.replaceEntry.mockClear();

    reachStep(getForm); // reproducible

    expect(browser.raw.replaceEntry).toHaveBeenCalledTimes(1);
    expect(browser.raw.replaceEntry).toHaveBeenCalledWith(reproducibleBrowserEntry(getForm));
    expect(browser.raw.pushEntry).not.toHaveBeenCalled();
  });

  it('re-opens the previous step when going back', () => {
    const { nextStep, browser, reachStep } = setup();
    reachStep(link);
    reachStep(getForm);

    browser.navigate(-1);

    expect(nextStep).toHaveBeenCalledWith(link, undefined);
    expect(browser.position()).toBe(0);
  });

  it('never re-opens a non-reproducible step: it is already gone from the history once a step follows it', () => {
    const { nextStep, browser, reachStep } = setup();
    reachStep(link);
    reachStep(postForm);
    reachStep(getForm);

    browser.navigate(-1);

    // postForm's entry was overwritten by getForm, so back lands straight on link.
    expect(nextStep).toHaveBeenCalledWith(link, undefined);
    expect(browser.position()).toBe(0);
  });

  it('bounces the user back when navigating forward onto the non-reproducible frontier', () => {
    const { nextStep, browser, reachStep } = setup();
    reachStep(link); // reproducible
    reachStep(postForm); // non-reproducible, the frontier

    browser.navigate(-1); // back to link
    nextStep.mockClear();

    browser.navigate(1); // forward onto the non-reproducible entry

    expect(browser.raw.go).toHaveBeenCalledWith(-1);
    expect(browser.position()).toBe(0); // bounced back onto link
    expect(nextStep).toHaveBeenCalledWith(link, undefined);
  });

  it('ignores a navigation with no state, i.e. an entry this app did not record', () => {
    const { nextStep, browser, reachStep } = setup();
    reachStep(link);
    nextStep.mockClear();

    browser.navigate(-1); // past the first entry — no state

    expect(nextStep).not.toHaveBeenCalled();
    expect(browser.raw.go).not.toHaveBeenCalled();
  });

  it('does not record a new entry when a step is re-opened via back navigation', () => {
    const { nextStep, browser, reachStep } = setup();
    reachStep(link);
    reachStep(getForm);
    browser.raw.replaceEntry.mockClear();
    browser.raw.pushEntry.mockClear();

    browser.navigate(-1); // back to link → re-opens it
    reachStep(link); // stepper reaches the re-opened step (same action id)

    expect(nextStep).toHaveBeenCalledWith(link, undefined);
    expect(browser.position()).toBe(0);
    expect(browser.raw.replaceEntry).not.toHaveBeenCalled();
    expect(browser.raw.pushEntry).not.toHaveBeenCalled();
  });

  it('lets polling steps occupy at most one entry, so they never flood the history', () => {
    const { browser, reachStep, reachPollingStep } = setup();
    reachStep(link);
    reachPollingStep();
    reachPollingStep();
    reachPollingStep();

    // Polling is non-reproducible: the first tick takes the frontier entry, the rest replace it.
    expect(browser.raw.pushEntry).toHaveBeenCalledTimes(1);
    expect(browser.raw.pushEntry).toHaveBeenCalledWith(nonReproducibleBrowserEntry);
  });
});

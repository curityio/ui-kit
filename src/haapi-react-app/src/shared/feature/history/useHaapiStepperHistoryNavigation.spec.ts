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

const entry = (action: HaapiStepperNextStepAction): HaapiStepperHistoryEntry =>
  ({ step: {}, triggeredByAction: action, timestamp: new Date() }) as HaapiStepperHistoryEntry;

// A minimal in-memory model of the browser history stack (state = { index }).
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
  };

  return {
    nav: nav as unknown as HistoryNavigation,
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

  const fake = createFakeBrowser();
  const { rerender } = renderHook(({ h }: { h: HistoryNavigation }) => useHaapiStepperHistoryNavigation(h), {
    initialProps: { h: fake.nav },
  });

  const reachStep = (action: HaapiStepperNextStepAction) => {
    history = [...history, entry(action)];
    rerender({ h: fake.nav });
  };

  // Simulates a polling tick: a POLLING step whose GET poll action carries a fresh id each time (as the SDK
  // stamps a new UUID per tick).
  const reachPollingStep = () => {
    const pollAction = {
      id: `poll-${history.length}`,
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
    rerender({ h: fake.nav });
  };

  return { nextStep, fake, reachStep, reachPollingStep };
}

describe('useHaapiStepperHistoryNavigation', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('records a browser entry for every step — reproducible and non-reproducible', () => {
    const { fake, reachStep } = setup();

    reachStep(link); // index 0 (first step reuses the loaded entry)
    reachStep(postForm); // index 1 (non-reproducible, still recorded)
    reachStep(getForm); // index 2

    expect(fake.raw.replaceEntry).toHaveBeenCalledTimes(1);
    expect(fake.raw.replaceEntry).toHaveBeenCalledWith({ index: 0 });
    expect(fake.raw.pushEntry).toHaveBeenCalledTimes(2);
    expect(fake.raw.pushEntry).toHaveBeenNthCalledWith(1, { index: 1 });
    expect(fake.raw.pushEntry).toHaveBeenNthCalledWith(2, { index: 2 });
  });

  it('re-opens the previous reproducible step when going back', () => {
    const { nextStep, fake, reachStep } = setup();
    reachStep(link); // 0
    reachStep(getForm); // 1

    fake.navigate(-1); // back to index 0

    expect(nextStep).toHaveBeenCalledWith(link, undefined);
    expect(fake.position()).toBe(0);
  });

  it('skips a non-reproducible step when going back (lands on the nearest reproducible before it)', () => {
    const { nextStep, fake, reachStep } = setup();
    reachStep(link); // 0 (reproducible)
    reachStep(postForm); // 1 (non-reproducible)
    reachStep(getForm); // 2 (reproducible)

    fake.navigate(-1); // browser → index 1 (postForm)

    // postForm@1 is skipped; we land on link@0 and realign the browser there.
    expect(nextStep).toHaveBeenCalledWith(link, undefined);
    expect(fake.position()).toBe(0);
  });

  it('skips a non-reproducible step when going forward', () => {
    const { nextStep, fake, reachStep } = setup();
    reachStep(link); // 0
    reachStep(postForm); // 1
    reachStep(getForm); // 2

    fake.navigate(-2); // jump back to index 0 (link)
    nextStep.mockClear();

    fake.navigate(1); // forward → index 1 (postForm)

    // postForm@1 skipped; land on getForm@2 and realign there.
    expect(nextStep).toHaveBeenCalledWith(getForm, undefined);
    expect(fake.position()).toBe(2);
  });

  it('snaps back and stays put when there is no reproducible step ahead', () => {
    const { nextStep, fake, reachStep } = setup();
    reachStep(link); // 0 (reproducible)
    reachStep(postForm); // 1 (non-reproducible, the frontier)

    fake.navigate(-1); // back to link@0
    nextStep.mockClear();

    fake.navigate(1); // forward → index 1 (postForm), nothing reproducible ahead

    expect(nextStep).not.toHaveBeenCalled();
    expect(fake.position()).toBe(0); // snapped back onto link@0
  });

  // R1 ("Back on the first step must stay in the app, no reload") is deferred — see the PR description.
  // Without a sentinel history entry seeded behind the first step, Back leaves the document and the browser
  // reloads (a cross-document navigation that never fires `popstate`). The fake browser can't model that
  // reload, so asserting it here would give false confidence; left skipped until the sentinel is implemented.
  it.skip('R1: Back on the first step stays in the app without reloading (needs sentinel entry)', () => {});

  it('lands on the nearest reproducible step when the browser jumps multiple entries', () => {
    const { nextStep, fake, reachStep } = setup();
    reachStep(link); // 0
    reachStep(getForm); // 1
    reachStep(postForm); // 2

    fake.navigate(-2); // jump from index 2 straight to index 0

    expect(nextStep).toHaveBeenCalledWith(link, undefined);
    expect(fake.position()).toBe(0);
  });

  it('discards the abandoned forward branch when a new action is taken after going back', () => {
    const { fake, reachStep } = setup();
    reachStep(link); // 0
    reachStep(getForm); // 1 (will be abandoned)

    fake.navigate(-1); // back to link@0 (re-opens link)
    reachStep(postForm); // new action from @0 → overwrites index 1, dropping getForm

    // The new step took index 1 (branch rewritten), not appended at index 2.
    expect(fake.raw.pushEntry).toHaveBeenCalledTimes(2);
    expect(fake.raw.pushEntry).toHaveBeenNthCalledWith(1, { index: 1 }); // getForm
    expect(fake.raw.pushEntry).toHaveBeenNthCalledWith(2, { index: 1 }); // postForm replaced it
  });

  it('does not record browser entries for polling steps, so they never flood the history', () => {
    const { fake, reachStep, reachPollingStep } = setup();
    reachStep(link); // 0 — reproducible, recorded once
    reachPollingStep(); // tick 1 — skipped
    reachPollingStep(); // tick 2 — skipped
    reachPollingStep(); // tick 3 — skipped

    // Polling added nothing: only link@0 was recorded.
    expect(fake.raw.replaceEntry).toHaveBeenCalledTimes(1);
    expect(fake.raw.pushEntry).not.toHaveBeenCalled();

    // The next real step after polling takes index 1 — polling consumed no indices.
    reachStep(getForm);
    expect(fake.raw.pushEntry).toHaveBeenCalledTimes(1);
    expect(fake.raw.pushEntry).toHaveBeenCalledWith({ index: 1 });
  });

  it('does not record a new entry when a step is re-opened via back navigation', () => {
    const { nextStep, fake, reachStep } = setup();
    reachStep(link); // 0
    reachStep(getForm); // 1
    fake.raw.replaceEntry.mockClear();
    fake.raw.pushEntry.mockClear();

    fake.navigate(-1); // back to link@0 → re-opens link
    reachStep(link); // stepper reaches the re-opened step (same action id)

    // The re-open must not create another browser entry.
    expect(nextStep).toHaveBeenCalledWith(link, undefined);
    expect(fake.raw.replaceEntry).not.toHaveBeenCalled();
    expect(fake.raw.pushEntry).not.toHaveBeenCalled();
    expect(fake.position()).toBe(0);
  });
});

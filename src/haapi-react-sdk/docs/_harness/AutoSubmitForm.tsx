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

import { ReactNode, useEffect, useRef } from 'react';

/**
 * Previewer helper: clicks the rendered form's submit button once, as soon as it appears.
 *
 * Used so error examples surface their error without manual input — a HAAPI error only exists as the
 * response to a submitted action. This stays *outside* the example so the example's own code remains
 * a clean, documentation-grade `<HaapiStepperStepUI … />`; the "force" lives here, not in the example.
 *
 * The stepper boots asynchronously (it fetches the step before rendering the form), so a fixed delay is
 * unreliable — a short one fires before the form exists, a long one adds visible lag. Instead we poll for
 * the submit button and act the moment it renders, giving up after a few seconds.
 */
const POLL_INTERVAL_MS = 50;
const MAX_WAIT_MS = 5000;

export function AutoSubmitForm({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    let cancelled = false;
    let waited = 0;
    // One handle for the initial kick-off AND every retry, so cleanup always clears the pending timer.
    let timeoutId: ReturnType<typeof setTimeout>;

    const trySubmit = () => {
      if (cancelled) {
        return;
      }
      const container = containerRef.current;
      // Prefer the SDK's submit button; fall back to a plain submit button for examples with a custom form.
      const submit =
        container?.querySelector<HTMLButtonElement>('[data-testid="form-submit-button"]') ??
        container?.querySelector<HTMLButtonElement>('button[type="submit"]');

      if (!submit) {
        if ((waited += POLL_INTERVAL_MS) <= MAX_WAIT_MS) {
          timeoutId = setTimeout(trySubmit, POLL_INTERVAL_MS);
        }
        return;
      }

      // Fill text-like inputs first, otherwise the browser's required-field validation blocks the submit
      // and no request is sent. Values are irrelevant — the mock returns its canned error regardless. Set
      // via the native setter + an `input` event so React's controlled state updates too.
      // eslint-disable-next-line @typescript-eslint/unbound-method -- always invoked via `.call(input, …)` below
      const setNativeValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      const fillableTypes = ['text', 'email', 'password', 'tel', 'url', 'number'];
      container?.querySelectorAll<HTMLInputElement>('input').forEach(input => {
        if (fillableTypes.includes(input.type) && !input.value) {
          setNativeValue?.call(input, 'preview');
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });

      submit.click();
    };

    timeoutId = setTimeout(trySubmit, 0);
    return () => {
      cancelled = true;
      clearTimeout(timeoutId);
    };
  }, []);

  return <div ref={containerRef}>{children}</div>;
}

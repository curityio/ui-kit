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
 * Previewer helper: clicks the rendered form's submit button once after it mounts.
 *
 * Used so error examples surface their error without manual input — a HAAPI error only exists as the
 * response to a submitted action. This stays *outside* the example so the example's own code remains
 * a clean, documentation-grade `<HaapiStepperStepUI … />`; the "force" lives here, not in the example.
 *
 * The timeout fires on the next macrotask, by which point the stepper has booted and rendered the
 * form. If a slower flow ever renders the button later, increase the delay.
 */
export function AutoSubmitForm({ children }: { children: ReactNode }) {
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      const container = containerRef.current;
      if (!container) {
        return;
      }

      // Fill text-like inputs first, otherwise the browser's required-field validation blocks the submit
      // and no request is sent. Values are irrelevant — the mock returns its canned error regardless. Set
      // via the native setter + an `input` event so React's controlled state updates too.
      const setNativeValue = Object.getOwnPropertyDescriptor(HTMLInputElement.prototype, 'value')?.set;
      const fillableTypes = ['text', 'email', 'password', 'tel', 'url', 'number'];
      container.querySelectorAll<HTMLInputElement>('input').forEach(input => {
        if (fillableTypes.includes(input.type) && !input.value) {
          setNativeValue?.call(input, 'preview');
          input.dispatchEvent(new Event('input', { bubbles: true }));
        }
      });

      // Prefer the SDK's submit button; fall back to a plain submit button for examples with a custom form.
      const submit =
        container.querySelector<HTMLButtonElement>('[data-testid="form-submit-button"]') ??
        container.querySelector<HTMLButtonElement>('button[type="submit"]');
      submit?.click();
    }, 1);

    return () => clearTimeout(timeoutId);
  }, []);

  return <div ref={containerRef}>{children}</div>;
}

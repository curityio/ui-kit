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

import type { ComponentType } from 'react';
import { render, cleanup } from '@testing-library/react';
import { afterEach, describe, expect, test, vi } from 'vitest';

/*
 * Smoke test for every runnable docs example: each `*HaapiReactSDKPlaygroundExample.tsx` must mount
 * without crashing. The examples are typechecked by `tsc -b`, but only this spec executes them, so a
 * runtime break (bad hook usage, a step the harness data doesn't cover) fails CI here instead of on the
 * published docs page. Sandbox-only packages the examples import (antd, …) are aliased to
 * `_harness/sandbox-package-stub.ts` in `vitest.config.ts`.
 */

// The examples normally run against the playground's mocked web driver (docgen-side). Here the driver
// never resolves, so each example renders its initial UI — enough to catch mount-time crashes.
vi.mock('@curity/identityserver-haapi-web-driver', () => ({
  createHaapiFetch: () => () => new Promise(() => undefined),
}));

const examples = import.meta.glob('./sections/**/*HaapiReactSDKPlaygroundExample.tsx');

describe('docs examples', () => {
  afterEach(cleanup);

  test('the glob finds the examples', () => {
    expect(Object.keys(examples).length).toBeGreaterThan(0);
  });

  for (const [file, load] of Object.entries(examples)) {
    test(`${file} renders without crashing`, async () => {
      const { default: App } = (await load()) as { default: ComponentType };
      expect(() => render(<App />)).not.toThrow();
    });
  }
});

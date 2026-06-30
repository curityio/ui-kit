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

import type { HaapiStepperBootstrapConfig } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';

/**
 * The mock HAAPI client config every example runs against. Examples that also call `useHaapiFetch`
 * directly (e.g. the tabbed authenticator selector, to cancel an in-progress authenticator) pass this so
 * they reuse the stepper's single driver instance — the driver is a process-global singleton that only
 * supports one configuration per page load, and it compares configs by value.
 */
export const MOCK_HAAPI = { clientId: 'docs', tokenEndpoint: 'https://mock.invalid/oauth/token' };

/**
 * Served-mode bootstrap for a catalog example: the {@link HAAPI_EXAMPLE} key travels in `initialUrl`,
 * which the docs mock maps back to the matching step (the single source of truth in `examples/catalog`).
 * `ExamplePreviewer` assigns this to `window.__CONFIG__` so examples run in served mode with no `config`
 * prop.
 */
export function bootstrapForStep(step: string): HaapiStepperBootstrapConfig {
  return { initialUrl: `/${step}`, haapi: MOCK_HAAPI };
}

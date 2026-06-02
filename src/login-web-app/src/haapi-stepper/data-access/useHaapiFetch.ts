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

import { useMemo } from 'react';
import { createHaapiFetch } from '@curity/identityserver-haapi-web-driver';
import type { FetchLike, HaapiConfiguration } from '@curity/identityserver-haapi-web-driver';
import { sendHaapiFetchRequest } from './haapi-fetch-request';
import type { HaapiFetchAction } from './types/haapi-fetch.types';

// `@curity/identityserver-haapi-web-driver` is a *process-global singleton*:
// the docs state "at most one active fetch-like function", and in practice
// `createHaapiFetch` registers an iframe + postMessage channel that can't be
// duplicated. To enforce this, we cache the driver's fetch function at the
// module level and throw if a different `HaapiConfiguration` is supplied on a
// subsequent call.
//
// This also has the benefit of ensuring that all components using `useHaapiFetch`
// share the same driver instance, even across StrictMode remounts.
let cachedHaapiFetch: FetchLike | undefined;
let cachedConfig: HaapiConfiguration | undefined;

export function useHaapiFetch(haapi: HaapiConfiguration) {
  const haapiFetch = useMemo(() => getHaapiFetch(haapi), [haapi]);
  return useMemo(
    () => ({
      sendHaapiFetchRequest: (action: HaapiFetchAction) => sendHaapiFetchRequest(action, haapiFetch),
    }),
    [haapiFetch]
  );
}

function getHaapiFetch(haapi: HaapiConfiguration): FetchLike {
  if (isNewHaapiConfig(haapi)) {
    throw new Error(
      'useHaapiFetch: HaapiConfiguration changed but the underlying HAAPI driver only ' +
        'supports one configuration per page load. To switch configurations, reload the page.'
    );
  }
  if (!cachedHaapiFetch) {
    cachedConfig = haapi;
    cachedHaapiFetch = createHaapiFetch(haapi);
  }
  return cachedHaapiFetch;
}

function isNewHaapiConfig(haapi: HaapiConfiguration): boolean {
  if (!cachedHaapiFetch || !cachedConfig) {
    return false;
  }
  return (
    cachedConfig.clientId !== haapi.clientId ||
    cachedConfig.tokenEndpoint !== haapi.tokenEndpoint ||
    cachedConfig.baseUrl !== haapi.baseUrl ||
    cachedConfig.deviceIdentifier !== haapi.deviceIdentifier
  );
}

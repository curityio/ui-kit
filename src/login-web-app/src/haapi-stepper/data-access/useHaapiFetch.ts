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
import { sendHaapiFetchRequest } from './happi-fetch-request';
import type { HaapiFetchAction } from './types/haapi-fetch.types';

// The @curity/identityserver-haapi-web-driver is a *process-global singleton*:
// the docs state "at most one active fetch-like function", and in practice
// `createHaapiFetch` registers an iframe + postMessage channel that can't
// survive rapid create/close/create cycles (e.g. React StrictMode dev).
// Caching the created fetch function allows us to reuse it and avoid such issues.
let cachedHaapiFetch: FetchLike | undefined;

function getHaapiFetch(haapi: HaapiConfiguration): FetchLike {
  return (cachedHaapiFetch ??= createHaapiFetch(haapi));
}

export function useHaapiFetch(haapi: HaapiConfiguration) {
  const haapiFetch = useMemo(() => getHaapiFetch(haapi), [haapi]);
  return useMemo(
    () => ({
      sendHaapiFetchRequest: (action: HaapiFetchAction) => sendHaapiFetchRequest(action, haapiFetch),
    }),
    [haapiFetch]
  );
}

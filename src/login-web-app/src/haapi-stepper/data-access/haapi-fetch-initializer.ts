/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { createHaapiFetch, FetchLike, HaapiConfiguration } from '@curity/identityserver-haapi-web-driver';

interface GlobalConfiguration {
  requestDelay?: number;
  haapi: HaapiConfiguration;
}

// @ts-expect-error Usage of 'any' due to global variable
const config = window.__CONFIG__ as GlobalConfiguration | undefined;
if (!config) {
  throw new Error('Configuration not set');
}

function withDelay(f: FetchLike, d: number): FetchLike {
  const delayed = async (link: Parameters<FetchLike>[0], init: Parameters<FetchLike>[1]): ReturnType<FetchLike> => {
    await new Promise(resolve => setTimeout(resolve, d));
    return await f(link, init);
  };
  delayed.init = () => f.init();
  return delayed;
}

const mainHaapiFetch = createHaapiFetch(config.haapi);
const haapiFetch =
  config.requestDelay && config.requestDelay > 0 ? withDelay(mainHaapiFetch, config.requestDelay) : mainHaapiFetch;

export default haapiFetch;

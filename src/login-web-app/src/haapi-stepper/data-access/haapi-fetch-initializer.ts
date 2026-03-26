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

import { createHaapiFetch, FetchLike } from '@curity/identityserver-haapi-web-driver';
import { configuration } from './bootstrap-configuration';

function withDelay(f: FetchLike, d: number): FetchLike {
  const delayed = async (link: Parameters<FetchLike>[0], init: Parameters<FetchLike>[1]): ReturnType<FetchLike> => {
    await new Promise(resolve => setTimeout(resolve, d));
    return await f(link, init);
  };
  delayed.init = () => f.init();
  delayed.close = () => f.close();
  return delayed;
}

const mainHaapiFetch = createHaapiFetch(configuration.haapi);
const haapiFetch =
  configuration.requestDelay && configuration.requestDelay > 0
    ? withDelay(mainHaapiFetch, configuration.requestDelay)
    : mainHaapiFetch;

export default haapiFetch;

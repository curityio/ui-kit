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

import { HaapiConfiguration } from '@curity/identityserver-haapi-web-driver';

export interface BootstrapConfiguration {
  initialUrl: string;
  haapi: HaapiConfiguration;
}

// @ts-expect-error window.__CONFIG__ is not declared on the Window type
const _configuration = window.__CONFIG__ as BootstrapConfiguration | undefined;
if (!_configuration) {
  throw new Error('Configuration not set');
}

export const configuration = _configuration;

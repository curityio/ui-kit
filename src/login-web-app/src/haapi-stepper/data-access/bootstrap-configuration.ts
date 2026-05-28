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
  theme: {
    logo: {
      path: string;
      isInsideWell: boolean;
    };
    /**
     * Optional per-page icon configuration. Only present when symbols are enabled in the server theme.
     * Resolved against the current step's `metadata.viewName` (see `resolvePageSymbol`).
     */
    pageSymbols?: PageSymbols;
  };
}

export interface PageSymbols {
  /** Map of full HAAPI viewName -> symbol path. Highest precedence. */
  views?: Record<string, string>;
  /** Map of plugin implementation type (e.g. `html-form`, `bankid`) -> symbol path. */
  plugins?: Record<string, string>;
  /** Fallback symbol path used when no per-view / per-plugin entry matches. */
  default?: string;
}

// @ts-expect-error window.__CONFIG__ is not declared on the Window type
const _configuration = window.__CONFIG__ as BootstrapConfiguration | undefined;
if (!_configuration) {
  throw new Error('Configuration not set');
}

export const configuration = _configuration;

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

import type { HaapiStepperStepSymbolsConfig } from '../../feature/stepper/haapi-stepper.types';

/**
 * Extracts the plugin implementation type from a HAAPI `viewName` of the form
 * `<category>/<plugin-type>/<rest>`, where category is `authenticator`, `authentication-action`
 * or `consentor`.
 */
const PLUGIN_TYPE_FROM_VIEW_NAME = /^(?:authenticator|authentication-action|consentor)\/([^/]+)\/.*/;

/**
 * Resolves the step symbol image path for a given HAAPI step `viewName` against the
 * `theme.stepSymbols` configuration delivered by the server bootstrap.
 *
 * Resolution order:
 *   1. Exact match in `stepSymbols.views`.
 *   2. Plugin-type match (extracted from `viewName` via {@link PLUGIN_TYPE_FROM_VIEW_NAME}) in `stepSymbols.plugins`.
 *   3. `stepSymbols.default`.
 *   4. `undefined` when no rule resolves — callers should render nothing.
 *
 * Returns `undefined` for any falsy input (no `viewName`, no `stepSymbols`).
 */
export const resolveStepSymbol = (
  viewName: string | undefined,
  stepSymbols: HaapiStepperStepSymbolsConfig | undefined
): string | undefined => {
  if (!viewName || !stepSymbols) {
    return undefined;
  }

  const exactMatch = stepSymbols.views?.[viewName];
  if (exactMatch) {
    return exactMatch;
  }

  const pluginType = PLUGIN_TYPE_FROM_VIEW_NAME.exec(viewName)?.[1];
  const pluginMatch = pluginType ? stepSymbols.plugins?.[pluginType] : undefined;
  if (pluginMatch) {
    return pluginMatch;
  }

  return stepSymbols.default;
};

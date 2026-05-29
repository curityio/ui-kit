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

import { useAppConfig } from '../feature/app-config/AppConfigHook';
import { resolvePageSymbol } from '../util/resolve-page-symbol';

interface PageSymbolProps {
  viewName: string | undefined;
}

/**
 * Renders the page symbol icon associated with the current step's HAAPI `viewName`.
 *
 * The mapping comes from `theme.pageSymbols` in the bootstrap configuration and is resolved by
 * {@link resolvePageSymbol}. When `theme.pageSymbols` is absent, when `viewName` is absent, or when
 * no entry resolves, this component renders nothing.
 */
export const PageSymbol = ({ viewName }: PageSymbolProps) => {
  const { theme } = useAppConfig();
  const src = resolvePageSymbol(viewName, theme.pageSymbols);

  if (!src) {
    return null;
  }

  return (
    <figure className="haapi-stepper-page-symbol" aria-hidden="true">
      <img className="haapi-stepper-page-symbol-image" src={src} alt="HAAPI Page Symbol" role="presentation" />
    </figure>
  );
};

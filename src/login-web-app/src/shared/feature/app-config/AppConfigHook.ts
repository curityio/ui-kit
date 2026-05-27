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

import { use } from 'react';
import { AppConfigContext } from './AppConfigContext';

/**
 * Hook to access the bootstrap configuration provided by `<AppConfigProvider>`.
 *
 * @throws {Error} If used outside of an `<AppConfigProvider>`.
 *
 * @example
 * ```tsx
 * function Logo() {
 *   const { theme } = useAppConfig();
 *   return <img src={theme.logo.path} alt="" />;
 * }
 * ```
 */
export function useAppConfig() {
  const appConfig = use(AppConfigContext);

  if (!appConfig) {
    throw new Error('useAppConfig must be used inside AppConfigProvider');
  }

  return appConfig;
}

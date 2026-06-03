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
import { HaapiAppConfigContext } from './HaapiAppConfigContext';

/**
 * Hook to access the bootstrap configuration provided by `<HaapiAppConfig>`.
 *
 * @throws {Error} If used outside of a `<HaapiAppConfig>` provider.
 *
 * @example
 * ```tsx
 * function Logo() {
 *   const { theme } = useHaapiAppConfig();
 *   return <img src={theme.logo.path} alt="" />;
 * }
 * ```
 */
export function useHaapiAppConfig() {
  const haapiAppConfig = use(HaapiAppConfigContext);

  if (!haapiAppConfig) {
    throw new Error('useHaapiAppConfig must be used inside HaapiAppConfig');
  }

  return haapiAppConfig;
}

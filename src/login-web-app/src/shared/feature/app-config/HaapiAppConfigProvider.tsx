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

import { ReactNode } from 'react';
import { HaapiAppConfigContext } from './HaapiAppConfigContext';
import { HaapiAppConfig } from './types';

export const HaapiAppConfigProvider = ({ children }: { children: ReactNode }) => {
  const configuration = window.__CONFIG__ as HaapiAppConfig | undefined;
  if (!configuration) {
    throw new Error('HaapiAppConfigProvider: window.__CONFIG__ is not set');
  }
  return <HaapiAppConfigContext value={configuration}>{children}</HaapiAppConfigContext>;
};

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
import { configuration } from '../../../haapi-stepper/data-access/bootstrap-configuration';
import { AppConfigContext } from './AppConfigContext';

export const AppConfig = ({ children }: { children: ReactNode }) => (
  <AppConfigContext value={configuration}>{children}</AppConfigContext>
);

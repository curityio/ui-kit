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

export const Logo = () => {
  const { theme } = useAppConfig();
  return <img className="haapi-stepper-logo" src={theme.logo.path} alt="" role="presentation" />;
};

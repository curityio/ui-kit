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

import { Navigate } from 'react-router';
import { useUiConfigAreOperationsAllowed } from '@/ui-config/hooks/useUiConfigAreOperationsAllowed';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { ROUTE_PATHS } from '@/routes';

export const DefaultRoute = () => {
  const hasAccountPermissions = useUiConfigAreOperationsAllowed(
    [
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER,
    ],
    [UI_CONFIG_OPERATIONS.READ],
    true
  );
  const redirectToAppsAndServices = !hasAccountPermissions;

  return redirectToAppsAndServices ? (
    <Navigate to={ROUTE_PATHS.APPS_AND_SERVICES} replace />
  ) : (
    <Navigate to={ROUTE_PATHS.ACCOUNT} replace />
  );
};

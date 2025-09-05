import { ROUTE_PATHS } from '../../routes.tsx';
import { useUiConfig } from '../data-access/UiConfigProvider.tsx';
import { UI_CONFIG_OPERATIONS, UiConfigIfRouteProps } from '../typings.ts';
import { getResourceUiConfigAllowedOperations, useCurrentRouteResources } from '../utils/ui-config-if-utils.tsx';
import { Navigate } from 'react-router';

export const UiConfigIfRoute = ({
  children,
  allowedOperations = [UI_CONFIG_OPERATIONS.READ],
  allowAccessWithPartialResourcePermissions = true,
}: UiConfigIfRouteProps) => {
  const uiConfig = useUiConfig();
  const routeResources = useCurrentRouteResources() || [];
  const matchOperation = allowAccessWithPartialResourcePermissions ? 'some' : 'every';
  const shouldBeDisplayed = routeResources[matchOperation](resource => {
    const resourceUiConfigAllowedOperations = getResourceUiConfigAllowedOperations(resource, uiConfig);
    const resourceHasAccessPermissions = allowedOperations?.[matchOperation](operation =>
      resourceUiConfigAllowedOperations?.includes(operation)
    );

    return resourceHasAccessPermissions;
  });

  return shouldBeDisplayed ? children : <Navigate to={`/${ROUTE_PATHS.FEATURE_NOT_AVAILABLE}`} replace />;
};

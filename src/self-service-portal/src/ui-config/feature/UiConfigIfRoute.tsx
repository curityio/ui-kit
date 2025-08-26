import { ROUTE_PATHS } from '@/routes';
import { useUiConfig } from '@/ui-config/data-access/UiConfigProvider';
import { UI_CONFIG_OPERATIONS, UiConfigIfRouteProps } from '@/ui-config/typings';
import { getResourceUiConfigAllowedOperations, useCurrentRouteResources } from '@/ui-config/utils/ui-config-if-utils';
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

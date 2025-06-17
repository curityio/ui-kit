import { ROUTES } from '@/routes';
import {
  GrantedAuthorizationsResources,
  UI_CONFIG_OPERATIONS,
  UI_CONFIG_RESOURCE_GROUPS,
  UI_CONFIG_RESOURCES,
  UiConfig,
  UserManagementResources,
} from '@/ui-config/typings';
import { matchRoutes, useLocation } from 'react-router';

export const useCurrentRouteResources = () => {
  const location = useLocation();
  const matches = matchRoutes(ROUTES, location);
  const currentRoute = matches?.[matches?.length - 1];
  const routeResources = currentRoute?.route?.resources;

  return routeResources;
};

export const getResourceUiConfigAllowedOperations = (
  resource: UI_CONFIG_RESOURCES,
  uiConfig: UiConfig
): UI_CONFIG_OPERATIONS[] => {
  const [resourceGroup, resourceKey] = resource.split('.');
  let resourceUiConfigAllowedOperations: UI_CONFIG_OPERATIONS[] = [];

  if (resourceGroup === UI_CONFIG_RESOURCE_GROUPS.USER_MANAGEMENT) {
    resourceUiConfigAllowedOperations =
      uiConfig.resourceGroups[resourceGroup]?.resources?.[resourceKey as keyof UserManagementResources]?.operations ||
      [];
  } else if (resourceGroup === UI_CONFIG_RESOURCE_GROUPS.GRANTED_AUTHORIZATIONS) {
    resourceUiConfigAllowedOperations =
      uiConfig.resourceGroups[resourceGroup]?.resources?.[resourceKey as keyof GrantedAuthorizationsResources]
        ?.operations || [];
  }

  return resourceUiConfigAllowedOperations;
};

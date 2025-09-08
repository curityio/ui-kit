import { useUiConfig } from '../data-access/UiConfigProvider.tsx';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '../typings.ts';
import { getResourceUiConfigAllowedOperations, useCurrentRouteResources } from '../utils/ui-config-if-utils.tsx';

export const useUiConfigAreOperationsAllowed = (
  resources?: UI_CONFIG_RESOURCES[],
  allowedOperations?: UI_CONFIG_OPERATIONS[],
  displayWithPartialResourcePermissions = false
): boolean => {
  const uiConfig = useUiConfig();
  const currentRouteResources = useCurrentRouteResources();
  const elementAssociatedResources = resources || currentRouteResources;
  const elementAssociatedAllowedOperations = allowedOperations || [UI_CONFIG_OPERATIONS.READ];
  const matchOperation = displayWithPartialResourcePermissions ? 'some' : 'every';
  const hasPermissions = !!elementAssociatedResources?.[matchOperation](resource =>
    elementAssociatedAllowedOperations?.[matchOperation](operation => {
      const resourceUiConfigAllowedOperations = getResourceUiConfigAllowedOperations(resource, uiConfig);

      return resourceUiConfigAllowedOperations?.includes(operation);
    })
  );

  return hasPermissions;
};

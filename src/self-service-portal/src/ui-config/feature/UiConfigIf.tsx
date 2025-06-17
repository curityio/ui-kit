import { useUiConfig } from '@/ui-config/data-access/UiConfigProvider';
import { UI_CONFIG_OPERATIONS, UiConfigIfProps } from '@/ui-config/typings';
import { getResourceUiConfigAllowedOperations, useCurrentRouteResources } from '@/ui-config/utils/ui-config-if-utils';

export const UiConfigIf = ({
  resources,
  allowedOperations,
  displayWithPartialResourcePermissions = false,
  children,
}: UiConfigIfProps) => {
  const uiConfig = useUiConfig();
  const currentRouteResources = useCurrentRouteResources();
  const elementAssociatedResources = resources || currentRouteResources;
  const elementAssociatedAllowedOperations = allowedOperations || [UI_CONFIG_OPERATIONS.READ];
  const matchOperation = displayWithPartialResourcePermissions ? 'some' : 'every';
  const shouldBeDisplayed = !!elementAssociatedResources?.[matchOperation](resource =>
    elementAssociatedAllowedOperations?.[matchOperation](operation => {
      const resourceUiConfigAllowedOperations = getResourceUiConfigAllowedOperations(resource, uiConfig);

      if (operation === UI_CONFIG_OPERATIONS.READ && resourceUiConfigAllowedOperations?.length) {
        return true;
      }

      return resourceUiConfigAllowedOperations?.includes(operation);
    })
  );

  return shouldBeDisplayed ? children : null;
};

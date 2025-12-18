import { UiConfigIfProps } from '@/ui-config/typings';
import { useUiConfigAreOperationsAllowed } from '@/ui-config/hooks/useUiConfigAreOperationsAllowed';

export const UiConfigIf = ({
  resources,
  allowedOperations,
  displayWithPartialResourcePermissions = false,
  children,
}: UiConfigIfProps) => {
  const shouldBeDisplayed = useUiConfigAreOperationsAllowed(
    resources,
    allowedOperations,
    displayWithPartialResourcePermissions
  );

  return shouldBeDisplayed ? children : null;
};

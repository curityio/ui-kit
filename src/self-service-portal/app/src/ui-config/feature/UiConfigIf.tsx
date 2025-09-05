import { UiConfigIfProps } from '../typings.ts';
import { useUiConfigAreOperationsAllowed } from '../hooks/useUiConfigAreOperationsAllowed.ts';

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

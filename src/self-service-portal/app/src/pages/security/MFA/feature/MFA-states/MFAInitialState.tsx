import { useTranslation } from 'react-i18next';
import { Alert } from '@curity/ui-kit-component-library';

export interface MFAInitialStateProps {
  children?: React.ReactNode;
  errorMessageKey?: string;
}

export const MFAInitialState = ({
  children,
  errorMessageKey = 'security.multi-factor-authentication.not-used-warning',
}: MFAInitialStateProps) => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mw-40" data-testid="mfa-initial-state">
      <Alert errorMessage={t(errorMessageKey)} kind="warning" />
      <div className="center py4">{children}</div>
    </div>
  );
};

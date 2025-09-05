import { useTranslation } from 'react-i18next';
import { Alert } from '../../../../../shared/ui/Alert.tsx';

export interface MFAInitialStateProps {
  children?: React.ReactNode;
}

export const MFAInitialState = ({ children }: MFAInitialStateProps) => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mw-40" data-testid="mfa-initial-state">
      <Alert errorMessage={t('security.multi-factor-authentication.not-used-warning')} kind="warning" />
      <div className="center py4">{children}</div>
    </div>
  );
};

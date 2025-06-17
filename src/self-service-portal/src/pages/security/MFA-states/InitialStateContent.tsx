import { useTranslation } from 'react-i18next';
import { IconGeneralLockUnlocked } from '@icons';
import { Alert } from '@shared/ui/Alert.tsx';

export const InitialStateContent = () => {
  const { t } = useTranslation();

  return (
    <div className="mx-auto mw-40 border-light p3 br-8">
      <div className="sm-flex flex-gap-3">
        <div className="flex-20">
          <IconGeneralLockUnlocked width={128} height={128} />
        </div>
        <div className="flex-70 flex flex-column flex-gap-2 flex-start">
          <p data-testid="mfa-initial-state-info">
            {t(
              'Multi-factor Authentication (MFA) is currently not used for your account. You can turn it on at your next login.'
            )}
          </p>
        </div>
      </div>
      <Alert
        errorMessage={t(
          'Your account is not fully protected! Use MFA to keep your account safe from unauthorized access.'
        )}
        kind="warning"
      />
    </div>
  );
};

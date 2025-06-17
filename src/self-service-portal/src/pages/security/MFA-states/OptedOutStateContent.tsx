import { getFormattedDate } from '@shared/utils/date.ts';
import { IconGeneralLockUnlocked } from '@icons';
import { useTranslation } from 'react-i18next';
import { Alert } from '@shared/ui/Alert.tsx';

interface OptedOutStateContentProps {
  optOutAt: number;
}

export const OptedOutStateContent = ({ optOutAt }: OptedOutStateContentProps) => {
  const optOutAtDate = getFormattedDate(optOutAt);
  const { t } = useTranslation();

  return (
    <div className="mx-auto mw-40 border-light p3 br-8">
      <div className="sm-flex flex-gap-3">
        <div className="flex-20">
          <IconGeneralLockUnlocked width={128} height={128} />
        </div>
        <div className="flex-70 flex flex-column flex-gap-2 flex-start">
          <p data-testid="mfa-opted-out-state-info">
            {t(
              'Multi-factor Authentication is currently disabled for your account. You opted out on {{optOutAtDate}}. You can Reset and enable MFA again. Enabling MFA will happen on the next authentication.',
              { optOutAtDate }
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

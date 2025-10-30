import { getFormattedDate } from '@shared/utils/date.ts';
import { IconGeneralLockUnlocked } from '@curity-ui-kit/icons';
import { useTranslation } from 'react-i18next';
import { Alert } from '@shared/ui/Alert';

interface MFAOptedOutStateProps {
  optOutAt: number;
  children?: React.ReactNode;
}

export const MFAOptedOutState = ({ optOutAt, children }: MFAOptedOutStateProps) => {
  const optOutAtDate = getFormattedDate(optOutAt);
  const { t } = useTranslation();

  return (
    <div className="mx-auto mw-40 border-light p3 br-8" data-testid="mfa-opted-out-state">
      <div className="sm-flex flex-gap-3">
        <div className="flex-20">
          <IconGeneralLockUnlocked width={128} height={128} />
        </div>
        <div className="flex-70 flex flex-column flex-gap-2 flex-start">
          <p data-testid="mfa-opted-out-state-info">
            {t('security.multi-factor-authentication.disabled-warning', { optOutAtDate })}
          </p>
        </div>
      </div>
      <Alert errorMessage={t('security.multi-factor-authentication.not-protected')} kind="warning" />
      <div className="center py4">{children}</div>
    </div>
  );
};

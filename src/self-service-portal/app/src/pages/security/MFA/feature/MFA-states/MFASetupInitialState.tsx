import { Button } from '@shared/ui';
import { useTranslation } from 'react-i18next';
import { Account, RegistrableFactor, StringMultiValuedValue } from '@/shared/data-access/API';
import { MFARegistrableAuthenticationFactorList } from '@/pages/security/MFA/feature/MFARegistrableAuthenticationFactorList';

interface MFASetupInitialStateProps {
  MFASetupFactors: RegistrableFactor[];
  accountData: Account;
  manageAuthFactorToggle: (authFactor: RegistrableFactor, isRegistered: boolean) => void;
  factorDeviceAdded: (authFactor: RegistrableFactor) => void;
  factorDeviceVerified: (factor: RegistrableFactor, device: StringMultiValuedValue) => void;
  startMFASetup: (authFactors: RegistrableFactor[]) => void;
}

export const MFASetupInitialState = ({
  MFASetupFactors,
  accountData,
  manageAuthFactorToggle,
  factorDeviceAdded,
  factorDeviceVerified,
  startMFASetup,
}: MFASetupInitialStateProps) => {
  const { t } = useTranslation();
  const registrableAuthFactors = accountData?.mfaOptIn?.registrableFactors?.factors || [];

  return (
    <>
      <div className="mb2">
        <h3 className="m0">{t('security.multi-factor-authentication.methods')}</h3>
        <p>{t('security.multi-factor-authentication.enable-requirement')}</p>
      </div>
      <MFARegistrableAuthenticationFactorList
        account={accountData}
        factors={registrableAuthFactors}
        registeredFactors={MFASetupFactors}
        factorToggled={manageAuthFactorToggle}
        factorDeviceAdded={factorDeviceAdded}
        factorDeviceVerified={factorDeviceVerified}
      />
      <div className="sm-flex flex-center justify-between mt2 py2">
        <p>
          <em>
            {MFASetupFactors?.length} {t('security.multi-factor-authentication.methods-selected')}
          </em>
        </p>
        <Button
          title={t('security.multi-factor-authentication.methods-selected.continue')}
          onClick={() => startMFASetup(MFASetupFactors)}
          disabled={!MFASetupFactors?.length}
          className="button button-small button-primary"
          data-testid="mfa-setup-initial-content-continue-button"
        />
      </div>
    </>
  );
};

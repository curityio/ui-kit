import { OptinMfa, RegisteredFactor } from '@shared/data-access/API';
import { useState } from 'react';
import { getFormattedDate } from '@shared/utils/date.ts';
import { Alert } from '@shared/ui/Alert.tsx';
import { DataTable } from '@shared/ui';
import { IconFacilitiesSms, IconGeneralCheckmarkCircled, IconGeneralPlus } from '@icons';
import { Link } from 'react-router';
import { Dialog } from '@shared/ui/dialog/Dialog.tsx';
import { USER_MANAGEMENT_API } from '@shared/data-access/API/user-management';
import { useMutation } from '@apollo/client';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings.ts';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf.tsx';
import { Column } from '@shared/ui/data-table/typings.ts';
import { useTranslation } from 'react-i18next';
import { ConfirmButton } from '@shared/ui/ConfirmButton.tsx';
import { GRAPHQL_API_ERROR_MESSAGES } from '@/shared/data-access/API/GRAPHQL_API_ERROR_MESSAGES';

interface OptedInStateContentProps {
  optInMfaData: OptinMfa;
  accountId: string;
  refetchAccountData: () => void;
}

export const OptedInStateContent = ({ optInMfaData, accountId, refetchAccountData }: OptedInStateContentProps) => {
  const { t } = useTranslation();

  const [showResetMFADialog, setShowResetMFADialog] = useState<boolean>(false);
  const activeFactorsTableColumns: Column<RegisteredFactor>[] = [
    { key: 'type', label: t('Type') },
    { key: 'description', label: t('Alias') },
    {
      key: 'changedAt',
      label: t('Enabled'),
      customRender: (factor: RegisteredFactor) => getFormattedDate(factor.changedAt as number),
    },
  ];
  const numberOfAvailableRecoveryCodes = optInMfaData.recoveryCodeBatch?.codes.reduce(
    (numberOfAvailableCodes, currentCode) => {
      return numberOfAvailableCodes - (currentCode.consumed ? 1 : 0);
    },
    optInMfaData.recoveryCodeBatch?.codes.length
  );
  const [deleteOptInMfaFactorFromAccountByAccountId, { error: deleteOptInMfaFactorError }] = useMutation(
    USER_MANAGEMENT_API.MUTATIONS.deleteOptInMfaFactorFromAccountByAccountId
  );
  const [resetOptInMfaStateByAccountId, { error: resetOptInMfaStateError }] = useMutation(
    USER_MANAGEMENT_API.MUTATIONS.resetOptInMfaStateByAccountId
  );

  const handleResetMFA = () => {
    resetOptInMfaStateByAccountId({
      variables: {
        input: {
          accountId,
        },
      },
    }).then(() => refetchAccountData());
  };

  const handleFactorDelete = (factorToDelete: RegisteredFactor) => {
    deleteOptInMfaFactorFromAccountByAccountId({
      variables: {
        input: {
          accountId: accountId as string,
          acr: factorToDelete.acr as string,
        },
      },
    }).then(() => refetchAccountData());
  };

  return (
    <>
      <div className="xlg-flex flex-center justify-between w100 py2">
        <Alert
          data-testid="mfa-opted-in-state-info"
          kind="success"
          errorMessage={t(
            'Multi-factor authentication is enabled. Your account is protected with an additional layer of security'
          )}
          classes="mb0"
        ></Alert>
      </div>
      <div className="br-8 p3 border-light w100" data-testid="active-authentication-methods-section">
        <div className="flex flex-center justify-between mb2">
          <h3 className="m0">{t('Active Authentication methods')}</h3>
          <div className="pill pill-success">{t('Used for MFA')}</div>
        </div>
        <DataTable
          columns={activeFactorsTableColumns}
          data={optInMfaData.registeredFactors.factors}
          showCreate={false}
          showSearch={false}
          showDelete={false}
          customActions={factorToDelete => (
            <>
              <ConfirmButton
                className="button-tiny button-primary-outline"
                dialogConfig={{ title: t('Disable authentication method') }}
                dialogMessage={t(
                  'Are you sure you want to disable {{factorName}} authentication method? This action cannot be undone.',
                  {
                    factorName: factorToDelete.description,
                  }
                )}
                aria-label={t('disable')}
                title={t('disable')}
                onConfirm={() => handleFactorDelete(factorToDelete)}
                disabled={optInMfaData.registeredFactors.factors.length < 2}
              />
            </>
          )}
        />
        {deleteOptInMfaFactorError && (
          <Alert
            kind="danger"
            errorMessage={t(GRAPHQL_API_ERROR_MESSAGES.deleteOptInMfaFactorFromAccountByAccountId)}
          />
        )}
      </div>

      {/* Recovery Codes */}

      {!!optInMfaData.recoveryCodeBatch && (
        <div className="br-8 p3 border-light w100 mt3">
          <h2 className="mt0">{t('Recovery Codes')}</h2>

          <div className="flex flex-center flex-gap-1" data-testid="recovery-codes">
            <IconGeneralCheckmarkCircled width={36} height={36} color="#57c75c" />
            {t('{{codesAvailable}} codes available', {
              codesAvailable: numberOfAvailableRecoveryCodes + '/' + optInMfaData.recoveryCodeBatch?.codes.length,
            })}
          </div>
        </div>
      )}

      {/* Shortcuts */}
      <div className="br-8 p3 border-light w100 mt3">
        <h2 className="mt0">{t('Add a new authentication method to your account')}</h2>

        <div className="flex flex-center flex-gap-2">
          <Link to="/security/email" data-testid="email-shortcut">
            <button className="button button-small button-primary-outline">
              <IconGeneralPlus width={24} height={24} />
              {t('New Email')}
            </button>
          </Link>
          <Link to="/security/phone" data-testid="phone-shortcut">
            <button className="button button-small button-primary-outline">
              <IconFacilitiesSms width={24} height={24} />
              {t('New Phone number')}
            </button>
          </Link>
          <Link to="/security/otp" data-testid="otp-shortcut">
            <button className="button button-small button-primary-outline">
              <IconFacilitiesSms width={24} height={24} />
              {t('New OTP Authenticator')}
            </button>
          </Link>
        </div>
      </div>

      {/* Reset */}
      <UiConfigIf
        resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA]}
        allowedOperations={[UI_CONFIG_OPERATIONS.RESET]}
      >
        <div className="br-8 p3 border-light w100 mt3">
          <h2 className="mt0">{t('Reset')}</h2>
          <p>
            {t(
              'Resetting Multi-factor Authentication will remove all your current authentication methods. You can set up MFA again at your next login.'
            )}
          </p>

          <button
            className="button button-small button-danger-outline"
            onClick={() => setShowResetMFADialog(true)}
            data-testid="reset-mfa-button"
          >
            {t('Reset Multi Factor Authentication')}
          </button>
        </div>
      </UiConfigIf>

      {/* Dialog for Reset */}
      {showResetMFADialog && (
        <Dialog
          isOpen={true}
          title={t('Reset Multi-Factor Authentication?')}
          showActionButton={true}
          showCancelButton={true}
          actionButtonText={t('Reset MFA')}
          cancelButtonText={t('Cancel')}
          actionButtonCallback={() => {
            handleResetMFA();
          }}
          closeCallback={() => setShowResetMFADialog(false)}
        >
          <h2>{t('Reset Multi-Factor Authentication?')}</h2>
          <p>
            {t(
              'Resetting Multi-factor Authentication will remove all your current authentication methods. You can set up MFA again at your next login.This may leave your account less secure.'
            )}
          </p>
          {resetOptInMfaStateError && (
            <Alert kind="danger" errorMessage={t(GRAPHQL_API_ERROR_MESSAGES.resetOptInMfaStateByAccountId)} />
          )}
        </Dialog>
      )}
    </>
  );
};

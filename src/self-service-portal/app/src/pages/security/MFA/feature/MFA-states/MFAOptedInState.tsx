import {
  Account,
  OptinMfa,
  RegisteredFactor,
  RegistrableFactor,
  StringMultiValuedValue,
} from '@shared/data-access/API';
import { useState } from 'react';
import { Alert } from '@shared/ui/Alert';
import { IconGeneralCheckmarkCircled } from '@curity-ui-kit/icons';
import { Dialog } from '@shared/ui/dialog/Dialog';
import { ApolloError, useMutation } from '@apollo/client';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings.ts';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';
import { useTranslation } from 'react-i18next';
import { GRAPHQL_API_ERROR_MESSAGES } from '@/shared/data-access/API/GRAPHQL_API_ERROR_MESSAGES';
import { MFARegisteredAuthenticationFactorList } from '@/pages/security/MFA/feature/MFARegisteredAuthenticationFactorList';
import { MFARegistrableAuthenticationFactorList } from '@/pages/security/MFA/feature/MFARegistrableAuthenticationFactorList';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { MFARecoveryCodes } from '@/pages/security/MFA/ui/MFARecoveryCodes';
import { Button } from '@/shared/ui';
import toast from 'react-hot-toast';

interface MFAOptedInStateProps {
  optInMfaData: OptinMfa;
  account: Account;
  refetchAccountData: () => void;
  resetMfaSetupState: () => void;
  factorToggled: (authFactor: RegistrableFactor | RegisteredFactor, isRegistered: boolean) => void;
  factorDeviceAdded: (factor: RegistrableFactor) => void;
  factorDeviceVerified: (factor: RegistrableFactor, device: StringMultiValuedValue) => void;
  deleteOptInMfaFactorError?: ApolloError;
}

export const MFAOptedInState = ({
  optInMfaData,
  account,
  refetchAccountData,
  resetMfaSetupState,
  factorToggled,
  factorDeviceAdded,
  factorDeviceVerified,
  deleteOptInMfaFactorError,
}: MFAOptedInStateProps) => {
  const { t } = useTranslation();

  const [showResetMFADialog, setShowResetMFADialog] = useState<boolean>(false);
  const [showReplaceRecoveryCodesDialog, setShowReplaceRecoveryCodesDialog] = useState<boolean>(false);
  const numberOfAvailableRecoveryCodes = optInMfaData.recoveryCodeBatch?.codes.reduce(
    (numberOfAvailableCodes, currentCode) => {
      return numberOfAvailableCodes - (currentCode.consumed ? 1 : 0);
    },
    optInMfaData.recoveryCodeBatch?.codes.length
  );
  const [resetOptInMfaStateByAccountId, { error: resetOptInMfaStateError }] = useMutation(
    GRAPHQL_API.USER_MANAGEMENT.MUTATIONS.resetOptInMfaStateByAccountId
  );
  const [startOptInMfaResetRecoveryCodesByAccountId, { data: startOptInMfaResetRecoveryCodesData }] = useMutation(
    GRAPHQL_API.USER_MANAGEMENT.MUTATIONS.startOptInMfaResetRecoveryCodesByAccountId
  );
  const [completeOptInMfaResetRecoveryCodesByAccountId] = useMutation(
    GRAPHQL_API.USER_MANAGEMENT.MUTATIONS.completeOptInMfaResetRecoveryCodesByAccountId
  );
  const recoveryCodes =
    startOptInMfaResetRecoveryCodesData?.startOptInMfaResetRecoveryCodesByAccountId?.recoveryCodes?.map(
      code => code.value
    ) || [];

  const startResetRecoveryCodes = () => {
    startOptInMfaResetRecoveryCodesByAccountId({
      variables: {
        input: {
          accountId: account.id,
        },
      },
    })
      .then(() => setShowReplaceRecoveryCodesDialog(true))
      .catch(() => console.error(GRAPHQL_API_ERROR_MESSAGES.startOptInMfaResetRecoveryCodesByAccountId));
  };

  const completeResetRecoveryCodes = () => {
    completeOptInMfaResetRecoveryCodesByAccountId({
      variables: {
        input: {
          accountId: account.id,
          state: startOptInMfaResetRecoveryCodesData!.startOptInMfaResetRecoveryCodesByAccountId!.state,
        },
      },
    })
      .then(() => {
        setShowReplaceRecoveryCodesDialog(false);
        refetchAccountData();
        toast.success(t('security.multi-factor-authentication.replaced-success'));
      })
      .catch(() => console.error(GRAPHQL_API_ERROR_MESSAGES.completeOptInMfaResetRecoveryCodesByAccountId));
  };

  const handleResetMFA = () => {
    resetOptInMfaStateByAccountId({
      variables: {
        input: {
          accountId: account.id,
        },
      },
    })
      .then(() => {
        return refetchAccountData();
      })
      .then(() => {
        resetMfaSetupState();
      });
  };

  return (
    <>
      <div className="xlg-flex flex-center justify-between w100 py2" data-testid="mfa-opted-in-state">
        <Alert
          data-testid="mfa-opted-in-state-info"
          kind="success"
          errorMessage={t('security.multi-factor-authentication.enabled-message')}
          classes="mb0"
        ></Alert>
      </div>

      {/* Registered Factors */}

      <div className="br-8 p3 border-light w100" data-testid="registered-authentication-methods-section">
        <div className="flex flex-center justify-between flex-wrap mb2">
          <h3 className="m0">{t('security.multi-factor-authentication.active-methods')}</h3>
          <div className="pill pill-success">{t('security.multi-factor-authentication.used')}</div>
        </div>
        <MFARegisteredAuthenticationFactorList
          factors={account?.mfaOptIn?.registeredFactors?.factors || []}
          factorDisabled={factor => factorToggled(factor, false)}
        />
        {deleteOptInMfaFactorError && (
          <Alert
            kind="danger"
            errorMessage={t(GRAPHQL_API_ERROR_MESSAGES.deleteOptInMfaFactorFromAccountByAccountId)}
          />
        )}
      </div>

      {/* Registrable Factors */}

      <UiConfigIf
        resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA]}
        allowedOperations={[UI_CONFIG_OPERATIONS.MFA_ADD_FACTOR]}
      >
        <div className="br-8 p3 border-light w100 mt3" data-testid="registrable-authentication-methods-section">
          <div className="flex flex-center justify-between flex-wrap mb2">
            <h3 className="m0">{t('security.multi-factor-authentication.available-methods')}</h3>
            <div className="pill pill-grey">{t('security.multi-factor-authentication.not-used')}</div>
          </div>
          <MFARegistrableAuthenticationFactorList
            account={account!}
            factors={account?.mfaOptIn?.registrableFactors?.factors || []}
            factorToggled={factorToggled}
            factorDeviceAdded={factorDeviceAdded}
            factorDeviceVerified={factorDeviceVerified}
          />
        </div>
      </UiConfigIf>

      {/* Recovery Codes */}

      {!!optInMfaData.recoveryCodeBatch && (
        <div className="br-8 p3 border-light w100 mt3">
          <UiConfigIf
            resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA]}
            allowedOperations={[UI_CONFIG_OPERATIONS.MFA_RESET_RECOVERY_CODES]}
          >
            <div className="sm-flex flex-center justify-between">
              <h2 className="mt0">{t('security.multi-factor-authentication.recovery-codes')}</h2>
              <Button
                title={t('security.multi-factor-authentication.replace')}
                onClick={startResetRecoveryCodes}
                className="button button-small button-danger-outline"
                data-testid="recovery-codes-reset-button"
              />
            </div>
          </UiConfigIf>

          <div className="flex flex-center flex-gap-1" data-testid="recovery-codes">
            <IconGeneralCheckmarkCircled width={36} height={36} color="#57c75c" />
            {t('security.multi-factor-authentication.codes-available', {
              codesAvailable: numberOfAvailableRecoveryCodes + '/' + optInMfaData.recoveryCodeBatch?.codes.length,
            })}
          </div>
        </div>
      )}

      {/* Reset */}
      <UiConfigIf
        resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA]}
        allowedOperations={[UI_CONFIG_OPERATIONS.MFA_RESET]}
      >
        <div className="br-8 p3 border-light w100 mt3">
          <h2 className="mt0">{t('security.multi-factor-authentication.reset-heading')}</h2>
          <p>{t('security.multi-factor-authentication.reset-warning')}</p>

          <button
            className="button button-small button-danger-outline"
            onClick={() => setShowResetMFADialog(true)}
            data-testid="reset-mfa-button"
          >
            {t('security.multi-factor-authentication.reset')}
          </button>
        </div>
      </UiConfigIf>
      {showReplaceRecoveryCodesDialog && (
        <Dialog
          isOpen={true}
          title={t('security.multi-factor-authentication.replace-recovery-title')}
          showActionButton={true}
          showCancelButton={true}
          actionButtonText={t('security.multi-factor-authentication.replace')}
          cancelButtonText={t('cancel')}
          actionButtonCallback={() => completeResetRecoveryCodes()}
          closeCallback={() => setShowReplaceRecoveryCodesDialog(false)}
        >
          <MFARecoveryCodes codes={recoveryCodes} />
        </Dialog>
      )}
      {showResetMFADialog && (
        <Dialog
          isOpen={true}
          title={t('security.multi-factor-authentication.reset')}
          showActionButton={true}
          showCancelButton={true}
          actionButtonText={t('security.multi-factor-authentication.reset-short')}
          cancelButtonText={t('cancel')}
          actionButtonCallback={() => {
            handleResetMFA();
          }}
          closeCallback={() => setShowResetMFADialog(false)}
        >
          <h2>{t('security.multi-factor-authentication.reset')}</h2>
          <p>{t('security.multi-factor-authentication.reset-warning-extended')}</p>
          {resetOptInMfaStateError && (
            <Alert kind="danger" errorMessage={t(GRAPHQL_API_ERROR_MESSAGES.resetOptInMfaStateByAccountId)} />
          )}
        </Dialog>
      )}
    </>
  );
};

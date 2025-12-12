/*
 * Copyright (C) 2024 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { IconActionMultiFactor } from '@curity/ui-kit-icons';
import { Button, PageHeader, Spinner, toUiKitTranslation } from '@curity/ui-kit-component-library';
import { useAuth } from '@auth/data-access/AuthProvider';
import { GRAPHQL_API } from '@shared/data-access/API/GRAPHQL_API.ts';
import { useMutation, useQuery } from '@apollo/client';
import { MFAOptedInState } from '@/pages/security/MFA/feature/MFA-states/MFAOptedInState';
import { MFAOptedOutState } from '@/pages/security/MFA/feature/MFA-states/MFAOptedOutState';
import { useTranslation } from 'react-i18next';
import { MFAInitialState } from '@/pages/security/MFA/feature/MFA-states/MFAInitialState';
import { useEffect, useState } from 'react';
import {
  OptinMfa,
  RegisteredFactor,
  RegistrableFactor,
  StartOptInMfaSetupByAccountIdMutation,
  StartOptInMfaSetupByAccountIdPayload,
  StringMultiValuedValue,
} from '@/shared/data-access/API';
import { EmailVerificationDialog } from '@/pages/security/email/EmailVerificationDialog';
import { PhoneNumberVerificationDialog } from '@/pages/security/phone/PhoneNumberVerificationDialog';
import { NewTotpDeviceDialog } from '@/pages/security/NewTotpDeviceDialog';
import { MFARecoveryCodes } from '@/pages/security/MFA/ui/MFARecoveryCodes';
import { MFASetupInitialState } from './feature/MFA-states/MFASetupInitialState';
import { MFARegistrableAuthenticationFactorList } from '@/pages/security/MFA/feature/MFARegistrableAuthenticationFactorList';
import { ProgressSteps } from '@/shared/ui/progress-steps/ProgressSteps';
import { NewPasskeyDialog } from '../Passkeys/NewPasskeyDialog';
import { GRAPHQL_API_ERROR_MESSAGES } from '@/shared/data-access/API/GRAPHQL_API_ERROR_MESSAGES';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';

export enum MFA_REGISTRABLE_FACTORS {
  EMAIL = 'email',
  PHONE = 'sms',
  TOTP = 'totp',
  PASSKEYS = 'passkeys',
}

export enum MFA_STATES {
  INITIAL = 'INITIAL',
  SETUP_INITIAL = 'SETUP_INITIAL',
  SETUP_CONFIRMATION = 'SETUP_CONFIRMATION',
  OPTED_IN = 'OPTED_IN',
  OPTED_OUT = 'OPTED_OUT',
}

export const MFA = () => {
  const { session } = useAuth();
  const { t } = useTranslation();
  const uiKitT = toUiKitTranslation(t);
  const [currentMFAState, setCurrentMFAState] = useState(MFA_STATES.INITIAL);
  const {
    data: getAccountByUserNameData,
    refetch: refetchAccount,
    loading,
  } = useQuery(GRAPHQL_API.USER_MANAGEMENT.QUERIES.getAccountByUserName, {
    variables: { userName: session?.idTokenClaims?.sub },
  });
  const [MFASetupFactors, setMFASetupFactors] = useState<RegistrableFactor[]>([]);
  const [showCreateDeviceDialog, setShowCreateDeviceDialog] = useState<MFA_REGISTRABLE_FACTORS | undefined>(undefined);
  const [deviceToVerify, setDeviceToVerify] = useState<StringMultiValuedValue | undefined>(undefined);
  const [addOptInMfaFactorToAccountByAccountId] = useMutation(
    GRAPHQL_API.USER_MANAGEMENT.MUTATIONS.addOptInMfaFactorToAccountByAccountId
  );
  const [startOptInMfaSetupByAccountId, { data: startOptInMfaSetupData, reset: resetStartOptInMfaSetupData }] =
    useMutation(GRAPHQL_API.USER_MANAGEMENT.MUTATIONS.startOptInMfaSetupByAccountId);
  const [completeOptInMfaSetupByAccountId, { data: completeOptInMfaSetupData }] = useMutation(
    GRAPHQL_API.USER_MANAGEMENT.MUTATIONS.completeOptInMfaSetupByAccountId
  );
  const [deleteOptInMfaFactorFromAccountByAccountId, { error: deleteOptInMfaFactorError }] = useMutation(
    GRAPHQL_API.USER_MANAGEMENT.MUTATIONS.deleteOptInMfaFactorFromAccountByAccountId
  );

  const accountData = getAccountByUserNameData?.accountByUserName;
  const accountId = accountData?.id;
  const optInMfaData = accountData?.mfaOptIn;

  useEffect(() => {
    const MFAStateUpdate: MFA_STATES = getCurrentMFAState(currentMFAState, optInMfaData, startOptInMfaSetupData);

    // TODO IS-10689
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setCurrentMFAState(MFAStateUpdate);
  }, [getAccountByUserNameData, startOptInMfaSetupData, completeOptInMfaSetupData]);

  if (!accountId || loading) {
    return <Spinner width={48} height={48} mode="fullscreen" />;
  }

  const startMFASetup = (authFactors: RegistrableFactor[]) => {
    startOptInMfaSetupByAccountId({
      variables: {
        input: {
          accountId,
          factors: authFactors.map(({ acr }) => ({ acr })),
        },
      },
    })
      .then(() => refetchAccount())
      .catch(() => console.error(GRAPHQL_API_ERROR_MESSAGES.startOptInMfaSetupByAccountId));
  };

  const completeMFASetup = (startMFASetupState: StartOptInMfaSetupByAccountIdPayload['state']) => {
    if (startOptInMfaSetupData) {
      completeOptInMfaSetupByAccountId({
        variables: {
          input: {
            accountId,
            state: startMFASetupState,
          },
        },
      })
        .then(() => refetchAccount())
        .catch(() => console.error(GRAPHQL_API_ERROR_MESSAGES.completeOptInMfaSetupByAccountId));
    }
  };

  const addAuthFactorToAccount = (authFactor: RegistrableFactor) => {
    addOptInMfaFactorToAccountByAccountId({
      variables: {
        input: {
          accountId,
          acr: authFactor.acr,
        },
      },
    })
      .then(() => refetchAccount())
      .catch(() => console.error(GRAPHQL_API_ERROR_MESSAGES.addOptInMfaFactorToAccountByAccountId));
  };

  const deleteAuthFactorFromAccount = (authFactor: RegisteredFactor) => {
    deleteOptInMfaFactorFromAccountByAccountId({
      variables: {
        input: {
          accountId,
          acr: authFactor.acr,
        },
      },
    })
      .then(() => refetchAccount())
      .catch(() => console.error(GRAPHQL_API_ERROR_MESSAGES.deleteOptInMfaFactorFromAccountByAccountId));
  };

  const addAuthFactorDevice = (authFactor: RegistrableFactor) => {
    setShowCreateDeviceDialog(authFactor.type as MFA_REGISTRABLE_FACTORS);
  };

  const verifyAuthFactorDevice = (authFactor: RegistrableFactor, deviceToVerify: StringMultiValuedValue) => {
    setDeviceToVerify(deviceToVerify);
    setShowCreateDeviceDialog(authFactor.type as MFA_REGISTRABLE_FACTORS);
  };

  const manageAuthFactorToggle = (authFactor: RegistrableFactor | RegisteredFactor, isRegistered: boolean) => {
    authFactor = authFactor as RegistrableFactor;

    if (currentMFAState === MFA_STATES.SETUP_INITIAL) {
      setMFASetupFactors(MFASetupFactors =>
        isRegistered
          ? [...MFASetupFactors, authFactor]
          : MFASetupFactors.filter(MFASetupFactor => MFASetupFactor.type !== authFactor.type)
      );
    } else {
      if (isRegistered) {
        addAuthFactorToAccount(authFactor);
      } else {
        deleteAuthFactorFromAccount(authFactor as RegisteredFactor);
      }
    }
  };

  const resetCreateDeviceDialog = () => {
    setShowCreateDeviceDialog(undefined);
    setDeviceToVerify(undefined);
  };

  const turnOnMFAButtonElement = (
    <UiConfigIf
      resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA]}
      allowedOperations={[UI_CONFIG_OPERATIONS.MFA_SETUP]}
    >
      <Button
        title={t('security.multi-factor-authentication.turn-on')}
        onClick={() => setCurrentMFAState(MFA_STATES.SETUP_INITIAL)}
        className="button-small button-primary"
        data-testid="mfa-start-setup-button"
      />
    </UiConfigIf>
  );

  let MFAStateContentToDisplay = null;

  if (currentMFAState === MFA_STATES.INITIAL) {
    if (optInMfaData !== null) {
      MFAStateContentToDisplay = (
        <>
          <ProgressSteps currentStep={1} />
          <MFAInitialState>{turnOnMFAButtonElement}</MFAInitialState>
        </>
      );
    } else {
      MFAStateContentToDisplay = (
        <>
          <MFAInitialState errorMessageKey={'security.multi-factor-authentication.not-used-no-optin-warning'} />
        </>
      );
    }
  } else if (currentMFAState === MFA_STATES.SETUP_INITIAL) {
    MFAStateContentToDisplay = (
      <>
        <ProgressSteps currentStep={2} />
        <MFASetupInitialState
          MFASetupFactors={MFASetupFactors}
          accountData={accountData}
          manageAuthFactorToggle={manageAuthFactorToggle}
          factorDeviceAdded={addAuthFactorDevice}
          factorDeviceVerified={verifyAuthFactorDevice}
          startMFASetup={startMFASetup}
        />
      </>
    );
  } else if (currentMFAState === MFA_STATES.SETUP_CONFIRMATION) {
    const MFASetupRecoveryCodes = startOptInMfaSetupData?.startOptInMfaSetupByAccountId?.recoveryCodes?.map(
      code => code.value
    );

    MFAStateContentToDisplay = (
      <>
        <ProgressSteps currentStep={3} />
        <div className="flex flex-column flex-gap-2">
          <h3 className="m0">{t('security.multi-factor-authentication.methods')}</h3>
          <p>{t('security.multi-factor-authentication.enable-requirement')}</p>
          <MFARegistrableAuthenticationFactorList
            account={accountData!}
            factors={MFASetupFactors}
            isDisplayMode={true}
          />
          {MFASetupRecoveryCodes && <MFARecoveryCodes codes={MFASetupRecoveryCodes} />}
          <div className="flex justify-center flex-gap-2">
            <Button
              title={t('cancel')}
              onClick={() => {
                resetStartOptInMfaSetupData();
                setCurrentMFAState(MFA_STATES.SETUP_INITIAL);
              }}
              className="button-small button-primary-outline"
            />
            <Button
              title={t('confirm')}
              onClick={() => completeMFASetup(startOptInMfaSetupData!.startOptInMfaSetupByAccountId!.state!)}
              className="button-small button-primary"
              data-testid="mfa-complete-setup-button"
            />
          </div>
        </div>
      </>
    );
  } else if (currentMFAState === MFA_STATES.OPTED_IN && optInMfaData !== null) {
    MFAStateContentToDisplay = (
      <MFAOptedInState
        optInMfaData={optInMfaData!}
        account={accountData}
        refetchAccountData={refetchAccount}
        resetMfaSetupState={() => {
          resetStartOptInMfaSetupData();
          setMFASetupFactors([]);
        }}
        factorToggled={manageAuthFactorToggle}
        factorDeviceAdded={addAuthFactorDevice}
        factorDeviceVerified={verifyAuthFactorDevice}
        deleteOptInMfaFactorError={deleteOptInMfaFactorError}
      />
    );
  } else if (currentMFAState === MFA_STATES.OPTED_OUT) {
    MFAStateContentToDisplay = (
      <MFAOptedOutState optOutAt={optInMfaData!.preferences!.optOutAt}>{turnOnMFAButtonElement}</MFAOptedOutState>
    );
  }

  return (
    <>
      <PageHeader
        t={uiKitT}
        title={t('security.multi-factor-authentication.title')}
        description={t('security.multi-factor-authentication.description')}
        icon={<IconActionMultiFactor width={128} height={128} />}
        data-testid="mfa-page-header"
      />
      {MFAStateContentToDisplay}
      {showCreateDeviceDialog === MFA_REGISTRABLE_FACTORS.EMAIL && (
        <EmailVerificationDialog
          accountId={accountId}
          emailForOtpVerification={deviceToVerify?.value ?? null}
          setEmailAsPrimaryAfterVerification={true}
          onEmailListChange={() => {
            refetchAccount();
            resetCreateDeviceDialog();
          }}
          onClose={() => resetCreateDeviceDialog()}
        />
      )}
      {showCreateDeviceDialog === MFA_REGISTRABLE_FACTORS.PHONE && (
        <PhoneNumberVerificationDialog
          accountId={accountId}
          phoneNumberForOtpVerification={deviceToVerify?.value}
          setPhoneNumberAsPrimaryAfterVerification={true}
          onPhoneNumberListChange={refetchAccount}
          onClose={() => resetCreateDeviceDialog()}
        />
      )}
      {showCreateDeviceDialog === MFA_REGISTRABLE_FACTORS.TOTP && (
        <NewTotpDeviceDialog
          isOpen={showCreateDeviceDialog === MFA_REGISTRABLE_FACTORS.TOTP}
          accountId={accountId}
          onClose={() => {
            resetCreateDeviceDialog();
            refetchAccount();
          }}
        />
      )}
      {showCreateDeviceDialog === MFA_REGISTRABLE_FACTORS.PASSKEYS && (
        <NewPasskeyDialog
          isOpen={showCreateDeviceDialog === MFA_REGISTRABLE_FACTORS.PASSKEYS}
          accountId={accountId}
          refetchAccount={refetchAccount}
          onClose={() => {
            resetCreateDeviceDialog();
            refetchAccount();
          }}
        />
      )}
    </>
  );
};

const getCurrentMFAState = (
  currentMFAState: MFA_STATES,
  optInMfaData?: OptinMfa | null,
  startOptInMfaSetupData?: StartOptInMfaSetupByAccountIdMutation | null
): MFA_STATES => {
  const isSettingUpMFA =
    currentMFAState === MFA_STATES.SETUP_INITIAL || currentMFAState === MFA_STATES.SETUP_CONFIRMATION;

  if (optInMfaData) {
    if (optInMfaData.preferences?.optOutAt && !isSettingUpMFA) {
      return MFA_STATES.OPTED_OUT;
    } else if (optInMfaData.registeredFactors?.factors?.length) {
      return MFA_STATES.OPTED_IN;
    } else {
      const isMFASetupConfirmationState = !!startOptInMfaSetupData?.startOptInMfaSetupByAccountId;

      if (isMFASetupConfirmationState) {
        return MFA_STATES.SETUP_CONFIRMATION;
      } else if (currentMFAState === MFA_STATES.SETUP_INITIAL) {
        return MFA_STATES.SETUP_INITIAL;
      } else {
        return MFA_STATES.INITIAL;
      }
    }
  } else {
    return MFA_STATES.INITIAL;
  }
};

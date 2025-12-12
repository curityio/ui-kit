/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { Dialog } from '@/shared/ui/dialog/Dialog';
import { Spinner, SuccessCheckmark } from '@curity/ui-kit-component-library';
import { useMutation } from '@apollo/client';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OtpInput } from '@/shared/ui/OtpInput';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { GRAPHQL_API_ERROR_MESSAGES } from '@/shared/data-access/API/GRAPHQL_API_ERROR_MESSAGES';

type Props = {
  accountId: string;
  onClose: () => void;
  emailForOtpVerification: string | null;
  setEmailAsPrimaryAfterVerification?: boolean;
  onEmailListChange?: () => void;
};
export const EmailVerificationDialog = ({
  accountId,
  onClose,
  emailForOtpVerification = '',
  setEmailAsPrimaryAfterVerification,
  onEmailListChange,
}: Props) => {
  const { t } = useTranslation();
  const [emailVerificationState, setEmailVerificationState] = useState('');
  const [otpDigits, setOtpDigits] = useState('');
  const [startVerifyEmailAddressByAccountId, { data: verificationStartData, loading: verificationStartLoading }] =
    useMutation(USER_MANAGEMENT_API.MUTATIONS.startVerifyEmailAddressByAccountId);
  const [
    completeVerifyEmailAddressByAccountId,
    { data: verificationCompleteData, loading: verificationCompleteLoading, error: verificationCompleteError },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.completeVerifyEmailAddressByAccountId);
  const [updatePrimaryEmailAddressByAccountId] = useMutation(
    USER_MANAGEMENT_API.MUTATIONS.updatePrimaryEmailAddressByAccountId
  );
  const hasTriggeredStartVerification = useRef(false);

  const isStartVerificationLoading = verificationStartLoading;
  const isCompleteVerificationLoading = verificationCompleteLoading;
  const isDialogLoading = isStartVerificationLoading || isCompleteVerificationLoading;
  const isDialogEmailVerificationStep = !!verificationStartData && !verificationCompleteData;
  const isDialogEmailVerificationSuccessStep = !!verificationCompleteData;

  useEffect(() => {
    if (emailForOtpVerification && !hasTriggeredStartVerification.current) {
      hasTriggeredStartVerification.current = true;
      startVerifyEmailAddressByAccountId({
        variables: {
          input: {
            accountId,
            emailAddress: emailForOtpVerification,
          },
        },
      })
        .then(response => {
          const state = response?.data?.startVerifyEmailAddressByAccountId?.state;
          if (state) setEmailVerificationState(state);
        })
        .catch(() => console.error(GRAPHQL_API_ERROR_MESSAGES.startVerifyEmailAddressByAccountId));
    }
  }, [accountId, emailForOtpVerification, startVerifyEmailAddressByAccountId]);

  const dialogConfig = {
    otp: {
      subtitle: t('account.email.check-inbox'),
      actionText: t('account.verify-code'),
    },
    loading: {
      subtitle: t('account.processing'),
      actionText: t('account.verify-code'),
    },
    success: {
      subtitle: t('account.email.verified'),
      actionText: t('done'),
    },
  } as const;

  const getDialogStepKey = (): keyof typeof dialogConfig => {
    if (isDialogEmailVerificationStep) return 'otp';
    if (isDialogLoading) return 'loading';
    if (isDialogEmailVerificationSuccessStep) return 'success';
    return 'loading';
  };

  const getDialogSubTitle = () => dialogConfig[getDialogStepKey()].subtitle;
  const getActionButtonText = () => dialogConfig[getDialogStepKey()].actionText;

  const handleActionButtonClick = () => {
    if (isDialogEmailVerificationSuccessStep) {
      onClose();
      return;
    }
    if (isDialogEmailVerificationStep) {
      verifyOtpCode();
      return;
    }
  };

  const verifyOtpCode = async () => {
    const code = otpDigits;
    await completeVerifyEmailAddressByAccountId({
      variables: {
        input: {
          accountId,
          otp: code,
          state: emailVerificationState,
        },
      },
    }).catch(() => console.error(GRAPHQL_API_ERROR_MESSAGES.completeVerifyEmailAddressByAccountId));

    if (emailForOtpVerification && setEmailAsPrimaryAfterVerification) {
      await updatePrimaryEmailAddressByAccountId({
        variables: {
          input: {
            accountId,
            newPrimaryEmailAddress: emailForOtpVerification,
          },
        },
      });
    }

    onEmailListChange?.();
  };

  const isActionButtonDisabled = (): boolean => {
    if (isDialogEmailVerificationStep) {
      return otpDigits.length !== 6;
    }
    if (isDialogLoading) {
      return true;
    }
    return false;
  };

  return (
    <Dialog
      isOpen={true}
      title={t('account.email.verification')}
      subTitle={getDialogSubTitle()}
      showActionButton
      closeDialogOnActionButtonClick={false}
      isActionButtonDisabled={isActionButtonDisabled()}
      actionButtonText={getActionButtonText()}
      actionButtonCallback={handleActionButtonClick}
      closeCallback={onClose}
    >
      {isDialogLoading && (
        <div className="flex flex-column flex-center flex-gap-2">
          <Spinner width={48} height={48} />
          <div> {isStartVerificationLoading ? t('account.sending-code') : t('account.verifying-code')}</div>
        </div>
      )}

      {isDialogEmailVerificationStep && (
        <>
          <div className="flex flex-column flex-center mb0">
            <p className="mt0 mb3" data-testid="otp-description">
              {t('account.email.code-sent')}
            </p>
            <OtpInput
              errorMessage={
                verificationCompleteError && GRAPHQL_API_ERROR_MESSAGES.completeVerifyEmailAddressByAccountId
              }
              onChange={setOtpDigits}
            />
          </div>
        </>
      )}

      {isDialogEmailVerificationSuccessStep && (
        <div className="p3 flex flex-column flex-center">
          <SuccessCheckmark />
          <p className="mb0" data-testid="email-verification-success-message">
            {t('account.email.verified-success')}
          </p>
        </div>
      )}
    </Dialog>
  );
};

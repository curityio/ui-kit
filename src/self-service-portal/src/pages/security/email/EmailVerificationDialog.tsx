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

import { Alert } from '@/shared/ui/Alert';
import { Dialog } from '@/shared/ui/dialog/Dialog';
import { Spinner } from '@/shared/ui/Spinner';
import { SuccessCheckmark } from '@/shared/ui/SuccessCheckmark';
import { useMutation } from '@apollo/client';
import { IconGeneralCheckmarkCircled } from '@icons';
import React, { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OtpInput } from '@/shared/ui/OtpInput';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { Input } from '@/shared/ui/input/Input';
import { GRAPHQL_API_ERROR_MESSAGES } from '@/shared/data-access/API/GRAPHQL_API_ERROR_MESSAGES';

type Props = {
  accountId: string;
  onClose: () => void;
  emailForOtpVerification?: string | null;
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
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState(emailForOtpVerification ?? '');
  const [emailVerificationState, setEmailVerificationState] = useState('');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [touched, setTouched] = useState(false);
  const [forceEmailStep, setForceEmailStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState('');
  const [
    startVerifyEmailAddressByAccountId,
    {
      data: verificationStartData,
      loading: verificationStartLoading,
      error: verificationStartError,
      reset: restVerificationStartError,
    },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.startVerifyEmailAddressByAccountId);
  const [
    completeVerifyEmailAddressByAccountId,
    {
      data: verificationCompleteData,
      loading: verificationCompleteLoading,
      error: verificationCompleteError,
      reset: restVerificationCompleteError,
    },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.completeVerifyEmailAddressByAccountId);
  const [updatePrimaryEmailAddressByAccountId] = useMutation(
    USER_MANAGEMENT_API.MUTATIONS.updatePrimaryEmailAddressByAccountId
  );
  const hasTriggeredStartVerification = useRef(false);

  const isStartVerificationLoading = verificationStartLoading;
  const isCompleteVerificationLoading = verificationCompleteLoading;
  const isDialogLoading = isStartVerificationLoading || isCompleteVerificationLoading;
  const isDialogEmailStep = !emailForOtpVerification && (forceEmailStep || !verificationStartData);
  const isDialogEmailVerificationStep = !forceEmailStep && !!verificationStartData && !verificationCompleteData;
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

  useEffect(() => {
    if (isDialogEmailStep) {
      inputRef.current?.focus();
    }
  }, [isDialogEmailStep]);

  const dialogConfig = {
    email: {
      subtitle: t('account.email.verify'),
      actionText: t('account.send-code'),
      cancelText: t('cancel'),
    },
    otp: {
      subtitle: t('account.email.check-inbox'),
      actionText: t('account.verify-code'),
      cancelText: '',
    },
    loading: {
      subtitle: t('account.processing'),
      actionText: t('account.verify-code'),
      cancelText: '',
    },
    success: {
      subtitle: t('account.email.verified'),
      actionText: t('done'),
      cancelText: '',
    },
  } as const;

  const getDialogStepKey = (): keyof typeof dialogConfig => {
    if (isDialogEmailStep) return 'email';
    if (isDialogEmailVerificationStep) return 'otp';
    if (isDialogLoading) return 'loading';
    if (isDialogEmailVerificationSuccessStep) return 'success';
    return 'email';
  };

  const getDialogSubTitle = () => dialogConfig[getDialogStepKey()].subtitle;
  const getActionButtonText = () => dialogConfig[getDialogStepKey()].actionText;
  const getCancelButtonText = () => dialogConfig[getDialogStepKey()].cancelText;

  const handleEmailInputChange = (e: React.FormEvent<HTMLInputElement>) => {
    const newEmail = (e.target as HTMLInputElement).value;
    setEmail(newEmail);
    validateEmail(newEmail);
  };

  const handleActionButtonClick = () => {
    if (isDialogEmailVerificationSuccessStep) {
      onClose();
      return;
    }
    if (isDialogEmailVerificationStep) {
      verifyOtpCode();
      return;
    }
    submitEmailAddress();
  };

  const cancelDialogOrGoBackToEmailStep = () => {
    if (isDialogEmailVerificationStep) {
      resetDialog();
      return;
    }
    onClose();
  };

  const submitEmailAddress = async () => {
    setForceEmailStep(false);
    await startVerifyEmailAddressByAccountId({
      variables: {
        input: {
          accountId,
          emailAddress: email,
        },
      },
    })
      .then(response => {
        const state = response?.data?.startVerifyEmailAddressByAccountId?.state;
        if (state) setEmailVerificationState(state);
      })
      .catch(() => console.error(GRAPHQL_API_ERROR_MESSAGES.startVerifyEmailAddressByAccountId));
    onEmailListChange?.();
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

  const resetDialog = () => {
    setEmail('');
    setForceEmailStep(true);
    setIsEmailValid(false);
    setTouched(false);
    restVerificationStartError();
    restVerificationCompleteError();
  };

  const isActionButtonDisabled = (): boolean => {
    if (isDialogEmailStep) {
      return !isEmailValid;
    }
    if (isDialogEmailVerificationStep) {
      return otpDigits.length !== 6;
    }
    if (isDialogLoading) {
      return true;
    }
    return false;
  };

  const validateEmail = (email: string): void => {
    if (!isEmailFormatValid(email.trim())) {
      setIsEmailValid(false);
    } else {
      setIsEmailValid(true);
    }
  };

  const isEmailFormatValid = (email: string): boolean => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim());

  return (
    <Dialog
      isOpen={true}
      title={t('account.email.verification')}
      subTitle={getDialogSubTitle()}
      showActionButton
      showCancelButton={isDialogEmailStep}
      closeDialogOnActionButtonClick={false}
      closeDialogOnCancelButtonClick={false}
      isActionButtonDisabled={isActionButtonDisabled()}
      actionButtonText={getActionButtonText()}
      cancelButtonText={getCancelButtonText()}
      actionButtonCallback={handleActionButtonClick}
      cancelButtonCallback={cancelDialogOrGoBackToEmailStep}
      closeCallback={onClose}
    >
      {isDialogEmailStep && (
        <>
          <p>{t('account.email.info')}</p>
          <div className="left-align">
            <label htmlFor="newemail" className="label inline-flex flex-center flex-gap-1">
              {t('account.email.email-address')}
              {isEmailValid && (
                <IconGeneralCheckmarkCircled width={24} height={24} style={{ color: 'var(--color-success)' }} />
              )}
            </label>
            <Input
              ref={inputRef}
              id="newemail"
              type="email"
              inputClassName="w100"
              placeholder="name@example.com"
              autoFocus
              value={email}
              onInput={e => {
                setTouched(true);
                handleEmailInputChange(e);
              }}
              data-testid="email-input"
            />
            {!isEmailValid && touched && (
              <Alert
                kind="danger"
                classes="mt2"
                errorMessage={t('account.email.invalid')}
                data-testid="email-validation-error"
              />
            )}
            {verificationStartError && (
              <Alert
                kind="danger"
                errorMessage={t(GRAPHQL_API_ERROR_MESSAGES.startVerifyEmailAddressByAccountId)}
                classes="mt2"
                data-testid="email-start-verification-error"
              />
            )}
          </div>
        </>
      )}

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

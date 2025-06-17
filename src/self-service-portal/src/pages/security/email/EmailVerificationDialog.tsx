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
  emailForOtpVerification?: string | null;
  onClose: () => void;
  onEmailListChange: () => void;
};
export const EmailVerificationDialog = ({
  accountId,
  emailForOtpVerification = '',
  onClose,
  onEmailListChange,
}: Props) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [email, setEmail] = useState(emailForOtpVerification ?? '');
  const [isEmailValid, setIsEmailValid] = useState(false);
  const [touched, setTouched] = useState(false);
  const [forceEmailStep, setForceEmailStep] = useState(false);
  const [
    startVerifyEmailAddress,
    {
      data: verificationStartData,
      loading: verificationStartLoading,
      error: verificationStartError,
      reset: restVerificationStartError,
    },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.startVerifyEmailAddress);
  const [
    completeVerifyEmailAddress,
    {
      data: verificationCompleteData,
      loading: verificationCompleteLoading,
      error: verificationCompleteError,
      reset: restVerificationCompleteError,
    },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.completeVerifyEmailAddress);
  const [otpDigits, setOtpDigits] = useState('');

  const isStartVerificationLoading = verificationStartLoading;
  const isCompleteVerificationLoading = verificationCompleteLoading;
  const isDialogLoading = isStartVerificationLoading || isCompleteVerificationLoading;
  const isDialogEmailStep = forceEmailStep || !verificationStartData;
  const isDialogEmailVerificationStep = !forceEmailStep && !!verificationStartData && !verificationCompleteData;
  const isDialogEmailVerificationSuccessStep = !!verificationCompleteData;

  useEffect(() => {
    if (emailForOtpVerification) {
      startVerifyEmailAddress({
        variables: {
          input: {
            accountId,
            emailAddress: emailForOtpVerification,
          },
        },
      });
    }
  }, [accountId, emailForOtpVerification, startVerifyEmailAddress]);

  useEffect(() => {
    if (isDialogEmailStep) {
      inputRef.current?.focus();
    }
  }, [isDialogEmailStep]);

  const dialogConfig = {
    email: {
      title: t('New Email Address'),
      actionText: t('Send Verification Code'),
      cancelText: t('Cancel'),
    },
    otp: {
      title: t('Check your inbox'),
      actionText: t('Verify Code'),
      cancelText: t('Add a Different Email'),
    },
    loading: {
      title: t('Processing'),
      actionText: t('Verify Code'),
      cancelText: t('Cancel'),
    },
    success: {
      title: t('Email Address Verified'),
      actionText: t('Done'),
      cancelText: t('Close'),
    },
  } as const;

  const getDialogStepKey = (): keyof typeof dialogConfig => {
    if (isDialogEmailStep) return 'email';
    if (isDialogEmailVerificationStep) return 'otp';
    if (isDialogLoading) return 'loading';
    if (isDialogEmailVerificationSuccessStep) return 'success';
    return 'email';
  };

  const getDialogTitle = () => dialogConfig[getDialogStepKey()].title;
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
    await startVerifyEmailAddress({
      variables: {
        input: {
          accountId,
          emailAddress: email,
        },
      },
    });
    onEmailListChange();
  };

  const verifyOtpCode = async () => {
    const code = otpDigits;
    await completeVerifyEmailAddress({
      variables: {
        input: {
          accountId,
          otp: code,
        },
      },
    });
    onEmailListChange();
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
      title={t('New Email Address')}
      subTitle={getDialogTitle()}
      showActionButton
      showCancelButton
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
          <p>{t("We'll send a verification code to this email address")}</p>
          <div className="left-align">
            <label htmlFor="newemail" className="label inline-flex flex-center flex-gap-1">
              {t('Email address')}
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
                errorMessage={t('Please enter a valid email address')}
                data-testid="email-validation-error"
              />
            )}
            {verificationStartError && (
              <Alert
                kind="danger"
                errorMessage={t(GRAPHQL_API_ERROR_MESSAGES.startVerifyEmailAddress)}
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
          <div> {isStartVerificationLoading ? t('Sending verification code...') : t('Verifying code...')}</div>
        </div>
      )}

      {isDialogEmailVerificationStep && (
        <>
          <div className="flex flex-column flex-center mb0">
            <p className="mt0 mb3" data-testid="otp-description">
              {verificationCompleteError
                ? t(GRAPHQL_API_ERROR_MESSAGES.completeVerifyEmailAddress)
                : t(
                    'We emailed you a 6-digit code sent to your email. Enter the code below to verify your email address.'
                  )}
            </p>
            <OtpInput
              errorMessage={verificationCompleteError && GRAPHQL_API_ERROR_MESSAGES.completeVerifyEmailAddress}
              onChange={setOtpDigits}
            />
          </div>
        </>
      )}

      {isDialogEmailVerificationSuccessStep && (
        <div className="p3 flex flex-column flex-center">
          <SuccessCheckmark />
          <p className="mb0" data-testid="email-verification-success-message">
            {t('Your new email address has been successfully verified')}
          </p>
        </div>
      )}
    </Dialog>
  );
};

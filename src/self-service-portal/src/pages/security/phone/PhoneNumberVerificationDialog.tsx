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
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OtpInput } from '../../../shared/ui/OtpInput';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { Input } from '@/shared/ui/input/Input';
import { GRAPHQL_API_ERROR_MESSAGES } from '@/shared/data-access/API/GRAPHQL_API_ERROR_MESSAGES';

type Props = {
  accountId: string;
  phoneNumberForOtpVerification?: string | null;
  onClose: () => void;
  onPhoneNumberListChange: () => void;
};
export const PhoneNumberVerificationDialog = ({
  accountId,
  phoneNumberForOtpVerification: phoneNumberForOtpVerification = '',
  onClose,
  onPhoneNumberListChange: onPhoneNumberListChange,
}: Props) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [phoneNumber, setPhoneNumber] = useState(phoneNumberForOtpVerification ?? '');
  const [forcePhoneNumberStep, setForcePhoneNumberStep] = useState(false);
  const [
    startVerifyPhoneNumber,
    {
      data: verificationStartData,
      loading: verificationStartLoading,
      error: verificationStartError,
      reset: restVerificationStartError,
    },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.startVerifyPhoneNumber);
  const [
    completeVerifyPhoneNumber,
    {
      data: verificationCompleteData,
      loading: verificationCompleteLoading,
      error: verificationCompleteError,
      reset: restVerificationCompleteError,
    },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.completeVerifyPhoneNumber);
  const [otpDigits, setOtpDigits] = useState('');

  const isStartVerificationLoading = verificationStartLoading;
  const isCompleteVerificationLoading = verificationCompleteLoading;
  const isDialogLoading = isStartVerificationLoading || isCompleteVerificationLoading;
  const isDialogPhoneNumberStep = forcePhoneNumberStep || !verificationStartData;
  const isDialogPhoneNumberVerificationStep =
    !forcePhoneNumberStep && !!verificationStartData && !verificationCompleteData;
  const isDialogPhoneNumberVerificationSuccessStep = !!verificationCompleteData;

  useEffect(() => {
    if (phoneNumberForOtpVerification) {
      startVerifyPhoneNumber({
        variables: {
          input: {
            accountId,
            phoneNumber: phoneNumberForOtpVerification,
          },
        },
      });
    }
  }, [accountId, phoneNumberForOtpVerification, startVerifyPhoneNumber]);

  useEffect(() => {
    if (isDialogPhoneNumberStep) {
      inputRef.current?.focus();
    }
  }, [isDialogPhoneNumberStep]);

  const dialogConfig = {
    phoneNumber: {
      title: t('New Phone Number'),
      actionText: t('Send Verification Code'),
      cancelText: t('Cancel'),
    },
    otp: {
      title: t('Check your phone'),
      actionText: t('Verify Code'),
      cancelText: t('Add a Different Phone Number'),
    },
    loading: {
      title: t('Processing'),
      actionText: t('Verify Code'),
      cancelText: t('Cancel'),
    },
    success: {
      title: t('Phone Number Verified'),
      actionText: t('Done'),
      cancelText: t('Close'),
    },
  } as const;

  const getDialogStepKey = (): keyof typeof dialogConfig => {
    if (isDialogPhoneNumberStep) return 'phoneNumber';
    if (isDialogPhoneNumberVerificationStep) return 'otp';
    if (isDialogLoading) return 'loading';
    if (isDialogPhoneNumberVerificationSuccessStep) return 'success';
    return 'phoneNumber';
  };

  const getDialogTitle = () => dialogConfig[getDialogStepKey()].title;
  const getActionButtonText = () => dialogConfig[getDialogStepKey()].actionText;
  const getCancelButtonText = () => dialogConfig[getDialogStepKey()].cancelText;

  const handleActionButtonClick = () => {
    if (isDialogPhoneNumberVerificationSuccessStep) {
      onClose();
      return;
    }
    if (isDialogPhoneNumberVerificationStep) {
      verifyOtpCode();
      return;
    }
    submitPhoneNumber();
  };

  const cancelDialogOrGoBackToPhoneNumberStep = () => {
    if (isDialogPhoneNumberVerificationStep) {
      resetDialog();
      return;
    }
    onClose();
  };

  const submitPhoneNumber = async () => {
    setForcePhoneNumberStep(false);
    await startVerifyPhoneNumber({
      variables: {
        input: {
          accountId,
          phoneNumber: phoneNumber,
        },
      },
    });
    onPhoneNumberListChange();
  };

  const verifyOtpCode = async () => {
    const code = otpDigits;
    await completeVerifyPhoneNumber({
      variables: {
        input: {
          accountId,
          otp: code,
        },
      },
    });
    onPhoneNumberListChange();
  };

  const resetDialog = () => {
    setPhoneNumber('');
    setForcePhoneNumberStep(true);
    restVerificationStartError();
    restVerificationCompleteError();
  };

  const isActionButtonDisabled = (): boolean => {
    if (isDialogPhoneNumberVerificationStep) {
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
      title={t('New Phone Number')}
      subTitle={getDialogTitle()}
      showActionButton
      showCancelButton
      closeDialogOnActionButtonClick={false}
      closeDialogOnCancelButtonClick={false}
      isActionButtonDisabled={isActionButtonDisabled()}
      actionButtonText={getActionButtonText()}
      cancelButtonText={getCancelButtonText()}
      actionButtonCallback={handleActionButtonClick}
      cancelButtonCallback={cancelDialogOrGoBackToPhoneNumberStep}
      closeCallback={onClose}
    >
      {isDialogPhoneNumberStep && (
        <>
          <p>{t("We'll send a verification code to this phone number")}</p>
          <div className="left-align">
            <label htmlFor="newphoneNumber" className="label inline-flex flex-center flex-gap-1">
              {t('Phone number')}
            </label>
            <Input
              ref={inputRef}
              id="newphoneNumber"
              type="tel"
              inputClassName="w100"
              autoFocus
              value={phoneNumber}
              onChange={event => setPhoneNumber(event.target.value)}
              data-testid="phone-number-input"
            />
            {verificationStartError && (
              <Alert
                kind="danger"
                errorMessage={t(GRAPHQL_API_ERROR_MESSAGES.startVerifyPhoneNumber)}
                classes="mt2"
                data-testid="phone-number-start-verification-error"
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

      {isDialogPhoneNumberVerificationStep && (
        <>
          <div className="flex flex-column flex-center mb0">
            <p className="mt0 mb3" data-testid="otp-description">
              {verificationCompleteError
                ? t(GRAPHQL_API_ERROR_MESSAGES.completeVerifyPhoneNumber)
                : t(
                    'We have send a 6-digit code to your phone number. Enter the code below to verify your phone number.'
                  )}
            </p>
            <OtpInput
              errorMessage={verificationCompleteError && GRAPHQL_API_ERROR_MESSAGES.completeVerifyPhoneNumber}
              onChange={setOtpDigits}
            />
          </div>
        </>
      )}

      {isDialogPhoneNumberVerificationSuccessStep && (
        <div className="p3 flex flex-column flex-center">
          <SuccessCheckmark />
          <p className="mb0" data-testid="phone-number-verification-success-message">
            {t('Your new phone number has been successfully verified')}
          </p>
        </div>
      )}
    </Dialog>
  );
};

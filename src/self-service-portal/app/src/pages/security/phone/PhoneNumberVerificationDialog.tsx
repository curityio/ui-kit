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

import { Alert } from '../../../shared/ui/Alert.tsx';
import { Dialog } from '../../../shared/ui/dialog/Dialog.tsx';
import { Spinner } from '../../../shared/ui/Spinner.tsx';
import { SuccessCheckmark } from '../../../shared/ui/SuccessCheckmark.tsx';
import { useMutation } from '@apollo/client';
import { useState, useRef, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { OtpInput } from '../../../shared/ui/OtpInput.tsx';
import { USER_MANAGEMENT_API } from '../../../shared/data-access/API/user-management';
import { Input } from '../../../shared/ui/input/Input.tsx';
import { GRAPHQL_API_ERROR_MESSAGES } from '../../../shared/data-access/API/GRAPHQL_API_ERROR_MESSAGES.ts';

type Props = {
  accountId: string;
  onClose: () => void;
  phoneNumberForOtpVerification?: string | null;
  setPhoneNumberAsPrimaryAfterVerification?: boolean;
  onPhoneNumberListChange?: () => void;
};
export const PhoneNumberVerificationDialog = ({
  accountId,
  onClose,
  phoneNumberForOtpVerification = '',
  setPhoneNumberAsPrimaryAfterVerification,
  onPhoneNumberListChange,
}: Props) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [phoneNumber, setPhoneNumber] = useState(phoneNumberForOtpVerification ?? '');
  const [phoneNumberVerificationState, setPhoneNumberVerificationState] = useState('');
  const [forcePhoneNumberStep, setForcePhoneNumberStep] = useState(false);
  const [otpDigits, setOtpDigits] = useState('');
  const [
    startVerifyPhoneNumberByAccountId,
    {
      data: verificationStartData,
      loading: verificationStartLoading,
      error: verificationStartError,
      reset: restVerificationStartError,
    },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.startVerifyPhoneNumberByAccountId);
  const [
    completeVerifyPhoneNumberByAccountId,
    {
      data: verificationCompleteData,
      loading: verificationCompleteLoading,
      error: verificationCompleteError,
      reset: restVerificationCompleteError,
    },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.completeVerifyPhoneNumberByAccountId);
  const [updatePrimaryPhoneNumberByAccountId] = useMutation(
    USER_MANAGEMENT_API.MUTATIONS.updatePrimaryPhoneNumberByAccountId
  );
  const hasTriggeredStartVerification = useRef(false);

  const isStartVerificationLoading = verificationStartLoading;
  const isCompleteVerificationLoading = verificationCompleteLoading;
  const isDialogLoading = isStartVerificationLoading || isCompleteVerificationLoading;
  const isDialogPhoneNumberStep = forcePhoneNumberStep || !verificationStartData;
  const isDialogPhoneNumberVerificationStep =
    !forcePhoneNumberStep && !!verificationStartData && !verificationCompleteData;
  const isDialogPhoneNumberVerificationSuccessStep = !!verificationCompleteData;

  useEffect(() => {
    if (phoneNumberForOtpVerification && !hasTriggeredStartVerification.current) {
      hasTriggeredStartVerification.current = true;
      startVerifyPhoneNumberByAccountId({
        variables: {
          input: {
            accountId,
            phoneNumber: phoneNumberForOtpVerification,
          },
        },
      }).then(response => {
        const state = response?.data?.startVerifyPhoneNumberByAccountId?.state;
        if (state) setPhoneNumberVerificationState(state);
      });
    }
  }, [accountId, phoneNumberForOtpVerification, startVerifyPhoneNumberByAccountId]);

  useEffect(() => {
    if (isDialogPhoneNumberStep) {
      inputRef.current?.focus();
    }
  }, [isDialogPhoneNumberStep]);

  const dialogConfig = {
    phoneNumber: {
      subtitle: phoneNumberForOtpVerification ? t('account.phone.verify') : t('account.phone.new'),
      actionText: t('account.send-code'),
      cancelText: t('cancel'),
    },
    otp: {
      subtitle: t('account.phone.check'),
      actionText: t('account.verify-code'),
      cancelText: '',
    },
    loading: {
      subtitle: t('account.processing'),
      actionText: t('account.verify-code'),
      cancelText: '',
    },
    success: {
      subtitle: t('account.phone.verification'),
      actionText: t('done'),
      cancelText: '',
    },
  } as const;

  const getDialogStepKey = (): keyof typeof dialogConfig => {
    if (isDialogPhoneNumberStep) return 'phoneNumber';
    if (isDialogPhoneNumberVerificationStep) return 'otp';
    if (isDialogLoading) return 'loading';
    if (isDialogPhoneNumberVerificationSuccessStep) return 'success';
    return 'phoneNumber';
  };

  const getDialogSubtitle = () => dialogConfig[getDialogStepKey()].subtitle;
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
    await startVerifyPhoneNumberByAccountId({
      variables: {
        input: {
          accountId,
          phoneNumber: phoneNumber,
        },
      },
    }).then(response => {
      const state = response?.data?.startVerifyPhoneNumberByAccountId?.state;
      if (state) setPhoneNumberVerificationState(state);
    });
    onPhoneNumberListChange?.();
  };

  const verifyOtpCode = async () => {
    const code = otpDigits;
    await completeVerifyPhoneNumberByAccountId({
      variables: {
        input: {
          accountId,
          otp: code,
          state: phoneNumberVerificationState,
        },
      },
    });

    if (setPhoneNumberAsPrimaryAfterVerification) {
      await updatePrimaryPhoneNumberByAccountId({
        variables: {
          input: {
            accountId,
            newPrimaryPhoneNumber: phoneNumberForOtpVerification || phoneNumber,
          },
        },
      });
    }

    onPhoneNumberListChange?.();
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
      title={t('account.phone.verification')}
      subTitle={getDialogSubtitle()}
      showActionButton
      showCancelButton={isDialogPhoneNumberStep}
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
          <p>{t('account.phone.send-code')}</p>
          <div className="left-align">
            <label htmlFor="newphoneNumber" className="label inline-flex flex-center flex-gap-1">
              {t('account.phone.title')}
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
                errorMessage={t(GRAPHQL_API_ERROR_MESSAGES.startVerifyPhoneNumberByAccountId)}
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
          <div> {isStartVerificationLoading ? t('account.sending-code') : t('account.verifying-code')}</div>
        </div>
      )}

      {isDialogPhoneNumberVerificationStep && (
        <>
          <div className="flex flex-column flex-center mb0">
            <p className="mt0 mb3" data-testid="otp-description">
              {t('account.phone.enter-code')}
            </p>
            <OtpInput
              errorMessage={
                verificationCompleteError && GRAPHQL_API_ERROR_MESSAGES.completeVerifyPhoneNumberByAccountId
              }
              onChange={setOtpDigits}
            />
          </div>
        </>
      )}

      {isDialogPhoneNumberVerificationSuccessStep && (
        <div className="p3 flex flex-column flex-center">
          <SuccessCheckmark />
          <p className="mb0" data-testid="phone-number-verification-success-message">
            {t('account.phone.verification-success')}
          </p>
        </div>
      )}
    </Dialog>
  );
};

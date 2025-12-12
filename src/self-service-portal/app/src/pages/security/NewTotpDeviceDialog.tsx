import { GRAPHQL_API_ERROR_MESSAGES } from '@/shared/data-access/API/GRAPHQL_API_ERROR_MESSAGES';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { Alert, Dialog, Input, Spinner, SuccessCheckmark, toUiKitTranslation } from '@curity/ui-kit-component-library';
import { OtpInput } from '@/shared/ui/OtpInput';
import { useMutation } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';

interface NewTotpDeviceDialogProps {
  isOpen: boolean;
  accountId?: string;
  onClose: () => void;
}

export const NewTotpDeviceDialog = ({ isOpen, accountId, onClose }: NewTotpDeviceDialogProps) => {
  const { t } = useTranslation();
  const uiKitT = toUiKitTranslation(t);
  const inputRef = useRef<HTMLInputElement>(null);
  const [totpAlias, setTotpAlias] = useState('');
  const [
    startVerifyTotpDeviceByAccountId,
    { data: verificationStartData, loading: verificationStartLoading, error: verificationStartError },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.startVerifyTotpDeviceByAccountId);
  const [
    completeVerifyTotpDeviceByAccountId,
    { data: verificationCompleteData, loading: verificationCompleteLoading, error: verificationCompleteError },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.completeVerifyTotpDeviceByAccountId);

  const isDialogLoading = verificationStartLoading || verificationCompleteLoading;
  const isDialogDeviceDetailsStep = !verificationStartData;
  const isDialogDeviceVerificationStep = !!verificationStartData && !verificationCompleteData;
  const isDialogDeviceRegistrationSuccessStep = !!verificationCompleteData;
  const dialogActionButtonText = isDialogDeviceDetailsStep ? t('create-and-verify') : t('done');
  const digits = verificationStartData?.startVerifyTotpDeviceByAccountId?.digits;

  useEffect(() => {
    if (isOpen) {
      inputRef.current?.focus();
    }
  }, [isOpen]);

  const handleStartVerifyTotpDeviceByAccountId = () => {
    if (accountId && totpAlias) {
      startVerifyTotpDeviceByAccountId({
        variables: {
          input: {
            accountId,
            alias: totpAlias,
          },
        },
      });
    }
  };
  const handleCompleteVerifyTotpDeviceByAccountId = (code: string) => {
    const state = verificationStartData?.startVerifyTotpDeviceByAccountId?.state;

    if (accountId && state && code) {
      completeVerifyTotpDeviceByAccountId({
        variables: {
          input: {
            accountId,
            totp: code,
            state,
          },
        },
      });
    }
  };
  const handleDialogNextStep = () => {
    if (isDialogDeviceDetailsStep) {
      handleStartVerifyTotpDeviceByAccountId();
    } else if (isDialogDeviceRegistrationSuccessStep) {
      onClose();
    }
  };

  const getStartVerificationErrorMessage = (): string => {
    const graphQLError = verificationStartError?.graphQLErrors?.[0];
    const isLocalizedValidationError = graphQLError?.extensions?.classification === 'localized-validation-error';
    return isLocalizedValidationError
      ? (graphQLError?.message ?? '')
      : t(GRAPHQL_API_ERROR_MESSAGES.startVerifyTotpDeviceByAccountId);
  };

  return (
    isOpen && (
      <Dialog
        isOpen={true}
        title={t('security.otp-authenticators.creation')}
        subTitle={t('security.otp-authenticators.new-otp')}
        showActionButton={isDialogDeviceDetailsStep || isDialogDeviceRegistrationSuccessStep}
        actionButtonText={dialogActionButtonText}
        actionButtonCallback={handleDialogNextStep}
        showCancelButton={!isDialogDeviceRegistrationSuccessStep}
        cancelButtonText={t('cancel')}
        cancelButtonCallback={onClose}
        closeCallback={onClose}
        closeDialogOnActionButtonClick={false}
        t={uiKitT}
      >
        {isDialogLoading && (
          <div className="flex flex-center flex-column justify-center">
            <h1>{t('verifying-code')}</h1>
            <p className="m0">{t('please-wait')}...</p>
            <Spinner width={48} height={48} />
          </div>
        )}

        {isDialogDeviceDetailsStep && (
          <>
            <Input
              ref={inputRef}
              label={t('alias')}
              value={totpAlias}
              onChange={event => setTotpAlias(event.target.value)}
              autoFocus
              className="flex flex-column flex-start"
              inputClassName="w100"
              data-testid="mfa-new-totp-device-alias-input"
            />
            {verificationStartError && (
              <Alert
                kind="danger"
                errorMessage={getStartVerificationErrorMessage()}
                classes="mt2"
                data-testid="totp-device-start-verification-error"
              />
            )}
          </>
        )}

        {isDialogDeviceVerificationStep && (
          <div className="flex flex-column flex-center mb0">
            <h3 className="mt0">{t('security.otp-authenticators.scan-and-verify')}</h3>
            <p className="mt0 mb3">{t('security.otp-authenticators.scan-and-enter', { digits })}</p>
            {verificationStartData?.startVerifyTotpDeviceByAccountId?.qrLink && (
              <QRCode value={verificationStartData.startVerifyTotpDeviceByAccountId.qrLink} className="mb3" />
            )}
            <OtpInput
              length={digits}
              errorMessage={verificationCompleteError && GRAPHQL_API_ERROR_MESSAGES.completeVerifyTotpDeviceByAccountId}
              onComplete={handleCompleteVerifyTotpDeviceByAccountId}
            />
          </div>
        )}

        {isDialogDeviceRegistrationSuccessStep && (
          <>
            <h3 className="mt0">{t('OTP Authenticator verified')}</h3>
            <div className="p3 flex flex-column flex-center">
              <SuccessCheckmark />
              <p className="mb0" data-testid="device-verification-success-message">
                {t('Your new OTP Authenticator has been successfully verified')}
              </p>
            </div>
          </>
        )}
      </Dialog>
    )
  );
};

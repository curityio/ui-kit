import { GRAPHQL_API_ERROR_MESSAGES } from '@/shared/data-access/API/GRAPHQL_API_ERROR_MESSAGES';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { Alert } from '@/shared/ui/Alert';
import { Dialog } from '@/shared/ui/dialog/Dialog';
import { Input } from '@/shared/ui/input/Input';
import { OtpInput } from '@/shared/ui/OtpInput';
import { Spinner } from '@/shared/ui/Spinner';
import { SuccessCheckmark } from '@/shared/ui/SuccessCheckmark';
import { useMutation } from '@apollo/client';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import QRCode from 'react-qr-code';

interface NewTotpDeviceDialogProps {
  isOpen: boolean;
  accountId?: string;
  onClosed: () => void;
}

export const NewTotpDeviceDialog = ({ isOpen, accountId, onClosed }: NewTotpDeviceDialogProps) => {
  const { t } = useTranslation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [totpAlias, setTotpAlias] = useState('');
  const [showNewTotpDeviceDialog, setShowNewTotpDeviceDialog] = useState<boolean>(false);
  const [
    startVerifyTotpDevice,
    { data: verificationStartData, loading: verificationStartLoading, error: verificationStartError },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.startVerifyTotpDevice);
  const [
    completeVerifyTotpDevice,
    { data: verificationCompleteData, loading: verificationCompleteLoading, error: verificationCompleteError },
  ] = useMutation(USER_MANAGEMENT_API.MUTATIONS.completeVerifyTotpDevice);

  const isDialogLoading = verificationStartLoading || verificationCompleteLoading;
  const isDialogDeviceDetailsStep = !verificationStartData;
  const isDialogDeviceVerificationStep = !!verificationStartData && !verificationCompleteData;
  const isDialogDeviceRegistrationSuccessStep = !!verificationCompleteData;
  const dialogActionButtonText = isDialogDeviceDetailsStep ? t('Create and verify') : t('Done');

  useEffect(() => {
    if (isOpen) {
      setShowNewTotpDeviceDialog(true);
      inputRef.current?.focus();
    } else {
      setShowNewTotpDeviceDialog(false);
    }
  }, [isOpen]);

  const handleStartVerifyTotpDevice = () => {
    if (accountId && totpAlias) {
      startVerifyTotpDevice({
        variables: {
          input: {
            accountId,
            alias: totpAlias,
          },
        },
      });
    }
  };
  const handleCompleteVerifyTotpDevice = (code: string) => {
    const transactionId = verificationStartData?.startVerifyTotpDevice?.transactionId;

    if (accountId && transactionId && code) {
      completeVerifyTotpDevice({
        variables: {
          input: {
            accountId,
            totp: code,
            transactionId: transactionId,
          },
        },
      });
    }
  };
  const handleDialogNextStep = () => {
    if (isDialogDeviceDetailsStep) {
      handleStartVerifyTotpDevice();
    } else if (isDialogDeviceRegistrationSuccessStep) {
      onClosed();
    }
  };

  return (
    showNewTotpDeviceDialog && (
      <Dialog
        isOpen={true}
        title={t('New OTP Authenticator')}
        showActionButton={isDialogDeviceDetailsStep || isDialogDeviceRegistrationSuccessStep}
        actionButtonText={dialogActionButtonText}
        actionButtonCallback={handleDialogNextStep}
        showCancelButton={true}
        cancelButtonText={t('Cancel')}
        cancelButtonCallback={onClosed}
        closeCallback={onClosed}
        closeDialogOnActionButtonClick={false}
      >
        {isDialogLoading && (
          <div className="flex flex-center flex-column justify-center">
            <h1>{t('Verifying Code')}</h1>
            <p className="m0">{t('Please wait')}...</p>
            <Spinner width={48} height={48} />
          </div>
        )}

        {isDialogDeviceDetailsStep && (
          <>
            <Input
              ref={inputRef}
              label={t('Alias')}
              value={totpAlias}
              onChange={event => setTotpAlias(event.target.value)}
              autoFocus
              className="flex flex-column flex-start"
              inputClassName="w100"
              data-testid="device-input"
            />
            {verificationStartError && (
              <Alert
                kind="danger"
                errorMessage={t(GRAPHQL_API_ERROR_MESSAGES.startVerifyTotpDevice)}
                classes="mt2"
                data-testid="totp-device-start-verification-error"
              />
            )}
          </>
        )}

        {isDialogDeviceVerificationStep && (
          <div className="flex flex-column flex-center mb0">
            <h2 className="mt0">{t('Scan and Verify Your Code')}</h2>
            <p className="mt0 mb3">
              {t(
                'Scan the QR code with your device and enter the 6-digit code sent to you to complete verification. This ensures a secure and seamless experience.'
              )}
            </p>
            {verificationStartData?.startVerifyTotpDevice?.qrLink && (
              <QRCode value={verificationStartData.startVerifyTotpDevice.qrLink} className="mb3" />
            )}
            <OtpInput
              errorMessage={verificationCompleteError && GRAPHQL_API_ERROR_MESSAGES.completeVerifyTotpDevice}
              onComplete={handleCompleteVerifyTotpDevice}
            />
          </div>
        )}

        {isDialogDeviceRegistrationSuccessStep && (
          <>
            <h2 className="mt0">{t('Your device has been registered successfully')}</h2>
            <div className="p3 flex flex-column flex-center">
              <SuccessCheckmark />
              <p className="mb0" data-testid="device-verification-success-message">
                {t('Your new authenticator has been successfully verified')}
              </p>
            </div>
          </>
        )}
      </Dialog>
    )
  );
};

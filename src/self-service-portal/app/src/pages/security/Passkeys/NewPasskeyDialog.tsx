import { useState } from 'react';
import { Dialog } from '../../../shared/ui/dialog/Dialog.tsx';
import { Input } from '../../../shared/ui/input/Input.tsx';
import { useTranslation } from 'react-i18next';
import { useVerifyPasskey } from './useVerifyPasskey.tsx';

interface NewPasskeyDialogProps {
  isOpen: boolean;
  accountId: string;
  refetchAccount: () => void;
  onClose: () => void;
}

export const NewPasskeyDialog = ({ isOpen, accountId, refetchAccount, onClose }: NewPasskeyDialogProps) => {
  const { t } = useTranslation();
  const [alias, setAlias] = useState('');
  const { verifyPasskey } = useVerifyPasskey();

  const createNewPasskey = () => {
    verifyPasskey(accountId, alias, refetchAccount);
    setAlias('');
    onClose();
  };

  const resetAliasAndCloseDialog = () => {
    setAlias('');
    onClose();
  };

  return (
    <Dialog
      isOpen={isOpen}
      title={t('security.passkeys.creation')}
      subTitle={t('security.passkeys.new')}
      closeCallback={resetAliasAndCloseDialog}
      showActionButton={true}
      actionButtonText={t('create-and-verify')}
      actionButtonCallback={createNewPasskey}
      isActionButtonDisabled={!alias}
      showCancelButton={true}
      cancelButtonText={t('cancel')}
      cancelButtonCallback={resetAliasAndCloseDialog}
      data-testid="new-passkey-dialog"
    >
      <Input
        name="alias"
        label={t('alias')}
        value={alias}
        onChange={e => setAlias(e.target.value)}
        autoFocus
        data-testid="new-passkey-alias-input"
        className="left-align"
        inputClassName="w100"
      />
    </Dialog>
  );
};

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

import { IconAuthenticatorTotp } from '@icons';
import { DataTable, PageHeader } from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import { Column } from '@/shared/ui/data-table/typings';
import { useState } from 'react';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { Device, DEVICE_TYPES } from '@/shared/data-access/API';
import { useVerifyPasskey } from './useVerifyPasskey';
import { Spinner } from '@/shared/ui/Spinner';
import { Dialog } from '@/shared/ui/dialog/Dialog';
import { Input } from '@/shared/ui/input/Input';
import { getFormattedDate } from '@shared/utils/date.ts';

export const Passkeys = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [search, setSearch] = useState('');
  const [showNewPasskeyDialog, setShowNewPasskeyDialog] = useState(false);
  const [newPasskeyAlias, setNewPasskeyAlias] = useState('');
  const { data: accountResponse, refetch: refetchAccount } = useQuery(
    GRAPHQL_API.USER_MANAGEMENT.QUERIES.getAccountByUserName,
    {
      variables: { userName: session?.idTokenClaims?.sub },
    }
  );
  const [deleteDeviceFromAccountByAccountId] = useMutation(
    USER_MANAGEMENT_API.MUTATIONS.deleteDeviceFromAccountByAccountId
  );
  const { verifyPasskey } = useVerifyPasskey();

  const columns: Column<Device>[] = [
    { key: 'alias', label: t('Alias') },
    {
      key: 'meta',
      label: t('Created'),
      customRender: (passkey: Device) => (passkey.meta?.created ? getFormattedDate(passkey.meta?.created) : ''),
    },
  ];
  const accountId = accountResponse?.accountByUserName?.id;

  if (!accountId) {
    return (
      <div className="flex flex-center flex-column justify-center h100">
        <Spinner width={48} height={48} />
      </div>
    );
  }

  const passKeys =
    accountResponse?.accountByUserName?.devices
      ?.filter(device => device !== null)
      .filter(device => device?.category?.name === DEVICE_TYPES.PASSKEYS)
      ?.filter(device =>
        `${device.deviceId}${device.deviceType}${device.alias}`
          .toLocaleLowerCase()
          .includes(search?.toLocaleLowerCase())
      ) || [];

  const deletePasskeyFromAccount = ({ deviceId }: Device) => {
    return deleteDeviceFromAccountByAccountId({
      variables: {
        input: {
          accountId,
          deviceId,
        },
      },
    }).then(() => refetchAccount());
  };

  const resetNewPasskeyAlias = () => {
    setNewPasskeyAlias('');
    setShowNewPasskeyDialog(false);
  };

  return (
    <>
      <PageHeader
        title={t('Passkeys')}
        description={t(
          'With passkeys, you can securely sign in to your Account using just your fingerprint, face, screen lock, or security key. Passkeys and security keys can also be used as a second step when signing in with your password. Be sure to keep your screen locks private and security keys safe, so only you can use them.'
        )}
        icon={<IconAuthenticatorTotp width={128} height={128} />}
      />

      <DataTable
        title={t('Passkeys')}
        columns={columns}
        data={passKeys}
        createButtonLabel={t('passkey')}
        onRowDelete={deletePasskeyFromAccount}
        onSearch={setSearch}
        onCreateNew={() => setShowNewPasskeyDialog(true)}
        data-testid="passkeys-list"
      />

      <Dialog
        isOpen={showNewPasskeyDialog}
        title={t('New Passkey')}
        closeCallback={resetNewPasskeyAlias}
        showActionButton={true}
        actionButtonText={t('Create and verify')}
        actionButtonCallback={() => {
          verifyPasskey(accountId, newPasskeyAlias, refetchAccount);
          resetNewPasskeyAlias();
        }}
        isActionButtonDisabled={!newPasskeyAlias}
        showCancelButton={true}
        cancelButtonText={t('Cancel')}
      >
        <Input
          id={t('alias')}
          label={t('Alias')}
          onInput={e => setNewPasskeyAlias((e.target as HTMLInputElement).value)}
          className="left-align"
          inputClassName="w100"
          autoFocus
          value={newPasskeyAlias}
          data-testid="new-passkey-alias-input"
        />
      </Dialog>
    </>
  );
};

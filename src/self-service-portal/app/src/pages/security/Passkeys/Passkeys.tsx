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
import { DataTable, PageHeader } from '../../../shared/ui';
import { useTranslation } from 'react-i18next';
import { Column } from '../../../shared/ui/data-table/typings.ts';
import { useState } from 'react';
import { GRAPHQL_API } from '../../../shared/data-access/API/GRAPHQL_API.ts';
import { USER_MANAGEMENT_API } from '../../../shared/data-access/API/user-management';
import { useQuery, useMutation } from '@apollo/client';
import { useAuth } from '../../../auth/data-access/AuthProvider.tsx';
import { Device, DEVICE_TYPES } from '../../../shared/data-access/API';
import { Spinner } from '../../../shared/ui/Spinner.tsx';
import { NewPasskeyDialog } from './NewPasskeyDialog.tsx';
import { getFormattedDate } from '../../../shared/utils/date.ts';

export const Passkeys = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [search, setSearch] = useState('');
  const [showNewPasskeyDialog, setShowNewPasskeyDialog] = useState(false);
  const { data: accountResponse, refetch: refetchAccount } = useQuery(
    GRAPHQL_API.USER_MANAGEMENT.QUERIES.getAccountByUserName,
    {
      variables: { userName: session?.idTokenClaims?.sub },
    }
  );
  const [deleteDeviceFromAccountByAccountId] = useMutation(
    USER_MANAGEMENT_API.MUTATIONS.deleteDeviceFromAccountByAccountId
  );

  const columns: Column<Device>[] = [
    {
      key: 'deviceId',
      label: t('name'),
      customRender: (device: Device) => {
        const details = device?.details;
        if (!details || !('webAuthnAuthenticator' in details) || !details.webAuthnAuthenticator) return null;
        const webAuthn = details.webAuthnAuthenticator;
        return (
          <div className="flex flex-center flex-gap-1">
            {webAuthn.iconLightUri && (
              <img src={webAuthn.iconLightUri} alt={webAuthn.name ?? ''} width={32} height={32} />
            )}
            <span>{webAuthn.name}</span>
          </div>
        );
      },
    },

    { key: 'alias', label: t('alias') },
    {
      key: 'meta',
      label: t('account.created'),
      customRender: (passkey: Device) => (passkey.meta?.created ? getFormattedDate(passkey.meta?.created) : ''),
    },
  ];
  const accountId = accountResponse?.accountByUserName?.id;

  if (!accountId) {
    return <Spinner width={48} height={48} mode="fullscreen" />;
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

  return (
    <>
      <PageHeader
        title={t('security.passkeys.title')}
        description={t('security.passkeys.description')}
        icon={<IconAuthenticatorTotp width={128} height={128} />}
        data-testid="passkeys-page-header"
      />

      <DataTable
        title={t('security.passkeys.title')}
        columns={columns}
        data={passKeys}
        createButtonLabel={t('security.passkeys.passkey')}
        onRowDelete={deletePasskeyFromAccount}
        onSearch={setSearch}
        onCreateNew={() => setShowNewPasskeyDialog(true)}
        data-testid="passkeys-list"
      />

      <NewPasskeyDialog
        isOpen={showNewPasskeyDialog}
        accountId={accountId}
        refetchAccount={refetchAccount}
        onClose={() => setShowNewPasskeyDialog(false)}
      />
    </>
  );
};

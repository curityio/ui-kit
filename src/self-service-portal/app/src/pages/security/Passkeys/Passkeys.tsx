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

import { IconAuthenticatorPasskeys } from '@curity/ui-kit-icons';
import { DataTable } from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import { Column } from '@/shared/ui/data-table/typings';
import { useState } from 'react';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { useMutation, useQuery } from '@apollo/client';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { Device, DEVICE_TYPES } from '@/shared/data-access/API';
import { PageHeader, Spinner, toUiKitTranslation } from '@curity/ui-kit-component-library';
import { NewPasskeyDialog } from './NewPasskeyDialog';
import { getFormattedDate } from '@shared/utils/date.ts';

export const Passkeys = () => {
  const { t } = useTranslation();
  const uiKitT = toUiKitTranslation(t);
  const { session } = useAuth();
  const [search, setSearch] = useState('');
  const [showNewPasskeyDialog, setShowNewPasskeyDialog] = useState(false);
  const { data: accountResponse, refetch: refetchAccount } = useQuery(
    GRAPHQL_API.USER_MANAGEMENT.QUERIES.getAccountByUserName,
    {
      variables: { userName: session?.idTokenClaims?.sub },
    }
  );

  const getDeviceInfo = (device: Device) => {
    const details = device?.details;
    const webAuthn = details && 'webAuthnAuthenticator' in details ? details.webAuthnAuthenticator : null;
    const deviceName = webAuthn?.name || t('security.passkeys.passkey');
    const deviceIconUrl = webAuthn?.iconLightUri;
    return { deviceName, deviceIconUrl };
  };

  const [deleteDeviceFromAccountByAccountId] = useMutation(
    USER_MANAGEMENT_API.MUTATIONS.deleteDeviceFromAccountByAccountId
  );

  const columns: Column<Device>[] = [
    {
      key: 'deviceId',
      label: t('security.passkeys.device'),
      customRender: (device: Device) => {
        const { deviceName, deviceIconUrl } = getDeviceInfo(device);

        return (
          <div className="flex flex-center flex-gap-1">
            {deviceIconUrl ? (
              <img src={deviceIconUrl} alt={deviceName} width={32} height={32} />
            ) : (
              <IconAuthenticatorPasskeys width={32} height={32} />
            )}
            <span>{deviceName}</span>
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
      ?.filter(device => {
        const { deviceName } = getDeviceInfo(device);

        return `${device.deviceId}${device.deviceType}${device.alias}${deviceName}`
          .toLocaleLowerCase()
          .includes(search?.toLocaleLowerCase());
      }) || [];

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
        t={uiKitT}
        title={t('security.passkeys.title')}
        description={t('security.passkeys.description')}
        icon={<IconAuthenticatorPasskeys width={128} height={128} />}
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

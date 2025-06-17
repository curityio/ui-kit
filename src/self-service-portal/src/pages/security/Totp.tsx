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
import { DataTable, PageHeader } from '../../shared/ui';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client/react';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { Column } from '@/shared/ui/data-table/typings';
import { Device, DEVICE_TYPES } from '@/shared/data-access/API';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { NewTotpDeviceDialog } from '@/pages/security/NewTotpDeviceDialog';
import { useState } from 'react';

export const Totp = () => {
  const { t } = useTranslation();
  const [isNewTotpDeviceDialogOpen, setIsNewTotpDeviceDialogOpen] = useState(false);
  const [search, setSearch] = useState('');
  const { session } = useAuth();
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
    { key: 'deviceId', label: t('Device ID') },
    { key: 'alias', label: t('Alias') },
    { key: 'deviceType', label: t('Type') },
  ];
  const accountId = accountResponse?.accountByUserName?.id;
  const otpDevices = accountResponse?.accountByUserName?.devices
    ?.filter(device => device !== null)
    ?.filter(device => device?.category?.name === DEVICE_TYPES.TOTP)
    ?.filter(device =>
      `${device.alias}${device.deviceId}${device.deviceType}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );

  const deleteDeviceFromAccount = (device: Device) => {
    if (accountId && device) {
      deleteDeviceFromAccountByAccountId({
        variables: {
          input: {
            accountId,
            deviceId: device.deviceId,
          },
        },
      }).then(() => refetchAccount());
    }
  };

  return (
    <>
      <PageHeader
        title={t('OTP Authenticators')}
        description={t(
          'TOTP is suitable as a second factor during authentication, and usually less suitable as a standalone single factor, as it relies on the device only, which may not be protected by any passwords or pin codes'
        )}
        icon={<IconAuthenticatorTotp width={128} height={128} data-testid="page-header-icon" />}
      />

      <DataTable
        title={t('OTP Authenticators')}
        columns={columns}
        data={otpDevices}
        createButtonLabel={t('authenticator')}
        onRowDelete={deleteDeviceFromAccount}
        onSearch={(query: string) => setSearch(query)}
        onCreateNew={() => setIsNewTotpDeviceDialogOpen(true)}
      />

      {isNewTotpDeviceDialogOpen && (
        <NewTotpDeviceDialog
          isOpen={isNewTotpDeviceDialogOpen}
          accountId={accountId}
          onClosed={() => {
            setIsNewTotpDeviceDialogOpen(false);
            refetchAccount();
          }}
        />
      )}
    </>
  );
};

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

import { IconAuthenticatorTotp } from '@curity/ui-kit-icons';
import { PageHeader, toUiKitTranslation } from '@curity/ui-kit-component-library';
import { DataTable } from '../../shared/ui';
import { useTranslation } from 'react-i18next';
import { useMutation, useQuery } from '@apollo/client/react';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { Column } from '@/shared/ui/data-table/typings';
import { Device, DEVICE_TYPES } from '@/shared/data-access/API';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { NewTotpDeviceDialog } from '@/pages/security/NewTotpDeviceDialog';
import { useState } from 'react';
import { UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { MFA_REGISTRABLE_FACTORS } from '@/pages/security/MFA/MFA.tsx';

export const Totp = () => {
  const { t } = useTranslation();
  const uiKitT = toUiKitTranslation(t);
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
    { key: 'deviceId', label: t('security.otp-authenticators.device-id') },
    { key: 'alias', label: t('alias') },
    { key: 'deviceType', label: t('type') },
  ];
  const accountId = accountResponse?.accountByUserName?.id;
  const otpDevices = accountResponse?.accountByUserName?.devices
    ?.filter(device => device !== null)
    ?.filter(device => device?.category?.name === DEVICE_TYPES.TOTP)
    ?.filter(
      device =>
        device?.details && 'canUseWithTotpAuthenticator' in device.details && device.details.canUseWithTotpAuthenticator
    )
    ?.filter(device =>
      `${device.alias}${device.deviceId}${device.deviceType}`.toLocaleLowerCase().includes(search.toLocaleLowerCase())
    );

  const shouldDisallowDeletingOtpDevices =
    otpDevices?.length === 1 &&
    accountResponse?.accountByUserName?.mfaOptIn?.registeredFactors?.factors.some(
      factor => factor.type === MFA_REGISTRABLE_FACTORS.TOTP
    );

  if (shouldDisallowDeletingOtpDevices) {
    columns.push({
      key: 'meta',
      label: t('actions'),
      customRender: () => (
        <small>
          <em>{t('security.otp-authenticators.disallow.deletion.description')}</em>
        </small>
      ),
    });
  }

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
        t={uiKitT}
        title={t('security.otp-authenticators.title')}
        description={t('security.otp-authenticators.description')}
        icon={<IconAuthenticatorTotp width={128} height={128} data-testid="page-header-icon" />}
        data-testid="totp-page-header"
      />

      <DataTable
        title={t('security.otp-authenticators.title')}
        columns={columns}
        data={otpDevices}
        createButtonLabel={t('security.otp-authenticators.authenticator')}
        showDelete={!shouldDisallowDeletingOtpDevices}
        onRowDelete={deleteDeviceFromAccount}
        onSearch={(query: string) => setSearch(query)}
        onCreateNew={() => setIsNewTotpDeviceDialogOpen(true)}
        uiConfigResources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP]}
      />

      {isNewTotpDeviceDialogOpen && (
        <NewTotpDeviceDialog
          isOpen={isNewTotpDeviceDialogOpen}
          accountId={accountId}
          onClose={() => {
            setIsNewTotpDeviceDialogOpen(false);
            refetchAccount();
          }}
        />
      )}
    </>
  );
};

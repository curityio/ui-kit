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

import { useMutation, useQuery } from '@apollo/client';
import { ContactInfo } from '../components/account/ContactInfo';
import { ProfileDetails } from '../components/account/ProfileDetails';
import { PageHeader } from '@/shared/ui/page-header/PageHeader';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { AccountUpdateFields } from '@/shared/data-access/API';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { IconUserProfile } from '@/shared/components/icons';
import { useTranslation } from 'react-i18next';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';
import { UI_CONFIG_RESOURCES, UI_CONFIG_OPERATIONS } from '@/ui-config/typings';
import { Spinner } from '@/shared/ui/Spinner';
import { Outlet } from 'react-router';
import { useEffect, useState } from 'react';

export const Account = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const {
    data: accountResponse,
    loading,
    refetch: refetchAccount,
  } = useQuery(GRAPHQL_API.USER_MANAGEMENT.QUERIES.getAccountByUserName, {
    variables: { userName: session?.idTokenClaims?.sub },
  });

  const account = accountResponse?.accountByUserName;
  const userName = account?.name
    ? `${account?.name?.givenName || ''} ${account?.name?.familyName || ''}`
    : account?.userName || '';
  const [updateAccountById] = useMutation(GRAPHQL_API.USER_MANAGEMENT.MUTATIONS.updateAccountById);
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');

  useEffect(() => {
    setGivenName(account?.name?.givenName || '');
    setFamilyName(account?.name?.familyName || '');
  }, [account?.name?.givenName, account?.name?.familyName]);

  if (loading || !account) {
    return <Spinner width={48} height={48} mode="fullscreen" />;
  }

  const handleUpdateAccount = async (accountUpdate: AccountUpdateFields) => {
    if (account) {
      try {
        await updateAccountById({
          variables: {
            input: {
              accountId: account.id,
              fields: {
                ...accountUpdate,
              },
            },
          },
        });
        await refetchAccount();
      } catch {
        await refetchAccount();
        setGivenName(account?.name?.givenName || '');
        setFamilyName(account?.name?.familyName || '');
      }
    }
  };

  return (
    <>
      <PageHeader
        title={`${t('welcome')} ${userName}`}
        description={t('account.description')}
        icon={<IconUserProfile name={userName} />}
        data-testid="account-page-header"
      />
      {account && (
        <>
          <UiConfigIf
            resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]}
            allowedOperations={[UI_CONFIG_OPERATIONS.READ]}
          >
            <ProfileDetails
              givenName={givenName}
              familyName={familyName}
              onGivenNameChange={setGivenName}
              onFamilyNameChange={setFamilyName}
              onChange={handleUpdateAccount}
            />
          </UiConfigIf>
          <UiConfigIf
            resources={[
              UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL,
              UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER,
              UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS,
            ]}
            allowedOperations={[UI_CONFIG_OPERATIONS.READ]}
            displayWithPartialResourcePermissions={true}
          >
            <ContactInfo account={account} />
          </UiConfigIf>
        </>
      )}
      <Outlet />
    </>
  );
};

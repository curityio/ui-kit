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

export const Account = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const { data: accountResponse } = useQuery(GRAPHQL_API.USER_MANAGEMENT.QUERIES.getAccountByUserName, {
    variables: { userName: session?.idTokenClaims?.sub },
  });
  const account = accountResponse?.accountByUserName;
  const userName = `${account?.name?.givenName} ${account?.name?.familyName}`;
  const [updateAccountById] = useMutation(GRAPHQL_API.USER_MANAGEMENT.MUTATIONS.updateAccountById);

  const handleUpdateAccount = (accountUpdate: AccountUpdateFields) => {
    if (account) {
      updateAccountById({
        variables: {
          input: {
            accountId: account.id,
            fields: {
              ...accountUpdate,
            },
          },
        },
      });
    }
  };

  return (
    <>
      <PageHeader
        title={`${t('Welcome')} ${userName}`}
        description={t('Manage your data, privacy and security to get the most out of Curity')}
        icon={<IconUserProfile name={userName} />}
      />
      {account && (
        <>
          <ProfileDetails account={account} onChange={handleUpdateAccount} />
          <ContactInfo account={account} />
        </>
      )}
    </>
  );
};

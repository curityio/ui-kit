/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { useTranslation } from 'react-i18next';
import { IconActionAutoLinkAccount } from '@curity/ui-kit-icons';
import { DataTable } from '@/shared/ui';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { useMutation, useQuery } from '@apollo/client';
import { LinkedAccount } from '@/shared/data-access/API';
import { Column } from '@/shared/ui/data-table/typings';
import { getFormattedDate } from '@shared/utils/date.ts';
import { UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { PageHeader, toUiKitTranslation } from '@curity/ui-kit-component-library';

export const LinkedAccounts = () => {
  const { t } = useTranslation();
  const uiKitT = toUiKitTranslation(t);
  const linkedAccountsTableColumns: Column<LinkedAccount>[] = [
    { key: 'value', label: t('linked-accounts.foreign-account-username') },
    { key: 'domain', label: t('linked-accounts.foreign-account-domain') },
    {
      key: 'created',
      label: t('account.created'),
      customRender: value => getFormattedDate(value.created),
    },
  ];
  const { session } = useAuth();
  const { data: accountResponse, refetch: refetchAccount } = useQuery(
    USER_MANAGEMENT_API.QUERIES.getAccountByUserName,
    {
      variables: { userName: session?.idTokenClaims?.sub },
    }
  );
  const account = accountResponse?.accountByUserName;

  const [deleteLinkedAccountByAccountById] = useMutation(
    USER_MANAGEMENT_API.MUTATIONS.deleteLinkFromAccountByAccountId
  );
  const handleDeleteAccount = (linkedAccount: LinkedAccount) => {
    if (account) {
      deleteLinkedAccountByAccountById({
        variables: {
          input: {
            accountId: account.id,
            linkedAccount: {
              domain: linkedAccount.domain,
              value: linkedAccount.value,
            },
          },
        },
      }).then(() => refetchAccount());
    }
  };

  return (
    <>
      <PageHeader
        t={uiKitT}
        title={t('linked-accounts.title')}
        description={t('linked-accounts.description')}
        icon={<IconActionAutoLinkAccount width={128} height={128} />}
        data-testid="linked-accounts-page-header"
      />

      <DataTable
        columns={linkedAccountsTableColumns}
        title={t('linked-accounts.title')}
        data={account?.linkedAccounts?.filter(linkedAccount => linkedAccount !== null)}
        showCreate={false}
        showSearch={false}
        onRowDelete={linkedAccountToDelete => handleDeleteAccount(linkedAccountToDelete)}
        uiConfigResources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_LINKED_ACCOUNTS]}
        data-testid="linked-account-list"
      />
    </>
  );
};

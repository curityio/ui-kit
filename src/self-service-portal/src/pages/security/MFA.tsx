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

import { IconActionMultiFactor } from '@icons';
import { PageHeader } from '@shared/ui';
import { useAuth } from '@auth/data-access/AuthProvider.tsx';
import { GRAPHQL_API } from '@shared/data-access/API/GRAPHQL_API.ts';
import { useQuery } from '@apollo/client';
import { OptedInStateContent } from '@/pages/security/MFA-states/OptedInStateContent.tsx';
import { OptedOutStateContent } from '@/pages/security/MFA-states/OptedOutStateContent.tsx';
import { useTranslation } from 'react-i18next';
import { InitialStateContent } from '@/pages/security/MFA-states/InitialStateContent.tsx';

export const MFA = () => {
  const { session } = useAuth();
  const { t } = useTranslation();
  const {
    data: accountResponse,
    refetch,
    loading,
  } = useQuery(GRAPHQL_API.USER_MANAGEMENT.QUERIES.getAccountByUserName, {
    variables: { userName: session?.idTokenClaims?.sub },
  });
  const optInMfaData = accountResponse?.accountByUserName?.mfaOptIn;

  if (loading) {
    return null;
  }

  let content = null;

  if (!optInMfaData) {
    content = <InitialStateContent />;
  } else if (!optInMfaData.preferences) {
    if (accountResponse?.accountByUserName?.id) {
      content = (
        <OptedInStateContent
          optInMfaData={optInMfaData}
          accountId={accountResponse?.accountByUserName?.id}
          refetchAccountData={refetch}
        />
      );
    }
  } else {
    content = <OptedOutStateContent optOutAt={optInMfaData.preferences.optOutAt} />;
  }

  return (
    <>
      <PageHeader
        title={t('Multi-factor Authentication')}
        description={t(
          'Multi factor Authentication allows the user to add second factors to protect their account. The first time the user hits the action they will be presented with the option to add a second factor. Once added, the user must always login with two factors.'
        )}
        icon={<IconActionMultiFactor width={128} height={128} />}
      />
      {content}
    </>
  );
};

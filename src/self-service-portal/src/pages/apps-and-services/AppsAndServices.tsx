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

import { IconAuthenticatorDefault, IconGeneralArrowForward, IconUserDataSources } from '@icons';
import { List, ListCell, ListRow, PageHeader } from '../../shared/ui';
import { Section } from '@/shared/ui/Section';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { Link } from 'react-router';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { AuthorizedOAuthClient } from '@/shared/data-access/API';
import { EmptyState } from '@/shared/ui/EmptyState';
import { useTranslation } from 'react-i18next';
import { SearchField } from '@/shared/ui/search-field/SearchField';

export const AppsAndServices = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const { data: appsResponse } = useQuery(GRAPHQL_API.GRANTED_AUTHORIZATION.QUERIES.getGrantedAuthorizationsByOwner, {
    variables: { owner: session?.idTokenClaims?.sub, first: 100000 },
  });
  const [appIdSearch, setAppIdSearch] = useState('');
  const appResults = appsResponse?.grantedAuthorizationsByOwner?.edges?.map(edge => edge.node.authorizedClient) || [];
  const appResultsFiltered = appResults?.filter(app =>
    app.id?.toLocaleLowerCase().includes(appIdSearch.toLocaleLowerCase())
  );

  const appList = (appList: AuthorizedOAuthClient[]) => {
    return (
      <List>
        {appList?.map((item, index) => (
          <Link to={item.id} key={index}>
            <ListRow className="flex flex-center justify-between flex-gap-2 w100 button-transparent p2">
              <ListCell>
                {item?.logoUri ? (
                  <img src={item.logoUri} alt={item.id} className="block w-3 h-3" />
                ) : (
                  <IconAuthenticatorDefault className="block w-3 h-3" />
                )}

                {item?.name || item?.id}
              </ListCell>
              <ListCell>{item?.description}</ListCell>
              <ListCell>
                {t('View details')}
                <IconGeneralArrowForward width={24} height={24} />
              </ListCell>
            </ListRow>
          </Link>
        ))}
      </List>
    );
  };

  return (
    <>
      <PageHeader
        title={t('Apps and Services')}
        description={t(
          'Key privacy options that help you choose what data is stored in your account, what information you share with others and more'
        )}
        icon={<IconUserDataSources width={128} height={128} />}
      />

      <Section title={t('Apps and Services')}>
        <>
          <h2>{t('Apps and Services')}</h2>
          <p>{t('Your shared data with these third-party apps and services')}</p>
          <div className="flex flex-gap-2 flex-center flex-wrap justify-between py2">
            <div>
              <SearchField
                title={t('Apps and Services')}
                length={appList?.length ?? 0}
                onSearch={setAppIdSearch}
                autoFocus
              />
            </div>
          </div>
        </>

        {appResultsFiltered?.length ? (
          appList(appResultsFiltered)
        ) : (
          <EmptyState heading={t('No apps or services found')} />
        )}
      </Section>
    </>
  );
};

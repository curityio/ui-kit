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

import { IconAuthenticatorDefault, IconGeneralArrowForward, IconUserDataSources } from '@curity/ui-kit-icons';
import { List, ListCell, ListRow, PageHeader } from '../../shared/ui';
import { Section } from '@/shared/ui/section/Section';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { Link } from 'react-router';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { useQuery } from '@apollo/client';
import { useState } from 'react';
import { AuthorizedOAuthClient } from '@/shared/data-access/API';
import { EmptyState, toUiKitTranslation } from '@curity/ui-kit-component-library';
import { useTranslation } from 'react-i18next';
import { SearchField } from '@/shared/ui/search-field/SearchField';

export const AppsAndServices = () => {
  const { t } = useTranslation();
  const toUiKitT = toUiKitTranslation(t);
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
      <List data-testid="apps-and-services-list">
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
                {t('view-details')}
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
        title={t('apps-and-services.title')}
        description={t('apps-and-services.description')}
        icon={<IconUserDataSources width={128} height={128} data-testid="page-header-icon" />}
        data-testid="apps-and-services-page-header"
      />

      <Section title={t('apps-and-services.title')}>
        <>
          <p>{t('apps-and-services.shared-data')}</p>
          <div className="flex flex-gap-2 flex-center flex-wrap justify-between py2">
            <div>
              <SearchField
                title={t('apps-and-services.title')}
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
          <EmptyState heading={t('apps-and-services.not-found')} t={toUiKitT} />
        )}
      </Section>
    </>
  );
};

import { useTranslationRef } from '@backstage/frontend-plugin-api';
import {
  CellText,
  ColumnConfig,
  Flex,
  SearchField,
  Table,
  Text,
  useTable,
} from '@backstage/ui';
import { useQuery } from '@apollo/client/react';

import { GRAPHQL_API } from '../../shared/data-access/graphql/GRAPHQL_API';
import { CapabilityKey } from '../../shared/data-access/graphql/db-clients/types';
import { devopsDashboardTranslationRef } from '../../i18n';
import { activeCapabilities } from '../util/activeCapabilities';
import { matchesIdOrName } from '../../shared/util/matchesIdOrName';
import { useGraphQLClientState } from '../../wrapper';

type DbClientRow = {
  id: string;
  name: string;
  status: string;
  capabilities: string;
  created: string;
};

// First page only for now; cursor pagination arrives with the M3 list work.
const PAGE_SIZE = 100;

const isAccessDenied = (error: unknown): boolean =>
  !!error &&
  typeof error === 'object' &&
  'statusCode' in error &&
  (error as { statusCode?: number }).statusCode === 403;

/**
 * Data half of the section. Rendered only when the plugin wrapper has
 * mounted the ApolloProvider, so plain Apollo hooks work here.
 */
const DbClientsTable = () => {
  const { t } = useTranslationRef(devopsDashboardTranslationRef);

  const capabilityLabels: Record<CapabilityKey, string> = {
    code: t('dbClients.capabilities.code'),
    implicit: t('dbClients.capabilities.implicit'),
    resource_owner_password: t(
      'dbClients.capabilities.resource_owner_password',
    ),
    assertion: t('dbClients.capabilities.assertion'),
    assisted_token: t('dbClients.capabilities.assisted_token'),
    backchannel: t('dbClients.capabilities.backchannel'),
    client_credentials: t('dbClients.capabilities.client_credentials'),
    introspection: t('dbClients.capabilities.introspection'),
    token_exchange: t('dbClients.capabilities.token_exchange'),
    oauth_token_exchange: t('dbClients.capabilities.oauth_token_exchange'),
    haapi: t('dbClients.capabilities.haapi'),
  };

  const statusLabels: Record<string, string> = {
    ACTIVE: t('dbClients.status.active'),
    INACTIVE: t('dbClients.status.inactive'),
  };

  const { data, loading, error } = useQuery(
    GRAPHQL_API.dbClients.QUERIES.searchDatabaseClients,
    {
      variables: { first: PAGE_SIZE },
    },
  );

  const clients: DbClientRow[] = (data?.searchDatabaseClients.edges ?? []).map(
    ({ node }) => ({
      id: node.client_id,
      name: node.name ?? '',
      status: statusLabels[node.status] ?? node.status,
      capabilities: activeCapabilities(node.capabilities)
        .map(key => capabilityLabels[key])
        .join(', '),
      created: new Date(node.meta.created).toLocaleDateString(),
    }),
  );

  const columns: ColumnConfig<DbClientRow>[] = [
    {
      id: 'id',
      label: t('dbClients.table.clientId'),
      isRowHeader: true,
      cell: client => <CellText title={client.id} />,
    },
    {
      id: 'name',
      label: t('dbClients.table.name'),
      cell: client => <CellText title={client.name} />,
    },
    {
      id: 'status',
      label: t('dbClients.table.status'),
      cell: client => <CellText title={client.status} />,
    },
    {
      id: 'capabilities',
      label: t('dbClients.table.capabilities'),
      cell: client => <CellText title={client.capabilities} />,
    },
    {
      id: 'created',
      label: t('dbClients.table.created'),
      cell: client => <CellText title={client.created} />,
    },
  ];

  const { tableProps, search } = useTable({
    mode: 'complete',
    data: clients,
    searchFn: matchesIdOrName,
  });

  if (loading) {
    return <Text as="p">{t('dbClients.states.loading')}</Text>;
  }
  if (error) {
    return (
      <Text as="p">
        {isAccessDenied(error)
          ? t('dbClients.states.accessDenied')
          : t('dbClients.states.error')}
      </Text>
    );
  }

  return (
    <>
      <SearchField
        aria-label={t('dbClients.search.label')}
        placeholder={t('dbClients.search.placeholder')}
        value={search.value}
        onChange={search.onChange}
      />

      <Table columnConfig={columns} {...tableProps} />
    </>
  );
};

export const DbClientsSection = () => {
  const { t } = useTranslationRef(devopsDashboardTranslationRef);
  const { loading, error, notConfigured } = useGraphQLClientState();

  const state = (() => {
    if (loading) {
      return <Text as="p">{t('dbClients.states.loading')}</Text>;
    }
    if (error) {
      return <Text as="p">{t('dbClients.states.error')}</Text>;
    }
    if (notConfigured) {
      return <Text as="p">{t('dbClients.states.notConfigured')}</Text>;
    }
    return <DbClientsTable />;
  })();

  return (
    <Flex direction="column" gap="4" p="4">
      <Text as="p" variant="body-medium" color="secondary">
        {t('dbClients.description')}
      </Text>

      {state}
    </Flex>
  );
};

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

import { devopsDashboardTranslationRef } from '../../i18n';
import { matchesIdOrName } from '../../utils/matchesIdOrName';

/**
 * Static mock of the Database Clients section to agree on the shape before
 * any data layer exists: the rows are hard-coded, and the search filters
 * them client-side. The live version binds the same `Table`/`useTable`
 * combination to real data.
 */

type PlaceholderClient = {
  id: string;
  name: string;
  status: string;
  capabilities: string;
  created: string;
};

const PLACEHOLDER_CLIENTS: PlaceholderClient[] = [
  {
    id: 'spa-client',
    name: 'Single Page App',
    status: 'Active',
    capabilities: 'Code Flow',
    created: '2026-05-14',
  },
  {
    id: 'mobile-app',
    name: 'Mobile App',
    status: 'Active',
    capabilities: 'Code Flow, Refresh Tokens',
    created: '2026-06-02',
  },
  {
    id: 'backend-service',
    name: 'Backend Service',
    status: 'Inactive',
    capabilities: 'Client Credentials',
    created: '2026-07-21',
  },
];

export const DbClientsSection = () => {
  const { t } = useTranslationRef(devopsDashboardTranslationRef);

  const columns: ColumnConfig<PlaceholderClient>[] = [
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
    data: PLACEHOLDER_CLIENTS,
    searchFn: matchesIdOrName,
  });

  return (
    <Flex direction="column" gap="4" p="4">
      <Text as="p" variant="body-medium" color="secondary">
        {t('dbClients.description')}
      </Text>

      <SearchField
        aria-label={t('dbClients.search.label')}
        placeholder={t('dbClients.search.placeholder')}
        value={search.value}
        onChange={search.onChange}
      />

      <Table columnConfig={columns} {...tableProps} />
    </Flex>
  );
};

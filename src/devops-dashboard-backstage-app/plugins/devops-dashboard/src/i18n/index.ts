import { createTranslationRef } from '@backstage/frontend-plugin-api';

import { PLUGIN_ID } from '../plugin';

/**
 * All user-facing texts of the plugin. Host apps can override single
 * messages or add languages by registering a translation resource for
 * this ref.
 */
export const devopsDashboardTranslationRef = createTranslationRef({
  id: PLUGIN_ID,
  messages: {
    dbClients: {
      description:
        'OAuth clients that the Curity Identity Server stores in a database.',
      search: {
        label: 'Search database clients',
        placeholder: 'Search by client ID or name',
      },
      table: {
        clientId: 'Client ID',
        name: 'Name',
        status: 'Status',
        capabilities: 'Capabilities',
        created: 'Created',
      },
    },
  },
});

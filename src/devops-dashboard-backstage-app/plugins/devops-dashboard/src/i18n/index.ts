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
      states: {
        loading: 'Loading database clients…',
        notConfigured:
          'Database clients are not enabled for this profile. Enable them on the Curity Identity Server to see them here.',
        accessDenied:
          'You do not have access to database clients. Your access token must include the admin API scope.',
        error: 'Failed to load database clients.',
      },
      status: {
        active: 'Active',
        inactive: 'Inactive',
      },
      capabilities: {
        code: 'Code Flow',
        implicit: 'Implicit Flow',
        resource_owner_password: 'Resource Owner Password',
        assertion: 'Assertion',
        assisted_token: 'Assisted Token',
        backchannel: 'Backchannel Authentication',
        client_credentials: 'Client Credentials',
        introspection: 'Introspection',
        token_exchange: 'Token Exchange',
        oauth_token_exchange: 'OAuth Token Exchange',
        haapi: 'HAAPI',
      },
    },
  },
});

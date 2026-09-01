import type { ProfileEndpointUrls } from './graphQLApi';
import { DB_CLIENTS_API } from './db-clients/api';

/**
 * Every Curity GraphQL API the dashboard consumes, keyed by the profile
 * endpoint that serves it. Sections bind operations through it, e.g.
 * `useQuery(GRAPHQL_API.dbClients.QUERIES.searchDatabaseClients)`, and the
 * transport derives its operation-to-endpoint routing from it.
 */
export const GRAPHQL_API = {
  dbClients: DB_CLIENTS_API,
} satisfies Partial<Record<keyof ProfileEndpointUrls, object>>;

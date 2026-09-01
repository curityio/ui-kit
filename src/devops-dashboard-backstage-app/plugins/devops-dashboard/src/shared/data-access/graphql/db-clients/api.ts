import { SEARCH_DATABASE_CLIENTS } from './queries/searchDatabaseClients';

export enum DB_CLIENTS_API_OPERATIONS {
  // QUERIES
  SEARCH_DATABASE_CLIENTS = 'searchDatabaseClients',
}

/**
 * The database-clients GraphQL API as this plugin consumes it: one entry
 * per operation, bound to its typed document. Consumed through
 * {@link GRAPHQL_API}, e.g.
 * `useQuery(GRAPHQL_API.dbClients.QUERIES.searchDatabaseClients)`.
 */
export const DB_CLIENTS_API = {
  QUERIES: {
    [DB_CLIENTS_API_OPERATIONS.SEARCH_DATABASE_CLIENTS]:
      SEARCH_DATABASE_CLIENTS,
  },
};

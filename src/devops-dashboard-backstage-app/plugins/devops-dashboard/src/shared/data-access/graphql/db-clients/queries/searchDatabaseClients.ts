import { gql, TypedDocumentNode } from '@apollo/client';

import { DatabaseClientNode } from '../types';

export interface SearchDatabaseClientsResult {
  searchDatabaseClients: {
    edges: Array<{ node: DatabaseClientNode }>;
    pageInfo: { endCursor: string | null; hasNextPage: boolean };
    totalCount: number;
  };
}

export interface SearchDatabaseClientsVariables {
  searchTerms?: string;
  first?: number;
  after?: string;
}

export const SEARCH_DATABASE_CLIENTS: TypedDocumentNode<
  SearchDatabaseClientsResult,
  SearchDatabaseClientsVariables
> = gql`
  query searchDatabaseClients(
    $searchTerms: String
    $first: Int
    $after: String
  ) {
    searchDatabaseClients(
      searchTerms: $searchTerms
      first: $first
      after: $after
    ) {
      edges {
        node {
          client_id
          name
          status
          capabilities {
            code {
              type
            }
            implicit {
              type
            }
            resource_owner_password {
              type
            }
            assertion {
              type
            }
            assisted_token {
              type
            }
            backchannel {
              type
            }
            client_credentials {
              type
            }
            introspection {
              type
            }
            token_exchange {
              type
            }
            oauth_token_exchange {
              type
            }
            haapi {
              type
            }
          }
          meta {
            created
            lastModified
            warnings
          }
        }
      }
      pageInfo {
        endCursor
        hasNextPage
      }
      totalCount
    }
  }
`;

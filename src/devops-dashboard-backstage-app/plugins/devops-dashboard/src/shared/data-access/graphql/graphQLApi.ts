import { ApiBlueprint, createApiRef } from '@backstage/frontend-plugin-api';
import { createApiFactory } from '@backstage/core-plugin-api';
import {
  ApolloClient,
  ApolloLink,
  HttpLink,
  InMemoryCache,
} from '@apollo/client';
import { ErrorLink } from '@apollo/client/link/error';
import { SetContextLink } from '@apollo/client/link/context';
import { from as observableFrom, mergeMap } from 'rxjs';
import {
  ADMIN_API_SCOPE,
  CurityAuthApi,
  curityAuthApiRef,
} from '../curityAuthApi';
import {
  DevOpsDashboardConfigApi,
  devopsDashboardConfigApiRef,
} from '../configApi';
import { GRAPHQL_API } from './GRAPHQL_API';

export interface ProfileEndpointUrls {
  dbClients?: string;
}

/**
 * Which endpoint serves each operation — derived from GRAPHQL_API, so new
 * operations and APIs route without touching the transport.
 */
const ENDPOINT_BY_OPERATION: Record<string, keyof ProfileEndpointUrls> =
  Object.fromEntries(
    (
      Object.entries(GRAPHQL_API) as [
        keyof ProfileEndpointUrls,
        Record<string, Record<string, unknown>>,
      ][]
    ).flatMap(([endpoint, api]) =>
      Object.values(api).flatMap(operations =>
        Object.keys(operations).map(operation => [operation, endpoint]),
      ),
    ),
  );

export interface DevOpsDashboardGraphQLApi {
  /**
   * Apollo client for the profile's Curity GraphQL APIs, or undefined when
   * the profile exposes none ("not configured"). One client (and cache) per
   * profile; operations route to the right endpoint by name.
   */
  getClient(profileId: string): Promise<ApolloClient | undefined>;
}

export const devopsDashboardGraphQLApiRef =
  createApiRef<DevOpsDashboardGraphQLApi>().with({
    id: 'plugin.devops-dashboard.graphql',
  });

/**
 * Mirrors the self-service portal's link chain, so components stay
 * decoupled from transport and auth: `errorLink` (retry a 401 once after a
 * silent token refresh) → `endpointResolverLink` (operation name → endpoint
 * URL) → `authLink` (bearer token with the admin API scope) → `httpLink`.
 * Swapping to the token handler pattern later only changes this factory.
 */
const buildClient = (
  endpointUrls: ProfileEndpointUrls,
  authApi: CurityAuthApi,
) => {
  const errorLink = new ErrorLink(({ error, operation, forward }) => {
    const isUnauthorized =
      !!error &&
      'statusCode' in error &&
      (error as { statusCode?: number }).statusCode === 401;

    if (isUnauthorized) {
      return observableFrom(authApi.getAccessToken([ADMIN_API_SCOPE])).pipe(
        mergeMap(() => forward(operation)),
      );
    }

    return undefined;
  });

  const endpointResolverLink = new ApolloLink((operation, forward) => {
    const endpoint = ENDPOINT_BY_OPERATION[String(operation.operationName)];
    operation.setContext({ uri: endpoint && endpointUrls[endpoint] });
    return forward(operation);
  });

  const authLink = new SetContextLink(async ({ headers }) => ({
    headers: {
      ...headers,
      Authorization: `Bearer ${await authApi.getAccessToken([
        ADMIN_API_SCOPE,
      ])}`,
    },
  }));

  const httpLink = new HttpLink({
    uri: operation => operation.getContext().uri,
  });

  return new ApolloClient({
    link: ApolloLink.from([
      errorLink,
      endpointResolverLink,
      authLink,
      httpLink,
    ]),
    cache: new InMemoryCache(),
  });
};

const createDevOpsDashboardGraphQLApi = (
  configApi: DevOpsDashboardConfigApi,
  authApi: CurityAuthApi,
): DevOpsDashboardGraphQLApi => {
  const clientsByProfile = new Map<string, ApolloClient>();

  return {
    async getClient(profileId) {
      const cached = clientsByProfile.get(profileId);
      if (cached) {
        return cached;
      }

      const profiles = await configApi.getProfiles();
      const profile = profiles.find(({ id }) => id === profileId);
      const endpointUrls = { dbClients: profile?.dbClientsGraphqlUrl };
      if (!endpointUrls.dbClients) {
        return undefined;
      }

      const client = buildClient(endpointUrls, authApi);
      clientsByProfile.set(profileId, client);
      return client;
    },
  };
};

export const graphQLApi = ApiBlueprint.make({
  name: 'graphql',
  params: define =>
    define(
      createApiFactory({
        api: devopsDashboardGraphQLApiRef,
        deps: {
          configApi: devopsDashboardConfigApiRef,
          authApi: curityAuthApiRef,
        },
        factory: ({ configApi, authApi }) =>
          createDevOpsDashboardGraphQLApi(configApi, authApi),
      }),
    ),
});

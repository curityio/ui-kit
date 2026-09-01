import { createContext, ReactNode, useContext } from 'react';
import { PluginWrapperBlueprint, useApi } from '@backstage/frontend-plugin-api';
import { ApolloClient } from '@apollo/client';
import { ApolloProvider } from '@apollo/client/react';
import useAsync from 'react-use/lib/useAsync';

import { devopsDashboardConfigApiRef } from './shared/data-access/configApi';
import { devopsDashboardGraphQLApiRef } from './shared/data-access/graphql/graphQLApi';

/**
 * How far the plugin got in resolving the profile's Apollo client.
 * `notConfigured` = the profile exposes no Curity GraphQL API.
 */
export interface GraphQLClientState {
  loading: boolean;
  error?: Error;
  notConfigured?: boolean;
}

const GraphQLClientContext = createContext<GraphQLClientState>({
  loading: true,
});

/**
 * The client-resolution state, shared by the plugin wrapper below with all
 * the plugin's extensions. Query data does not live here — components run
 * Apollo's `useQuery` against the `ApolloProvider` the wrapper mounts.
 */
export const useGraphQLClientState = (): GraphQLClientState =>
  useContext(GraphQLClientContext);

interface WrapperValue extends GraphQLClientState {
  client?: ApolloClient;
}

const WrapperComponent = ({
  children,
  value,
}: {
  children: ReactNode;
  value: WrapperValue;
}) => (
  <GraphQLClientContext.Provider value={value}>
    {value.client ? (
      <ApolloProvider client={value.client}>{children}</ApolloProvider>
    ) : (
      children
    )}
  </GraphQLClientContext.Provider>
);

/**
 * Wraps every extension of this plugin (see backstage-intro.md, "The role
 * of React"): resolves the profile's Apollo client once and mounts
 * `ApolloProvider`, so all sections use standard Apollo hooks. The
 * `useWrapperValue` hook runs in a single place in the app.
 */
export const devopsDashboardWrapper = PluginWrapperBlueprint.make({
  params: define =>
    define({
      loader: async () => ({
        useWrapperValue: (): WrapperValue => {
          const configApi = useApi(devopsDashboardConfigApiRef);
          const graphQLApi = useApi(devopsDashboardGraphQLApiRef);

          // Single profile for now; the M3 profile picker will hold the
          // selected profile in a utility API this hook reads instead.
          const {
            value: client,
            loading,
            error,
          } = useAsync(async () => {
            const [profile] = await configApi.getProfiles();
            return profile && graphQLApi.getClient(profile.id);
          }, []);

          return {
            client: client || undefined,
            loading,
            error,
            notConfigured: !loading && !error && !client,
          };
        },
        component: WrapperComponent,
      }),
    }),
});

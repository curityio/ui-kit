import {
  ApiBlueprint,
  configApiRef,
  createApiRef,
} from '@backstage/frontend-plugin-api';
import { createApiFactory } from '@backstage/core-plugin-api';

export interface DevOpsDashboardProfile {
  id: string;
  /** Absent when the profile exposes no database-clients GraphQL API. */
  dbClientsGraphqlUrl?: string;
}

export interface DevOpsDashboardConfigApi {
  getProfiles(): Promise<DevOpsDashboardProfile[]>;
}

/**
 * Environment knowledge for the dashboard: which Curity profiles exist and
 * where each one serves its database-clients GraphQL API. Consumers only
 * know this contract — `getProfiles` is async so the source can change
 * without touching them. Today it reads the frontend-visible
 * `devopsDashboard.profiles` app-config (see config.d.ts); a
 * discovery-backed implementation can replace it later.
 */
export const devopsDashboardConfigApiRef =
  createApiRef<DevOpsDashboardConfigApi>().with({
    id: 'plugin.devops-dashboard.config',
  });

export const configApi = ApiBlueprint.make({
  name: 'config',
  params: define =>
    define(
      createApiFactory({
        api: devopsDashboardConfigApiRef,
        deps: { configApi: configApiRef },
        factory: ({ configApi }) => ({
          async getProfiles() {
            return (
              configApi.getOptionalConfigArray('devopsDashboard.profiles') ?? []
            ).map(profile => ({
              id: profile.getString('id'),
              dbClientsGraphqlUrl: profile.getOptionalString(
                'dbClientsGraphqlUrl',
              ),
            }));
          },
        }),
      }),
    ),
});

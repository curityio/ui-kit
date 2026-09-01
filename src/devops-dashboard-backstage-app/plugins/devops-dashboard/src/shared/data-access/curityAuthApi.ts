import {
  ApiBlueprint,
  configApiRef,
  createApiRef,
  discoveryApiRef,
  oauthRequestApiRef,
} from '@backstage/frontend-plugin-api';
import { createApiFactory } from '@backstage/core-plugin-api';
import type {
  BackstageIdentityApi,
  OAuthApi,
  OpenIdConnectApi,
  ProfileInfoApi,
  SessionApi,
} from '@backstage/core-plugin-api';
import { OAuth2 } from '@backstage/core-app-api';

/** The scope the Curity admin API requires on every access token. */
export const ADMIN_API_SCOPE = 'urn:se:curity:scopes:admin:api';

export type CurityAuthApi = OAuthApi &
  OpenIdConnectApi &
  ProfileInfoApi &
  BackstageIdentityApi &
  SessionApi;

/**
 * The plugin's auth contract: an authenticated session against the Curity
 * Identity Server that can mint access tokens, e.g.
 * `getAccessToken([ADMIN_API_SCOPE])`.
 */
export const curityAuthApiRef = createApiRef<CurityAuthApi>().with({
  id: 'auth.curity',
});

/**
 * Default implementation: Backstage's `OAuth2` client (popup, session
 * cache, silent refresh) driving the host app's Curity auth provider —
 * the companion backend this plugin requires. The provider must be
 * registered under the id `curity` (its config then lives at
 * `auth.providers.curity`); that name is the plugin's contract.
 * Host apps with a different auth setup override this factory instead.
 */
export const curityAuthApi = ApiBlueprint.make({
  name: 'curity-auth',
  params: define =>
    define(
      createApiFactory({
        api: curityAuthApiRef,
        deps: {
          discoveryApi: discoveryApiRef,
          oauthRequestApi: oauthRequestApiRef,
          configApi: configApiRef,
        },
        factory: ({ discoveryApi, oauthRequestApi, configApi }) =>
          OAuth2.create({
            configApi,
            discoveryApi,
            oauthRequestApi,
            provider: {
              id: 'curity',
              title: 'Curity',
              icon: () => null,
            },
            environment: configApi.getOptionalString('auth.environment'),
            defaultScopes: [
              'openid',
              'profile',
              ...(configApi.getOptionalStringArray(
                'devopsDashboard.auth.additionalScopes',
              ) ?? []),
              ADMIN_API_SCOPE,
            ],
          }),
      }),
    ),
});

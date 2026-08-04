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
import { CURITY_AUTH_PROVIDER_ID } from 'common';

/**
 * Auth API for the Curity Identity Server (generic OIDC provider).
 * Plugins use this ref to obtain Curity access tokens, e.g.:
 * `curityAuthApiRef.getAccessToken(['urn:se:curity:scopes:admin:api'])`
 */
export const curityAuthApiRef = createApiRef<
  OAuthApi & OpenIdConnectApi & ProfileInfoApi & BackstageIdentityApi & SessionApi
>({
  id: 'auth.curity',
});

/**
 * Registers the implementation behind {@link curityAuthApiRef}: an OAuth2
 * client that drives the backend `oidc` provider (popup, session cache,
 * silent refresh). The provider id must match the backend registration and
 * the `auth.providers` key in app-config.
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
              id: CURITY_AUTH_PROVIDER_ID,
              title: 'Curity',
              icon: () => null,
            },
            environment: configApi.getOptionalString('auth.environment'),
            defaultScopes: ['openid', 'profile', 'urn:se:curity:scopes:admin:api'],
          }),
      }),
    ),
});

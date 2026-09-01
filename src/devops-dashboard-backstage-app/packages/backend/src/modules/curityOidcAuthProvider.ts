import {
  coreServices,
  createBackendModule,
} from '@backstage/backend-plugin-api';
import {
  DEFAULT_NAMESPACE,
  stringifyEntityRef,
} from '@backstage/catalog-model';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
  createSignInResolverFactory,
} from '@backstage/plugin-auth-node';
import type { OAuthAuthenticatorResult } from '@backstage/plugin-auth-node';
import {
  oidcAuthenticator,
  oidcSignInResolvers,
} from '@backstage/plugin-auth-backend-module-oidc-provider';
import type { OidcAuthResult } from '@backstage/plugin-auth-backend-module-oidc-provider';
import { CURITY_AUTH_PROVIDER_ID } from 'common';

/**
 * Development-only sign-in: identifies the user by the token's `sub` claim
 * without requiring a matching User entity in the catalog. The dev-server
 * test users (e.g. janedoe) carry no email claim, so the stock email-based
 * resolvers cannot identify them. Only offered when `auth.environment` is
 * `development`, and only runs when the dev-only app-config.local.yaml
 * names it under `signIn.resolvers` — elsewhere the name does not exist,
 * so config naming it fails at startup.
 */
const subClaimNoCatalogUser = createSignInResolverFactory<
  OAuthAuthenticatorResult<OidcAuthResult>
>({
  create: () => async (info, ctx) => {
    const sub = info.result.fullProfile.userinfo.sub;
    if (!sub) {
      throw new Error('OIDC response is missing the sub claim');
    }
    const userEntityRef = stringifyEntityRef({
      kind: 'User',
      namespace: DEFAULT_NAMESPACE,
      name: sub,
    });
    return ctx.issueToken({
      claims: { sub: userEntityRef, ent: [userEntityRef] },
    });
  },
});

/**
 * Curity sign-in via the generic OIDC authenticator. The resolver is chosen
 * declaratively in config (`auth.providers.curity.<env>.signIn.resolvers`).
 */
export default createBackendModule({
  pluginId: 'auth',
  moduleId: 'curity-oidc-provider',
  register(reg) {
    reg.registerInit({
      deps: {
        providers: authProvidersExtensionPoint,
        config: coreServices.rootConfig,
      },
      async init({ providers, config }) {
        const isDevelopment =
          config.getOptionalString('auth.environment') === 'development';
        providers.registerProvider({
          providerId: CURITY_AUTH_PROVIDER_ID,
          factory: createOAuthProviderFactory({
            authenticator: oidcAuthenticator,
            signInResolverFactories: {
              ...oidcSignInResolvers,
              ...(isDevelopment ? { subClaimNoCatalogUser } : {}),
            },
          }),
        });
      },
    });
  },
});

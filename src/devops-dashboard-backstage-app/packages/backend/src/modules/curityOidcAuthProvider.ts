import { createBackendModule } from '@backstage/backend-plugin-api';
import { DEFAULT_NAMESPACE, stringifyEntityRef } from '@backstage/catalog-model';
import {
  authProvidersExtensionPoint,
  createOAuthProviderFactory,
} from '@backstage/plugin-auth-node';
import { oidcAuthenticator } from '@backstage/plugin-auth-backend-module-oidc-provider';
import { CURITY_AUTH_PROVIDER_ID } from 'common';

/**
 * Curity sign-in via the generic OIDC authenticator, with a sub-based
 * sign-in resolver: the dev-server test users (e.g. janedoe) carry no
 * email claim, so the stock email-based resolvers cannot be used. The
 * user is signed in from the token's `sub` without requiring a matching
 * User entity in the catalog (dev-harness behavior).
 */
export default createBackendModule({
  pluginId: 'auth',
  moduleId: 'curity-oidc-provider',
  register(reg) {
    reg.registerInit({
      deps: { providers: authProvidersExtensionPoint },
      async init({ providers }) {
        providers.registerProvider({
          providerId: CURITY_AUTH_PROVIDER_ID,
          factory: createOAuthProviderFactory({
            authenticator: oidcAuthenticator,
            async signInResolver(info, ctx) {
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
          }),
        });
      },
    });
  },
});

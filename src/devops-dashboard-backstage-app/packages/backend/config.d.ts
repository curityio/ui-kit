export interface Config {
  auth?: {
    providers?: {
      /**
       * The Curity Identity Server sign-in provider, registered by
       * src/modules/curityOidcAuthProvider.ts under the devops-dashboard
       * plugin's contractual provider id `curity`. Keyed by environment
       * and shaped like the generic OIDC provider's configuration, plus
       * the dev-only `subClaimNoCatalogUser` resolver. Mirrored by hand:
       * the OIDC module publishes its schema only as compiled JSON keyed
       * under `oidc` and exports no type to extend.
       */
      curity?: {
        [environment: string]: {
          clientId: string;
          /**
           * @visibility secret
           */
          clientSecret: string;
          metadataUrl: string;
          callbackUrl?: string;
          tokenEndpointAuthMethod?: string;
          tokenSignedResponseAlg?: string;
          additionalScopes?: string | string[];
          prompt?: string;
          signIn?: {
            resolvers: Array<
              | {
                  resolver: 'emailMatchingUserEntityProfileEmail';
                  dangerouslyAllowSignInWithoutUserInCatalog?: boolean;
                }
              | {
                  resolver: 'emailLocalPartMatchingUserEntityName';
                  allowedDomains?: string[];
                  dangerouslyAllowSignInWithoutUserInCatalog?: boolean;
                }
              | {
                  /**
                   * Development only: signs the user in from the token's
                   * `sub` claim without a matching catalog User entity.
                   */
                  resolver: 'subClaimNoCatalogUser';
                }
            >;
          };
        };
      };
    };
  };
}

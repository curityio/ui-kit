export interface Config {
  devopsDashboard?: {
    auth?: {
      /**
       * Extra scopes to request besides openid, profile, and the
       * mandatory Curity admin API scope.
       * @visibility frontend
       */
      additionalScopes?: string[];
    };
    /**
     * The Curity profiles the DevOps Dashboard can show.
     * @visibility frontend
     */
    profiles?: Array<{
      /**
       * The Curity profile id, e.g. "oauth-dev".
       * @visibility frontend
       */
      id: string;
      /**
       * Where the profile serves its database-clients GraphQL API,
       * e.g. "https://localhost:9443/oauth-dev/clients-graphql-api".
       * Omit when the profile exposes none; the dashboard then shows
       * the profile as "not configured".
       * @visibility frontend
       */
      dbClientsGraphqlUrl?: string;
    }>;
  };
}

# DevOps Dashboard Backstage app

The [Backstage](https://backstage.io) host app for the
[Curity DevOps Dashboard plugin](plugins/devops-dashboard/README.md).

The app serves two purposes:

- The development harness for the plugin.
- The basis for the branded Backstage instance that Curity ships.

On top of a standard Backstage app it adds sign-in through the Curity
Identity Server (`packages/app/src/modules/auth`,
`packages/backend/src/modules/curityOidcAuthProvider.ts`), so the plugin can
obtain access tokens for the Curity admin API.

New to Backstage? Start with [Backstage in five minutes](docs/backstage-intro.md).

## Run

Prerequisites: a running Curity Identity Server with the
`devops_dashboard_backstage` OAuth client registered. Register it once with
the configuration shell (from the identity-server repo):

```sh
dist/bin/idsh <<'EOF'
configure
set environments environment services zones default-zone allowed-origins-for-cors [ http://localhost:3000 http://localhost:3001 ]
set environments environment admin-service http restconf oauth oauth-profile oauth-dev
set environments environment admin-service http restconf oauth client [ devops_dashboard_backstage ]
set profiles profile oauth-dev oauth-service settings authorization-server client-store config-backed client devops_dashboard_backstage capabilities code
set profiles profile oauth-dev oauth-service settings authorization-server client-store config-backed client devops_dashboard_backstage secret Password1
set profiles profile oauth-dev oauth-service settings authorization-server client-store config-backed client devops_dashboard_backstage redirect-uris http://localhost:7007/api/auth/curity/handler/frame
set profiles profile oauth-dev oauth-service settings authorization-server client-store config-backed client devops_dashboard_backstage scope openid
set profiles profile oauth-dev oauth-service settings authorization-server client-store config-backed client devops_dashboard_backstage scope profile
set profiles profile oauth-dev oauth-service settings authorization-server client-store config-backed client devops_dashboard_backstage scope email
set profiles profile oauth-dev oauth-service settings authorization-server client-store config-backed client devops_dashboard_backstage scope urn:se:curity:scopes:admin:api
set profiles profile oauth-dev oauth-service settings authorization-server client-store config-backed client devops_dashboard_backstage audience [ devops_dashboard_backstage urn:se:curity:audiences:admin:api ]
set profiles profile oauth-dev oauth-service settings authorization-server client-store config-backed client devops_dashboard_backstage user-authentication allowed-authenticators testAuth-janedoe
commit comment "Register the Backstage dev client"
exit
exit
EOF
```

Notes on the values above:

- The `allowed-origins-for-cors` zone setting lets the browser call the
  database-clients GraphQL API from the Backstage origin.
- The audience must contain **both** the client id (OIDC sign-in validates
  the ID token's `aud` against it) and the admin API audience (required for
  the RESTCONF allow-listing).

To show database clients, the profile also needs the feature enabled and the
GraphQL API authorized. Apply the two DevOps Dashboard enablement patches
(they configure the client data source, the GraphQL endpoint, the
authorization manager, and the groups claim the API requires):
`curity-web-ui/devops-dashboard/cypress/fixtures/enable-dashboard-patch-data.json`
and the `enable-database-clients` recipe in
`curity-web-ui/.claude/skills/enable-database-clients/`.

```sh
yarn install
git apply dev-setup.patch   # creates the gitignored app-config.local.yaml
yarn start
```

Frontend on `http://localhost:3000`, backend on `:7007`. Sign-in starts
automatically when the app opens.

## Tests

```sh
yarn test        # unit tests
yarn test:e2e    # Playwright, against the running app
```

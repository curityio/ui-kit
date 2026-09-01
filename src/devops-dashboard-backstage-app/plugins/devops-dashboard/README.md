# DevOps Dashboard plugin

A Backstage plugin for the Curity DevOps Dashboard.

## What is the Curity DevOps Dashboard?

The [Curity Identity Server](https://curity.io) separates configuration from
runtime data. Server configuration belongs to administrators and lives in the
admin UI. Runtime data — such as OAuth clients stored in a database, sessions,
or tokens — changes while the server runs, and the people who need to see it
are usually operations and support teams, not administrators.

The DevOps Dashboard is the view for those teams. It shows the runtime data of
a running Curity Identity Server without giving access to server configuration.

This plugin brings the DevOps Dashboard into [Backstage](https://backstage.io),
so teams can use it inside the developer portal they already work in. It adds
a **DevOps Dashboard** entry to the Backstage sidebar, with one tab per
section.

## Requirements

- A Backstage app built on the
  [frontend system](https://backstage.io/docs/frontend-system/architecture/index).
- A running Curity Identity Server, reachable from the user's browser.
- Users must be able to authenticate against the Curity Identity Server, and
  their access token must carry the admin API scope
  (`urn:se:curity:scopes:admin:api`). Users without the scope see an
  access-denied message.
- A **companion auth backend**: a Curity auth provider registered in your
  Backstage backend **under the id `curity`**. The plugin ships a default
  auth API that signs users in through that provider, but the provider
  itself lives in the backend — the plugin cannot bring it along. Today
  that means registering a generic OIDC provider that points at your
  Curity Identity Server (this repository's app shows how in
  `packages/backend/src/modules/curityOidcAuthProvider.ts`); a published
  auth backend module will replace that manual step later.

## Auth configuration

The provider id `curity` is the plugin's contract — its auth
API always dials `/api/auth/curity/*`. Register the backend provider under
that id and put its settings under `auth.providers.curity` in your
`app-config.yaml`:

```yaml
auth:
  environment: development
  session:
    secret: ${BACKSTAGE_SESSION_SECRET} # required by the OIDC provider
  providers:
    curity:
      development:
        metadataUrl: https://curity.example.com/oauth/anonymous/.well-known/openid-configuration
        clientId: my-backstage-client
        clientSecret: ${CURITY_CLIENT_SECRET}
        # openid/profile/email are requested by default; the dashboard
        # needs the admin API scope on top
        additionalScopes: 'urn:se:curity:scopes:admin:api'
        # How the Curity identity maps to a Backstage user — see
        # https://backstage.io/docs/auth/oidc/provider
        signIn:
          resolvers:
            - resolver: emailMatchingUserEntityProfileEmail
```

These are the settings of Backstage's generic OIDC provider — its
[documentation](https://backstage.io/docs/auth/oidc/provider) covers the
remaining optional keys.

The plugin reads one optional key from app-config:

```yaml
devopsDashboard:
  auth:
    # Extra scopes to request besides openid, profile, and the admin API
    # scope, which are always requested.
    additionalScopes: []
```

Your app can keep sign-in with another provider and use Curity only for the
dashboard, or use the same Curity provider for both. Apps with their own
Curity auth setup can override the plugin's `curityAuthApiRef` factory
instead of using the default one.

## Install the plugin in your own Backstage app

Installation follows the standard Backstage steps:

1. Add the package to your app:

   ```sh
   yarn --cwd packages/app add @internal/backstage-plugin-devops-dashboard
   ```

2. Let your app discover it. If your `app-config.yaml` enables package
   discovery, you are done:

   ```yaml
   app:
     packages: all
   ```

   Without discovery, register the plugin explicitly in your app's
   `createApp` call:

   ```tsx
   import devopsDashboardPlugin from '@internal/backstage-plugin-devops-dashboard';

   const app = createApp({
     features: [devopsDashboardPlugin],
   });
   ```

3. Register the companion auth provider and configure it as described under
   [Requirements](#requirements) and [Auth configuration](#auth-configuration).

The **DevOps Dashboard** entry then appears in the sidebar, and the page is
available at `/devops-dashboard`.

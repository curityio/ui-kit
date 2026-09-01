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

The **DevOps Dashboard** entry then appears in the sidebar, and the page is
available at `/devops-dashboard`.

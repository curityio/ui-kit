import {
  createFrontendPlugin,
  PageBlueprint,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';
import StorageIcon from '@material-ui/icons/Storage';
import DashboardIcon from '@material-ui/icons/Dashboard';

import { configApi } from './shared/data-access/configApi';
import { curityAuthApi } from './shared/data-access/curityAuthApi';
import { dbClientsRouteRef, rootRouteRef } from './routes';

export const PLUGIN_ID = 'devops-dashboard';

/**
 * The DevOps Dashboard page. Its title and icon double as the app's
 * sidebar entry (nav items are derived from page extensions).
 * Sections attach as sub-pages and render as tabs in the page header.
 */
export const devopsDashboardHomePage = PageBlueprint.make({
  params: {
    path: '/devops-dashboard',
    title: 'DevOps Dashboard',
    icon: <DashboardIcon />,
    routeRef: rootRouteRef,
  },
});

export const dbClientsSubPage = SubPageBlueprint.make({
  // Attachment is by computed ID string: `page:<pluginId>` is the ID the
  // unnamed (default) page extension above gets — no object reference exists.
  attachTo: { id: `page:${PLUGIN_ID}`, input: 'pages' },
  name: 'db-clients',
  params: {
    path: 'db-clients',
    title: 'Database Clients',
    icon: <StorageIcon />,
    routeRef: dbClientsRouteRef,
    loader: () =>
      import('./db-clients/feature/DbClientsSection').then(m => (
        <m.DbClientsSection />
      )),
  },
});

const devopsDashboardPluginRoutingAPI = {
  root: rootRouteRef,
  dbClients: dbClientsRouteRef,
};

export const devopsDashboardPlugin = createFrontendPlugin({
  pluginId: PLUGIN_ID,
  extensions: [
    devopsDashboardHomePage,
    dbClientsSubPage,
    configApi,
    curityAuthApi,
  ],
  routes: devopsDashboardPluginRoutingAPI,
});

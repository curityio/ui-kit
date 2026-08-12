import {
  createFrontendPlugin,
  PageBlueprint,
  SubPageBlueprint,
} from '@backstage/frontend-plugin-api';
import StorageIcon from '@material-ui/icons/Storage';
import DashboardIcon from '@material-ui/icons/Dashboard';

import { dbClientsRouteRef, rootRouteRef } from './routes';

export const PLUGIN_ID = 'devops-dashboard';

/**
 * Extension IDs follow `<kind>:<namespace>[/<name>]`, where the namespace
 * defaults to the plugin ID. Sub-pages attach to the page through this.
 */
const PAGE_EXTENSION_ID = `page:${PLUGIN_ID}`;

/**
 * The DevOps Dashboard page. Its title and icon double as the app's
 * sidebar entry (nav items are derived from page extensions).
 * Sections attach as sub-pages and render as tabs in the page header.
 */
export const homePage = PageBlueprint.make({
  params: {
    path: '/devops-dashboard',
    title: 'DevOps Dashboard',
    icon: <DashboardIcon />,
    routeRef: rootRouteRef,
  },
});

export const dbClientsSubPage = SubPageBlueprint.make({
  attachTo: { id: PAGE_EXTENSION_ID, input: 'pages' },
  name: 'db-clients',
  params: {
    path: 'db-clients',
    title: 'Database Clients',
    icon: <StorageIcon />,
    routeRef: dbClientsRouteRef,
    loader: () =>
      import('./components/DbClientsSection').then(m => <m.DbClientsSection />),
  },
});

export const devopsDashboardPlugin = createFrontendPlugin({
  pluginId: PLUGIN_ID,
  extensions: [homePage, dbClientsSubPage],
  routes: {
    root: rootRouteRef,
    dbClients: dbClientsRouteRef,
  },
});

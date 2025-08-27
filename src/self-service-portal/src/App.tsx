import { createBrowserRouter, RouterProvider } from 'react-router';
import { ROUTES } from './routes';
import { BOOTSTRAP_UI_CONFIG } from '@/BOOTSTRAP_UI_CONFIG';

const router = createBrowserRouter(ROUTES, { basename: BOOTSTRAP_UI_CONFIG.PATHS.APP_BASE });

export function App() {
  return <RouterProvider router={router}></RouterProvider>;
}

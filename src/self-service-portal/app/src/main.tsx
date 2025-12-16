import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { App } from './App';

import '@curity/ui-kit-css/lib/dist/index.css';
import '@styles/ssp-header.css';
import '@styles/ssp-index.css';
import '@styles/ssp-layout.css';
import '@styles/ssp-user-menu.css';
import '@styles/tables/ssp-table-cell.css';
import '@styles/tables/ssp-table-row.css';
import '@styles/tables/ssp-table.css';

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
  </StrictMode>
);

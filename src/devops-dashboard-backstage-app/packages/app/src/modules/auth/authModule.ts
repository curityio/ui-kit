import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { curityAuthApi } from './curityAuthApi';
import { signInPage } from './signInPage';

/**
 * Overrides the core `app` plugin with the Curity auth extensions:
 * the {@link curityAuthApiRef} implementation and the sign-in page gate.
 */
export const authModule = createFrontendModule({
  pluginId: 'app',
  extensions: [curityAuthApi, signInPage],
});

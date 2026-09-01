import { createFrontendModule } from '@backstage/frontend-plugin-api';
import { SignInPageBlueprint } from '@backstage/plugin-app-react';
import { SignInPage } from '@backstage/core-components';
import type { SignInPageProps } from '@backstage/core-plugin-api';
import { CURITY_AUTH_PROVIDER_ID } from 'common';
import { curityAuthApiRef } from '@internal/backstage-plugin-devops-dashboard';

/**
 * Replaces the app's sign-in page: gates the whole app behind a Curity
 * login (`auto` starts the flow on load, no button click needed).
 */
const signInPage = SignInPageBlueprint.make({
  params: {
    loader: async () => (props: SignInPageProps) => (
      <SignInPage
        {...props}
        auto
        provider={{
          id: CURITY_AUTH_PROVIDER_ID,
          title: 'Curity',
          message: 'Sign in using the Curity Identity Server',
          apiRef: curityAuthApiRef,
        }}
      />
    ),
  },
});

export const signInModule = createFrontendModule({
  pluginId: 'app',
  extensions: [signInPage],
});

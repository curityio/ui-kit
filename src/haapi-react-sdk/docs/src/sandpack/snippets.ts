/*
 * Copyright (C) 2026 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import type { SandpackFiles } from '@codesandbox/sandpack-react';
import { haapiClosureFiles } from './closure';

/**
 * Isolated, runnable docs snippets. Each is the `/App.tsx` source shown in the Sandpack editor, mounted
 * over the shared SDK closure. Authored for the docs (separate from the Vite previewer's switch).
 */

const defaultRenderingApp = `import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { config } from './config';

export default function App() {
  return (
    <HaapiStepper config={config}>
      <HaapiStepperStepUI />
    </HaapiStepper>
  );
}
`;

// Boilerplate config kept out of the snippet (hidden tab) so the example stays focused on the SDK usage.
const haapiConfig = `import type { HaapiStepperConfig } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/haapi-stepper.types';

export const config: HaapiStepperConfig = {
  bootstrap: {
    initialUrl: '/',
    haapi: { clientId: 'docs', tokenEndpoint: 'https://mock.invalid/oauth/token' },
  },
  autoRedirectOnAuthenticationComplete: false,
};
`;

/** Default rendering: the real `<HaapiStepperStepUI>` against the mock login step. */
export const defaultRenderingFiles: SandpackFiles = {
  ...haapiClosureFiles,
  '/config.ts': haapiConfig,
  '/App.tsx': defaultRenderingApp,
};

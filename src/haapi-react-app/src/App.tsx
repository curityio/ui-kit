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

import { Layout } from './shared/ui/Layout';
import { HaapiAppConfigProvider } from './shared/feature/app-config/HaapiAppConfigProvider';
import { ErrorBoundary } from './shared/feature/error-handling/ErrorBoundary';
import { HaapiStepperStepUI } from '@curity/haapi-react-sdk/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { HaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepper';
import { HaapiStepperErrorNotifier } from '@curity/haapi-react-sdk/haapi-stepper/feature/stepper/HaapiStepperErrorNotifier';

export function App() {
  return (
    <HaapiAppConfigProvider>
      <ErrorBoundary>
        <HaapiStepper>
          <Layout>
            <HaapiStepperErrorNotifier>
              <HaapiStepperStepUI />
            </HaapiStepperErrorNotifier>
          </Layout>
        </HaapiStepper>
      </ErrorBoundary>
    </HaapiAppConfigProvider>
  );
}

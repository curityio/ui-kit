/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { Layout } from './shared/ui/Layout';
import { DevBar } from './shared/ui/devbar/DevBar';
import { ErrorBoundary } from './shared/feature/error-handling/ErrorBoundary';
import { HaapiStepperStepUI } from './haapi-stepper/feature/steps/HaapiStepperStepUI';
import { HaapiStepper } from './haapi-stepper/feature/stepper/HaapiStepper';
import { HaapiStepperErrorNotifier } from './haapi-stepper/feature';

export function App() {
  return (
    <ErrorBoundary>
      <HaapiStepper>
          <Layout>
            <DevBar />
            <HaapiStepperStepUI />
          </Layout>
      </HaapiStepper>
    </ErrorBoundary>
  );
}

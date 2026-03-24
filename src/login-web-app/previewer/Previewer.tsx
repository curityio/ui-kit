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

import { useState } from 'react';
import { StartPage } from './pages/StartPage';
import { examplesById } from './examples.ts';
import { Layout } from './shared/ui/layout/Layout';
import { Preview } from './shared/ui/preview/Preview';
import { formatErrorStepData } from '../src/haapi-stepper/feature/stepper/data-formatters/problem-step';
import { formatNextStepData } from '../src/haapi-stepper/feature/stepper/data-formatters/format-next-step-data';
import { HaapiStepperContext } from '../src/haapi-stepper/feature/stepper/HaapiStepperContext';
import { type HaapiStepperAPI } from '../src/haapi-stepper/feature/stepper/haapi-stepper.types';
import { HaapiErrorStep } from '../src/haapi-stepper/data-access';

enum Page {
  START = 'start',
}

const nextStep: HaapiStepperAPI['nextStep'] = (...args) => {
  console.log('nextStep called with arguments:', args);
};

const baseContextValue: Omit<HaapiStepperAPI, 'currentStep' | 'error'> = {
  loading: false,
  nextStep,
  history: [],
};

export function Previewer() {
  const [currentPage, setCurrentPage] = useState(Page.START);
  const [showError, setShowError] = useState(false);

  const example = examplesById.get(currentPage);

  const error = (showError && example ? example.error : null) as HaapiErrorStep | null;

  const mockHaapiStepperValue: HaapiStepperAPI = Object.assign({}, baseContextValue, {
    currentStep: example?.step ? formatNextStepData(example.step) : null,
    error: error ? formatErrorStepData(error) : null,
  });

  const renderPreview = () => {
    if (example) {
      return <Preview key={example.id} title={example.title} step={example.step} onErrorToggle={setShowError} />;
    }

    return <StartPage />;
  };

  return (
    <HaapiStepperContext value={mockHaapiStepperValue}>
      <Layout onNavigate={page => setCurrentPage(page as Page)} currentPage={currentPage}>
        {renderPreview()}
      </Layout>
    </HaapiStepperContext>
  );
}

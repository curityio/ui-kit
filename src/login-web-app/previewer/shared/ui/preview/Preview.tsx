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
import { HaapiActionStep, HaapiCompletedStep } from '../../../../src/haapi-stepper/data-access';
import { HaapiStepperStepUI } from '../../../../src/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { JsonRepresentation } from '../json-representation/JsonRepresentation';
import { Main } from '../main/Main';
import { Header } from '../page-header/PageHeader';
import { PreviewLayout } from '../preview-layout/PreviewLayout';

interface PreviewProps {
  title: string;
  step: HaapiActionStep | HaapiCompletedStep;
  onErrorToggle: (showError: boolean) => void;
}

export function Preview({ title, step, onErrorToggle }: PreviewProps) {
  const [, setHasError] = useState<boolean>(false);

  const handleErrorToggle = (hasError: boolean) => {
    setHasError(hasError);
    onErrorToggle(hasError);
  };

  return (
    <PreviewLayout>
      <Header title={title} setHasError={handleErrorToggle} />
      <Main>
        <HaapiStepperStepUI />
        <JsonRepresentation data={step} />
      </Main>
    </PreviewLayout>
  );
}

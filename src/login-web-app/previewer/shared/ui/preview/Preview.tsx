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

import { useState } from 'react';
import { HaapiActionStep, HaapiCompletedStep } from '../../../../src/haapi-stepper/data-access';
import { HaapiStepperStepUI } from '../../../../src/haapi-stepper/feature/steps/HaapiStepperStepUI';
import { JsonRepresentation } from '../json-representation/JsonRepresentation';
import { Main } from '../main/Main';
import { Header } from '../page-header/PageHeader';
import { PreviewLayout } from '../preview-layout/PreviewLayout';
import { PageSymbol } from '../../../../src/shared/ui/PageSymbol';
import { Well } from '../../../../src/haapi-stepper/ui/well/Well';
import { useHaapiAppConfig } from '../../../../src/shared/feature/app-config/HaapiAppConfigHook';
import { Logo } from '../../../../src/shared/ui/Logo';
import styles from './preview.module.css';

interface PreviewProps {
  title: string;
  step: HaapiActionStep | HaapiCompletedStep;
  onErrorToggle: (showError: boolean) => void;
}

export function Preview({ title, step, onErrorToggle }: PreviewProps) {
  const [, setHasError] = useState<boolean>(false);
  const currentPage = step.metadata?.viewName ?? 'Unknown view';
  const { isInsideWell } = useHaapiAppConfig().theme.logo ?? {};

  const handleErrorToggle = (hasError: boolean) => {
    setHasError(hasError);
    onErrorToggle(hasError);
  };

  return (
    <PreviewLayout>
      <Header title={title} setHasError={handleErrorToggle} />
      <Main>
        <div className={styles.appView}>
          {!isInsideWell && <Logo />}
          <Well>
            {isInsideWell && <Logo />}
            <PageSymbol viewName={currentPage} />
            <HaapiStepperStepUI />
          </Well>
        </div>
        <JsonRepresentation data={step} />
      </Main>
    </PreviewLayout>
  );
}

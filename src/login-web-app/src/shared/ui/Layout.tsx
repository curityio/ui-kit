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

import { ReactNode } from 'react';
import { Well } from '../../haapi-stepper/ui/well/Well';
import { useAppConfig } from '../feature/app-config/AppConfigHook';
import { useHaapiStepper } from '../../haapi-stepper/feature/stepper/HaapiStepperHook';
import { Logo } from './Logo';
import { PageSymbol } from './PageSymbol';

export const Layout = ({ children }: { children: ReactNode }) => {
  const { isInsideWell } = useAppConfig().theme.logo;
  const { currentStep } = useHaapiStepper();

  return (
    <>
      <main className="app-layout">
        {!isInsideWell && <Logo />}
        <Well>
          {isInsideWell && <Logo />}
          <div className="h100">
            <PageSymbol viewName={currentStep?.metadata?.viewName} />
            {children}
          </div>
        </Well>
      </main>
    </>
  );
};

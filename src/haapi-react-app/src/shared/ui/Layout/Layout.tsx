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
import { useHaapiAppConfig } from '../../feature/app-config/HaapiAppConfigHook';
import { Logo } from '../Logo/Logo';
import { PageSymbol } from '../PageSymbol/PageSymbol';
import { useHaapiStepper } from '@curity/haapi-react-sdk/haapi-stepper/feature';
import { Well } from '../Well';

export const Layout = ({ children }: { children: ReactNode }) => {
  const { currentStep } = useHaapiStepper();
  const { isInsideWell } = useHaapiAppConfig().theme.logo ?? {};

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

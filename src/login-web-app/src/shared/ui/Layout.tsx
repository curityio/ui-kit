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
import { Header } from './header/Header';
import { configuration } from '../../haapi-stepper/data-access/bootstrap-configuration';
import { Well } from '../../haapi-stepper/ui/well/Well';

export const Layout = ({ children }: { children: ReactNode }) => {
  const logo = configuration.theme.logo;
  const logoElement = <img className="haapi-stepper-logo" src={logo.path} alt="" role="presentation" />;

  return (
    <>
      {!logo.isInsideWell && logoElement}
      <Well>
        {logo.isInsideWell && logoElement}
        <div className="h100">
          <Header />
          <main className="app-layout">{children}</main>
        </div>
      </Well>
    </>
  );
};

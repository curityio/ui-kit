/*
 * Copyright (C) 2024 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { Header, toUiKitTranslation } from '@curity/ui-kit-component-library';
import { Sidebar } from './sidebar/Sidebar';
import { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '@shared/utils/useRouteTitle.tsx';
import { useAuth } from '@auth/data-access/AuthProvider.tsx';

export interface LayoutProps {
  children?: React.ReactNode;
}

export const Layout = ({ children }: LayoutProps) => {
  const [isSidebarOpen, setIsSidebarOpen] = useState(false);
  const { t } = useTranslation();
  const toUiKitT = toUiKitTranslation(t);
  const pageTitle = usePageTitle();
  const authContext = useAuth();

  const toggleSidebar = () => {
    setIsSidebarOpen(!isSidebarOpen);
  };

  const location = useLocation();

  useEffect(() => {
    if (isSidebarOpen) {
      // TODO IS-10689
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setIsSidebarOpen(false);
    }
  }, [location]);

  return (
    <>
      <Header
        toggleSidebar={toggleSidebar}
        isSidebarOpen={isSidebarOpen}
        isLoggedIn={!!authContext?.session?.isLoggedIn}
        t={toUiKitT}
        userName={authContext?.session?.idTokenClaims?.sub}
        pageTitle={pageTitle}
        onSignOut={authContext.logout}
      />
      <div className={`app-container ${isSidebarOpen && 'app-container-sidebar-open'}`}>
        <Sidebar />
        <main>{children}</main>
      </div>
    </>
  );
};

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

import { IconGeneralKebabMenu, IconVciCredentialHome } from '@curity/ui-kit-icons';
import { Link } from 'react-router';
import { useEffect } from 'react';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { Button } from '@curity/ui-kit-component-library';
import classes from './header.module.css';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '@/shared/utils/useRouteTitle';
import { Breadcrumbs } from '@/shared/ui/Breadcrumbs';
import { UserMenu } from '../user-menu/UserMenu';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const { t } = useTranslation();
  const pageTitle = usePageTitle();
  const authContext = useAuth();

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle, t]);

  return (
    <header
      className={`${classes.header} px2 flex flex-center flex-gap-1 justify-between w100`}
      role="banner"
      aria-label={`${t('header')}`}
    >
      <div className="flex flex-center" data-testid="app-title">
        <Link to="/" className="button button-tiny button-transparent">
          <IconVciCredentialHome width={24} height={24} />
        </Link>
        <Breadcrumbs pageTitle={pageTitle} />
      </div>

      <div className="flex flex-center flex-gap-1 nowrap">
        {authContext?.session?.isLoggedIn && (
          <UserMenu username={authContext?.session?.idTokenClaims?.sub} onSignOut={authContext.logout} />
        )}

        <Button
          icon={<IconGeneralKebabMenu width={24} height={24} />}
          aria-label={t('toggle-sidebar-navigation')}
          className="button-tiny button-transparent"
          onClick={toggleSidebar}
          aria-expanded={isSidebarOpen}
          aria-controls="sidebar-navigation"
          data-testid="sidebar-toggle"
        />
      </div>
    </header>
  );
};

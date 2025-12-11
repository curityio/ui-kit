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
import { Button } from '../Button';
import classes from './header.module.css';
import { Breadcrumbs } from '@components/Breadcrumbs';
import { UserMenu } from '../user-menu/UserMenu';
import { TranslationFunction } from '@/types/util.type.ts';

interface HeaderProps {
  isSidebarOpen: boolean;
  isLoggedIn: boolean;
  pageTitle: string;
  userName: string;
  toggleSidebar: () => void;
  onSignOut: () => void;
  t: TranslationFunction;
}

export const Header = ({
  toggleSidebar,
  isSidebarOpen,
  pageTitle,
  onSignOut,
  isLoggedIn,
  userName,
  t,
}: HeaderProps) => {
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
        {isLoggedIn && <UserMenu username={userName} onSignOut={onSignOut} t={t} />}

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

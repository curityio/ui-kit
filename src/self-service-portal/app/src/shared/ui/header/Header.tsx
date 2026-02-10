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

import { useAuth } from '@/auth/data-access/AuthProvider';
import { usePageTitle } from '@/shared/utils/useRouteTitle';
import { Breadcrumbs, Button, toUiKitTranslation, UserMenu } from '@curity/ui-kit-component-library';
import { IconGeneralChevron, IconGeneralKebabMenu, IconGeneralLock, IconVciCredentialHome } from '@curity/ui-kit-icons';
import { useEffect, useRef, useState } from 'react';
import { useTranslation } from 'react-i18next';
import { Link } from 'react-router';
import styles from './header.module.css';
import { BOOTSTRAP_UI_CONFIG } from '@/BOOTSTRAP_UI_CONFIG.ts';
import { UiConfigMetadataResponse } from '@/ui-config/typings.ts';
import { setupI18nTranslations } from '@/i18n/setup-translations.ts';

interface HeaderProps {
  toggleSidebar: () => void;
  isSidebarOpen: boolean;
}

export const Header = ({ toggleSidebar, isSidebarOpen }: HeaderProps) => {
  const { t } = useTranslation();
  const uiKitT = toUiKitTranslation(t);
  const pageTitle = usePageTitle();
  const authContext = useAuth();
  const menuContainerRef = useRef<HTMLDivElement | null>(null);
  const menuButtonRef = useRef<HTMLButtonElement | null>(null);

  const [isLanguageSelectorOpen, setIsLanguageSelectorOpen] = useState(false);
  const [language, setLanguage] = useState(null);

  const onSelectLanguage = (e: React.MouseEvent<HTMLButtonElement>) => {
    setLanguage(e.target.innerText.toLowerCase());
  };

  async function setNewLanguage(requestURI: string): Promise<{ [key: string]: string }> {
    const uiConfigMetadataResponse = await fetch(requestURI, {
      credentials: 'include',
    });

    if (uiConfigMetadataResponse.status !== 200) {
      throw new Error('Failed to fetch metadata');
    }

    const uiConfigMetadataResponseJSON: UiConfigMetadataResponse = await uiConfigMetadataResponse.json();
    const { messages } = uiConfigMetadataResponseJSON;

    return messages;
  }

  useEffect(() => {
    if (!language) {
      return;
    }

    const requestURI = `${BOOTSTRAP_UI_CONFIG.PATHS.BACKEND}${BOOTSTRAP_UI_CONFIG.PATHS.METADATA}?ui_locales=${language}`;
    console.log('requestURI', requestURI);
    setNewLanguage(requestURI).then(messages => {
      setupI18nTranslations(messages);
    });
  }, [language]);

  // TODO: this logic should be extracted to a custom hook, as it is repeated in the UserMenu component.
  //  The hook should receive as parameters whether the menu is open, (as well as the setter for it)
  //  a ref to the menu container and a ref to the button that opens the menu, and should return a function to toggle the menu open state
  useEffect(() => {
    if (!isLanguageSelectorOpen) return;

    const closeMenuOnOutsideClick = (event: MouseEvent) => {
      const clickedOutsideMenu = menuContainerRef.current && !menuContainerRef.current.contains(event.target as Node);

      if (clickedOutsideMenu) {
        setIsLanguageSelectorOpen(false);
      }
    };

    const closeMenuOnEscape = (event: globalThis.KeyboardEvent) => {
      if (event.key === 'Escape' && isLanguageSelectorOpen) {
        setIsLanguageSelectorOpen(false);
        menuButtonRef.current?.focus();
      }
    };

    document.addEventListener('mousedown', closeMenuOnOutsideClick);
    document.addEventListener('keydown', closeMenuOnEscape);

    return () => {
      document.removeEventListener('mousedown', closeMenuOnOutsideClick);
      document.removeEventListener('keydown', closeMenuOnEscape);
    };
  }, [isLanguageSelectorOpen]);

  useEffect(() => {
    document.title = pageTitle;
  }, [pageTitle, t]);

  return (
    <header
      className={`${styles.header} px2 flex flex-center flex-gap-1 justify-between w100`}
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
          <>
            {/*
              TODO: the language selector should be extracted to its own component in @curity/ui-kit-component-library,
              as it is a separate concern from the user menu and it will make the Header component cleaner and more readable.
            */}
            <div className="relative" ref={menuContainerRef}>
              <Button
                ref={menuButtonRef}
                onClick={() => setIsLanguageSelectorOpen(currentIsOpen => !currentIsOpen)}
                className="button button-tiny button-transparent"
                aria-expanded={isLanguageSelectorOpen}
                aria-haspopup="menu"
                aria-controls="language-selector"
                data-testid="user-menu-button"
              >
                <span className={styles['user-menu-username']}>EN</span>
                <span
                  className={`${styles['user-menu-chevron']} ${isLanguageSelectorOpen ? styles['user-menu-chevron-open'] : ''}`}
                >
                  <IconGeneralChevron width={16} height={16} aria-hidden="true" />
                </span>
              </Button>

              {isLanguageSelectorOpen && (
                <div
                  id="language-selector"
                  className={`flex flex-column flex-gap-0 br-8 ${styles['user-menu']} ${isLanguageSelectorOpen ? styles['user-menu-open'] : ''}`}
                  role="menu"
                  tabIndex={-1}
                >
                  <Button
                    icon={<IconGeneralLock width={24} height={24} aria-hidden="true" />}
                    title={t('SV')}
                    className="button-tiny button-link"
                    onClick={onSelectLanguage}
                    value="sv"
                    data-testid="logout-button"
                    role="menuitem"
                    tabIndex={1}
                  />
                  <Button
                    icon={<IconGeneralLock width={24} height={24} aria-hidden="true" />}
                    title={t('PT')}
                    className="button-tiny button-link"
                    onClick={onSelectLanguage}
                    value="pt"
                    data-testid="logout-button"
                    role="menuitem"
                    tabIndex={2}
                  />
                </div>
              )}
            </div>

            <UserMenu username={authContext?.session?.idTokenClaims?.sub} onSignOut={authContext.logout} t={uiKitT} />
          </>
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

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
import { useState } from 'react';
import { useAuth } from '../data-access/AuthProvider.tsx';
import { useTranslation } from 'react-i18next';

export const SignInButton = () => {
  const authContext = useAuth();
  const [isClicked, setIsClicked] = useState(false);
  const { t } = useTranslation();

  const handleClick = () => {
    setIsClicked(true);
    authContext.startLogin();
  };

  return (
    <button
      aria-busy={isClicked ? 'true' : 'false'}
      aria-label={isClicked ? t('loading') : t('sign-in')}
      onClick={handleClick}
      className={`button button-fullwidth button-primary button-loading button-medium w100 ${
        isClicked && 'button-loading-active'
      }`}
      data-testid="sign-in"
    >
      <span aria-label={isClicked ? t('loading') : t('sign-in')}>{t('sign-in')}</span>
    </button>
  );
};

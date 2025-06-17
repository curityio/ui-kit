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

import { Login } from '@/shared/ui/login/Login';
import { useTranslation } from 'react-i18next';

export const LoginPage = () => {
  const { t } = useTranslation();

  return (
    <Login title={t('Welcome to the User Self Service Portal!')} description={t('Sign in to Manage your account')} />
  );
};

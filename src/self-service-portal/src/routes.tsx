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

import { Navigate, Outlet, RouteObject } from 'react-router';
import { Layout } from './components/layout/Layout';
import { Account } from './pages/Account';
import { LoginPage } from './auth/ui/LoginPage.tsx';
import { NoMatch } from './pages/NoMatch';
import { Security } from './pages/Security';
import { Email } from './pages/security/email/Email.tsx';
import { Totp } from './pages/security/Totp.tsx';
import { Phone } from './pages/security/phone/Phone';
import { Sessions } from './pages/Sessions';
import { AuthRoutes } from './auth/feature/AuthRoutes.tsx';
import { AuthProvider } from './auth/data-access/AuthProvider.tsx';
import { GraphQLAPIProvider } from '@shared/data-access/API/GraphQLAPIProvider.tsx';
import { LinkedAccounts } from '@/pages/LinkedAccounts.tsx';
import { AppsAndServicesDetail } from './pages/apps-and-services/AppsAndServicesDetail.tsx';
import { Address } from './pages/account/Address.tsx';
import { AppsAndServices } from './pages/apps-and-services/AppsAndServices.tsx';
import { UiConfigProvider } from '@/ui-config/data-access/UiConfigProvider.tsx';
import { UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { UiConfigIfRoute } from '@/ui-config/feature/UiConfigIfRoute';
import { FeatureNotAvailable } from '@/shared/ui/FeatureNotAvailable';
import { MFA } from '@/pages/security/MFA.tsx';
import { Toaster } from 'react-hot-toast';
import { Password } from '@/pages/Password/feature/Password';
import { RouteErrorBoundary } from '@/error-handling/RouteErrorBoundary';
import { appToastConfig } from '@/util';
import { Passkeys } from '@/pages/security/Passkeys/Passkeys';

export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: 'login',
  CREATE_ACCOUNT: 'create-account',
  ACCOUNT: 'account',
  ACCOUNT_ADDRESS: 'account/address',
  LINKED_ACCOUNTS: 'linked-accounts',
  APPS_AND_SERVICES: 'apps-and-services',
  SECURITY: 'security',
  SESSIONS: 'sessions',
  SECURITY_OTP: 'security/otp',
  SECURITY_PHONE: 'security/phone',
  SECURITY_EMAIL: 'security/email',
  SECURITY_PASSWORD: '/security/password',
  SECURITY_MFA: 'security/mfa',
  SECURITY_PASSKEYS: 'security/passkeys',
  FEATURE_NOT_AVAILABLE: 'feature-not-available',
};

export type USSPRouteConfig = RouteObject & {
  title?: string;
  resources?: UI_CONFIG_RESOURCES[];
  children?: USSPRouteConfig[];
};

const AUTHENTICATED_ROUTES: USSPRouteConfig[] = [
  {
    path: ROUTE_PATHS.HOME,
    element: <Navigate to={ROUTE_PATHS.ACCOUNT} replace />,
  },
  {
    path: ROUTE_PATHS.ACCOUNT,
    title: 'Account',
    element: (
      <UiConfigIfRoute>
        <Account />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME, UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS],
  },
  {
    path: ROUTE_PATHS.ACCOUNT_ADDRESS,
    title: 'Account / Address',
    element: <Address />,
  },
  {
    path: ROUTE_PATHS.LINKED_ACCOUNTS,
    title: 'Linked Accounts',
    element: (
      <UiConfigIfRoute>
        <LinkedAccounts />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_LINKED_ACCOUNTS],
  },
  {
    path: ROUTE_PATHS.APPS_AND_SERVICES,
    title: 'Apps and Services',
    element: (
      <UiConfigIfRoute>
        <AppsAndServices />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.GRANTED_AUTHORIZATIONS_GRANTED_AUTHORIZATIONS],
  },
  {
    path: ROUTE_PATHS.SECURITY,
    title: 'Security',
    element: (
      <UiConfigIfRoute>
        <Security />
      </UiConfigIfRoute>
    ),
    resources: [
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSWORD,
      UI_CONFIG_RESOURCES.GRANTED_AUTHORIZATIONS_GRANTED_AUTHORIZATIONS,
    ],
  },
  {
    path: ROUTE_PATHS.SECURITY_OTP,
    title: 'Security / OTP Authenticators',
    element: (
      <UiConfigIfRoute>
        <Totp />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP],
  },
  {
    path: ROUTE_PATHS.SECURITY_PHONE,
    title: 'Security / Phone Numbers',
    element: (
      <UiConfigIfRoute>
        <Phone />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER],
  },
  {
    path: ROUTE_PATHS.SECURITY_EMAIL,
    title: 'Security / Email addresses',
    element: (
      <UiConfigIfRoute>
        <Email />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL],
  },
  {
    path: ROUTE_PATHS.SECURITY_PASSWORD,
    title: 'Security / Password',
    element: (
      <UiConfigIfRoute>
        <Password />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSWORD],
  },
  {
    path: ROUTE_PATHS.SECURITY_MFA,
    title: 'Security / Multi-factor Authentication',
    element: (
      <UiConfigIfRoute>
        <MFA />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA],
  },
  {
    path: ROUTE_PATHS.SECURITY_PASSKEYS,
    title: 'Security / Passkeys',
    element: (
      <UiConfigIfRoute>
        <Passkeys />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSKEYS],
  },
  {
    path: `${ROUTE_PATHS.APPS_AND_SERVICES}/:id`,
    title: 'App Detail',
    element: (
      <UiConfigIfRoute>
        <AppsAndServicesDetail />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.GRANTED_AUTHORIZATIONS_GRANTED_AUTHORIZATIONS],
  },
  {
    path: ROUTE_PATHS.SESSIONS,
    title: 'Sessions',
    element: (
      <UiConfigIfRoute>
        <Sessions />
      </UiConfigIfRoute>
    ),
  },
];

export const ROUTES: USSPRouteConfig[] = [
  {
    path: ROUTE_PATHS.HOME,
    element: (
      <UiConfigProvider>
        <AuthProvider />
      </UiConfigProvider>
    ),
    children: [
      {
        path: ROUTE_PATHS.HOME,
        element: (
          <AuthRoutes>
            <GraphQLAPIProvider>
              <Layout>
                <RouteErrorBoundary>
                  <Outlet />
                </RouteErrorBoundary>
              </Layout>
              <Toaster toastOptions={appToastConfig} />
            </GraphQLAPIProvider>
          </AuthRoutes>
        ),
        children: AUTHENTICATED_ROUTES,
      },
      {
        path: ROUTE_PATHS.LOGIN,
        title: 'Self Service Portal',
        element: <LoginPage />,
      },
      {
        path: ROUTE_PATHS.FEATURE_NOT_AVAILABLE,
        title: 'Feature Not Available',
        element: <FeatureNotAvailable />,
      },
      {
        path: '*',
        element: <NoMatch />,
      },
    ],
  },
];

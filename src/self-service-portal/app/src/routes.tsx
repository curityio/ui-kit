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

import { Outlet, RouteObject } from 'react-router';
import { Layout } from './components/layout/Layout.tsx';
import { Account } from './pages/Account.tsx';
import { LoginPage } from './auth/ui/LoginPage.tsx';
import { NoMatch } from './pages/NoMatch.tsx';
import { Security } from './pages/Security.tsx';
import { Totp } from './pages/security/Totp.tsx';
import { AuthRoutes } from './auth/feature/AuthRoutes.tsx';
import { AuthProvider } from './auth/data-access/AuthProvider.tsx';
import { GraphQLAPIProvider } from './shared/data-access/API/GraphQLAPIProvider.tsx';
import { LinkedAccounts } from './pages/LinkedAccounts.tsx';
import { AppsAndServicesDetail } from './pages/apps-and-services/AppsAndServicesDetail.tsx';
import { Address } from './pages/account/Address.tsx';
import { AppsAndServices } from './pages/apps-and-services/AppsAndServices.tsx';
import { UiConfigProvider } from './ui-config/data-access/UiConfigProvider.tsx';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from './ui-config/typings.ts';
import { UiConfigIfRoute } from './ui-config/feature/UiConfigIfRoute.tsx';
import { FeatureNotAvailable } from './shared/ui/FeatureNotAvailable.tsx';
import { MFA } from './pages/security/MFA/MFA.tsx';
import { Toaster } from 'react-hot-toast';
import { Password } from './pages/Password/feature/Password.tsx';
import { RouteErrorBoundary } from './error-handling/RouteErrorBoundary.tsx';
import { appToastConfig } from './util.ts';
import { Passkeys } from './pages/security/Passkeys/Passkeys.tsx';
import {
  IconActionAutoLinkAccount,
  IconActionMultiFactor,
  IconAuthenticatorPasskeys,
  IconAuthenticatorTotp,
  IconCapabilityResourceOwnerPasswordCredentials,
  IconGeneralLocation,
  IconGeneralLock,
  IconUserDataSources,
  IconUserManagement,
} from '@icons';
import { DefaultRoute } from './shared/components/DefaultRoute.tsx';

export const ROUTE_PATHS = {
  HOME: '/',
  LOGIN: 'login',
  CREATE_ACCOUNT: 'create-account',
  ACCOUNT: 'account',
  ACCOUNT_ADDRESS: 'address',
  LINKED_ACCOUNTS: 'linked-accounts',
  APPS_AND_SERVICES: 'apps-and-services',
  SECURITY: 'security',
  SESSIONS: 'sessions',
  SECURITY_OTP: 'otp',
  SECURITY_PHONE: 'phone',
  SECURITY_EMAIL: 'email',
  SECURITY_PASSWORD: 'password',
  SECURITY_MFA: 'mfa',
  SECURITY_PASSKEYS: 'passkeys',
  FEATURE_NOT_AVAILABLE: 'feature-not-available',
};

export type USSPRouteConfig = RouteObject & {
  title?: string;
  sidebarTitle?: string;
  icon?: React.ComponentType<{ width?: number; height?: number }>;
  resources?: UI_CONFIG_RESOURCES[];
  children?: USSPRouteConfig[];
};

export const AUTHENTICATED_ROUTES: USSPRouteConfig[] = [
  {
    path: ROUTE_PATHS.HOME,
    element: <DefaultRoute />,
  },
  {
    path: ROUTE_PATHS.ACCOUNT,
    sidebarTitle: 'account.title',
    icon: IconUserManagement,
    element: <Outlet />,
    resources: [
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER,
    ],
    children: [
      {
        path: '',
        title: 'account.title',
        element: (
          <UiConfigIfRoute>
            <Account />
          </UiConfigIfRoute>
        ),
        resources: [
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME,
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS,
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL,
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER,
        ],
      },
      {
        path: ROUTE_PATHS.ACCOUNT_ADDRESS,
        title: 'account.address.path',
        sidebarTitle: 'account.address',
        icon: IconGeneralLocation,
        element: (
          <UiConfigIfRoute>
            <Address />
          </UiConfigIfRoute>
        ),
        resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS],
      },
    ],
  },
  {
    path: ROUTE_PATHS.LINKED_ACCOUNTS,
    title: 'linked-accounts.title',
    sidebarTitle: 'linked-accounts.title',
    icon: IconActionAutoLinkAccount,
    element: (
      <UiConfigIfRoute>
        <LinkedAccounts />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_LINKED_ACCOUNTS],
  },
  {
    path: ROUTE_PATHS.SECURITY,
    sidebarTitle: 'security.title',
    icon: IconGeneralLock,
    element: <Outlet />,
    resources: [
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSKEY,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA,
      UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSWORD,
    ],
    children: [
      {
        path: '',
        title: 'security.title',
        element: (
          <UiConfigIfRoute>
            <Security />
          </UiConfigIfRoute>
        ),
        resources: [
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL,
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER,
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP,
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSKEY,
          UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA,
        ],
      },
      {
        path: ROUTE_PATHS.SECURITY_PASSWORD,
        title: 'security.password.path',
        sidebarTitle: 'security.password.title',
        icon: IconCapabilityResourceOwnerPasswordCredentials,
        element: (
          <UiConfigIfRoute allowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}>
            <Password />
          </UiConfigIfRoute>
        ),
        resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSWORD],
      },
      {
        path: ROUTE_PATHS.SECURITY_OTP,
        title: 'security.otp-authenticators.path',
        sidebarTitle: 'security.otp-authenticators.title',
        icon: IconAuthenticatorTotp,
        element: (
          <UiConfigIfRoute>
            <Totp />
          </UiConfigIfRoute>
        ),
        resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP],
      },
      {
        path: ROUTE_PATHS.SECURITY_PASSKEYS,
        title: 'security.passkeys.path',
        sidebarTitle: 'security.passkeys.title',
        icon: IconAuthenticatorPasskeys,
        element: (
          <UiConfigIfRoute>
            <Passkeys />
          </UiConfigIfRoute>
        ),
        resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSKEY],
      },
      {
        path: ROUTE_PATHS.SECURITY_MFA,
        title: 'security.multi-factor-authentication.path',
        sidebarTitle: 'security.multi-factor-authentication.title',
        icon: IconActionMultiFactor,
        element: (
          <UiConfigIfRoute>
            <MFA />
          </UiConfigIfRoute>
        ),
        resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA],
      },
    ],
  },
  {
    path: ROUTE_PATHS.APPS_AND_SERVICES,
    title: 'apps-and-services.title',
    sidebarTitle: 'apps-and-services.title',
    icon: IconUserDataSources,
    element: (
      <UiConfigIfRoute>
        <AppsAndServices />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.GRANTED_AUTHORIZATIONS_GRANTED_AUTHORIZATIONS],
  },
  {
    path: `${ROUTE_PATHS.APPS_AND_SERVICES}/:id`,
    title: 'apps-and-services.app-detail',
    element: (
      <UiConfigIfRoute>
        <AppsAndServicesDetail />
      </UiConfigIfRoute>
    ),
    resources: [UI_CONFIG_RESOURCES.GRANTED_AUTHORIZATIONS_GRANTED_AUTHORIZATIONS],
  },
];

export const ROUTES: USSPRouteConfig[] = [
  {
    path: ROUTE_PATHS.HOME,
    element: (
      <RouteErrorBoundary>
        <UiConfigProvider>
          <AuthProvider />
        </UiConfigProvider>
      </RouteErrorBoundary>
    ),
    children: [
      {
        path: ROUTE_PATHS.HOME,
        element: (
          <AuthRoutes>
            <GraphQLAPIProvider>
              <Layout>
                <Outlet />
              </Layout>
              <Toaster toastOptions={appToastConfig} />
            </GraphQLAPIProvider>
          </AuthRoutes>
        ),
        children: AUTHENTICATED_ROUTES,
      },
      {
        path: ROUTE_PATHS.LOGIN,
        title: 'self-service-portal',
        element: <LoginPage />,
      },
      {
        path: ROUTE_PATHS.FEATURE_NOT_AVAILABLE,
        title: 'feature-not-available',
        element: <FeatureNotAvailable />,
      },
      {
        path: '*',
        element: <NoMatch />,
      },
    ],
  },
];

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

import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { AuthContextType } from '../utils/typings.ts';
import { OAuthAgentClient } from '@curity/token-handler-js-assistant';
import { EndLoginRequest, SessionResponse } from '@curity/token-handler-js-assistant/lib/types';
import { Outlet, useNavigate } from 'react-router';
import { Spinner } from '../../shared/ui/Spinner.tsx';
import { useUiConfig } from '../../ui-config/data-access/UiConfigProvider.tsx';

const AuthContext = createContext<AuthContextType | undefined>(undefined);
let authContextAPI: AuthContextType | undefined;

/*
 * Expose the auth context API to be used outside of the render context, like inside
 * the GraphQL onError link, a fetch interceptor, or outside a component tree.
 * Otherwise, use the useAuth hook.
 */
export const getAuthContextAPIFromOutsideRenderContext = () => {
  if (!authContextAPI) {
    throw new Error('OAuth client has not been initialized');
  }
  return authContextAPI;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error('useAuth must be used within a AuthProvider');
  }

  return context;
};

let sessionInitialized = false;

export function AuthProvider() {
  const uiConfig = useUiConfig();
  const [session, setSession] = useState<SessionResponse>();
  const navigate = useNavigate();
  const oauthClient = useMemo(() => {
    return new OAuthAgentClient({
      // Because all the UiConfigProvider's children are rendered only if the UiConfig has been resolved,
      // we can safely use the uiConfig here without checking if it is defined.
      oauthAgentBaseUrl: `${uiConfig.PATHS.BACKEND}${uiConfig.PATHS.OAUTH_AGENT}`,
    });
  }, [uiConfig]);
  const oauthClientHasBeenInitialized = session !== undefined;

  const configureOAuthAgentClient = useCallback(async () => {
    try {
      if (!sessionInitialized) {
        sessionInitialized = true;

        const sessionResponse = await oauthClient.onPageLoad(location.href);

        setSession(sessionResponse);
      }
    } catch (e) {
      console.error(e);
    }
  }, [oauthClient]);

  const startLogin = async () => {
    const response = await oauthClient.startLogin();

    if (response?.authorizationUrl) {
      location.href = response.authorizationUrl;
    }
  };

  const endLogin = async (request: EndLoginRequest) => {
    const sessionResponse = await oauthClient.endLogin(request);

    setSession(sessionResponse);

    return sessionResponse;
  };

  const refresh = useCallback(async () => {
    try {
      await oauthClient.refresh();
      const sessionResponse: SessionResponse = await oauthClient.session();

      setSession(sessionResponse);
    } catch {
      navigate('/login');
    }
  }, [oauthClient, navigate]);

  const logout = async () => {
    const logoutResponse = await oauthClient.logout();

    if (logoutResponse?.logoutUrl) {
      location.href = logoutResponse.logoutUrl;
    } else {
      navigate('/login');
    }
  };

  useEffect(() => {
    configureOAuthAgentClient();
  }, [configureOAuthAgentClient, refresh]);

  if (!oauthClientHasBeenInitialized) {
    return <Spinner width={48} height={48} mode="fullscreen" />;
  }

  const authProviderValue = {
    startLogin,
    endLogin,
    refresh,
    logout,
    session,
  };

  authContextAPI = authProviderValue;

  return (
    <AuthContext.Provider value={authProviderValue}>{oauthClientHasBeenInitialized && <Outlet />}</AuthContext.Provider>
  );
}

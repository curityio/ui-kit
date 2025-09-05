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

import { vi, describe, it, beforeEach, afterEach, expect, MockedClass } from 'vitest';
import * as TokenHandlerJsAssistant from '@curity/token-handler-js-assistant';
import { render } from '@testing-library/react';
import { AuthProvider, useAuth } from './AuthProvider.tsx';
import { useEffect } from 'react';
import { MemoryRouter, Routes, Route } from 'react-router';
import { OAuthAgentClient } from '@curity/token-handler-js-assistant';
import { mockUseUiConfig } from '../../shared/utils/test.ts';

describe('AuthProvider', () => {
  const OAuthClientMock = OAuthAgentClient as MockedClass<typeof OAuthAgentClient>;

  beforeEach(() => {
    mockUseUiConfig();
  });

  beforeEach(() => {
    OAuthClientMock.mockClear();
    vi.stubGlobal('fetch', vi.fn());
    vi.mocked(fetch).mockResolvedValueOnce({
      status: 401,
      ok: false,
      json: vi.fn().mockResolvedValue({ message: 'Unauthorized' }),
    } as unknown as Response);
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  describe('API', () => {
    it('should redirect to /login when the token refresh fails', async () => {
      const LoginPageTestId = 'login-page';
      const LoginPage = () => <p data-testid={LoginPageTestId}>Login Page</p>;

      OAuthClientMock.mockImplementationOnce(() => tokenHandlerJsAssistantMock);

      const { findByTestId } = render(
        <MemoryRouter initialEntries={['/test']}>
          <Routes>
            <Route element={<AuthProvider />}>
              <Route path="/test" element={<TestingComponent />} />
              <Route path="/login" element={<LoginPage />} />
            </Route>
          </Routes>
        </MemoryRouter>
      );
      const loginPageElement = await findByTestId(LoginPageTestId, { exact: false });

      expect(tokenHandlerJsAssistantMock.refresh).toHaveBeenCalled();
      expect(loginPageElement).not.toBeNull();
    });
  });
});

const testingComponentId = 'testTestId';
const sessionMock: TokenHandlerJsAssistant.SessionResponse = {
  isLoggedIn: false,
  idTokenClaims: {},
  accessTokenExpiresIn: 1221,
};
const tokenHandlerJsAssistantMock = {
  onPageLoad: vi.fn().mockResolvedValue(sessionMock),
  startLogin: vi.fn(),
  endLogin: vi.fn().mockResolvedValue(sessionMock),
  session: vi.fn().mockResolvedValue(sessionMock),
  logout: vi.fn(),
  refresh: vi.fn(() => {
    throw new Error('Error refreshing');
  }),
} as unknown as OAuthAgentClient;

vi.mock('@curity/token-handler-js-assistant', () => {
  return {
    OAuthAgentClient: vi.fn().mockImplementation(() => tokenHandlerJsAssistantMock),
  };
});

const TestingComponent = () => {
  const { refresh } = useAuth();

  useEffect(() => {
    refresh();
  }, [refresh]);

  return <div data-testid={testingComponentId}> </div>;
};

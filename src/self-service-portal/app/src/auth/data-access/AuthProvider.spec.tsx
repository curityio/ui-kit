import { afterEach, beforeEach, describe, expect, it, vi } from 'vitest';
import { render } from '@testing-library/react';
import { MemoryRouter, Route, Routes } from 'react-router';
import { useEffect } from 'react';
import { AuthProvider, useAuth } from './AuthProvider';
import * as TokenHandlerJsAssistant from '@curity/token-handler-js-assistant';
import { mockUseUiConfig } from '@shared/utils/test.ts';

const sessionMock: TokenHandlerJsAssistant.SessionResponse = {
  isLoggedIn: false,
  idTokenClaims: {},
  accessTokenExpiresIn: 1221,
};

const refreshMock = vi.fn(() => {
  throw new Error('Error refreshing');
});

vi.mock('@curity/token-handler-js-assistant', () => {
  class OAuthAgentClient {
    constructor() {}
    onPageLoad = vi.fn().mockResolvedValue(sessionMock);
    startLogin = vi.fn();
    endLogin = vi.fn().mockResolvedValue(sessionMock);
    session = vi.fn().mockResolvedValue(sessionMock);
    logout = vi.fn();
    refresh = refreshMock;
  }
  return { OAuthAgentClient };
});

describe('AuthProvider', () => {
  beforeEach(() => {
    mockUseUiConfig();
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

      const loginPageElement = await findByTestId(LoginPageTestId);
      expect(refreshMock).toHaveBeenCalled();
      expect(loginPageElement).not.toBeNull();
    });
  });
});

const testingComponentId = 'testTestId';

const TestingComponent = () => {
  const { refresh } = useAuth();
  useEffect(() => {
    refresh();
  }, [refresh]);

  return <div data-testid={testingComponentId} />;
};

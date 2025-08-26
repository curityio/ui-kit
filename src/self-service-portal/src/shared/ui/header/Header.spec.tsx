import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';

import { MemoryRouter } from 'react-router';

import { AuthContextType } from '@/auth/utils/typings';

let Header: typeof import('./Header').Header;
let useAuthMock: ReturnType<typeof vi.fn>;
let usePageTitleMock: ReturnType<typeof vi.fn>;

beforeAll(async () => {
  Header = (await import('./Header')).Header;
  vi.mock('@auth/data-access/AuthProvider', async () => {
    const actual = await vi.importActual<typeof import('@auth/data-access/AuthProvider')>(
      '@auth/data-access/AuthProvider'
    );
    useAuthMock = vi.fn();
    return {
      ...actual,
      useAuth: useAuthMock,
    };
  });

  vi.mock('@/shared/utils/useRouteTitle', () => {
    usePageTitleMock = vi.fn(() => 'Account');
    return {
      usePageTitle: usePageTitleMock,
    };
  });

  vi.mock('react-i18next', () => ({
    useTranslation: () => ({
      t: (key: string) => key,
    }),
  }));
});

const renderHeader = (isSidebarOpen = false, isLoggedIn = true) => {
  useAuthMock.mockReturnValue({
    session: { isLoggedIn },
    logout: vi.fn(),
    startLogin: vi.fn(),
    endLogin: vi.fn(),
    refresh: vi.fn(),
  } as unknown as AuthContextType);

  render(
    <MemoryRouter>
      <Header toggleSidebar={vi.fn()} isSidebarOpen={isSidebarOpen} />
    </MemoryRouter>
  );
};

describe('Header Component', () => {
  describe('Rendering', () => {
    it('should render the app title and the current page name', () => {
      renderHeader();

      expect(screen.getByTestId('app-title')).toBeInTheDocument();
      expect(screen.getByText('Account')).toBeInTheDocument();
    });

    it('should update the browser tab title based on the current page', () => {
      renderHeader();

      expect(document.title).toBe('Account');
    });
  });

  describe('login based display', () => {
    it('should show the `Sign Out` option when the user is logged in', () => {
      renderHeader();

      expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });

    it('should not show the `Sign Out` option when the user is not logged in', () => {
      renderHeader(false, false);

      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });
  });

  describe('Sidebar menu behavior', () => {
    it('should reflect the sidebar open or closed state using aria-expanded', () => {
      renderHeader(true);
      const button = screen.getByTestId('sidebar-toggle');

      expect(button).toHaveAttribute('aria-expanded', 'true');
    });

    it('should call toggleSidebar when the menu button is clicked', () => {
      const toggleSidebarMock = vi.fn();
      useAuthMock.mockReturnValue({
        session: { isLoggedIn: true },
        logout: vi.fn(),
        startLogin: vi.fn(),
        endLogin: vi.fn(),
        refresh: vi.fn(),
      } as unknown as AuthContextType);

      render(
        <MemoryRouter>
          <Header toggleSidebar={toggleSidebarMock} isSidebarOpen={false} />
        </MemoryRouter>
      );

      screen.getByTestId('sidebar-toggle').click();
      expect(toggleSidebarMock).toHaveBeenCalled();
    });
  });
});

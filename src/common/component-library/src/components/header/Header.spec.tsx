import { render, screen, fireEvent } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { describe, it, expect, vi, beforeAll } from 'vitest';

let Header: typeof import('./Header').Header;

const TEST_USERNAME = 'teddie';
const TEST_PAGE_TITLE = 'Account';

beforeAll(async () => {
  Header = (await import('./Header')).Header;
});

const renderHeader = (isSidebarOpen = false, isLoggedIn = true) => {
  render(
    <MemoryRouter>
      <Header
        toggleSidebar={vi.fn()}
        isSidebarOpen={isSidebarOpen}
        isLoggedIn={isLoggedIn}
        pageTitle={TEST_PAGE_TITLE}
        userName={TEST_USERNAME}
        onSignOut={vi.fn()}
        t={vi.fn()}
      />
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
    it('should show the username when the user is logged in', () => {
      renderHeader();
      const userMenuButton = screen.getByTestId('user-menu-button');

      expect(userMenuButton).toBeInTheDocument();
      expect(userMenuButton).toHaveTextContent(TEST_USERNAME);
    });

    it('should show the `Sign Out` option when clicking on the user menu', async () => {
      renderHeader();
      const userMenuButton = screen.getByTestId('user-menu-button');
      fireEvent.click(userMenuButton);
      const logoutButton = await screen.findByTestId('logout-button');

      expect(logoutButton).toBeInTheDocument();
    });

    it('should not show the username when the user is not logged in', () => {
      renderHeader(false, false);

      expect(screen.queryByTestId('user-menu-button')).not.toBeInTheDocument();
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

      render(
        <MemoryRouter>
          <Header
            toggleSidebar={toggleSidebarMock}
            isSidebarOpen={false}
            isLoggedIn={true}
            pageTitle={TEST_PAGE_TITLE}
            userName={TEST_USERNAME}
            onSignOut={vi.fn()}
            t={vi.fn()}
          />
        </MemoryRouter>
      );

      screen.getByTestId('sidebar-toggle').click();
      expect(toggleSidebarMock).toHaveBeenCalled();
    });

    it('should call toggleSidebar when the menu button is clicked', async () => {
      const onSignOutMock = vi.fn();

      render(
        <MemoryRouter>
          <Header
            toggleSidebar={vi.fn()}
            isSidebarOpen={false}
            isLoggedIn={true}
            pageTitle={TEST_PAGE_TITLE}
            userName={TEST_USERNAME}
            onSignOut={onSignOutMock}
            t={vi.fn()}
          />
        </MemoryRouter>
      );

      const userMenuButton = screen.getByTestId('user-menu-button');
      fireEvent.click(userMenuButton);

      const signOutButton = await screen.findByTestId('logout-button');
      fireEvent.click(signOutButton);

      expect(onSignOutMock).toHaveBeenCalled();
    });
  });
});

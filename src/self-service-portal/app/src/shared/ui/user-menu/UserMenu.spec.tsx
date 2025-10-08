import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi, beforeAll } from 'vitest';
import { UserMenu } from './UserMenu';

const TEST_USERNAME = 'testuser';

describe('UserMenu Component', () => {
  beforeAll(() => {
    vi.mock('react-i18next', () => ({
      useTranslation: () => ({
        t: (key: string) => {
          if (key === 'sign-out') {
            return 'Sign out';
          }
          return key;
        },

        i18n: { language: 'en' },
        ready: true,
      }),
    }));
  });

  describe('Rendering', () => {
    it('should render the user menu button with the provided username', () => {
      render(<UserMenu username={TEST_USERNAME} onSignOut={vi.fn()} />);

      const userMenuButton = screen.getByTestId('user-menu-button');

      expect(userMenuButton).toBeInTheDocument();
      expect(userMenuButton).toHaveTextContent(TEST_USERNAME);
    });

    it('should render with proper ARIA attributes', () => {
      render(<UserMenu username={TEST_USERNAME} onSignOut={vi.fn()} />);

      const userMenuButton = screen.getByTestId('user-menu-button');

      expect(userMenuButton).toHaveAttribute('aria-expanded', 'false');
      expect(userMenuButton).toHaveAttribute('aria-haspopup', 'menu');
      expect(userMenuButton).toHaveAttribute('aria-controls', 'user-dropdown-menu');
    });
  });

  describe('Menu interaction', () => {
    it('should open the dropdown menu when the user menu button is clicked', () => {
      render(<UserMenu username={TEST_USERNAME} onSignOut={vi.fn()} />);

      const userMenuButton = screen.getByTestId('user-menu-button');
      fireEvent.click(userMenuButton);

      expect(userMenuButton).toHaveAttribute('aria-expanded', 'true');
      expect(screen.getByTestId('logout-button')).toBeInTheDocument();
    });

    it('should close the dropdown menu when the user menu button is clicked again', () => {
      render(<UserMenu username={TEST_USERNAME} onSignOut={vi.fn()} />);

      const userMenuButton = screen.getByTestId('user-menu-button');
      fireEvent.click(userMenuButton);

      expect(screen.getByTestId('logout-button')).toBeInTheDocument();

      fireEvent.click(userMenuButton);

      expect(userMenuButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });

    it('should close the dropdown menu when clicking outside', () => {
      render(<UserMenu username={TEST_USERNAME} onSignOut={vi.fn()} />);

      const userMenuButton = screen.getByTestId('user-menu-button');

      fireEvent.click(userMenuButton);
      expect(screen.getByTestId('logout-button')).toBeInTheDocument();

      fireEvent.mouseDown(document.body);

      expect(userMenuButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });

    it('should close the dropdown menu when Escape key is pressed', () => {
      render(<UserMenu username={TEST_USERNAME} onSignOut={vi.fn()} />);

      const userMenuButton = screen.getByTestId('user-menu-button');

      fireEvent.click(userMenuButton);
      expect(screen.getByTestId('logout-button')).toBeInTheDocument();

      fireEvent.keyDown(document, { key: 'Escape' });

      expect(userMenuButton).toHaveAttribute('aria-expanded', 'false');
      expect(screen.queryByTestId('logout-button')).not.toBeInTheDocument();
    });
  });

  describe('Logout functionality', () => {
    it('should show the logout button with proper attributes when menu is open', () => {
      render(<UserMenu username={TEST_USERNAME} onSignOut={vi.fn()} />);

      const userMenuButton = screen.getByTestId('user-menu-button');
      fireEvent.click(userMenuButton);

      const logoutButton = screen.getByTestId('logout-button');

      expect(logoutButton).toBeInTheDocument();
      expect(logoutButton).toHaveAttribute('role', 'menuitem');
      expect(logoutButton).toHaveTextContent('Sign out');
    });

    it('should sign out the user when the logout button is clicked', () => {
      const onSignOut = vi.fn();
      render(<UserMenu username={TEST_USERNAME} onSignOut={onSignOut} />);

      const userMenuButton = screen.getByTestId('user-menu-button');
      fireEvent.click(userMenuButton);

      const logoutButton = screen.getByTestId('logout-button');
      fireEvent.click(logoutButton);

      expect(onSignOut).toHaveBeenCalledTimes(1);
    });
  });
});

import { describe, it, beforeEach, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router';
import { Sidebar } from './Sidebar.tsx';
import * as AuthProviderAll from '../../../auth/data-access/AuthProvider.tsx';
import * as UiConfigProviderAll from '../../../ui-config/data-access/UiConfigProvider.tsx';
import { UI_CONFIG } from '../../../ui-config/utils/ui-config-fixture.ts';

vi.mock('react-i18next', () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

describe('Sidebar', () => {
  beforeEach(() => {
    vi.spyOn(UiConfigProviderAll, 'useUiConfig').mockReturnValue(UI_CONFIG);

    vi.spyOn(AuthProviderAll, 'useAuth').mockReturnValue({
      session: { isLoggedIn: true },
      logout: vi.fn(),
      startLogin: vi.fn(),
      endLogin: vi.fn(),
      refresh: vi.fn(),
    });
  });

  it('should render the sidebar navigation container with proper aria-label', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByRole('navigation', { name: /Sidebar/i })).toBeInTheDocument();
  });

  it('should render all top-level sidebar items and their corresponding icons', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar-account.title')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-linked-accounts.title')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-security.title')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-apps-and-services.title')).toBeInTheDocument();

    expect(screen.getByTestId('sidebar-icon-account.title')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-icon-linked-accounts.title')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-icon-security.title')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-icon-apps-and-services.title')).toBeInTheDocument();
  });

  it('should render all submenu items for each section by default', () => {
    render(
      <MemoryRouter>
        <Sidebar />
      </MemoryRouter>
    );

    expect(screen.getByTestId('sidebar-child-account.address')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-child-security.otp-authenticators.title')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-child-security.password.title')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-child-security.multi-factor-authentication.title')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-child-security.passkeys.title')).toBeInTheDocument();

    expect(screen.getByTestId('sidebar-child-icon-account.address')).toBeInTheDocument();
    expect(screen.getByTestId('sidebar-child-icon-security.passkeys.title')).toBeInTheDocument();
  });
});

import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Login } from './Login.tsx';
import * as AuthProviderAll from '../../../auth/data-access/AuthProvider.tsx';
import { mockUseUiConfig } from '../../utils/test.ts';

describe('Login component', () => {
  beforeEach(() => {
    vi.spyOn(AuthProviderAll, 'useAuth').mockReturnValue({
      session: { isLoggedIn: true },
      logout: vi.fn(),
      startLogin: vi.fn(),
      endLogin: vi.fn(),
      refresh: vi.fn(),
    });
    mockUseUiConfig();
  });
  it('should render the title and description', () => {
    render(<Login title="Welcome to the User Self Service Portal!" description="Sign in to Manage your account" />);

    expect(screen.getByText('Welcome to the User Self Service Portal!')).toBeInTheDocument();
    expect(screen.getByText('Sign in to Manage your account')).toBeInTheDocument();
  });

  it('should render the Curity logo', () => {
    render(<Login title="Test title" description="Test description" />);

    expect(screen.getByAltText('Logo')).toBeInTheDocument();
  });

  it('should render the Sign in button', () => {
    render(<Login title="Test" description="Test desc" />);

    expect(screen.getByTestId('sign-in')).toBeInTheDocument();
  });
});

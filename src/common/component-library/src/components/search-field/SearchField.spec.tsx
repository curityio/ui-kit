import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, vi, expect, beforeEach } from 'vitest';
import { SearchField } from './SearchField';

describe('SearchField', () => {
  const defaultProps = {
    title: 'Email addresses',
    length: 42,
    t: (key: string) => {
      if (key === 'search') {
        return 'Search';
      }
      return key;
    },
  };

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('renders with correct placeholder', () => {
    render(<SearchField {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search 42 Email addresses...');
    expect(input).toBeInTheDocument();
    expect(input).toHaveAttribute('type', 'search');
  });

  it('applies additional className', () => {
    render(<SearchField {...defaultProps} className="extra-class" />);

    const inputContainer = screen.getByTestId('input-container');

    expect(inputContainer.className).toContain('extra-class');
  });

  it('calls onSearch when typing', () => {
    const onSearch = vi.fn();
    render(<SearchField {...defaultProps} onSearch={onSearch} />);

    const input = screen.getByPlaceholderText('Search 42 Email addresses...');
    fireEvent.change(input, { target: { value: 'john' } });

    expect(onSearch).toHaveBeenCalledWith('john');
  });

  it('does not throw if onSearch is not provided', () => {
    render(<SearchField {...defaultProps} />);

    const input = screen.getByPlaceholderText('Search 42 Email addresses...');
    expect(() => {
      fireEvent.change(input, { target: { value: 'jane' } });
    }).not.toThrow();
  });
});

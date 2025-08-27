import { render, screen } from '@testing-library/react';
import { PageHeader } from './PageHeader';
import { describe, it, expect } from 'vitest';

describe('PageHeader Component', () => {
  it('should render the title', () => {
    render(<PageHeader title="Test Title" />);
    expect(screen.getByTestId('page-header-title')).toHaveTextContent('Test Title');
  });

  it('should render the description if provided', () => {
    render(<PageHeader title="Title" description="This is a description" />);
    expect(screen.getByTestId('page-header-description')).toHaveTextContent('This is a description');
  });

  it('should not render description if not provided', () => {
    render(<PageHeader title="Only Title" />);
    expect(screen.getByTestId('page-header-description')).toBeEmptyDOMElement();
  });

  it('should render the icon if provided', () => {
    render(<PageHeader title="With Icon" icon={<svg data-testid="custom-icon" />} />);
    expect(screen.getByTestId('page-header-icon')).toContainElement(screen.getByTestId('custom-icon'));
  });
});

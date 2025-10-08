import { render, screen } from '@testing-library/react';
import { Section } from './Section';
import { describe, it, expect } from 'vitest';

describe('Section Component', () => {
  it('should render the title in a legend', () => {
    render(<Section title="Account Settings" />);
    expect(screen.getByText('Account Settings').tagName).toBe('LEGEND');
  });

  it('should render children content', () => {
    render(
      <Section title="Profile">
        <p>Test Content</p>
      </Section>
    );

    expect(screen.getByText('Test Content')).toBeInTheDocument();
  });

  it('should render the section with default and custom classes', () => {
    const { container } = render(<Section title="Styled Section" className="custom-class" />);
    const fieldset = container.querySelector('fieldset');

    expect(fieldset?.className).toContain('mt2 mb2 p3');
    expect(fieldset?.className).toContain('custom-class');
  });
});

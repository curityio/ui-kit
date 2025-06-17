import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import { Breadcrumbs } from './Breadcrumbs';
import { MemoryRouter } from 'react-router';

describe('Breadcrumbs', () => {
  it('renders a single breadcrumb when pageTitle has one part', () => {
    render(
      <MemoryRouter initialEntries={['/example']}>
        <Breadcrumbs pageTitle="Example" />
      </MemoryRouter>
    );

    const breadcrumb = screen.getByTestId('breadcrumb');
    expect(breadcrumb).toBeInTheDocument();
    expect(breadcrumb).toHaveTextContent('Example');
    expect(screen.getAllByTestId('breadcrumb')).toHaveLength(1);
  });

  it('renders multiple breadcrumbs when pageTitle has multiple parts', () => {
    render(
      <MemoryRouter initialEntries={['/example/section']}>
        <Breadcrumbs pageTitle="Example / Section" />
      </MemoryRouter>
    );

    const breadcrumbs = screen.getAllByTestId('breadcrumb');
    expect(breadcrumbs).toHaveLength(2);
    expect(breadcrumbs[0]).toHaveTextContent('Example');
    expect(breadcrumbs[1]).toHaveTextContent('Section');
    expect(breadcrumbs[0]).toBeInTheDocument();
    expect(breadcrumbs[1]).toBeInTheDocument();
  });

  it('links breadcrumbs to the correct paths', () => {
    render(
      <MemoryRouter initialEntries={['/example/section']}>
        <Breadcrumbs pageTitle="Example / Section" />
      </MemoryRouter>
    );

    const breadcrumbs = screen.getAllByTestId('breadcrumb');
    const exampleLink = breadcrumbs[0].querySelector('a');
    const sectionLink = breadcrumbs[1].querySelector('small');

    expect(exampleLink).toHaveAttribute('href', '/example');
    expect(sectionLink).toHaveTextContent('Section');
  });
});

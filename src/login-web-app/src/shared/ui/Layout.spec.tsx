/*
 * Copyright (C) 2026 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { describe, expect, it } from 'vitest';
import { render } from '@testing-library/react';
import { Layout } from './Layout';
import { HaapiAppConfigContext } from '../feature/app-config/HaapiAppConfigContext';
import { HaapiAppConfig } from '../feature/app-config/types';

const renderLayout = (isInsideWell: boolean) => {
  const config: HaapiAppConfig = {
    initialUrl: 'https://example/start',
    haapi: {} as HaapiAppConfig['haapi'],
    theme: { logo: { path: '/assets/logo.svg', isInsideWell } },
  };
  return render(
    <HaapiAppConfigContext value={config}>
      <Layout>
        <div data-testid="content" />
      </Layout>
    </HaapiAppConfigContext>
  );
};

describe('Layout — logo placement', () => {
  it('renders the logo inside the well when theme.logo.isInsideWell is true', () => {
    const { container } = renderLayout(true);
    const well = container.querySelector('.haapi-stepper-well');
    const logo = container.querySelector('img.haapi-stepper-logo');

    expect(well).not.toBeNull();
    expect(logo).not.toBeNull();
    expect(well?.contains(logo)).toBe(true);
  });

  it('renders the logo before the well (not inside it) when theme.logo.isInsideWell is false', () => {
    const { container } = renderLayout(false);
    const main = container.querySelector('main.app-layout');
    const well = container.querySelector('.haapi-stepper-well');
    const logo = container.querySelector('img.haapi-stepper-logo');

    expect(main).not.toBeNull();
    expect(well).not.toBeNull();
    expect(logo).not.toBeNull();

    // Logo is a sibling of the well, not a descendant.
    expect(well?.contains(logo)).toBe(false);
    expect(main?.contains(logo)).toBe(true);

    // Logo appears before the well in document order.
    expect(logo!.compareDocumentPosition(well!) & Node.DOCUMENT_POSITION_FOLLOWING).toBeTruthy();
  });
});

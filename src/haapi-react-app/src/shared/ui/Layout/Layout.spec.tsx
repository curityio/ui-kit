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
import { Layout } from '../Layout/Layout';
import type { HaapiAppConfig } from '../../feature/app-config/types';
import { HaapiAppConfigContext } from '../../feature/app-config/HaapiAppConfigContext';

describe('Layout', () => {
  describe('Logo placement', () => {
    it('renders the logo inside the well when theme.logo.isInsideWell is true', () => {
      const { container } = renderLayout({ isInsideWell: true });
      const well = container.querySelector('.haapi-stepper-well');
      const logo = container.querySelector('img.haapi-stepper-logo');

      expect(well).not.toBeNull();
      expect(logo).not.toBeNull();
      expect(well?.contains(logo)).toBe(true);
    });

    it('renders the logo before the well (not inside it) when theme.logo.isInsideWell is false', () => {
      const { container } = renderLayout({ isInsideWell: false });
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

    it('renders children and the well but no logo element when theme.logo is not configured', () => {
      const { container, getByTestId } = renderLayout({ withoutLogo: true });
      expect(getByTestId('content')).toBeInTheDocument();
      expect(container.querySelector('.haapi-stepper-well')).not.toBeNull();
      expect(container.querySelector('img.haapi-stepper-logo')).toBeNull();
    });
  });
});

interface LayoutHarnessOptions {
  isInsideWell?: boolean;
  withoutLogo?: boolean;
}

const renderLayout = ({ isInsideWell = false, withoutLogo = false }: LayoutHarnessOptions = {}) => {
  const config: HaapiAppConfig = {
    initialUrl: 'https://example/start',
    haapi: {} as HaapiAppConfig['haapi'],
    theme: { logo: withoutLogo ? undefined : { path: '/assets/logo.svg', isInsideWell } },
  };

  return render(
    <HaapiAppConfigContext value={config}>
      <Layout>
        <div data-testid="content" />
      </Layout>
    </HaapiAppConfigContext>
  );
};

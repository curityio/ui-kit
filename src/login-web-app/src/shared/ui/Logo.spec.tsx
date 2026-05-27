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
import { render, screen } from '@testing-library/react';
import { Logo } from './Logo';
import { AppConfigContext } from '../feature/app-config/AppConfigContext';
import type { BootstrapConfiguration } from '../../haapi-stepper/data-access/bootstrap-configuration';

const buildConfig = (logoPath: string): BootstrapConfiguration => ({
  initialUrl: 'https://example/start',
  haapi: {} as BootstrapConfiguration['haapi'],
  theme: { logo: { path: logoPath, isInsideWell: false } },
});

describe('Logo', () => {
  it('renders an image with the src from theme.logo.path', () => {
    render(
      <AppConfigContext value={buildConfig('/assets/logo.svg')}>
        <Logo />
      </AppConfigContext>
    );

    const img = screen.getByRole('presentation');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/assets/logo.svg');
    expect(img).toHaveClass('haapi-stepper-logo');
  });
});

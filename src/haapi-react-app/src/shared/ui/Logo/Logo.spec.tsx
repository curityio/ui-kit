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
import { Logo } from '../Logo/Logo';
import { HaapiAppConfigContext } from '../../feature/app-config/HaapiAppConfigContext';
import { HaapiAppConfig } from '../../feature/app-config/types';

const buildConfig = (logoPath: string): HaapiAppConfig => ({
  initialUrl: 'https://example/start',
  haapi: {} as HaapiAppConfig['haapi'],
  theme: { logo: { path: logoPath, isInsideWell: false } },
});

describe('Logo', () => {
  it('renders an image with the src from theme.logo.path', () => {
    render(
      <HaapiAppConfigContext value={buildConfig('/assets/logo.svg')}>
        <Logo />
      </HaapiAppConfigContext>
    );

    const img = screen.getByRole('img');
    expect(img.tagName).toBe('IMG');
    expect(img).toHaveAttribute('src', '/assets/logo.svg');
    expect(img).toHaveAttribute('alt', 'Logo');
    expect(img).toHaveClass('haapi-stepper-logo');
  });

  it('renders nothing when theme.logo is not configured', () => {
    const configWithoutLogo: HaapiAppConfig = {
      initialUrl: 'https://example/start',
      haapi: {} as HaapiAppConfig['haapi'],
      theme: {},
    };

    const { container } = render(
      <HaapiAppConfigContext value={configWithoutLogo}>
        <Logo />
      </HaapiAppConfigContext>
    );

    expect(container.querySelector('img')).toBeNull();
    expect(screen.queryByRole('img')).toBeNull();
  });
});

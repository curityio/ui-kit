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
import { PageSymbol } from './PageSymbol';
import type { PageSymbols } from '../../haapi-stepper/data-access/bootstrap-configuration';
import { HaapiAppConfigContext } from '../feature/app-config/HaapiAppConfigContext';
import { HaapiAppConfig } from '../feature/app-config/types';

const buildConfig = (pageSymbols?: PageSymbols): HaapiAppConfig => ({
  initialUrl: 'https://example/start',
  haapi: {} as HaapiAppConfig['haapi'],
  theme: {
    logo: { path: '/assets/logo.svg', isInsideWell: false },
    pageSymbols,
  },
});

const renderPageSymbol = (viewName: string | undefined, pageSymbols?: PageSymbols) =>
  render(
    <HaapiAppConfigContext value={buildConfig(pageSymbols)}>
      <PageSymbol viewName={viewName} />
    </HaapiAppConfigContext>
  );

describe('PageSymbol', () => {
  const pageSymbols: PageSymbols = {
    views: {
      'authenticator/html-form/create-account/post': '/symbols/create-account.svg',
      'authentication-action/email-verifier/confirm': '/symbols/email-verifier-confirm.svg',
      'consentor/scope-consent/review': '/symbols/scope-consent-review.svg',
    },
    plugins: {
      'html-form': '/symbols/html-form.svg',
      'email-verifier': '/symbols/email-verifier.svg',
      'scope-consent': '/symbols/scope-consent.svg',
    },
    default: '/symbols/default.svg',
  };

  it.each([
    ['authenticator', 'authenticator/html-form/create-account/post', '/symbols/create-account.svg'],
    ['authentication-action', 'authentication-action/email-verifier/confirm', '/symbols/email-verifier-confirm.svg'],
    ['consentor', 'consentor/scope-consent/review', '/symbols/scope-consent-review.svg'],
  ])(
    'renders the exact `views` entry for the %s category even when a plugin or default would also match',
    (_, viewName, expected) => {
      renderPageSymbol(viewName, pageSymbols);
      expect(document.querySelector<HTMLImageElement>('img.haapi-stepper-page-symbol-image')).toHaveAttribute(
        'src',
        expected
      );
    }
  );

  it.each([
    ['authenticator', 'authenticator/html-form/index', '/symbols/html-form.svg'],
    ['authentication-action', 'authentication-action/email-verifier/verify', '/symbols/email-verifier.svg'],
    ['consentor', 'consentor/scope-consent/consent', '/symbols/scope-consent.svg'],
  ])(
    'falls back to the plugin-type entry for the %s category when no `views` entry matches',
    (_, viewName, expected) => {
      renderPageSymbol(viewName, pageSymbols);
      expect(document.querySelector<HTMLImageElement>('img.haapi-stepper-page-symbol-image')).toHaveAttribute(
        'src',
        expected
      );
    }
  );

  it('falls back to `default` when neither `views` nor `plugins` matches', () => {
    renderPageSymbol('authenticator/unknown-plugin/index', pageSymbols);
    expect(document.querySelector<HTMLImageElement>('img.haapi-stepper-page-symbol-image')).toHaveAttribute(
      'src',
      '/symbols/default.svg'
    );
  });

  it('falls back to `default` when the viewName is outside the three plugin categories', () => {
    renderPageSymbol('views/select-authenticator/index', pageSymbols);
    expect(document.querySelector<HTMLImageElement>('img.haapi-stepper-page-symbol-image')).toHaveAttribute(
      'src',
      '/symbols/default.svg'
    );
  });

  it('renders nothing when nothing resolves and no `default` is configured', () => {
    renderPageSymbol('authenticator/unknown-plugin/index', {
      plugins: { 'html-form': '/symbols/html-form.svg' },
    });
    expect(document.querySelector<HTMLImageElement>('img.haapi-stepper-page-symbol-image')).toBeNull();
  });

  it('renders nothing when pageSymbols is absent', () => {
    renderPageSymbol('authenticator/html-form/index', undefined);
    expect(document.querySelector<HTMLImageElement>('img.haapi-stepper-page-symbol-image')).toBeNull();
  });

  it('renders nothing when pageSymbols is empty', () => {
    renderPageSymbol('authenticator/html-form/index', {});
    expect(document.querySelector<HTMLImageElement>('img.haapi-stepper-page-symbol-image')).toBeNull();
  });

  it('renders nothing when viewName is undefined', () => {
    renderPageSymbol(undefined, pageSymbols);
    expect(document.querySelector<HTMLImageElement>('img.haapi-stepper-page-symbol-image')).toBeNull();
  });

  it('renders nothing when viewName is an empty string', () => {
    renderPageSymbol('', pageSymbols);
    expect(document.querySelector<HTMLImageElement>('img.haapi-stepper-page-symbol-image')).toBeNull();
  });
});

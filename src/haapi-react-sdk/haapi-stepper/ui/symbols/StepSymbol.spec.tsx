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
import { StepSymbol } from './StepSymbol';
import type { HaapiStepperStepSymbolsConfig } from '../../feature/stepper/haapi-stepper.types';

const SYMBOL_IMAGE_SELECTOR = 'img.haapi-stepper-step-symbol-image';

const renderStepSymbol = (viewName: string | undefined, stepSymbols?: HaapiStepperStepSymbolsConfig) =>
  render(<StepSymbol viewName={viewName} stepSymbols={stepSymbols} />);

describe('StepSymbol', () => {
  const stepSymbols: HaapiStepperStepSymbolsConfig = {
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

  describe('Symbol resolution', () => {
    it.each([
      ['authenticator', 'authenticator/html-form/create-account/post', '/symbols/create-account.svg'],
      ['authentication-action', 'authentication-action/email-verifier/confirm', '/symbols/email-verifier-confirm.svg'],
      ['consentor', 'consentor/scope-consent/review', '/symbols/scope-consent-review.svg'],
    ])(
      'renders the exact `views` entry for the %s category even when a plugin or default would also match',
      (_, viewName, expected) => {
        renderStepSymbol(viewName, stepSymbols);
        expect(document.querySelector<HTMLImageElement>(SYMBOL_IMAGE_SELECTOR)).toHaveAttribute('src', expected);
      }
    );

    it.each([
      ['authenticator', 'authenticator/html-form/index', '/symbols/html-form.svg'],
      ['authentication-action', 'authentication-action/email-verifier/verify', '/symbols/email-verifier.svg'],
      ['consentor', 'consentor/scope-consent/consent', '/symbols/scope-consent.svg'],
    ])(
      'falls back to the plugin-type entry for the %s category when no `views` entry matches',
      (_, viewName, expected) => {
        renderStepSymbol(viewName, stepSymbols);
        expect(document.querySelector<HTMLImageElement>(SYMBOL_IMAGE_SELECTOR)).toHaveAttribute('src', expected);
      }
    );

    it('falls back to `default` when neither `views` nor `plugins` matches', () => {
      renderStepSymbol('authenticator/unknown-plugin/index', stepSymbols);
      expect(document.querySelector<HTMLImageElement>(SYMBOL_IMAGE_SELECTOR)).toHaveAttribute(
        'src',
        '/symbols/default.svg'
      );
    });

    it('falls back to `default` when the viewName is outside the three plugin categories', () => {
      renderStepSymbol('views/select-authenticator/index', stepSymbols);
      expect(document.querySelector<HTMLImageElement>(SYMBOL_IMAGE_SELECTOR)).toHaveAttribute(
        'src',
        '/symbols/default.svg'
      );
    });
  });

  describe('No symbol', () => {
    it('renders nothing when nothing resolves and no `default` is configured', () => {
      renderStepSymbol('authenticator/unknown-plugin/index', {
        plugins: { 'html-form': '/symbols/html-form.svg' },
      });
      expect(document.querySelector(SYMBOL_IMAGE_SELECTOR)).toBeNull();
    });

    it('renders nothing when stepSymbols is absent', () => {
      renderStepSymbol('authenticator/html-form/index', undefined);
      expect(document.querySelector(SYMBOL_IMAGE_SELECTOR)).toBeNull();
    });

    it('renders nothing when stepSymbols is empty', () => {
      renderStepSymbol('authenticator/html-form/index', {});
      expect(document.querySelector(SYMBOL_IMAGE_SELECTOR)).toBeNull();
    });

    it('renders nothing when viewName is undefined', () => {
      renderStepSymbol(undefined, stepSymbols);
      expect(document.querySelector(SYMBOL_IMAGE_SELECTOR)).toBeNull();
    });

    it('renders nothing when viewName is an empty string', () => {
      renderStepSymbol('', stepSymbols);
      expect(document.querySelector(SYMBOL_IMAGE_SELECTOR)).toBeNull();
    });
  });

  describe('Accessibility', () => {
    it('marks the symbol as decorative so screen readers skip it', () => {
      renderStepSymbol('authenticator/html-form/index', stepSymbols);

      expect(document.querySelector('figure.haapi-stepper-step-symbol')).toHaveAttribute('aria-hidden', 'true');
    });
  });
});

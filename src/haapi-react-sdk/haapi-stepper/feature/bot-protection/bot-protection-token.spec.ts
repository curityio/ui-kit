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

import { afterEach, beforeEach, describe, expect, test, vi } from 'vitest';
import {
  getBotProtectionParameters,
  getBotProtectionToken,
  RECAPTCHA_ENTERPRISE,
  resetBotProtectionState,
  scriptUrl,
  TURNSTILE,
} from './bot-protection-token';
import type { HaapiBotProtection } from '../../data-access/types/haapi-step.types';

const turnstile: HaapiBotProtection = {
  provider: TURNSTILE,
  siteKey: 'site-key-1',
  action: 'login',
  tokenField: '_bot_protection_token',
};

const recaptcha: HaapiBotProtection = { ...turnstile, provider: RECAPTCHA_ENTERPRISE, siteKey: 'site key/2' };

type TestWindow = Record<string, unknown>;

describe('bot-protection tokens (IS-12295)', () => {
  beforeEach(() => {
    resetBotProtectionState();
    // load scripts "instantly": call the onload callback when the script element is added
    vi.spyOn(document.head, 'appendChild').mockImplementation(node => {
      const src = (node as HTMLScriptElement).src;
      const callback = new URL(src).searchParams.get('onload')!;
      queueMicrotask(() => ((window as unknown as TestWindow)[callback] as () => void)());
      return node;
    });
  });

  afterEach(() => {
    vi.restoreAllMocks();
    delete (window as unknown as TestWindow).turnstile;
    delete (window as unknown as TestWindow).grecaptcha;
    document.querySelectorAll('.bot-protection-widget').forEach(e => e.remove());
  });

  test('script URLs per provider', () => {
    expect(scriptUrl(turnstile)).toMatch(
      /^https:\/\/challenges\.cloudflare\.com\/turnstile\/v0\/api\.js\?render=explicit&onload=/
    );
    expect(scriptUrl(recaptcha)).toMatch(
      /^https:\/\/www\.google\.com\/recaptcha\/enterprise\.js\?render=site%20key%2F2&onload=/
    );
    expect(() => scriptUrl({ ...turnstile, provider: 'hcaptcha' })).toThrow('Unsupported bot-protection provider');
  });

  test('reCAPTCHA Enterprise: executes with the site key and action', async () => {
    const execute = vi.fn().mockResolvedValue('recaptcha-token');
    (window as unknown as TestWindow).grecaptcha = {
      enterprise: {
        ready: (cb: () => void) => {
          cb();
        },
        execute,
      },
    };

    await expect(getBotProtectionToken(recaptcha)).resolves.toBe('recaptcha-token');
    expect(execute).toHaveBeenCalledWith('site key/2', { action: 'login' });
  });

  test('Turnstile: renders one invisible widget, then resets it for every new token', async () => {
    let callback: ((token: string) => void) | undefined;
    let tokenCount = 0;
    const api = {
      render: vi.fn((_container: HTMLElement, options: { callback: (token: string) => void }) => {
        callback = options.callback;
        return 'widget-1';
      }),
      execute: vi.fn(() => {
        tokenCount += 1;
        queueMicrotask(() => callback?.(`turnstile-token-${String(tokenCount)}`));
      }),
      reset: vi.fn(),
    };
    (window as unknown as TestWindow).turnstile = api;

    await expect(getBotProtectionToken(turnstile)).resolves.toBe('turnstile-token-1');
    await expect(getBotProtectionToken(turnstile)).resolves.toBe('turnstile-token-2');

    expect(api.render).toHaveBeenCalledTimes(1);
    expect(api.render.mock.calls[0][1]).toMatchObject({
      sitekey: 'site-key-1',
      action: 'login',
      execution: 'execute',
      appearance: 'interaction-only',
    });
    expect(api.reset).toHaveBeenCalledTimes(1);
    expect(api.execute).toHaveBeenCalledTimes(2);
  });

  test('Turnstile errors reject the token request', async () => {
    let errorCallback: ((code: string) => boolean) | undefined;
    (window as unknown as TestWindow).turnstile = {
      render: (_c: HTMLElement, options: { 'error-callback': (code: string) => boolean }) => {
        errorCallback = options['error-callback'];
        return 'widget-1';
      },
      execute: () => {
        queueMicrotask(() => errorCallback?.('110200'));
      },
      reset: () => undefined,
    };

    await expect(getBotProtectionToken(turnstile)).rejects.toThrow('Turnstile error 110200');
  });

  test('a provider missing after its script loaded rejects the token request', async () => {
    await expect(getBotProtectionToken(turnstile)).rejects.toThrow('Turnstile is not available');
    await expect(getBotProtectionToken(recaptcha)).rejects.toThrow('reCAPTCHA Enterprise is not available');
  });

  describe(getBotProtectionParameters.name, () => {
    test('no bot protection, no parameters', async () => {
      const getToken = vi.fn();

      await expect(getBotProtectionParameters(undefined, getToken)).resolves.toBeUndefined();
      expect(getToken).not.toHaveBeenCalled();
    });

    test('the token goes in the field named by the step', async () => {
      await expect(
        getBotProtectionParameters({ ...turnstile, tokenField: 'custom' }, () => Promise.resolve('tok'))
      ).resolves.toEqual({ custom: 'tok' });
    });

    test('when no token can be obtained the request goes without one', async () => {
      vi.spyOn(console, 'warn').mockImplementation(() => undefined);

      await expect(
        getBotProtectionParameters(turnstile, () => Promise.reject(new Error('blocked')))
      ).resolves.toBeUndefined();
    });
  });
});

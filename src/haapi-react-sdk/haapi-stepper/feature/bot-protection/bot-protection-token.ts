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

import type { HaapiBotProtection } from '../../data-access/types/haapi-step.types';

/**
 * Gets bot-protection tokens from Google reCAPTCHA Enterprise or Cloudflare Turnstile, as asked for by a step's
 * `metadata.botProtection` (IS-12295).
 *
 * Tokens are single use and short-lived, so one is requested for each submission, never in advance.
 */

export const RECAPTCHA_ENTERPRISE = 'recaptcha-enterprise';
export const TURNSTILE = 'turnstile';

interface RecaptchaEnterprise {
  ready(callback: () => void): void;
  execute(siteKey: string, options: { action: string }): Promise<string>;
}

interface TurnstileRenderOptions {
  sitekey: string;
  action: string;
  execution: 'execute';
  appearance: 'interaction-only';
  callback: (token: string) => void;
  'error-callback': (code: string) => boolean;
}

interface Turnstile {
  render(container: HTMLElement, options: TurnstileRenderOptions): string;
  execute(widgetId: string): void;
  reset(widgetId: string): void;
}

interface BotProtectionWindow {
  grecaptcha?: { enterprise?: RecaptchaEnterprise };
  turnstile?: Turnstile;
}

const ONLOAD_CALLBACK = '__curityHaapiBotProtectionOnload';

const loadedScripts = new Map<string, Promise<void>>();

interface PendingToken {
  resolve: (token: string) => void;
  reject: (error: Error) => void;
}

let turnstileWidget: { siteKey: string; id: string; pending: PendingToken | null } | null = null;

export function scriptUrl(botProtection: HaapiBotProtection): string {
  switch (botProtection.provider) {
    case RECAPTCHA_ENTERPRISE:
      return `https://www.google.com/recaptcha/enterprise.js?render=${encodeURIComponent(botProtection.siteKey)}&onload=${ONLOAD_CALLBACK}`;
    case TURNSTILE:
      return `https://challenges.cloudflare.com/turnstile/v0/api.js?render=explicit&onload=${ONLOAD_CALLBACK}`;
    default:
      throw new Error(`Unsupported bot-protection provider: ${botProtection.provider}`);
  }
}

function loadScript(url: string): Promise<void> {
  const existing = loadedScripts.get(url);
  if (existing) {
    return existing;
  }

  const loading = new Promise<void>((resolve, reject) => {
    (window as unknown as Record<string, unknown>)[ONLOAD_CALLBACK] = () => {
      resolve();
    };

    const script = document.createElement('script');
    script.src = url;
    script.async = true;
    script.onerror = () => {
      loadedScripts.delete(url);
      reject(new Error("The bot-protection provider's script could not be loaded"));
    };
    document.head.appendChild(script);
  });

  loadedScripts.set(url, loading);
  return loading;
}

function recaptchaToken(botProtection: HaapiBotProtection): Promise<string> {
  const enterprise = (window as unknown as BotProtectionWindow).grecaptcha?.enterprise;

  if (!enterprise) {
    return Promise.reject(new Error('reCAPTCHA Enterprise is not available'));
  }

  return new Promise<string>((resolve, reject) => {
    enterprise.ready(() => {
      enterprise.execute(botProtection.siteKey, { action: botProtection.action }).then(resolve, reject);
    });
  });
}

function turnstileToken(botProtection: HaapiBotProtection): Promise<string> {
  const turnstile = (window as unknown as BotProtectionWindow).turnstile;

  if (!turnstile) {
    return Promise.reject(new Error('Turnstile is not available'));
  }

  return new Promise<string>((resolve, reject) => {
    const settle = (error: Error | null, token?: string) => {
      const pending = turnstileWidget?.pending;
      if (turnstileWidget) {
        turnstileWidget.pending = null;
      }
      if (error) {
        pending?.reject(error);
      } else {
        pending?.resolve(token ?? '');
      }
    };

    if (turnstileWidget?.siteKey !== botProtection.siteKey) {
      const container = document.createElement('div');
      container.className = 'bot-protection-widget';
      document.body.appendChild(container);

      // invisible unless the provider decides the user must interact (managed mode)
      const id = turnstile.render(container, {
        sitekey: botProtection.siteKey,
        action: botProtection.action,
        execution: 'execute',
        appearance: 'interaction-only',
        callback: token => settle(null, token),
        'error-callback': code => {
          settle(new Error(`Turnstile error ${code}`));
          return true;
        },
      });
      turnstileWidget = { siteKey: botProtection.siteKey, id, pending: null };
    } else {
      // a widget holds one token at a time and tokens are single use
      turnstile.reset(turnstileWidget.id);
    }

    turnstileWidget.pending = { resolve, reject };
    turnstile.execute(turnstileWidget.id);
  });
}

/**
 * Gets a fresh token for the given step's bot protection.
 */
export async function getBotProtectionToken(botProtection: HaapiBotProtection): Promise<string> {
  await loadScript(scriptUrl(botProtection));

  return botProtection.provider === TURNSTILE ? turnstileToken(botProtection) : recaptchaToken(botProtection);
}

/**
 * Returns the extra form parameters that carry a bot-protection token, or `undefined` when the step has no bot
 * protection. When no token can be obtained, the request is sent without one: the server then responds with the
 * `bot-protection-failed` problem, which the user can recover from by submitting again.
 */
export async function getBotProtectionParameters(
  botProtection: HaapiBotProtection | undefined,
  getToken: (botProtection: HaapiBotProtection) => Promise<string> = getBotProtectionToken
): Promise<Record<string, string> | undefined> {
  if (!botProtection) {
    return undefined;
  }

  try {
    return { [botProtection.tokenField]: await getToken(botProtection) };
  } catch (error) {
    console.warn('Bot protection: could not get a token, submitting without one:', error);
    return undefined;
  }
}

/** For tests only. */
export function resetBotProtectionState() {
  loadedScripts.clear();
  turnstileWidget = null;
}

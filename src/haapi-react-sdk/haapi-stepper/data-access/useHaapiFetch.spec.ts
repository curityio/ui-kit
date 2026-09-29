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

import { beforeEach, describe, expect, it, vi } from 'vitest';
import { renderHook } from '@testing-library/react';
import type { HaapiConfiguration } from '@curity/identityserver-haapi-web-driver';
import { MEDIA_TYPES } from './types/media.types';
import { useHaapiFetch } from './useHaapiFetch';
import { HAAPI_STEPS } from './types/haapi-step.types';
import { HTTP_METHODS } from './types/haapi-form.types';
import type { ApiRequest } from './haapi-fetch-utils';

// Hoist the spies so the vi.mock factory (which runs at module-load time, before
// the test file body executes) can reference them without hitting the TDZ.
const { mockHaapiFetch, createHaapiFetchSpy } = vi.hoisted(() => {
  const mockHaapiFetch = vi.fn();
  const createHaapiFetchSpy = vi.fn(() => mockHaapiFetch);
  return { mockHaapiFetch, createHaapiFetchSpy };
});
vi.mock('@curity/identityserver-haapi-web-driver', () => ({
  createHaapiFetch: createHaapiFetchSpy,
}));

describe('useHaapiFetch', () => {
  const haapiConfig = { clientId: 'test-client', tokenEndpoint: 'https://example/token' } as HaapiConfiguration;

  beforeEach(() => {
    mockHaapiFetch.mockReset();
  });

  it('builds the fetcher via createHaapiFetch with the supplied HaapiConfiguration', () => {
    renderHook(() => useHaapiFetch(haapiConfig));

    expect(createHaapiFetchSpy).toHaveBeenCalledWith(haapiConfig);
  });

  it('sendHaapiFetchRequest forwards the given request to the underlying haapiFetch, verbatim', async () => {
    mockHaapiFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ type: HAAPI_STEPS.AUTHENTICATION }), {
        headers: { 'Content-Type': MEDIA_TYPES.AUTH },
      })
    );

    const { result } = renderHook(() => useHaapiFetch(haapiConfig));

    const body = new URLSearchParams({ username: 'alice' });
    const request: ApiRequest = {
      url: '/api/test',
      init: { method: HTTP_METHODS.POST, headers: { 'Content-Type': MEDIA_TYPES.FORM_URLENCODED }, body },
    };
    await result.current.sendHaapiFetchRequest(request);

    expect(mockHaapiFetch).toHaveBeenCalledWith(request.url, request.init);
  });

  it('sendHaapiFetchRequest returns the step parsed out of the response', async () => {
    mockHaapiFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ type: HAAPI_STEPS.AUTHENTICATION }), {
        headers: { 'Content-Type': MEDIA_TYPES.AUTH },
      })
    );

    const { result } = renderHook(() => useHaapiFetch(haapiConfig));

    const step = await result.current.sendHaapiFetchRequest({ url: '/test/href', init: { method: HTTP_METHODS.GET } });

    expect(step.type).toBe(HAAPI_STEPS.AUTHENTICATION);
  });

  describe('Single-config contract', () => {
    beforeEach(() => {
      vi.resetModules();
      createHaapiFetchSpy.mockClear();
    });

    it('tolerates reference churn when the config values are unchanged (does not re-create the driver)', async () => {
      const { useHaapiFetch: useFreshHaapiFetch } = await import('./useHaapiFetch');

      const configA = {
        clientId: 'app-x',
        tokenEndpoint: 'https://example/token',
      } as HaapiConfiguration;
      const configAClone = {
        clientId: 'app-x',
        tokenEndpoint: 'https://example/token',
      } as HaapiConfiguration;

      const { rerender } = renderHook(({ config }) => useFreshHaapiFetch(config), {
        initialProps: { config: configA },
      });
      rerender({ config: configAClone });

      expect(createHaapiFetchSpy).toHaveBeenCalledTimes(1);
      expect(createHaapiFetchSpy).toHaveBeenCalledWith(configA);
    });

    it('throws an actionable error when a later call arrives with a semantically different config', async () => {
      const { useHaapiFetch: useFreshHaapiFetch } = await import('./useHaapiFetch');

      const configA = {
        clientId: 'app-x',
        tokenEndpoint: 'https://example/token',
      } as HaapiConfiguration;
      const configB = {
        clientId: 'app-y', // ◄── different OAuth client identity
        tokenEndpoint: 'https://example/token',
      } as HaapiConfiguration;

      const { rerender } = renderHook(({ config }) => useFreshHaapiFetch(config), {
        initialProps: { config: configA },
      });

      const consoleErrorSpy = vi.spyOn(console, 'error').mockReturnValue(undefined);

      expect(() => rerender({ config: configB })).toThrow(
        /HaapiConfiguration changed.*one configuration per page load.*reload the page/s
      );

      consoleErrorSpy.mockRestore();
    });
  });
});

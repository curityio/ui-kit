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
import { MEDIA_TYPES } from '../../shared/util/types/media.types';
import { useHaapiFetch } from './useHaapiFetch';
import { HAAPI_STEPS, type HaapiLink } from './types/haapi-step.types';
import { HAAPI_ACTION_TYPES, type HaapiFormAction } from './types/haapi-action.types';
import { HAAPI_FORM_FIELDS, HTTP_METHODS } from './types/haapi-form.types';

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

  it('sendHaapiFetchRequest forwards link actions to the underlying haapiFetch as a GET to the link href', async () => {
    mockHaapiFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ type: HAAPI_STEPS.AUTHENTICATION }), {
        headers: { 'Content-Type': MEDIA_TYPES.AUTH },
      })
    );

    const { result } = renderHook(() => useHaapiFetch(haapiConfig));

    const link: HaapiLink = { href: '/test/href', rel: 'self' };
    await result.current.sendHaapiFetchRequest(link);

    expect(mockHaapiFetch).toHaveBeenCalledWith(link.href, { method: 'GET' });
  });

  it('sendHaapiFetchRequest forwards form actions to the underlying haapiFetch with the payload encoded into the request body', async () => {
    mockHaapiFetch.mockResolvedValueOnce(
      new Response(JSON.stringify({ type: HAAPI_STEPS.AUTHENTICATION }), {
        headers: { 'Content-Type': MEDIA_TYPES.AUTH },
      })
    );

    const { result } = renderHook(() => useHaapiFetch(haapiConfig));

    const formAction: HaapiFormAction = {
      template: HAAPI_ACTION_TYPES.FORM,
      kind: 'login',
      model: {
        method: HTTP_METHODS.POST,
        href: '/api/login',
        type: MEDIA_TYPES.FORM_URLENCODED,
        fields: [{ name: 'username', type: HAAPI_FORM_FIELDS.USERNAME }],
      },
    };

    await result.current.sendHaapiFetchRequest({
      action: formAction,
      payload: { username: 'alice' },
    });

    expect(mockHaapiFetch).toHaveBeenCalledTimes(1);
    const [url, init] = mockHaapiFetch.mock.calls[0] as [string, RequestInit];
    expect(url).toBe(formAction.model.href);
    expect(init.method).toBe(formAction.model.method);
    expect(init.headers).toEqual({ 'Content-Type': formAction.model.type });
    expect(init.body).toBeInstanceOf(URLSearchParams);
    expect((init.body as URLSearchParams).get('username')).toBe('alice');
  });
});

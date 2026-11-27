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

import { describe, test, expect } from 'vitest';
import { HAAPI_FORM_FIELDS, HTTP_METHODS } from './types/haapi-form.types';
import { MEDIA_TYPES } from './types/media.types';
import { HaapiFormAction, HAAPI_ACTION_TYPES, HAAPI_FORM_ACTION_KINDS } from './types/haapi-action.types';
import { createApiRequest, createRequestForUrl, createRequestForForm } from './haapi-fetch-utils';
import type { HaapiLink } from './types/haapi-step.types';

describe(createApiRequest.name, () => {
  test('builds a GET request to the href for a link action', () => {
    const link: HaapiLink = { href: '/example/link', rel: 'self' };

    expect(createApiRequest(link)).toEqual(createRequestForUrl(link.href));
  });

  test('builds a form request for a form action, with the payload applied', () => {
    const action = formAction(HTTP_METHODS.GET, '/example/path', { username: undefined });
    const payload = { username: 'alice' };

    expect(createApiRequest({ action, payload })).toEqual(createRequestForForm({ action, payload }));
  });
});

test(createRequestForUrl.name, () => {
  const { url, init } = createRequestForUrl('/example/path');

  expect(url).toBe('/example/path');
  expect(init.method).toBe(HTTP_METHODS.GET);
  expect(init.body).toBeUndefined();
  expect(init.headers).toBeUndefined();
});

describe(createRequestForForm.name, () => {
  describe(MEDIA_TYPES.FORM_URLENCODED, () => {
    test.each([
      ['/example/path', undefined, '/example/path?a=1'],
      ['/example/path', {}, '/example/path'],
      ['/example/path', { a: 'a', b: '/', c: 'nop' }, '/example/path?a=a&b=%2F'],
      [
        '/example/path',
        new Map([
          ['a', 'a'],
          ['b', 'b'],
        ]),
        '/example/path?a=a&b=b',
      ],
    ])('GET requests', (href, payload, expectedUrl) => {
      const action = formAction(HTTP_METHODS.GET, href, { a: '1', b: undefined });

      const { url, init } = createRequestForForm({ action, payload });

      expect(url).toBe(expectedUrl);
      expect(init.method).toBe(HTTP_METHODS.GET);
      expect(init.body).toBeUndefined();
      expect(init.headers).toBeUndefined();
    });

    test.each([
      [HTTP_METHODS.POST, undefined, { a: '1' }],
      [HTTP_METHODS.PUT, undefined, { a: '1' }],
      [HTTP_METHODS.POST, {}, undefined],
      [HTTP_METHODS.PUT, {}, undefined],
      [HTTP_METHODS.POST, { a: 'a', b: '/', c: 'nop' }, { a: 'a', b: '/' }],
      [HTTP_METHODS.PUT, { b: '/', c: 'nop' }, { b: '/' }],
    ])('POST/PUT requests', (method, payload, expectedBody) => {
      const action = formAction(method, '/example/path?a=a', { a: '1', b: undefined });

      const { url, init } = createRequestForForm({ action, payload });

      expect(url).toBe('/example/path?a=a');
      expect(init.method).toBe(method);

      if (expectedBody) {
        expect(init.body).toStrictEqual(new URLSearchParams(expectedBody));
        expect(init.headers).toStrictEqual({ 'Content-Type': MEDIA_TYPES.FORM_URLENCODED });
      } else {
        expect(init.body).toBeUndefined();
        expect(init.headers).toBeUndefined();
      }
    });

    test.each([HTTP_METHODS.GET, HTTP_METHODS.POST, HTTP_METHODS.PUT])(
      'URL and body are not modified/added if the action has no fields',
      method => {
        const action = formAction(method, '/example/path');
        const payload = { a: 'a' };

        const { url, init } = createRequestForForm({ action, payload });

        expect(url).toBe('/example/path');
        expect(init.method).toBe(method);
        expect(init.body).toBeUndefined();
        expect(init.headers).toBeUndefined();
      }
    );

    test.each([HTTP_METHODS.GET, HTTP_METHODS.POST])('cannot create request for complex payload', method => {
      const action = formAction(method, '/example/path', { a: undefined, b: undefined });
      const payload = {
        a: { inner: 'value' },
        b: 'b',
      };

      expect(() => createRequestForForm({ action, payload })).toThrow();
    });
  });

  describe(MEDIA_TYPES.JSON, () => {
    test.each([
      [HTTP_METHODS.POST, undefined, { a: '1' }],
      [HTTP_METHODS.PUT, undefined, { a: '1' }],
      [HTTP_METHODS.POST, {}, {}],
      [HTTP_METHODS.PUT, {}, {}],
      [HTTP_METHODS.POST, { b: 'b', c: 'nop' }, { b: 'b' }],
      [HTTP_METHODS.PUT, { a: 'a', b: { inner: 42 }, c: 'nop' }, { a: 'a', b: { inner: 42 } }],
    ])('POST/PUT requests', (method, payload, expectedBody) => {
      const action = formAction(method, '/example/path', { a: '1', b: undefined }, MEDIA_TYPES.JSON);

      const { url, init } = createRequestForForm({ action, payload });

      expect(url).toBe('/example/path');
      expect(init.method).toBe(method);
      assert(typeof init.body === 'string');
      expect(JSON.parse(init.body)).toStrictEqual(expectedBody);
      expect(init.headers).toStrictEqual({ 'Content-Type': MEDIA_TYPES.JSON });
    });

    test('cannot create GET requests', () => {
      const action = formAction(HTTP_METHODS.GET, '/example/path', { a: '1' }, MEDIA_TYPES.JSON);
      const payload = { a: 'a' };

      expect(() => createRequestForForm({ action, payload })).toThrow();
    });
  });
});

describe('extra parameters (IS-12295 bot-protection token)', () => {
  const token = { _bot_protection_token: 'tok' };

  test('are added to a form-urlencoded POST body, even though no field declares them', () => {
    const action = formAction(HTTP_METHODS.POST, '/authn/authentication/html1', { username: 'alice' });

    const { init } = createApiRequest({ action }, token);

    expect((init.body as URLSearchParams).toString()).toBe('username=alice&_bot_protection_token=tok');
  });

  test('are added to a POST body when the form has no fields', () => {
    const action = formAction(HTTP_METHODS.POST, '/authn/authentication/html1');

    const { init } = createApiRequest({ action }, token);

    expect((init.body as URLSearchParams).toString()).toBe('_bot_protection_token=tok');
    expect(init.headers).toEqual({ 'Content-Type': MEDIA_TYPES.FORM_URLENCODED });
  });

  test('are added to a JSON POST body', () => {
    const action = formAction(
      HTTP_METHODS.POST,
      '/authn/authentication/html1',
      { username: 'alice' },
      MEDIA_TYPES.JSON
    );

    const { init } = createApiRequest({ action }, token);

    expect(JSON.parse(init.body as string)).toEqual({ username: 'alice', _bot_protection_token: 'tok' });
  });

  test('are not added to GET requests or links', () => {
    const action = formAction(HTTP_METHODS.GET, '/authn/authentication/html1', { a: '1' });

    expect(createApiRequest({ action }, token).url).toBe('/authn/authentication/html1?a=1');
    expect(createApiRequest({ href: '/x', rel: 'self' }, token)).toEqual(createRequestForUrl('/x'));
  });

  test('without extra parameters the request is unchanged', () => {
    const action = formAction(HTTP_METHODS.POST, '/authn/authentication/html1', { username: 'alice' });

    expect(createApiRequest({ action }, undefined)).toEqual(createRequestForForm({ action }));
  });
});

function formAction(
  method: HTTP_METHODS,
  href: string,
  fields?: Record<string, string | undefined>,
  type?: MEDIA_TYPES
): HaapiFormAction {
  return {
    template: HAAPI_ACTION_TYPES.FORM,
    model: {
      method,
      href,
      type,
      fields: Object.entries(fields ?? {}).map(([n, v]) => ({
        type: HAAPI_FORM_FIELDS.TEXT,
        name: n,
        value: v,
      })),
    },
    kind: HAAPI_FORM_ACTION_KINDS.LOGIN,
  };
}

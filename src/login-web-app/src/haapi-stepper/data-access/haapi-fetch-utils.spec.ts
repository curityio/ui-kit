/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
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
import { MEDIA_TYPES } from '../../shared/util/types/media.types';
import { HaapiFormAction, HAAPI_ACTION_TYPES, HAAPI_FORM_ACTION_KINDS } from './types/haapi-action.types';
import { createRequestForUrl, createRequestForForm } from './haapi-fetch-utils';

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

      expect(() => createRequestForForm({ action, payload })).toThrowError();
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

      expect(() => createRequestForForm({ action, payload })).toThrowError();
    });
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

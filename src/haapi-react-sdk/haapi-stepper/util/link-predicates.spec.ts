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

import { createMockLink } from './tests/mocks';
import { isHaapiLink, isQrCodeLink } from './link-predicates';

describe('isQrCodeLink', () => {
  it('returns true for an image media type', () => {
    expect(isQrCodeLink(createMockLink({ subtype: 'image/svg+xml' }))).toBe(true);
    expect(isQrCodeLink(createMockLink({ subtype: 'image/png' }))).toBe(true);
  });

  it('returns false for a non-image media type', () => {
    expect(isQrCodeLink(createMockLink({ subtype: 'text/html' }))).toBe(false);
  });

  it('returns false when no media type is present', () => {
    expect(isQrCodeLink(createMockLink({ subtype: undefined }))).toBe(false);
  });
});

describe('isHaapiLink', () => {
  it('returns true for a HAAPI link without a media type', () => {
    expect(isHaapiLink(createMockLink({ href: '/continue', subtype: undefined }))).toBe(true);
  });

  it('returns true for a link with the explicit HAAPI media type', () => {
    expect(isHaapiLink(createMockLink({ href: '/continue', subtype: 'application/vnd.auth+json' }))).toBe(true);
  });

  it('returns false for an HTTP(S) link with a non-HAAPI media type', () => {
    expect(isHaapiLink(createMockLink({ href: 'https://example.com/tos', subtype: 'text/html' }))).toBe(false);
  });

  it('returns false for a link with a non-HTTP(S) protocol regardless of media type', () => {
    expect(isHaapiLink(createMockLink({ href: 'mailto:support@example.com', subtype: undefined }))).toBe(false);
    expect(isHaapiLink(createMockLink({ href: 'tel:+123456789', subtype: undefined }))).toBe(false);
  });

  it('returns false for image links', () => {
    expect(isHaapiLink(createMockLink({ href: 'data:image/svg+xml;base64,abc', subtype: 'image/svg+xml' }))).toBe(
      false
    );
  });

  it('returns false for a malformed href', () => {
    expect(isHaapiLink(createMockLink({ href: 'http://[malformed', subtype: 'text/html' }))).toBe(false);
    expect(isHaapiLink(createMockLink({ href: 'http://[malformed', subtype: undefined }))).toBe(false);
  });
});

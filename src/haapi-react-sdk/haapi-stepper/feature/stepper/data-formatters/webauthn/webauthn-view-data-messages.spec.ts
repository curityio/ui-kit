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

import { getWebAuthnViewDataMessages } from './webauthn-view-data-messages';

const PREFIX = 'authenticator.webauthn.register.view.';

describe('getWebAuthnViewDataMessages', () => {
  it('returns an empty map when messages are undefined', () => {
    expect(getWebAuthnViewDataMessages(undefined)).toEqual({});
  });

  it('keys the result by the suffix after ".view."', () => {
    const result = getWebAuthnViewDataMessages({
      [`${PREFIX}button.platform`]: 'Built-in',
      [`${PREFIX}button.cross-platform`]: 'Security key',
      [`${PREFIX}authenticator-attachment.platform`]: 'A non-removable built-in device.',
      [`${PREFIX}authenticator-attachment.cross-platform`]: 'A security key.',
    });

    expect(result).toEqual({
      'button.platform': 'Built-in',
      'button.cross-platform': 'Security key',
      'authenticator-attachment.platform': 'A non-removable built-in device.',
      'authenticator-attachment.cross-platform': 'A security key.',
    });
  });

  it('ignores keys without the ".view." marker', () => {
    const result = getWebAuthnViewDataMessages({
      [`${PREFIX}button.platform`]: 'kept',
      'authenticator.webauthn.register.page.title': 'dropped',
    });

    expect(result).toEqual({ 'button.platform': 'kept' });
  });
});

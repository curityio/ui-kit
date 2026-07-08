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

import { getQrCodeViewDataMessages } from './qr-code-view-data-messages';

const PREFIX = 'authenticator.bankid.launch.view.qr.';

describe('getQrCodeViewDataMessages', () => {
  it('returns undefined when there are no messages', () => {
    expect(getQrCodeViewDataMessages(undefined)).toBeUndefined();
    expect(getQrCodeViewDataMessages({})).toBeUndefined();
  });

  it('returns undefined when no key carries the ".view.qr." segment', () => {
    expect(
      getQrCodeViewDataMessages({ 'authenticator.bankid.launch.page.title': 'Login with BankID' })
    ).toBeUndefined();
  });

  it('selects the ".view.qr." messages, keeping their keys untouched', () => {
    const result = getQrCodeViewDataMessages({
      [`${PREFIX}instruction.heading`]: 'Help with scanning the QR code',
      [`${PREFIX}screen-reader.step4.2.1`]: 'Windows: Ctrl+Arrow up',
    });

    expect(result).toEqual({
      [`${PREFIX}instruction.heading`]: 'Help with scanning the QR code',
      [`${PREFIX}screen-reader.step4.2.1`]: 'Windows: Ctrl+Arrow up',
    });
  });

  it('excludes messages without the ".view.qr." segment', () => {
    const result = getQrCodeViewDataMessages({
      [`${PREFIX}instruction.heading`]: 'Help with scanning the QR code',
      'authenticator.bankid.launch.page.title': 'Login with BankID',
    });

    expect(result).toEqual({ [`${PREFIX}instruction.heading`]: 'Help with scanning the QR code' });
  });
});

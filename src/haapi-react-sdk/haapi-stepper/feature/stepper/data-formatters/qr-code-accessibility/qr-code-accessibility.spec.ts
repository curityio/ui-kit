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

import { getQrCodeAccessibility } from './qr-code-accessibility';

const PREFIX = 'authenticator.bankid.launch.view.qr.';
const key = (suffix: string) => `${PREFIX}${suffix}`;

const INSTRUCTION_MESSAGES: Record<string, string> = {
  [key('instruction.heading')]: 'Help with scanning the QR code',
  [key('instruction.step1')]: 'Open the BankID app',
  [key('instruction.step2')]: 'Press the Scan QR code button',
  [key('instruction.step3')]: "Point your phone's camera at the QR code",
  [key('instruction.step4')]: 'Follow the instructions in the app',
  [key('instruction.outro')]: 'The QR code is displayed for a configurable period.',
};

const SCREEN_READER_MESSAGES: Record<string, string> = {
  [key('screen-reader.heading')]: 'If you are using a screen reader',
  [key('screen-reader.intro')]: 'The most common error is that the full QR code is not visible. Try to:',
  [key('screen-reader.step1')]: 'Ensure the screen is on',
  [key('screen-reader.step2')]: 'Zoom out in the browser',
  [key('screen-reader.step3')]: 'Zoom out using magnification tools',
  [key('screen-reader.step4')]: 'Make sure the browser window is maximized by:',
  [key('screen-reader.step4.1')]: 'Clicking on the QR code above or',
  [key('screen-reader.step4.2')]: 'Using keyboard shortcuts',
  [key('screen-reader.step4.2.1')]: 'Windows: Ctrl+Arrow up',
  [key('screen-reader.step4.2.2')]: 'Mac: Ctrl+Cmd+F',
  [key('screen-reader.outro')]: 'Hold the phone in portrait mode about 40 cm away from the screen.',
};

describe('getQrCodeAccessibility', () => {
  it('builds both sections from a complete message set', () => {
    const result = getQrCodeAccessibility({ ...INSTRUCTION_MESSAGES, ...SCREEN_READER_MESSAGES });

    expect(result).toEqual({
      instruction: {
        heading: 'Help with scanning the QR code',
        items: [
          { text: 'Open the BankID app' },
          { text: 'Press the Scan QR code button' },
          { text: "Point your phone's camera at the QR code" },
          { text: 'Follow the instructions in the app' },
        ],
        outro: 'The QR code is displayed for a configurable period.',
      },
      screenReader: {
        heading: 'If you are using a screen reader',
        intro: 'The most common error is that the full QR code is not visible. Try to:',
        items: [
          { text: 'Ensure the screen is on' },
          { text: 'Zoom out in the browser' },
          { text: 'Zoom out using magnification tools' },
          {
            text: 'Make sure the browser window is maximized by:',
            items: [
              { text: 'Clicking on the QR code above or' },
              {
                text: 'Using keyboard shortcuts',
                items: [{ text: 'Windows: Ctrl+Arrow up' }, { text: 'Mac: Ctrl+Cmd+F' }],
              },
            ],
          },
        ],
        outro: 'Hold the phone in portrait mode about 40 cm away from the screen.',
      },
    });
  });

  it('returns undefined when there are no messages', () => {
    expect(getQrCodeAccessibility(undefined)).toBeUndefined();
  });

  it('builds only the section whose messages are present', () => {
    const result = getQrCodeAccessibility(INSTRUCTION_MESSAGES);

    expect(result?.instruction).toBeDefined();
    expect(result?.screenReader).toBeUndefined();
  });

  it('omits a section whose message set is incomplete', () => {
    const incompleteInstructions = Object.fromEntries(
      Object.entries(INSTRUCTION_MESSAGES).filter(([messageKey]) => messageKey !== key('instruction.outro'))
    );

    expect(getQrCodeAccessibility(incompleteInstructions)).toBeUndefined();
  });

  it('resolves messages by the ".view.qr." suffix regardless of the key prefix', () => {
    const waitPrefixed = Object.fromEntries(
      Object.entries(INSTRUCTION_MESSAGES).map(([messageKey, value]) => [
        messageKey.replace('.launch.view.qr.', '.wait.view.qr.'),
        value,
      ])
    );

    expect(getQrCodeAccessibility(waitPrefixed)?.instruction?.heading).toBe('Help with scanning the QR code');
  });

  it('ignores keys without the ".view.qr." marker', () => {
    const result = getQrCodeAccessibility({
      ...INSTRUCTION_MESSAGES,
      'authenticator.bankid.launch.page.title': 'Login with BankID',
    });

    expect(result?.instruction).toBeDefined();
    expect(JSON.stringify(result)).not.toContain('Login with BankID');
  });
});

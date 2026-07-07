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

import { HaapiStepperQrCodeAccessibility, HaapiStepperQrCodeAccessibilitySection } from '../../haapi-stepper.types';

/**
 * Resolves the BankID QR-code accessibility copy carried in `metadata.viewData.messages` into a
 * render-ready structure. Returns `undefined` when neither section is complete, so consumers receive
 * ready-shaped data without parsing message keys or checking completeness themselves.
 */
export function getQrCodeAccessibility(messages?: Record<string, string>): HaapiStepperQrCodeAccessibility | undefined {
  const qr = stripQrCodeViewPrefix(messages);
  const instruction = buildInstructionSection(qr);
  const screenReader = buildScreenReaderSection(qr);

  if (!instruction && !screenReader) {
    return undefined;
  }

  return {
    ...(instruction && { instruction }),
    ...(screenReader && { screenReader }),
  };
}

/**
 * Normalizes the raw `metadata.viewData.messages` map (keys like
 * `authenticator.bankid.launch.view.qr.instruction.heading`) into a map keyed by the logical suffix
 * after `.view.qr.` (e.g. `instruction.heading`, `screen-reader.step4.2.1`). Keying by the suffix
 * keeps this independent of the message-key prefix; keys without the marker are ignored.
 */
function stripQrCodeViewPrefix(messages?: Record<string, string>): Record<string, string> {
  const QR_CODE_VIEW_MARKER = '.view.qr.';

  return Object.fromEntries(
    Object.entries(messages ?? {})
      .filter(([key]) => key.includes(QR_CODE_VIEW_MARKER))
      .map(([key, value]) => [key.slice(key.lastIndexOf(QR_CODE_VIEW_MARKER) + QR_CODE_VIEW_MARKER.length), value])
  );
}

const allPresent = (qr: Record<string, string>, keys: string[]): boolean =>
  keys.every(key => typeof qr[key] === 'string' && qr[key].length > 0);

function buildInstructionSection(qr: Record<string, string>): HaapiStepperQrCodeAccessibilitySection | undefined {
  if (
    !allPresent(qr, [
      'instruction.heading',
      'instruction.step1',
      'instruction.step2',
      'instruction.step3',
      'instruction.step4',
      'instruction.outro',
    ])
  ) {
    return undefined;
  }
  return {
    heading: qr['instruction.heading'],
    items: [qr['instruction.step1'], qr['instruction.step2'], qr['instruction.step3'], qr['instruction.step4']].map(
      text => ({ text })
    ),
    outro: qr['instruction.outro'],
  };
}

function buildScreenReaderSection(qr: Record<string, string>): HaapiStepperQrCodeAccessibilitySection | undefined {
  if (
    !allPresent(qr, [
      'screen-reader.heading',
      'screen-reader.intro',
      'screen-reader.step1',
      'screen-reader.step2',
      'screen-reader.step3',
      'screen-reader.step4',
      'screen-reader.step4.1',
      'screen-reader.step4.2',
      'screen-reader.step4.2.1',
      'screen-reader.step4.2.2',
      'screen-reader.outro',
    ])
  ) {
    return undefined;
  }
  return {
    heading: qr['screen-reader.heading'],
    intro: qr['screen-reader.intro'],
    items: [
      { text: qr['screen-reader.step1'] },
      { text: qr['screen-reader.step2'] },
      { text: qr['screen-reader.step3'] },
      {
        text: qr['screen-reader.step4'],
        items: [
          { text: qr['screen-reader.step4.1'] },
          {
            text: qr['screen-reader.step4.2'],
            items: [{ text: qr['screen-reader.step4.2.1'] }, { text: qr['screen-reader.step4.2.2'] }],
          },
        ],
      },
    ],
    outro: qr['screen-reader.outro'],
  };
}

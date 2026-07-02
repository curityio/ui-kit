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

import { getQrViewDataMessages } from '../../util/qr-view-data-messages';

/**
 * Renders the BankID QR-code accessibility messages carried in `metadata.viewData.messages` as two
 * collapsible sections, mirroring the classic Velocity layout:
 *
 *  - "Help with scanning the QR code" (`instruction.*`)
 *  - "If you are using a screen reader" (`screen-reader.*`)
 *
 * Rendering is defensive: a section is shown only when all of its messages are present, so nothing is
 * rendered against servers that don't emit this view data (or other authenticators).
 *
 * Exported so consumers building a custom BankID UI can reuse it.
 */
export const HaapiStepperBankIdQrAccessibilityMessages = ({ messages }: { messages?: Record<string, string> }) => {
  const qr = getQrViewDataMessages(messages);
  const has = (...keys: string[]) =>
    keys.every(key => {
      const value = qr[key];
      return typeof value === 'string' && value.length > 0;
    });

  const showInstruction = has(
    'instruction.heading',
    'instruction.step1',
    'instruction.step2',
    'instruction.step3',
    'instruction.step4',
    'instruction.outro'
  );

  const showScreenReader = has(
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
    'screen-reader.outro'
  );

  if (!showInstruction && !showScreenReader) {
    return null;
  }

  return (
    <div className="haapi-stepper-bankid-qr-accessibility" data-testid="bankid-qr-accessibility">
      {showInstruction && (
        <details data-testid="bankid-qr-instructions">
          <summary>{qr['instruction.heading']}</summary>
          <ul>
            <li>{qr['instruction.step1']}</li>
            <li>{qr['instruction.step2']}</li>
            <li>{qr['instruction.step3']}</li>
            <li>{qr['instruction.step4']}</li>
          </ul>
          <p>{qr['instruction.outro']}</p>
        </details>
      )}
      {showScreenReader && (
        <details data-testid="bankid-qr-screen-reader">
          <summary>{qr['screen-reader.heading']}</summary>
          <p>{qr['screen-reader.intro']}</p>
          <ul>
            <li>{qr['screen-reader.step1']}</li>
            <li>{qr['screen-reader.step2']}</li>
            <li>{qr['screen-reader.step3']}</li>
            <li>
              {qr['screen-reader.step4']}
              <ul>
                <li>{qr['screen-reader.step4.1']}</li>
                <li>
                  {qr['screen-reader.step4.2']}
                  <ul>
                    <li>{qr['screen-reader.step4.2.1']}</li>
                    <li>{qr['screen-reader.step4.2.2']}</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <p>{qr['screen-reader.outro']}</p>
        </details>
      )}
    </div>
  );
};

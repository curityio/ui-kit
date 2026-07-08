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

/**
 * Renders the BankID QR-code accessibility messages carried by the QR-code link
 * (`qrCodeLink.qrCodeMessages`, relocated from `metadata.viewData.messages` by the step-data
 * formatting) as two collapsible sections, mirroring the classic Velocity layout:
 *
 *  - "Help with scanning the QR code" (`instruction.*`)
 *  - "If you are using a screen reader" (`screen-reader.*`)
 *
 * Interpreting the copy is BankID view knowledge, so this component owns it: messages are looked
 * up by their exact BankID keys, a section is shown only when all of its messages are present, and
 * nothing is rendered against servers that don't emit this view data (or other authenticators).
 *
 * Exported so consumers building a custom BankID UI can reuse it.
 */
export const HaapiStepperBankIdQrCodeAccessibilityMessages = ({
  qrCodeMessages,
}: {
  qrCodeMessages?: Record<string, string>;
}) => {
  // The exact keys the BankID authenticator uses for the QR-code accessibility copy
  // (see `WaitBankIdRepresentationFunction` in the server).
  const qrKey = (suffix: string) => `authenticator.bankid.launch.view.qr.${suffix}`;
  const qr = (suffix: string) => qrCodeMessages?.[qrKey(suffix)];
  const has = (...suffixes: string[]) =>
    suffixes.every(suffix => {
      const value = qr(suffix);
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
    <div className="haapi-stepper-bankid-qr-code-accessibility" data-testid="bankid-qr-code-accessibility">
      {showInstruction && (
        <details data-testid="bankid-qr-code-instructions">
          <summary>{qr('instruction.heading')}</summary>
          <ul>
            <li>{qr('instruction.step1')}</li>
            <li>{qr('instruction.step2')}</li>
            <li>{qr('instruction.step3')}</li>
            <li>{qr('instruction.step4')}</li>
          </ul>
          <p>{qr('instruction.outro')}</p>
        </details>
      )}
      {showScreenReader && (
        <details data-testid="bankid-qr-code-screen-reader">
          <summary>{qr('screen-reader.heading')}</summary>
          <p>{qr('screen-reader.intro')}</p>
          <ul>
            <li>{qr('screen-reader.step1')}</li>
            <li>{qr('screen-reader.step2')}</li>
            <li>{qr('screen-reader.step3')}</li>
            <li>
              {qr('screen-reader.step4')}
              <ul>
                <li>{qr('screen-reader.step4.1')}</li>
                <li>
                  {qr('screen-reader.step4.2')}
                  <ul>
                    <li>{qr('screen-reader.step4.2.1')}</li>
                    <li>{qr('screen-reader.step4.2.2')}</li>
                  </ul>
                </li>
              </ul>
            </li>
          </ul>
          <p>{qr('screen-reader.outro')}</p>
        </details>
      )}
    </div>
  );
};

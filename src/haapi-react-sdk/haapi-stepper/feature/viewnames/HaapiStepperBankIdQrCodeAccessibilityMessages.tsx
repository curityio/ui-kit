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

import type { HaapiStepperQrCodeAccessibility, HaapiStepperQrCodeAccessibilityItem } from '../stepper/haapi-stepper.types';

const QrCodeAccessibilityList = ({ items }: { items: HaapiStepperQrCodeAccessibilityItem[] }) => (
  <ul>
    {items.map(item => (
      <li key={item.text}>
        {item.text}
        {item.items && <QrCodeAccessibilityList items={item.items} />}
      </li>
    ))}
  </ul>
);

/**
 * Renders the BankID QR-code accessibility copy as two collapsible sections, mirroring the classic
 * Velocity layout:
 *
 *  - "Help with scanning the QR code" (`instruction`)
 *  - "If you are using a screen reader" (`screenReader`)
 *
 * The copy is already resolved and completeness-checked by the step-data formatter
 * (`getQrCodeAccessibility`), so this component is pure presentation: it renders whichever sections are
 * present and nothing at all when `qrCodeAccessibility` is absent.
 *
 * Exported so consumers building a custom BankID UI can reuse it.
 */
export const HaapiStepperBankIdQrCodeAccessibilityMessages = ({
  qrCodeAccessibility,
}: {
  qrCodeAccessibility?: HaapiStepperQrCodeAccessibility;
}) => {
  if (!qrCodeAccessibility) {
    return null;
  }

  const { instruction, screenReader } = qrCodeAccessibility;

  return (
    <div className="haapi-stepper-bankid-qr-code-accessibility" data-testid="bankid-qr-code-accessibility">
      {instruction && (
        <details data-testid="bankid-qr-code-instructions">
          <summary>{instruction.heading}</summary>
          <QrCodeAccessibilityList items={instruction.items} />
          <p>{instruction.outro}</p>
        </details>
      )}
      {screenReader && (
        <details data-testid="bankid-qr-code-screen-reader">
          <summary>{screenReader.heading}</summary>
          {screenReader.intro && <p>{screenReader.intro}</p>}
          <QrCodeAccessibilityList items={screenReader.items} />
          <p>{screenReader.outro}</p>
        </details>
      )}
    </div>
  );
};

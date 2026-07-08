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

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, expect, it } from 'vitest';

import { HaapiStepperBankIdQrCodeAccessibilityMessages } from './HaapiStepperBankIdQrCodeAccessibilityMessages';

// Full keys, exactly as the BankID authenticator sends them in `metadata.viewData.messages`.
const key = (suffix: string) => `authenticator.bankid.launch.view.qr.${suffix}`;

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

const ALL_MESSAGES = { ...INSTRUCTION_MESSAGES, ...SCREEN_READER_MESSAGES };

describe('HaapiStepperBankIdQrCodeAccessibilityMessages', () => {
  it('renders both sections, collapsed by default, when all messages are present', () => {
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeMessages={ALL_MESSAGES} />);

    const instructions = screen.getByTestId('bankid-qr-code-instructions');
    const screenReader = screen.getByTestId('bankid-qr-code-screen-reader');

    expect(instructions).not.toHaveAttribute('open');
    expect(screenReader).not.toHaveAttribute('open');
    expect(screen.getByText('Help with scanning the QR code')).toBeInTheDocument();
    expect(screen.getByText('If you are using a screen reader')).toBeInTheDocument();
  });

  it('expands and collapses a section when its summary is toggled', async () => {
    const user = userEvent.setup();
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeMessages={ALL_MESSAGES} />);

    const instructions = screen.getByTestId('bankid-qr-code-instructions');
    const summary = screen.getByText('Help with scanning the QR code');

    expect(instructions).not.toHaveAttribute('open');

    await user.click(summary);
    expect(instructions).toHaveAttribute('open');

    await user.click(summary);
    expect(instructions).not.toHaveAttribute('open');
  });

  it('renders every instruction message', () => {
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeMessages={ALL_MESSAGES} />);

    Object.values(INSTRUCTION_MESSAGES).forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('renders every screen-reader message', () => {
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeMessages={ALL_MESSAGES} />);

    Object.values(SCREEN_READER_MESSAGES).forEach(text => {
      expect(screen.getByText(text)).toBeInTheDocument();
    });
  });

  it('renders the nested screen-reader step structure', () => {
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeMessages={ALL_MESSAGES} />);

    const nestedLeaf = screen.getByText('Windows: Ctrl+Arrow up');
    expect(nestedLeaf).toBeInTheDocument();
    // step4.2.1 sits two <ul> levels below step4
    expect(nestedLeaf.closest('ul')?.parentElement?.textContent).toContain('Using keyboard shortcuts');
  });

  it('renders nothing when there are no messages', () => {
    const { container } = render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeMessages={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders only the instruction section when screen-reader messages are missing', () => {
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeMessages={INSTRUCTION_MESSAGES} />);

    expect(screen.getByTestId('bankid-qr-code-instructions')).toBeInTheDocument();
    expect(screen.queryByTestId('bankid-qr-code-screen-reader')).not.toBeInTheDocument();
  });

  it('renders only the screen-reader section when instruction messages are missing', () => {
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeMessages={SCREEN_READER_MESSAGES} />);

    expect(screen.getByTestId('bankid-qr-code-screen-reader')).toBeInTheDocument();
    expect(screen.queryByTestId('bankid-qr-code-instructions')).not.toBeInTheDocument();
  });

  it('does not render a section when its message set is incomplete', () => {
    const incompleteInstructions = Object.fromEntries(
      Object.entries(INSTRUCTION_MESSAGES).filter(([messageKey]) => messageKey !== key('instruction.outro'))
    );
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeMessages={incompleteInstructions} />);

    expect(screen.queryByTestId('bankid-qr-code-instructions')).not.toBeInTheDocument();
  });

  it('ignores QR-code messages it does not know about (e.g. the expiry countdown)', () => {
    render(
      <HaapiStepperBankIdQrCodeAccessibilityMessages
        qrCodeMessages={{ ...ALL_MESSAGES, [key('minutes-left')]: '{0} minutes left' }}
      />
    );

    expect(screen.queryByText('{0} minutes left')).not.toBeInTheDocument();
  });
});

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

import type { HaapiStepperQrCodeAccessibility } from '../stepper/haapi-stepper.types';
import { HaapiStepperBankIdQrCodeAccessibilityMessages } from './HaapiStepperBankIdQrCodeAccessibilityMessages';

const INSTRUCTION: HaapiStepperQrCodeAccessibility['instruction'] = {
  heading: 'Help with scanning the QR code',
  items: [
    { text: 'Open the BankID app' },
    { text: 'Press the Scan QR code button' },
    { text: "Point your phone's camera at the QR code" },
    { text: 'Follow the instructions in the app' },
  ],
  outro: 'The QR code is displayed for a configurable period.',
};

const SCREEN_READER: HaapiStepperQrCodeAccessibility['screenReader'] = {
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
};

const BOTH: HaapiStepperQrCodeAccessibility = { instruction: INSTRUCTION, screenReader: SCREEN_READER };

describe('HaapiStepperBankIdQrCodeAccessibilityMessages', () => {
  it('renders both sections, collapsed by default', () => {
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeAccessibility={BOTH} />);

    expect(screen.getByTestId('bankid-qr-code-instructions')).not.toHaveAttribute('open');
    expect(screen.getByTestId('bankid-qr-code-screen-reader')).not.toHaveAttribute('open');
    expect(screen.getByText('Help with scanning the QR code')).toBeInTheDocument();
    expect(screen.getByText('If you are using a screen reader')).toBeInTheDocument();
  });

  it('expands and collapses a section when its summary is toggled', async () => {
    const user = userEvent.setup();
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeAccessibility={BOTH} />);

    const instructions = screen.getByTestId('bankid-qr-code-instructions');
    const summary = screen.getByText('Help with scanning the QR code');

    expect(instructions).not.toHaveAttribute('open');
    await user.click(summary);
    expect(instructions).toHaveAttribute('open');
    await user.click(summary);
    expect(instructions).not.toHaveAttribute('open');
  });

  it('renders every message across both sections', () => {
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeAccessibility={BOTH} />);

    for (const text of [
      ...INSTRUCTION.items.map(item => item.text),
      INSTRUCTION.outro,
      SCREEN_READER.intro!,
      SCREEN_READER.outro,
      'Ensure the screen is on',
      'Make sure the browser window is maximized by:',
      'Using keyboard shortcuts',
      'Windows: Ctrl+Arrow up',
      'Mac: Ctrl+Cmd+F',
    ]) {
      expect(screen.getByText(text)).toBeInTheDocument();
    }
  });

  it('renders the nested screen-reader step structure', () => {
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeAccessibility={BOTH} />);

    const nestedLeaf = screen.getByText('Windows: Ctrl+Arrow up');
    // The leaf sits two <ul> levels below "Using keyboard shortcuts".
    expect(nestedLeaf.closest('ul')?.parentElement?.textContent).toContain('Using keyboard shortcuts');
  });

  it('renders nothing when no accessibility copy is present', () => {
    const { container } = render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeAccessibility={undefined} />);
    expect(container).toBeEmptyDOMElement();
  });

  it('renders only the instruction section when the screen-reader section is absent', () => {
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeAccessibility={{ instruction: INSTRUCTION }} />);

    expect(screen.getByTestId('bankid-qr-code-instructions')).toBeInTheDocument();
    expect(screen.queryByTestId('bankid-qr-code-screen-reader')).not.toBeInTheDocument();
  });

  it('renders only the screen-reader section when the instruction section is absent', () => {
    render(<HaapiStepperBankIdQrCodeAccessibilityMessages qrCodeAccessibility={{ screenReader: SCREEN_READER }} />);

    expect(screen.getByTestId('bankid-qr-code-screen-reader')).toBeInTheDocument();
    expect(screen.queryByTestId('bankid-qr-code-instructions')).not.toBeInTheDocument();
  });
});

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
 * Selects the QR-code messages from the raw `metadata.viewData.messages` map — the entries whose
 * key carries the `.view.qr.` segment (e.g. `authenticator.bankid.launch.view.qr.instruction.heading`).
 *
 * Keys are kept exactly as sent by the server; interpreting them is up to the consumer rendering
 * the QR code. Returns `undefined` when no QR-code messages are present.
 */
export function getQrCodeViewDataMessages(messages?: Record<string, string>): Record<string, string> | undefined {
  const QR_CODE_VIEW_MARKER = '.view.qr.';
  const qrCodeMessageEntries = Object.entries(messages ?? {}).filter(([key]) => key.includes(QR_CODE_VIEW_MARKER));

  return qrCodeMessageEntries.length > 0 ? Object.fromEntries(qrCodeMessageEntries) : undefined;
}

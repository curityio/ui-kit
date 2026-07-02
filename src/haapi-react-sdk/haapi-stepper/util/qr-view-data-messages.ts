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
 * Normalizes the raw `metadata.viewData.messages` map (keys like
 * `authenticator.bankid.launch.view.qr.instruction.heading`) into a map keyed by the logical suffix
 * after `.view.qr.` (e.g. `instruction.heading`, `screen-reader.step4.2.1`).
 */
export function getQrViewDataMessages(messages?: Record<string, string>): Record<string, string> {
  const VIEW_QR_MARKER = '.view.qr.';
  return Object.fromEntries(
    Object.entries(messages ?? {})
      .filter(([key]) => key.includes(VIEW_QR_MARKER))
      .map(([key, value]) => [key.slice(key.lastIndexOf(VIEW_QR_MARKER) + VIEW_QR_MARKER.length), value])
  );
}

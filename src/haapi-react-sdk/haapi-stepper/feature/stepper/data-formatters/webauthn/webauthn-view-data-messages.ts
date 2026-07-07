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

const VIEW_MARKER = '.view.';

/**
 * Normalizes the raw WebAuthn registration `metadata.viewData.messages` map (keys like
 * `authenticator.webauthn.register.view.button.platform`) into a map keyed by the logical suffix
 * after `.view.` (e.g. `button.platform`, `authenticator-attachment.cross-platform`).
 *
 * Keying by the suffix keeps callers independent of the full message-key prefix. Keys without the
 * `.view.` marker are ignored.
 */
export function getWebAuthnViewDataMessages(messages?: Record<string, string>): Record<string, string> {
  return Object.fromEntries(
    Object.entries(messages ?? {})
      .filter(([key]) => key.includes(VIEW_MARKER))
      .map(([key, value]) => [key.slice(key.lastIndexOf(VIEW_MARKER) + VIEW_MARKER.length), value])
  );
}

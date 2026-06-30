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

import { MEDIA_TYPES } from '../data-access/types/media.types';
import type { HaapiStepperLink } from '../feature/stepper/haapi-stepper.types';

/**
 * Returns `true` when the link's `subtype` indicates an inline image (e.g. `image/svg+xml`,
 * `image/png`). HAAPI uses this convention to expose QR codes as image-typed links so the UI can
 * render them as a scannable figure rather than a regular text link.
 */
export const isQrCodeLink = (link: HaapiStepperLink): boolean => {
  return link.subtype?.startsWith('image/') ?? false;
};

/**
 * Returns `true` when a link should be followed as an authenticated HAAPI request.
 *
 * A link is a HAAPI link when both:
 * - its URL uses an HTTP(S) protocol; and
 * - it declares no media `type` (exposed here as `subtype`), or declares HAAPI's media type.
 */
export const isHaapiLink = (link: HaapiStepperLink): boolean => {
  let protocol: string;
  try {
    protocol = new URL(link.href, window.location.origin).protocol;
  } catch {
    return false;
  }

  if (protocol !== 'http:' && protocol !== 'https:') {
    return false;
  }

  return link.subtype === undefined || link.subtype === (MEDIA_TYPES.AUTH as string);
};

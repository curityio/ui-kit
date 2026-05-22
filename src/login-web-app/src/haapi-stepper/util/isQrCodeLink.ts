/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import type { HaapiStepperLink } from '../feature/stepper/haapi-stepper.types';

/**
 * Returns `true` when the link's `subtype` indicates an inline image (e.g. `image/svg+xml`,
 * `image/png`). HAAPI uses this convention to expose QR codes as image-typed links so the UI can
 * render them as a scannable figure rather than a regular text link.
 */
export const isQrCodeLink = (link: HaapiStepperLink): boolean => {
  return link.subtype?.startsWith('image/') ?? false;
};

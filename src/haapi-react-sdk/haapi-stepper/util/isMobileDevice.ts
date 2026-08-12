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

export function isMobileDevice() {
  if (typeof window === 'undefined') {
    return false;
  }

  const isTouchPrimary = window.matchMedia('(pointer: coarse)').matches;
  const isSmallScreen = window.matchMedia('(max-width: 767px)').matches;

  const userAgent = navigator.userAgent;
  const isMobileUA = /Mobi|Opera Mini|Android|BlackBerry|iPhone|iPad|iPod/i.test(userAgent);

  return (isTouchPrimary && isSmallScreen) || isMobileUA;
}

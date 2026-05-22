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

const REGIONAL_INDICATOR_OFFSET = 127397;

export const countryFlag = (isoCode: string): string => {
  if (isoCode.length !== 2) return '';
  return [...isoCode.toUpperCase()]
    .map(char => String.fromCodePoint(char.charCodeAt(0) + REGIONAL_INDICATOR_OFFSET))
    .join('');
};

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

export function exhaustiveCheck(value: never, message?: string): never {
  // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
  throw new Error(`${message ?? 'Unexpected value'}: ${value}`);
}

export function required<T>(value: T | null | undefined, message?: string): T {
  if (!value) {
    throw new Error(message ?? 'Expected value is missing');
  }
  return value;
}

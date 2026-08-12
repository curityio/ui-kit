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

import { useState } from 'react';

/**
 * Provides a callback that rethrows async errors during render so React error boundaries can catch them.
 */
export function useThrowErrorToAppErrorBoundary(): (errorMessage: string) => void {
  const [, setError] = useState<unknown>();

  const throwErrorToAppErrorBoundary = (errorMessage: string): void => {
    setError(() => {
      throw new Error(errorMessage);
    });
  };

  return throwErrorToAppErrorBoundary;
}

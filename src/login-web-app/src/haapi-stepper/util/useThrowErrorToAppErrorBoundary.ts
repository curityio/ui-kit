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

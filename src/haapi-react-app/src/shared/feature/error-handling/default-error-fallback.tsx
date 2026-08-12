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

import { Well } from '../../ui/Well';

export interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="haapi-stepper-error-boundary-fallback" data-testid="error-boundary-fallback">
      <Well>
        <h1 className="haapi-stepper-heading" data-testid="error-boundary-fallback-title">
          Something went wrong
        </h1>
        {error?.message && <p data-testid="error-boundary-fallback-message">{error.message}</p>}
        <button
          className="button button-medium button-primary"
          type="button"
          onClick={resetError}
          data-testid="error-boundary-fallback-reset-button"
        >
          Try again
        </button>
      </Well>
    </div>
  );
}

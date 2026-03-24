export interface ErrorFallbackProps {
  error?: Error;
  resetError?: () => void;
}

export function DefaultErrorFallback({ error, resetError }: ErrorFallbackProps) {
  return (
    <div className="flex items-center justify-center h100vh" data-testid="error-boundary-fallback">
      <div className="flex-nostretch mw-36 flex flex-column flex-gap-2 bg-white p3 br-8">
        <h1 className="center" data-testid="error-boundary-fallback-title">
          Something went wrong
        </h1>
        {error?.message && (
          <p className="center" data-testid="error-boundary-fallback-message">
            {error.message}
          </p>
        )}
        <button
          className="button button-medium button-primary"
          type="button"
          onClick={resetError}
          data-testid="error-boundary-fallback-reset-button"
        >
          Try again
        </button>
      </div>
    </div>
  );
}

import { render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { act, useState } from 'react';
import { ErrorBoundary } from './ErrorBoundary';
import { useThrowErrorToAppErrorBoundary } from '../../../haapi-stepper/util/useThrowErrorToAppErrorBoundary';

describe('ErrorBoundary', () => {
  const errorBoundaryFallbackTitle = 'Something went wrong';
  const customErrorBoundaryFallbackTitle = 'Custom Error UI';
  const originalConsoleError = console.error;
  let user: ReturnType<typeof userEvent.setup>;

  beforeEach(() => {
    user = userEvent.setup();
    console.error = vi.fn();
  });

  afterEach(() => {
    console.error = originalConsoleError;
  });

  describe('Default behavior (no errors)', () => {
    it('should render children when there are no errors', () => {
      render(
        <ErrorBoundary>
          <div data-testid="child-component">Child content</div>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('child-component')).toBeInTheDocument();
      expect(screen.getByText('Child content')).toBeInTheDocument();
    });
  });

  describe('Error Fallback Component', () => {
    describe('DefaultErrorFallback component', () => {
      it('should render default error fallback component when child component throws', () => {
        const errorMessage = 'Child component sync error';

        render(
          <ErrorBoundary>
            <SyncErrorThrowerComponent errorMessage={errorMessage} />
          </ErrorBoundary>
        );

        expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();
        expect(screen.getByTestId('error-boundary-fallback-title')).toHaveTextContent(errorBoundaryFallbackTitle);
        expect(screen.getByTestId('error-boundary-fallback-message')).toHaveTextContent(errorMessage);
        expect(screen.getByTestId('error-boundary-fallback-reset-button')).toBeInTheDocument();
      });

      it('should not display error message paragraph when error has no message', () => {
        render(
          <ErrorBoundary>
            <SyncErrorThrowerComponent />
          </ErrorBoundary>
        );

        expect(screen.getByTestId('error-boundary-fallback-title')).toHaveTextContent(errorBoundaryFallbackTitle);
        expect(screen.queryByTestId('error-boundary-fallback-message')).not.toBeInTheDocument();
      });

      it('should log error to console when error occurs', () => {
        // eslint-disable-next-line @typescript-eslint/no-empty-function
        const consoleSpy = vi.spyOn(console, 'error').mockImplementation(() => {});

        render(
          <ErrorBoundary>
            <SyncErrorThrowerComponent errorMessage="Test error" />
          </ErrorBoundary>
        );

        expect(consoleSpy).toHaveBeenCalledWith(
          'Uncaught error:',
          expect.any(Error),
          expect.objectContaining({
            // eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
            componentStack: expect.any(String),
          })
        );

        consoleSpy.mockRestore();
      });
    });

    describe('Custom ErrorFallback component', () => {
      it('should render custom fallback component when provided and when child component throws', () => {
        render(
          <ErrorBoundary FallbackComponent={CustomErrorFallbackComponent}>
            <SyncErrorThrowerComponent errorMessage="Custom error test" />
          </ErrorBoundary>
        );

        expect(screen.getByText(customErrorBoundaryFallbackTitle)).toBeInTheDocument();
        expect(screen.getByTestId('custom-error-message')).toHaveTextContent('Custom error test');
        expect(screen.getByTestId('custom-reset-button')).toBeInTheDocument();
      });

      it('display error message in the custom fallback component when error has message', async () => {
        render(
          <ErrorBoundary FallbackComponent={CustomErrorFallbackComponent}>
            <SyncErrorThrowerComponent errorMessage="Prop passing test" />
          </ErrorBoundary>
        );

        expect(screen.getByTestId('custom-error-message')).toHaveTextContent('Prop passing test');

        const resetButton = screen.getByTestId('custom-reset-button');
        expect(resetButton).toBeInTheDocument();

        await expect(user.click(resetButton)).resolves.toBeUndefined();
      });
    });
  });

  describe('Error resetting functionality', () => {
    describe('DefaultErrorFallback component', () => {
      it('should reset error and render children again when reset button is clicked', async () => {
        render(
          <ErrorBoundary>
            <OnDemandErrorThrowerComponent />
          </ErrorBoundary>
        );

        const throwTestErrorButton = screen.getByTestId('ondemand-error-thrower-button');
        await act(async () => {
          await user.click(throwTestErrorButton);
        });

        const fallbackTitle = screen.getByTestId('error-boundary-fallback-title');
        expect(fallbackTitle).toBeInTheDocument();
        expect(screen.getByTestId('error-boundary-fallback')).toBeInTheDocument();

        const resetErrorButton = screen.getByTestId('error-boundary-fallback-reset-button');
        await act(async () => {
          await user.click(resetErrorButton);
        });

        expect(screen.getByTestId('ondemand-error-thrower-button')).toBeInTheDocument();
        expect(screen.queryByTestId('error-boundary-fallback')).not.toBeInTheDocument();
      });
    });

    describe('Custom ErrorFallback component', () => {
      it('should reset error using custom fallback component reset button', async () => {
        render(
          <ErrorBoundary FallbackComponent={CustomErrorFallbackComponent}>
            <OnDemandErrorThrowerComponent errorMessage="Custom Test Error" />
          </ErrorBoundary>
        );

        const throwTestErrorButton = screen.getByTestId('ondemand-error-thrower-button');
        await act(async () => {
          await user.click(throwTestErrorButton);
        });

        expect(screen.getByText(customErrorBoundaryFallbackTitle)).toBeInTheDocument();
        expect(screen.getByTestId('custom-error-message')).toHaveTextContent('Custom Test Error');

        const resetButton = screen.getByTestId('custom-reset-button');
        await act(async () => {
          await user.click(resetButton);
        });

        expect(screen.queryByTestId('ondemand-error-thrower-button')).toBeInTheDocument();
        expect(screen.queryByText(customErrorBoundaryFallbackTitle)).not.toBeInTheDocument();
      });
    });
  });

  describe('Edge cases', () => {
    it('should handle nested error boundaries', () => {
      render(
        <ErrorBoundary FallbackComponent={CustomErrorFallbackComponent}>
          <ErrorBoundary>
            <SyncErrorThrowerComponent errorMessage="Nested error" />
          </ErrorBoundary>
        </ErrorBoundary>
      );

      expect(screen.getByTestId('error-boundary-fallback-title')).toHaveTextContent(errorBoundaryFallbackTitle);
      expect(screen.getByTestId('error-boundary-fallback-message')).toHaveTextContent('Nested error');
      expect(screen.queryByText(customErrorBoundaryFallbackTitle)).not.toBeInTheDocument();
    });
  });

  describe('useThrowErrorToAppErrorBoundary hook', () => {
    it('should catch async errors rethrowed by the useThrowErrorToAppErrorBoundary hook', async () => {
      const testErrorMessage = 'useThrowErrorToAppErrorBoundary hook rethrown async error';

      render(
        <ErrorBoundary>
          <AsyncErrorToErrorBoundaryThrowerComponent errorMessage={testErrorMessage} />
        </ErrorBoundary>
      );

      expect(screen.getByTestId('async-error-to-error-boundary-thrower-container')).toBeInTheDocument();

      const throwButton = screen.getByTestId('async-error-to-error-boundary-thrower-button');
      await act(async () => {
        await user.click(throwButton);
      });

      expect(await screen.findByTestId('error-boundary-fallback')).toBeInTheDocument();
      expect(await screen.findByTestId('error-boundary-fallback-title')).toHaveTextContent(errorBoundaryFallbackTitle);
      expect(await screen.findByTestId('error-boundary-fallback-message')).toHaveTextContent(testErrorMessage);
    });
  });
});

function OnDemandErrorThrowerComponent({
  errorMessage = 'Test Error',
  testId = 'ondemand-error-thrower-button',
}: {
  errorMessage?: string;
  testId?: string;
}) {
  const [shouldThrow, setShouldThrow] = useState(false);

  if (shouldThrow) {
    throw new Error(errorMessage);
  }

  return (
    <button type="button" data-testid={testId} onClick={() => setShouldThrow(true)}>
      Throw Error
    </button>
  );
}

function SyncErrorThrowerComponent({
  shouldThrow = true,
  errorMessage,
}: {
  shouldThrow?: boolean;
  errorMessage?: string;
}) {
  if (shouldThrow) {
    throw new Error(errorMessage);
  }
  return <div>No error</div>;
}

function AsyncErrorToErrorBoundaryThrowerComponent({ errorMessage }: { errorMessage: string }) {
  const throwErrorToAppErrorBoundary = useThrowErrorToAppErrorBoundary();

  const handleAsyncError = async () => {
    try {
      await new Promise((_, reject) => {
        setTimeout(() => {
          reject(new Error(errorMessage));
        }, 0);
      });
    } catch (error) {
      throwErrorToAppErrorBoundary(error instanceof Error ? error.message : 'Unknown async error');
    }
  };

  return (
    <div data-testid="async-error-to-error-boundary-thrower-container">
      <button
        type="button"
        data-testid="async-error-to-error-boundary-thrower-button"
        onClick={() => {
          // eslint-disable-next-line @typescript-eslint/no-floating-promises
          handleAsyncError();
        }}
      >
        Trigger Async Error
      </button>
    </div>
  );
}

function CustomErrorFallbackComponent({ error, resetError }: { error?: Error; resetError?: () => void }) {
  return (
    <div>
      <h2>Custom Error UI</h2>
      <p data-testid="custom-error-message">{error?.message}</p>
      <button type="button" onClick={resetError} data-testid="custom-reset-button">
        Reset Custom
      </button>
    </div>
  );
}

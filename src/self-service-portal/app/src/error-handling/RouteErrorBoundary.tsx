import React, { useEffect, useState } from 'react';
import { useLocation } from 'react-router';
import { ErrorBoundary, FallbackProps } from 'react-error-boundary';
import { useTranslation } from 'react-i18next';
import { usePageTitle } from '@/shared/utils/useRouteTitle';
import { Alert } from '@/shared/ui/Alert';
import { Button } from '@curity/ui-kit-component-library';
import { Spinner } from '@/shared/ui/Spinner';

export const RouteErrorBoundary = ({ children }: { children: React.ReactNode }) => {
  const location = useLocation();
  const valueChangesThatResetErrorBoundary = [location.pathname];

  return (
    <ErrorBoundary FallbackComponent={RouteErrorBoundaryFallback} resetKeys={valueChangesThatResetErrorBoundary}>
      {children}
    </ErrorBoundary>
  );
};

const RouteErrorBoundaryFallback = ({ error, resetErrorBoundary }: FallbackProps) => {
  const { t } = useTranslation();
  const pageTitle = usePageTitle();
  const [isResettingErrorBoundary, setIsResettingErrorBoundary] = useState(false);
  const isAppBootstrappingError = error?.message?.includes('Error bootstrapping');
  const errorMessage = isAppBootstrappingError ? error?.message : `${t('Failed to load')} ${pageTitle} ${t('page')}`;

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>;

    if (isResettingErrorBoundary) {
      timer = setTimeout(() => {
        resetErrorBoundary();
        setIsResettingErrorBoundary(false);
      }, 2000);
    }

    return () => clearTimeout(timer);
  }, [isResettingErrorBoundary, resetErrorBoundary]);

  return (
    <div className="flex flex-column justify-center flex-center h100 p4">
      {isResettingErrorBoundary ? (
        <Spinner width={48} height={48} />
      ) : (
        <Alert kind="danger" errorMessage={errorMessage}>
          <Button
            onClick={() => setIsResettingErrorBoundary(true)}
            title={t('reload')}
            className="button-small button-primary-outline ml2"
          />
        </Alert>
      )}
    </div>
  );
};

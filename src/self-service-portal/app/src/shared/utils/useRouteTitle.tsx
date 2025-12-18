import { useMemo } from 'react';
import { matchRoutes, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '@/routes';

export const usePageTitle = () => {
  const defaultTitle = 'self-service-portal';
  const location = useLocation();
  const { t } = useTranslation();

  const title = useMemo(() => {
    const matches = matchRoutes(ROUTES, location);
    const currentRoute = matches?.[matches.length - 1];
    return currentRoute?.route?.title ? t(currentRoute.route.title) : t(defaultTitle);
  }, [location, t]);

  return title;
};

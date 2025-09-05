import { useEffect, useState } from 'react';
import { matchRoutes, useLocation } from 'react-router';
import { useTranslation } from 'react-i18next';
import { ROUTES } from '../../routes.tsx';

export const usePageTitle = () => {
  const defaultTitle = 'self-service-portal';
  const [title, setTitle] = useState<string>(defaultTitle);
  const location = useLocation();
  const { t } = useTranslation();

  useEffect(() => {
    const matches = matchRoutes(ROUTES, location);
    const currentRoute = matches?.[matches.length - 1];
    const pageTitle = currentRoute?.route?.title ? t(currentRoute.route.title) : t(defaultTitle);

    setTitle(pageTitle);
  }, [location, t]);

  return title;
};

/*
 * Copyright (C) 2024 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */
import { Link } from 'react-router';
import curityLogoLandscapeImg from '@curity-ui-kit/assets/images/curity-logo-landscape.svg';

import { useTranslation } from 'react-i18next';

export const NoMatch = () => {
  const { t } = useTranslation();

  return (
    <div className="home-layout flex justify-center">
      <div className="flex-60">
        <div className="flex flex-center justify-center flex-column h100">
          <div className="">
            <img
              src={curityLogoLandscapeImg}
              alt="Curity Logo"
              width={155}
              height={25}
              className="w-9 block mb4"
              data-testid="no-match-curity-logo"
            />
            <h1 data-testid="no-match-title">{t('page-not-found-404')}</h1>
            <p data-testid="no-match-description">{t('page-not-found-message')}.</p>
            <p>
              <Link to="/" data-testid="no-match-home-link">
                {t('return-to-home')}
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

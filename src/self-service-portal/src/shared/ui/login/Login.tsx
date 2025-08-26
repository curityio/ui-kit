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

import { SignInButton } from '@/auth/feature/SignInButton';
import classes from './login.module.css';
import selfServicePortalIntroImg from '@curity-ui-kit/assets/images/self-service-portal-intro.svg';
import curityLogoLandscapeImg from '@curity-ui-kit/assets/images/curity-logo-landscape.svg';
import { useUiConfig } from '@/ui-config/data-access/UiConfigProvider';

interface LoginProps {
  title: string;
  description?: string;
}

export const Login = ({ title, description }: LoginProps) => {
  const uiConfig = useUiConfig();
  return (
    <div className={`${classes['login-layout']}`}>
      <aside className="relative overflow-hidden">
        <img
          src={uiConfig.theme.loginImage || selfServicePortalIntroImg}
          alt={title}
          width={600}
          height={400}
          role="img"
        />
      </aside>

      <main className="p2 lg-p4">
        <div className="flex flex-center justify-center flex-column h100">
          <div className="p2">
            <img
              src={uiConfig.theme.logoImage || curityLogoLandscapeImg}
              alt="Logo"
              width={155}
              height={25}
              className={`${classes['login-logo']} block mb4`}
              role="img"
            />
            <h1>{title}</h1>
            <p>{description}</p>
            <SignInButton />
          </div>
        </div>
      </main>
    </div>
  );
};

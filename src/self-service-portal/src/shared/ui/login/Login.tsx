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
import selfServicePortalIntroImg from '@curity-internal/assets/images/self-service-portal-intro.svg';
import curityLogoLandscapeImg from '/src/images/curity-logo-landscape.svg';

interface LoginProps {
  title: string;
  description?: string;
}

export const Login = ({ title, description }: LoginProps) => {
  return (
    <div className={`${classes['login-layout']}`}>
      <aside className="relative overflow-hidden">
        <img src={selfServicePortalIntroImg} alt={title} />
      </aside>

      <main>
        <div className="flex flex-center justify-center flex-column h100">
          <div className="p2">
            <img src={curityLogoLandscapeImg} alt="Curity Logo" width={155} height={25} className="w-9 block mb4" />
            <h1>{title}</h1>
            <p>{description}</p>
            <SignInButton />
          </div>
        </div>
      </main>
    </div>
  );
};

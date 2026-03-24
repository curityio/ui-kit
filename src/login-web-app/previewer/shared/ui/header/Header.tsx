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

import { CurityLogo } from './CurityLogo';
import classes from './header.module.css';

export const Header = () => {
  return (
    <header className={classes.header}>
      <div className="flex flex-center">
        <a href="/" className="flex flex-center flex-gap-2">
          <CurityLogo />
          <span className={classes.logoText}>LWA previewer</span>
        </a>
      </div>
    </header>
  );
};

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

import { IconVciCredentialHome } from '@curity/ui-kit-icons';
import classes from './header.module.css';

export const Header = () => {
  return (
    <header className={`${classes.header} px2 flex flex-center flex-gap-1 w100`}>
      <a href="/" className="button button-tiny button-link">
        <IconVciCredentialHome width={32} height={32} />
        Return to app
      </a>
    </header>
  );
};

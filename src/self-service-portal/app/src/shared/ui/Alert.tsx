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

interface AlertProps {
  errorMessage: string;
  kind?: string;
  link?: string;
  linkText?: string;
  classes?: string;
  children?: React.ReactNode;
}

export const Alert = ({ errorMessage, kind, link, linkText, classes = '', children, ...props }: AlertProps) => (
  <div className={`alert alert-${kind} ${classes}`} {...props}>
    <p className="m0">{errorMessage}</p>
    {!!link && <Link to={link}>{linkText}</Link>}
    {children}
  </div>
);

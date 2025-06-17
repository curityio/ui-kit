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

import React, { ButtonHTMLAttributes } from 'react';

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  title?: string;
  icon?: React.ReactElement;
}

export const Button = ({ title, icon, ...props }: ButtonProps) => {
  const className = props.className + ' button';

  return (
    <button {...props} className={className}>
      {icon && <span>{icon}</span>}
      {title && <span>{title}</span>}
    </button>
  );
};

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

import { InputHTMLAttributes, ReactNode } from 'react';

interface PasswordInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label: string;
  className: string;
  children?: ReactNode;
}

export const PasswordInput = ({ label, id, className, children, ...props }: PasswordInputProps) => (
  <div>
    <label className="block" htmlFor={id}>
      {label}
    </label>
    <input type="password" id={id} placeholder="" className={`field w100 ${className}`} {...props} />
    {children}
  </div>
);

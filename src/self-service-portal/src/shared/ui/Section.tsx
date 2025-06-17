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
import React, { HTMLAttributes } from 'react';

interface SectionProps extends HTMLAttributes<HTMLFieldSetElement> {
  title: string;
  children?: React.ReactNode;
  className?: string;
}

export const Section = ({ title, className, children }: SectionProps) => {
  className = `mt2 mb2 p3 ${className || ''}`;
  return (
    <fieldset className={className || ''}>
      {title && <legend>{title}</legend>}
      {children}
    </fieldset>
  );
};

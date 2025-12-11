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

import { JSX } from 'react';
import classes from './page-header.module.css';
import { TranslationFunction } from '@/types/util.type.ts';

interface PageHeaderProps {
  title: string;
  t: TranslationFunction;
  description?: string;
  icon?: JSX.Element;
}

export const PageHeader = ({ title, description, icon, t, ...props }: PageHeaderProps) => {
  return (
    <header className={`${classes['page-header']} flex flex-center flex-gap-2 flex-column justify-center`} {...props}>
      <figure
        role="img"
        aria-hidden="true"
        aria-label={`${t('monogram-avatar')}`}
        className={`${classes['page-header-icon']} p2 w-6 h-6 flex flex-center justify-center`}
        data-testid="page-header-icon"
      >
        {icon}
      </figure>
      <div className="flex flex-column flex-gap-2 flex-center justify-center center py1">
        <h1 className="m0 word-break-all pretty" data-testid="page-header-title">
          {title}
        </h1>
        <p className="m0 mw-40" data-testid="page-header-description">
          {description}
        </p>
      </div>
    </header>
  );
};

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

import { Input } from '../input/Input';
import styles from './search-field.module.css';
import { TranslationFunction } from '@/types/util.type.ts';

type SearchFieldProps = {
  title: string;
  className?: string;
  onSearch?: (value: string) => void;
  length: number;
  autoFocus?: boolean;
  t: TranslationFunction;
};

export const SearchField = ({ title, className, onSearch, length, t, ...props }: SearchFieldProps) => {
  return (
    <Input
      type="search"
      placeholder={`${t('search')} ${length} ${title}...`}
      className={`${className || ''}`.trim()}
      inputClassName={`field ${styles['search-field']}`}
      onChange={e => onSearch && onSearch(e.target.value)}
      {...props}
      data-testid="search-input"
    />
  );
};

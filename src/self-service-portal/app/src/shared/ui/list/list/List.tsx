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

import { HTMLAttributes, JSX } from 'react';
import { ListItem } from '../list-item.model.ts';

interface ListProps extends HTMLAttributes<HTMLUListElement> {
  className?: string;
  children?: React.ReactNode;
}

export const List = <T extends ListItem<T>>({ className, children, ...props }: ListProps): JSX.Element => {
  return (
    <ul {...props} className={`list-reset ${className ? className : 'flex flex-column flex-gap-1'}`}>
      {children}
    </ul>
  );
};

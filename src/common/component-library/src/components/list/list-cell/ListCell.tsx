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

import { JSX, ReactNode } from 'react';

interface ListCellProps {
  children: ReactNode | JSX.Element;
  className?: string;
}
export const ListCell = ({ children, className }: ListCellProps) => {
  return <div className={className || 'flex flex-center justify-between flex-gap-2'}>{children}</div>;
};

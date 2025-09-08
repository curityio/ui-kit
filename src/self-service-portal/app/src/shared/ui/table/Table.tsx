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

import { ReactNode } from 'react';
import tableStyles from './table.module.css';
import tableHeaderStyles from './table-header.module.css';
import tableRowStyles from './table-row.module.css';
import tableCellStyles from './table-cell.module.css';

interface TableProps {
  children: ReactNode;
  className?: string;
}

// Base Table
export const Table = ({ children, className }: TableProps) => (
  <div className={`${tableStyles['table-scroller']}`}>
    <table className={`${tableStyles.table} ${className || ''}`} data-testid="table">
      {children}
    </table>
  </div>
);

// Table Header
export const TableHeader = ({ children, className }: TableProps) => (
  <thead className={className || ''}>{children}</thead>
);

// Table Row
export const TableRow = ({ children, className }: TableProps) => (
  <tr className={`${tableRowStyles['table-row']} ${className || ''}`}>{children}</tr>
);

// Table Head (for column headers)
export const TableHead = ({ children, className }: TableProps) => (
  <th className={`${tableHeaderStyles['table-header']} ${className || ''}`}>{children}</th>
);

// Table Body
export const TableBody = ({ children, className }: TableProps) => <tbody className={className || ''}>{children}</tbody>;

// Table Cell
export const TableCell = ({ children, className, ...props }: TableProps) => (
  <td className={`${tableCellStyles['table-cell']} ${className || ''}`} {...props}>
    {children}
  </td>
);

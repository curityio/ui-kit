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

import { useState } from 'react';
import { Toggle } from '../toggle/Toggle';
import styles from './page-header.module.css';

interface HeaderProps {
  title: string;
  setHasError: (hasError: boolean) => void;
}

export function Header({ title, setHasError }: HeaderProps) {
  const [showErrors, setShowErrors] = useState(false);

  return (
    <div className={styles.pageHeader}>
      <div className="flex flex-center justify-between flex-gap-4">
        <p className="m0">{title}</p>
        <Toggle
          checked={showErrors}
          onChange={checked => {
            setShowErrors(checked);
            setHasError(checked);
          }}
          label="View Errors"
          id={`view-errors-${title.toLowerCase().replace(/\s+/g, '-')}`}
        />
      </div>
      <div className="flex flex-center justify-end">
        <p className="m0">HAAPI JSON response</p>
      </div>
    </div>
  );
}

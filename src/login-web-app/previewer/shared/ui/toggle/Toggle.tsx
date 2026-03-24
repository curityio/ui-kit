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

import styles from './toggle.module.css';

interface ToggleProps extends Omit<React.InputHTMLAttributes<HTMLInputElement>, 'type' | 'onChange'> {
  checked: boolean;
  onChange: (checked: boolean) => void;
  label?: string;
  disabled?: boolean;
  name?: string;
  id?: string;
  testId?: string;
}

export function Toggle({ checked, onChange, label, disabled, name, id, testId, ...props }: ToggleProps) {
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.checked);
  };

  return (
    <div className="flex flex-center flex-gap-2">
      <label className={styles['toggle-switch']}>
        <input
          type="checkbox"
          checked={checked}
          onChange={handleChange}
          disabled={disabled}
          name={name}
          id={id}
          data-testid={testId}
          {...props}
        />
        <div className={styles['toggle-slider']} />
      </label>
      {!!label && (
        <label htmlFor={id} className={styles.toggleLabel}>
          {label}
        </label>
      )}
    </div>
  );
}

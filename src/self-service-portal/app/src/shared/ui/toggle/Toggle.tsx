import React from 'react';
import styles from './toggle.module.css';

type ToggleProps = {
  checked?: boolean;
  disabled?: boolean;
  name?: string;
  label?: string;
  onChange?: (checked: boolean) => void;
  testId?: string;
} & React.InputHTMLAttributes<HTMLInputElement>;

export const Toggle = ({
  checked = false,
  disabled = false,
  name,
  label,
  onChange,
  testId = 'custom-element',
  ...props
}: ToggleProps) => {
  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    onChange?.(event.target.checked);
  };

  const id = `toggle-${name}`;

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
        <label htmlFor={id} className={styles['toggleLabel']}>
          {label}
        </label>
      )}
    </div>
  );
};

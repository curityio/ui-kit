import { InputHTMLAttributes, Ref, useState } from 'react';
import { DISABLE_PASSWORD_ATTRIBUTES } from '@/utils/disable-password-managers';

interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  tooltip?: string;
  warning?: string;
  error?: string;
  className?: string;
  inputClassName?: string;
  labelClassName?: string;
  ref?: Ref<HTMLInputElement>;
  disablePasswordManager?: boolean;
}

export const Input = ({
  label,
  tooltip,
  warning,
  error,
  className = '',
  inputClassName = '',
  labelClassName = '',
  type = 'text',
  ref,
  disablePasswordManager = true,
  ...props
}: InputProps) => {
  const [isFocused, setIsFocused] = useState(false);

  const handleFocus = () => setIsFocused(true);
  const handleBlur = () => setIsFocused(false);

  return (
    <div className={`${className}`} data-testid="input-container">
      {label && (
        <label htmlFor={props.id} className={`nowrap ${labelClassName} ${isFocused ? 'focused' : ''}`}>
          {label}
        </label>
      )}

      <input
        ref={ref}
        id={props.id}
        aria-labelledby={!label ? props.id : undefined}
        type={type}
        className={`field ${inputClassName} ${error ? 'input-error' : ''}`}
        onFocus={handleFocus}
        onBlur={handleBlur}
        {...props}
        {...(disablePasswordManager ? DISABLE_PASSWORD_ATTRIBUTES : {})}
      />

      {tooltip && !error && <small className="input-tooltip">{tooltip}</small>}
      {warning && !error && <small className="input-warning">{warning}</small>}
      {error && <small className="input-error">{error}</small>}
    </div>
  );
};

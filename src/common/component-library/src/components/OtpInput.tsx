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

import { Alert } from '@components/Alert';
import { DISABLE_PASSWORD_ATTRIBUTES } from '@/utils/disable-password-managers';
import VerificationInput, { VerificationInputProps } from 'react-verification-input';
import { TranslationFunction } from '@/types/util.type.ts';

interface OtpInputProps extends VerificationInputProps {
  onChange?: (digits: string) => void;
  t: TranslationFunction;
  errorMessage?: string | null;
}

export const OtpInput: React.FC<OtpInputProps> = ({ errorMessage, onChange, t, ...props }) => {
  const handleChange = (updatedDigits: string) => {
    onChange?.(updatedDigits);
  };
  return (
    <>
      <VerificationInput
        inputProps={{ ...DISABLE_PASSWORD_ATTRIBUTES, inputMode: 'numeric' }}
        onChange={handleChange}
        length={length || 6}
        autoFocus
        placeholder=""
        validChars="0-9"
        classNames={{
          character: 'field',
          characterInactive: 'otp-input-character-inactive',
          characterSelected: 'otp-input-character-selected',
          characterFilled: 'otp-input-character-filled',
        }}
        {...props}
      />
      {errorMessage && (
        <Alert kind="danger" errorMessage={t(errorMessage)} classes="mt2" data-testid="complete-verification-error" />
      )}
    </>
  );
};

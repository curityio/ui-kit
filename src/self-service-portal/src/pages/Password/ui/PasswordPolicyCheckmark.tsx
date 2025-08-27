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

import styles from '../utils/password-policy.module.css';

export const PasswordPolicyCheckmark = () => {
  return (
    <svg
      className={`${styles['password-policy-rule-checkmark']}`}
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 52 52"
    >
      <circle className={`${styles['password-policy-rule-checkmark-circle']}`} cx="26" cy="26" r="25" fill="none" />
      <path
        className={`${styles['password-policy-rule-checkmark-check']}`}
        fill="none"
        d="M14.1 27.2l7.1 7.2 16.7-16.8"
      />
    </svg>
  );
};

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

import { PasswordPolicyCheckmark } from './PasswordPolicyCheckmark.tsx';
import styles from '../utils/password-policy.module.css';
import { CredentialRuleDescriptor } from '../../../shared/data-access/API/user-management/typing-overwrites';

interface PasswordPolicyRuleProps {
  rule: CredentialRuleDescriptor;
  passed?: boolean;
}

export const PasswordPolicyRule = ({ rule, passed = false }: PasswordPolicyRuleProps) => {
  const ruleType = rule.__typename;
  const characters = 'minimum' in rule ? rule.minimum : 'maximum' in rule ? rule.maximum : 0;

  return (
    <li
      title={rule.message!}
      className={`flex flex-gap-2 ${styles['password-policy-rule']} ${
        passed ? styles['password-policy-rule-satisfied'] : styles['password-policy-rule-unmet']
      } `}
      data-testid={'passwordPolicyRule' + ruleType}
    >
      <div className="relative">
        <PasswordPolicyCheckmark />
      </div>
      <small className="m0 ml2 w100 flex justify-between">
        {rule.message}

        <span>{characters}</span>
      </small>
    </li>
  );
};

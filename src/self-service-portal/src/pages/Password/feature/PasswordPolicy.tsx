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

import { useQuery } from '@apollo/client';
import { PasswordPolicyRule } from '../ui/PasswordPolicyRule';
import styles from '../utils/password-policy.module.css';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { passwordValidator } from '@/pages/Password/utils/password-validator';
import { useTranslation } from 'react-i18next';
import { useEffect } from 'react';

interface PasswordPolicyProps {
  passwordValue: string;
  onPasswordValidation: (isValid: boolean) => void;
}

export const PasswordPolicy = ({ passwordValue, onPasswordValidation }: PasswordPolicyProps) => {
  const { t } = useTranslation();
  const { data: credentialPoliciesResponse } = useQuery(GRAPHQL_API.USER_MANAGEMENT.QUERIES.getCredentialPolicy);
  const passwordRules = credentialPoliciesResponse?.credentialPolicy?.credentialUpdateRules || [];
  const passwordValidationErrors = passwordValidator(passwordRules, passwordValue);

  useEffect(() => {
    if (passwordValidationErrors) {
      const isValid = Object.keys(passwordValidationErrors).length === 0;

      onPasswordValidation(isValid);
    }
  }, [passwordValidationErrors, onPasswordValidation]);

  return passwordRules?.length ? (
    <div className={`${styles['password-policy']} left-align p3 mb2 mt2 br-8`}>
      <h4 className="mt0">{t('security.password.requirements')}</h4>
      <ul className="list-reset m0 flex flex-gap-1 flex-column">
        {passwordRules.map(validationRule => {
          const ruleType = validationRule.__typename;
          const isInValid = passwordValidationErrors?.[ruleType];

          return <PasswordPolicyRule rule={validationRule} key={ruleType} passed={!isInValid} />;
        })}
      </ul>
    </div>
  ) : null;
};

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

import { useMutation, useQuery } from '@apollo/client';
import { PageHeader } from '@/shared/ui/page-header/PageHeader';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { useTranslation } from 'react-i18next';
import { IconCapabilityResourceOwnerPasswordCredentials } from '@icons';
import { Section } from '@/shared/ui/Section';
import { useState } from 'react';
import { GraphQLFormattedError } from 'graphql/error/GraphQLError';
import { Alert } from '@/shared/ui/Alert';
import { PasswordPolicy } from '@/pages/Password/feature/PasswordPolicy';
import { PasswordInput } from '@/pages/Password/ui/PasswordInput';
import { Button } from '@/shared/ui/Button';
import toast from 'react-hot-toast';

interface PasswordUpdateBEValidationError extends GraphQLFormattedError {
  extensions: { details: { message: string }[] };
}

export const Password = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const userName = session?.idTokenClaims?.sub;
  const [passwordUpdateValue, setPasswordUpdateValue] = useState('');
  const [passwordUpdateConfirmationValue, setPasswordUpdateConfirmationValue] = useState('');
  const [passwordPassesFrontendValidation, setPasswordPassesFrontendValidation] = useState<boolean>();
  const { data: accountResponse } = useQuery(GRAPHQL_API.USER_MANAGEMENT.QUERIES.getAccountByUserName, {
    variables: { userName },
  });
  const [updateAccountById, { error: accountUpdateError }] = useMutation(
    GRAPHQL_API.USER_MANAGEMENT.MUTATIONS.updateAccountById
  );

  const account = accountResponse?.accountByUserName;
  const passwordUpdateConfirmationError =
    passwordUpdateConfirmationValue && passwordUpdateValue !== passwordUpdateConfirmationValue;
  const passwordUpdateBackendValidationError = accountUpdateError?.graphQLErrors?.find(
    error => error.extensions?.classification === 'credential-update-rejected'
  ) as PasswordUpdateBEValidationError;
  const passwordUpdateBackendValidationErrorMessage =
    passwordUpdateBackendValidationError?.extensions?.details?.[0]?.message;
  const passwordUpdateHasErrors = passwordUpdateConfirmationError || passwordUpdateBackendValidationError;
  const passwordUpdateIsValid =
    passwordUpdateValue?.length &&
    passwordUpdateConfirmationValue?.length &&
    passwordPassesFrontendValidation &&
    !passwordUpdateHasErrors;
  const passwordUpdateValidationClassName = `${passwordUpdateHasErrors ? 'is-error' : ''} ${
    passwordUpdateIsValid ? 'is-success' : ''
  }`;
  const disableUpdatePasswordButton =
    !passwordUpdateValue ||
    !passwordUpdateConfirmationValue ||
    passwordUpdateConfirmationError ||
    !passwordPassesFrontendValidation;

  const resetPasswordUpdateForm = () => {
    setPasswordUpdateValue('');
    setPasswordUpdateConfirmationValue('');
  };

  const updatePassword = (accountId?: string, passwordUpdate?: string) => {
    if (accountId && passwordUpdate) {
      updateAccountById({
        variables: {
          input: {
            accountId,
            fields: {
              password: passwordUpdate,
            },
          },
        },
      })
        .then(() => {
          toast.success(t('Your password has been successfully updated!'), {
            id: 'password-update-success',
          });
          resetPasswordUpdateForm();
        })
        // Here we need to handle the error to avoid Cypress test to fail when GraphQL errors
        .catch();
    }
  };

  return (
    <>
      <PageHeader
        title={t('Password')}
        description={t(
          'Set a new password. Ensure it meets any required complexity and security policies, if applicable.'
        )}
        icon={<IconCapabilityResourceOwnerPasswordCredentials width={128} height={128} />}
      />
      <Section title={t('Set a new password')} className="mx-auto w-30">
        <div className="flex flex-column flex-gap-2">
          {passwordUpdateBackendValidationError && (
            <Alert kind="danger" errorMessage={passwordUpdateBackendValidationErrorMessage} classes="w100" />
          )}
          <form>
            <input
              id="username"
              type="email"
              value={userName}
              autoComplete="username"
              disabled
              style={{ display: 'none' }}
            />
            <PasswordInput
              label={t('New password')}
              id="passwordUpdate"
              className={passwordUpdateValidationClassName}
              value={passwordUpdateValue}
              onChange={e => setPasswordUpdateValue(e.target.value)}
              autoComplete="new-password"
              data-testid="password-update-input"
            >
              {passwordUpdateConfirmationError && errorElement(t('Passwords must match'))}
            </PasswordInput>
            <PasswordInput
              label={t('Confirm new password')}
              id="passwordUpdateConfirmation"
              className={passwordUpdateValidationClassName}
              value={passwordUpdateConfirmationValue}
              onChange={e => setPasswordUpdateConfirmationValue(e.target.value)}
              autoComplete="new-password"
              data-testid="password-update-confirmation-input"
            >
              {passwordUpdateConfirmationError && errorElement(t('Passwords must match'))}
            </PasswordInput>
          </form>
          <PasswordPolicy
            passwordValue={passwordUpdateValue}
            onPasswordValidation={isValid => setPasswordPassesFrontendValidation(isValid)}
          />
        </div>
        <div className="flex flex-center justify-end flex-gap-2 mt2">
          <Button
            title={t('Set new password')}
            onClick={() => updatePassword(account?.id, passwordUpdateValue)}
            disabled={disableUpdatePasswordButton}
            className="button-small button-primary"
            data-testid="password-update-button"
          />
        </div>
      </Section>
    </>
  );
};

const errorElement = (message: string) => (
  <p className="m0 is-error" data-testid="password-update-error">
    <small>{message}</small>
  </p>
);

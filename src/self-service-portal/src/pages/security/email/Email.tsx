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

import { IconFacilitiesEmail } from '@icons';
import { useState } from 'react';
import { Button, DataTable, PageHeader } from '../../../shared/ui';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { useMutation, useQuery } from '@apollo/client';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { StringMultiValuedValue } from '@/shared/data-access/API';
import { useTranslation } from 'react-i18next';
import { EmailVerificationDialog } from './EmailVerificationDialog';
import { Column } from '@/shared/ui/data-table/typings';

export const Email = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [emailAddressSearch, setEmailAddressSearch] = useState('');
  const [selectedEmail, setSelectedEmail] = useState('');
  const [dialogKey, setDialogKey] = useState(0);
  const [showEmailVerificationDialog, setShowEmailVerificationDialog] = useState(false);
  const { data: accountResponse, refetch: refetchAccount } = useQuery(
    USER_MANAGEMENT_API.QUERIES.getAccountByUserName,
    {
      variables: { userName: session?.idTokenClaims?.sub },
    }
  );
  const [updatePrimaryEmailAddress] = useMutation(USER_MANAGEMENT_API.MUTATIONS.updatePrimaryEmailAddress);
  const [deleteEmailAddress] = useMutation(USER_MANAGEMENT_API.MUTATIONS.deleteEmailAddress);

  const accountId = accountResponse?.accountByUserName?.id;
  if (!accountId) {
    return null;
  }

  const emailAddresses = (accountResponse?.accountByUserName?.emails ?? []) as StringMultiValuedValue[];

  const emailAddressFiltered = emailAddresses
    .filter(email => email !== null)
    .filter(email => email.value?.toLocaleLowerCase().includes(emailAddressSearch.toLocaleLowerCase()));

  const columns: Column<StringMultiValuedValue>[] = [
    { key: 'value', label: t('Email address') },
    { key: 'primary', label: t('Primary') },
    {
      key: 'type',
      label: t('Verified'),
      customRender: (email: StringMultiValuedValue) =>
        email.type === 'verified' && (
          <span className="pill pill-grey" data-testid="email-verified-pill">
            {t('Verified')}
          </span>
        ),
    },
  ];

  const handleSetPrimaryEmail = (selectedEmailRow: StringMultiValuedValue): void => {
    if (selectedEmailRow.value) {
      updatePrimaryEmailAddress({
        variables: {
          input: {
            accountId,
            newPrimaryEmailAddress: selectedEmailRow.value,
          },
        },
      }).then(() => refetchAccount());
    }
  };

  const handleDeleteEmail = (selectedEmailRow: StringMultiValuedValue): void => {
    if (selectedEmailRow.value) {
      deleteEmailAddress({
        variables: {
          input: {
            accountId,
            emailAddressToDelete: selectedEmailRow.value,
          },
        },
      }).then(() => refetchAccount());
    }
  };

  const initializeAndOpenDialog = (email: string) => {
    setSelectedEmail(email);
    setDialogKey(prev => prev + 1);
    setShowEmailVerificationDialog(true);
  };

  return (
    <>
      <PageHeader
        title={t('Email addresses')}
        description={t(
          'The Email Authenticator sends a hyperlink to the user which verifies it is the owner of the email address by clicking the link. Alternatively the Email Authenticator can be configured to send a One Time Password (OTP) code in the email that the user enters at the Authenticator screen'
        )}
        icon={<IconFacilitiesEmail width={128} height={128} data-testid="page-header-icon" />}
      />

      <DataTable
        title={t('Email addresses')}
        data-testid="email-data-table"
        columns={columns}
        data={emailAddressFiltered}
        createButtonLabel={t('Email')}
        customActions={(row: StringMultiValuedValue) => (
          <>
            {row?.type === 'unverified' && (
              <Button
                className="button button-tiny button-primary-outline"
                title={t('Verify')}
                onClick={() => initializeAndOpenDialog(row?.value ?? '')}
                data-testid="email-verify-button"
              />
            )}
            {!row?.primary && row?.type === 'verified' && (
              <Button
                className="button button-tiny button-primary-outline"
                title={t('Make primary')}
                onClick={() => handleSetPrimaryEmail(row)}
                data-testid="email-make-primary-button"
              />
            )}
          </>
        )}
        onRowDelete={handleDeleteEmail}
        onSearch={(query: string) => setEmailAddressSearch(query)}
        onCreateNew={() => initializeAndOpenDialog('')}
      />

      {showEmailVerificationDialog && (
        <EmailVerificationDialog
          key={dialogKey}
          accountId={accountId}
          emailForOtpVerification={selectedEmail}
          onEmailListChange={refetchAccount}
          onClose={() => {
            setShowEmailVerificationDialog(false);
            setSelectedEmail('');
          }}
        />
      )}
    </>
  );
};

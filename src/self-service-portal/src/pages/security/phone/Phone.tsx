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

import { IconFacilitiesSms } from '@icons';
import { useState } from 'react';
import { Button, DataTable, PageHeader } from '../../../shared/ui';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { useMutation, useQuery } from '@apollo/client';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { StringMultiValuedValue } from '@/shared/data-access/API';
import { useTranslation } from 'react-i18next';
import { Column } from '@/shared/ui/data-table/typings';
import { PhoneNumberVerificationDialog } from './PhoneNumberVerificationDialog';

export const Phone = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const [phoneNumberSearch, setPhoneNumberSearch] = useState('');
  const [selectedPhoneNumber, setSelectedPhoneNumber] = useState('');
  const [showPhoneNumberVerificationDialog, setShowPhoneNumberVerificationDialog] = useState(false);
  const { data: accountResponse, refetch: refetchAccount } = useQuery(
    USER_MANAGEMENT_API.QUERIES.getAccountByUserName,
    {
      variables: { userName: session?.idTokenClaims?.sub },
    }
  );
  const [updatePrimaryPhoneNumber] = useMutation(USER_MANAGEMENT_API.MUTATIONS.updatePrimaryPhoneNumber);
  const [deletePhoneNumber] = useMutation(USER_MANAGEMENT_API.MUTATIONS.deletePhoneNumber);

  const accountId = accountResponse?.accountByUserName?.id;
  if (!accountId) {
    return null;
  }

  const phoneNumbers = (accountResponse?.accountByUserName?.phoneNumbers ?? []) as StringMultiValuedValue[];

  const phoneNumberFiltered = phoneNumbers
    .filter(phoneNumber => phoneNumber !== null)
    .filter(phoneNumber => phoneNumber.value?.toLocaleLowerCase().includes(phoneNumberSearch.toLocaleLowerCase()));

  const columns: Column<StringMultiValuedValue>[] = [
    { key: 'value', label: t('Phone number') },
    { key: 'primary', label: t('Primary') },
    {
      key: 'type',
      label: t('Verified'),
      customRender: (phoneNumber: StringMultiValuedValue) =>
        phoneNumber.type !== 'unverified' && (
          <span className="pill pill-grey" data-testid="phone-number-verified-pill">
            {t('Verified')}
          </span>
        ),
    },
  ];

  const handleSetPrimaryPhoneNumber = (selectedPhoneNumberRow: StringMultiValuedValue): void => {
    const newPrimaryPhoneNumber = extractPhoneNumberInputIfAccountExists(selectedPhoneNumberRow);

    if (newPrimaryPhoneNumber) {
      updatePrimaryPhoneNumber({
        variables: {
          input: {
            accountId,
            newPrimaryPhoneNumber,
          },
        },
      }).then(() => refetchAccount());
    }
  };

  const handleDeletePhoneNumber = (selectedPhoneNumberRow: StringMultiValuedValue): void => {
    const phoneNumberToDelete = extractPhoneNumberInputIfAccountExists(selectedPhoneNumberRow);

    if (phoneNumberToDelete) {
      deletePhoneNumber({
        variables: {
          input: {
            accountId,
            phoneNumberToDelete,
          },
        },
      }).then(() => refetchAccount());
    }
  };

  const initializeAndOpenDialog = (phoneNumber: string) => {
    setSelectedPhoneNumber(phoneNumber);
    setShowPhoneNumberVerificationDialog(true);
  };

  const extractPhoneNumberInputIfAccountExists = (selectedPhoneNumberRow: StringMultiValuedValue): string | null => {
    if (!accountId || !selectedPhoneNumberRow?.value) return null;
    return selectedPhoneNumberRow.value;
  };

  return (
    <>
      <PageHeader
        title={t('Phone Numbers')}
        description={t(
          'The Phone Number Authenticator sends a hyperlink to the user which verifies it is the owner of the phone number by clicking the link. Alternatively the Phone Number Authenticator can be configured to send a One Time Password (OTP) code in the phone number that the user enters at the Authenticator screen'
        )}
        icon={<IconFacilitiesSms width={128} height={128} data-testid="page-header-icon" />}
      />

      <DataTable
        title={t('Phone numbers')}
        columns={columns}
        data={phoneNumberFiltered}
        createButtonLabel={t('Phone number')}
        customActions={(row: StringMultiValuedValue) => (
          <>
            {row?.type === 'unverified' && (
              <Button
                className="button button-tiny button-primary-outline"
                title={t('Verify')}
                onClick={() => initializeAndOpenDialog(row?.value ?? '')}
                data-testid="phone-number-verify-button"
              />
            )}
            {!row?.primary && row?.type === 'verified' && (
              <Button
                className="button button-tiny button-primary-outline"
                title={t('Make primary')}
                onClick={() => handleSetPrimaryPhoneNumber(row)}
                data-testid="phone-number-make-primary-button"
              />
            )}
          </>
        )}
        onRowDelete={handleDeletePhoneNumber}
        onSearch={setPhoneNumberSearch}
        onCreateNew={() => initializeAndOpenDialog('')}
      />

      {showPhoneNumberVerificationDialog && (
        <PhoneNumberVerificationDialog
          accountId={accountId}
          phoneNumberForOtpVerification={selectedPhoneNumber}
          onPhoneNumberListChange={refetchAccount}
          onClose={() => {
            setShowPhoneNumberVerificationDialog(false);
            setSelectedPhoneNumber('');
          }}
        />
      )}
    </>
  );
};

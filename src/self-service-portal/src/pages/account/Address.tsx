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

import { IconGeneralLocation } from '@icons';
import { useState } from 'react';
import { Button, DataTable, PageHeader } from '@/shared/ui';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { useMutation, useQuery } from '@apollo/client';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { AddressInput } from '@/shared/data-access/API';
import { Input } from '@/shared/ui/input/Input';
import { Dialog } from '@/shared/ui/dialog/Dialog';
import { Column } from '@/shared/ui/data-table/typings';
import { Address as AddressType } from '@/shared/data-access/API/graphql-codegen-typings-queries-and-mutations/graphql';
import { useTranslation } from 'react-i18next';

export const Address = () => {
  const { t } = useTranslation();
  const [addressSearch, setAddressSearch] = useState('');
  const initialFormData: AddressInput = {
    country: '',
    formatted: '',
    locality: '',
    postalCode: '',
    primary: false,
    region: '',
    streetAddress: '',
    type: '',
  };
  const [formData, setFormData] = useState<AddressInput>(() => initialFormData);
  const { session } = useAuth();
  const [updateAddress] = useMutation(USER_MANAGEMENT_API.MUTATIONS.updateAccountById);
  const { data } = useQuery(USER_MANAGEMENT_API.QUERIES.getAccountByUserName, {
    variables: { userName: session?.idTokenClaims?.sub },
  });
  const [showNewAddressDialog, setShowNewAddressDialog] = useState<boolean>(false);

  const columns: Column<Pick<AddressType, 'display' | 'primary'>>[] = [
    { key: 'display', label: t('Address') },
    { key: 'primary', label: t('Primary') },
  ];
  const addresses = data?.accountByUserName?.addresses || [];
  const addressesWithDisplay = addresses.map(address => ({
    ...address,
    display: address ? getFormattedAddress(address) : '',
  }));
  const addressesFiltered = addressesWithDisplay.filter(address =>
    address?.display?.toLowerCase().includes(addressSearch.toLowerCase())
  );
  const account = data?.accountByUserName;

  const handleAddressFormInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value, primary: addresses.length === 0 }));
  };

  const handleCreateAddress = async (event: React.FormEvent) => {
    event.preventDefault();
    await updateAddressData([...addresses.filter(address => address !== null), formData]);
    resetFormAndCloseDialog();
  };

  const handleSetPrimaryAddress = (selectedAddressRow: AddressInput): void => {
    const updatedAddresses = addresses
      .filter(address => address !== null)
      .map(address => {
        const formattedAddress = getFormattedAddress(address);
        return {
          ...address,
          primary: formattedAddress === selectedAddressRow?.display,
        };
      });
    updateAddressData(updatedAddresses);
  };

  const handleDeleteAddress = (selectedAddressRow: AddressInput) => {
    const updatedAddresses = addresses.filter(
      address => address !== null && getFormattedAddress(address) !== selectedAddressRow.display
    ) as AddressInput[];
    updateAddressData(updatedAddresses);
  };

  const updateAddressData = async (updatedAddresses: AddressInput[]) => {
    if (account) {
      await updateAddress({
        variables: {
          input: {
            accountId: account.id,
            fields: {
              addresses: updatedAddresses,
            },
          },
        },
      });
    }
  };

  const hasValidFormData = () =>
    Object.entries(formData).some(([key, value]) => key !== 'type' && typeof value === 'string' && value.trim() !== '');

  const resetFormAndCloseDialog = () => {
    setFormData(initialFormData);
    setShowNewAddressDialog(false);
  };

  return (
    <>
      <PageHeader
        title={t('Address')}
        description={t(
          'Easily manage your addresses. Add a new address, update details, or remove ones you no longer use.'
        )}
        icon={<IconGeneralLocation width={128} height={128} />}
      />

      <DataTable
        title={t('Addresses')}
        columns={columns}
        data={addressesFiltered?.map(address => ({
          display: address?.display,
          primary: address?.primary,
        }))}
        createButtonLabel={t('address')}
        customActions={(row: AddressInput) => (
          <>
            {!row.primary && (
              <Button
                className="button button-tiny button-primary-outline"
                title={t('Make primary')}
                onClick={() => handleSetPrimaryAddress(row)}
                data-testid="make-primary-button"
              />
            )}
          </>
        )}
        onRowDelete={addressToDelete => handleDeleteAddress(addressToDelete)}
        onSearch={(query: string) => setAddressSearch(query)}
        onCreateNew={() => setShowNewAddressDialog(true)}
        showSearch={!!addresses.length}
        data-testid="address-list"
      />

      {showNewAddressDialog && (
        <Dialog
          isOpen={true}
          title={t('Address')}
          showActionButton={true}
          showCancelButton={true}
          actionButtonText={t('Save')}
          cancelButtonText={t('Cancel')}
          isActionButtonDisabled={!hasValidFormData()}
          actionButtonCallback={handleCreateAddress}
          cancelButtonCallback={resetFormAndCloseDialog}
          closeCallback={resetFormAndCloseDialog}
          data-testid="new-address-dialog"
        >
          <form onSubmit={handleCreateAddress} data-testid="new-address-form">
            <h2>{t('Add New Address')}</h2>
            <p>{t('Enter the details for your new address.')}</p>
            <div className="flex flex-column flex-gap-2 mt3">
              {[
                { name: 'type', label: t('Type'), placeholder: t('For example "work" or "private"') },
                { name: 'streetAddress', label: t('Street'), placeholder: t('123 Main St') },
                { name: 'locality', label: t('Locality') },
                { name: 'region', label: t('Region'), placeholder: t('State/Province') },
                { name: 'country', label: t('Country') },
                { name: 'postalCode', label: t('Postal Code'), placeholder: '12345' },
              ].map(({ name, label, placeholder }, index) => (
                <Input
                  key={name}
                  name={name}
                  label={label}
                  placeholder={placeholder || label}
                  type="text"
                  value={String(formData[name as keyof AddressInput])}
                  onChange={handleAddressFormInputChange}
                  className="flex flex-center flex-gap-2"
                  labelClassName="w-8 l left-align"
                  inputClassName="flex-auto"
                  autoFocus={index === 2}
                  data-testid={`address-${name}-input`}
                />
              ))}
            </div>
          </form>
        </Dialog>
      )}
    </>
  );
};

const getFormattedAddress = (address: AddressInput): string => {
  return [address.streetAddress, address.locality, address.region, address.country, address.postalCode]
    .filter(Boolean)
    .join(', ')
    .trim();
};

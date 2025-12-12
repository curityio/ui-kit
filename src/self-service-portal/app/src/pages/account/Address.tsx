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

import { IconGeneralLocation } from '@curity/ui-kit-icons';
import { useMemo, useState } from 'react';
import { Button, Dialog, Input, PageHeader, toUiKitTranslation } from '@curity/ui-kit-component-library';
import { DataTable } from '@/shared/ui';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management';
import { useMutation, useQuery } from '@apollo/client';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { AddressInput } from '@/shared/data-access/API';
import { Column } from '@/shared/ui/data-table/typings';
import { Address as AddressType } from '@/shared/data-access/API/graphql-codegen-typings-queries-and-mutations/graphql';
import { useTranslation } from 'react-i18next';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import countriesData from '@/shared/data/countries.json';

export const Address = () => {
  const { t } = useTranslation();
  const uiKitT = toUiKitTranslation(t);
  const [addressSearch, setAddressSearch] = useState('');
  const initialFormData: AddressInput = {
    country: null,
    locality: null,
    postalCode: null,
    primary: false,
    region: null,
    streetAddress: null,
    type: null,
  };
  const [formData, setFormData] = useState<AddressInput>(() => initialFormData);
  const { session } = useAuth();
  const [updateAddress] = useMutation(USER_MANAGEMENT_API.MUTATIONS.updateAccountById);
  const { data } = useQuery(USER_MANAGEMENT_API.QUERIES.getAccountByUserName, {
    variables: { userName: session?.idTokenClaims?.sub },
  });
  const [showNewAddressDialog, setShowNewAddressDialog] = useState<boolean>(false);

  const countries = useMemo(() => countriesData, []);

  const columns: Column<Pick<AddressType, 'display' | 'primary'>>[] = [
    { key: 'display', label: t('account.address') },
    { key: 'primary', label: t('account.primary') },
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

  const handleAddressFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;

    setFormData(prev => ({
      ...prev,
      [name]: value.replace(/^\s+/, ''),
      primary: addresses.length === 0,
    }));
  };

  const handleCreateAddress = async (event: React.FormEvent) => {
    event.preventDefault();

    const cleanedFormData = Object.fromEntries(
      Object.entries(formData).map(([key, value]) => [key, typeof value === 'string' ? value.trimEnd() || null : value])
    ) as AddressInput;

    await updateAddressData([...addresses.filter(address => address !== null), cleanedFormData]);
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
        title={t('account.address')}
        description={t('account.address.description')}
        icon={<IconGeneralLocation width={128} height={128} />}
        data-testid="address-page-header"
        t={uiKitT}
      />

      <DataTable
        title={t('account.addresses')}
        columns={columns}
        data={addressesFiltered?.map(address => ({
          display: address?.display,
          primary: address?.primary,
        }))}
        createButtonLabel={t('account.address')}
        customActions={(row: AddressInput) => (
          <>
            {!row.primary && (
              <UiConfigIf
                resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS]}
                allowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
              >
                <Button
                  className="button button-tiny button-primary-outline"
                  title={t('account.make-primary')}
                  onClick={() => handleSetPrimaryAddress(row)}
                  data-testid="make-primary-button"
                />
              </UiConfigIf>
            )}
          </>
        )}
        onRowDelete={addressToDelete => handleDeleteAddress(addressToDelete)}
        onSearch={(query: string) => setAddressSearch(query)}
        onCreateNew={() => setShowNewAddressDialog(true)}
        showSearch={!!addresses.length}
        uiConfigResources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS]}
        data-testid="address-list"
      />

      {showNewAddressDialog && (
        <Dialog
          t={uiKitT}
          isOpen={true}
          title={t('account.address')}
          showActionButton={true}
          showCancelButton={true}
          actionButtonText={t('save')}
          cancelButtonText={t('cancel')}
          isActionButtonDisabled={!hasValidFormData()}
          actionButtonCallback={handleCreateAddress}
          cancelButtonCallback={resetFormAndCloseDialog}
          closeCallback={resetFormAndCloseDialog}
          data-testid="new-address-dialog"
        >
          <form onSubmit={handleCreateAddress} data-testid="new-address-form">
            <h2>{t('account.address.add-new-address')}</h2>
            <p>{t('account.address.enter-details')}</p>
            <div className="flex flex-column flex-gap-2 mt2">
              {[
                { name: 'type', label: t('type'), placeholder: t('account.address.type-placeholder') },
                {
                  name: 'streetAddress',
                  label: t('account.street'),
                  placeholder: t('account.address.street-placeholder'),
                },
                { name: 'locality', label: t('account.address.locality') },
                {
                  name: 'region',
                  label: t('account.address.region'),
                  placeholder: t('account.address.region.placeholder'),
                },
                { name: 'postalCode', label: t('account.address.postal-code'), placeholder: '12345' },
              ].map(({ name, label, placeholder }, index) => (
                <Input
                  key={name}
                  name={name}
                  label={label}
                  placeholder={placeholder || label}
                  type="text"
                  value={(formData[name as keyof AddressInput] as string) || ''}
                  onChange={handleAddressFormInputChange}
                  className="flex flex-column flex-gap-0"
                  labelClassName="flex-20 left-align"
                  inputClassName="flex-auto"
                  autoFocus={index === 0}
                  data-testid={`address-${name}-input`}
                  disablePasswordManager={false}
                />
              ))}
              <div className="left-align">
                <label htmlFor="country" className="label inline-flex flex-center flex-gap-1">
                  {t('account.address.country')}
                </label>
                <select
                  id="country"
                  name="country"
                  value={formData.country || ''}
                  onChange={handleAddressFormInputChange}
                  className="field flex-auto"
                  data-testid={`address-country-select`}
                  style={{ color: formData.country ? 'inherit' : 'var(--form-field-placeholder-color)' }}
                >
                  <option value="" disabled>
                    {t('account.address.country')}
                  </option>
                  {countries.map((country: { value: string; label: string }) => (
                    <option key={country.value} value={country.label}>
                      {country.label}
                    </option>
                  ))}
                </select>
              </div>
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

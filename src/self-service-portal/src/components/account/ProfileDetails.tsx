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

import { Section } from '@/shared/ui/Section.tsx';
import { Account, AccountUpdateFields } from '@/shared/data-access/API';
import { ChangeEvent, useEffect, useState } from 'react';
import { Input } from '@/shared/ui/input/Input';
import { EditableContent } from '@shared/ui/EditableContent/EditableContent.tsx';
import { useTranslation } from 'react-i18next';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';

interface ProfileProps {
  account: Account;
  onChange: (accountUpdate: AccountUpdateFields) => void;
}

export const ProfileDetails = ({ account, onChange }: ProfileProps) => {
  const { t } = useTranslation();
  const [givenName, setGivenName] = useState('');
  const [familyName, setFamilyName] = useState('');

  useEffect(() => {
    setGivenName(account?.name?.givenName || '');
    setFamilyName(account?.name?.familyName || '');
  }, [account]);

  const handleGivenName = (event: ChangeEvent<HTMLInputElement>) => {
    const givenNameUpdate = event.target.value;

    setGivenName(givenNameUpdate);
  };
  const handleFamilyName = (event: ChangeEvent<HTMLInputElement>) => {
    const familyNameUpdate = event.target.value;

    setFamilyName(familyNameUpdate);
  };

  return (
    <Section title={t('Profile details')}>
      <div className="flex">
        <div className="flex-60">
          <div className="flex flex-column flex-gap-2">
            <EditableContent
              onCancel={originalValue => setGivenName(originalValue)}
              onSave={givenNameUpdate => onChange({ name: { givenName: givenNameUpdate } })}
              uiConfigResources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]}
              uiConfigAllowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
            >
              <Input
                label={t('First Name')}
                id="givenName"
                value={givenName}
                onChange={handleGivenName}
                className="flex flex-gap-1"
                labelClassName="flex-30"
                inputClassName="flex-auto"
              />
            </EditableContent>
            <EditableContent
              onCancel={originalValue => setFamilyName(originalValue)}
              onSave={familyNameUpdate => onChange({ name: { familyName: familyNameUpdate } })}
              uiConfigResources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]}
              uiConfigAllowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
            >
              <Input
                label={t('Last Name')}
                id="familyName"
                value={familyName}
                onChange={handleFamilyName}
                className="flex flex-gap-1"
                labelClassName="flex-30"
                inputClassName="flex-auto"
              />
            </EditableContent>
          </div>
        </div>
      </div>
    </Section>
  );
};

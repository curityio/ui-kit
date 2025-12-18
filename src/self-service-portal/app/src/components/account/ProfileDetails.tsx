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

import { Section } from '@/shared/ui/section/Section';
import { AccountUpdateFields } from '@/shared/data-access/API';
import { ChangeEvent } from 'react';
import { Input } from '@curity/ui-kit-component-library';
import { EditableContent } from '@shared/ui/EditableContent/EditableContent';
import { useTranslation } from 'react-i18next';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';

interface ProfileProps {
  onChange: (accountUpdate: AccountUpdateFields) => void;
  givenName: string;
  familyName: string;
  onGivenNameChange: (value: string) => void;
  onFamilyNameChange: (value: string) => void;
}

export const ProfileDetails = ({
  onChange,
  givenName,
  familyName,
  onGivenNameChange,
  onFamilyNameChange,
}: ProfileProps) => {
  const { t } = useTranslation();

  const handleGivenName = (event: ChangeEvent<HTMLInputElement>) => {
    const givenNameUpdate = event.target.value;

    onGivenNameChange(givenNameUpdate);
  };
  const handleFamilyName = (event: ChangeEvent<HTMLInputElement>) => {
    const familyNameUpdate = event.target.value;

    onFamilyNameChange(familyNameUpdate);
  };

  return (
    <Section title={t('account.profile-details')} data-testid="profile-details-section">
      <div className="sm-flex">
        <div className="w100">
          <div className="flex flex-column flex-gap-3">
            <EditableContent
              onCancel={onGivenNameChange}
              onSave={givenNameUpdate => onChange({ name: { givenName: givenNameUpdate } })}
              uiConfigResources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]}
              uiConfigAllowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
              data-testid="profile-details-given-name"
            >
              <Input
                label={t('account.first-name')}
                id="givenName"
                value={givenName}
                onChange={handleGivenName}
                className="flex flex-gap-1 flex-center"
                labelClassName="flex-auto"
                inputClassName="flex-auto"
                data-testid="given-name-input"
              />
            </EditableContent>
            <EditableContent
              onCancel={onFamilyNameChange}
              onSave={familyNameUpdate => onChange({ name: { familyName: familyNameUpdate } })}
              uiConfigResources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME]}
              uiConfigAllowedOperations={[UI_CONFIG_OPERATIONS.UPDATE]}
              data-testid="profile-details-family-name"
            >
              <Input
                label={t('account.last-name')}
                id="familyName"
                value={familyName}
                onChange={handleFamilyName}
                className="flex flex-gap-1 flex-center"
                labelClassName="flex-auto"
                inputClassName="flex-auto"
                data-testid="family-name-input"
              />
            </EditableContent>
          </div>
        </div>
      </div>
    </Section>
  );
};

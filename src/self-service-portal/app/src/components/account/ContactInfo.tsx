/*
 * Copyright (C) 2032 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { IconFacilitiesEmail, IconFacilitiesSms, IconGeneralLocation } from '@curity/ui-kit-icons';
import { Section } from '@/shared/ui/section/Section';
import { Account } from '@/shared/data-access/API';
import { List } from '@/shared/ui';
import { useTranslation } from 'react-i18next';
import { EmailVerificationDialog } from '@/pages/security/email/EmailVerificationDialog';
import { GRAPHQL_API } from '@/shared/data-access/API/GRAPHQL_API';
import { useQuery } from '@apollo/client';
import { useAuth } from '@/auth/data-access/AuthProvider';
import { Spinner } from '@curity/ui-kit-component-library';
import { useState } from 'react';
import { PhoneNumberVerificationDialog } from '@/pages/security/phone/PhoneNumberVerificationDialog';
import { getPrimaryOrFirstDevice } from '@/shared/utils/get-primary-or-first-device';
import { ContactItem } from './ContactItem';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';

interface ContactInfoProps {
  account: Account;
}

export const ContactInfo = ({ account }: ContactInfoProps) => {
  const { session } = useAuth();
  const { t } = useTranslation();
  const [showEmailDialog, setShowEmailDialog] = useState<boolean>(false);
  const [showPhoneDialog, setShowPhoneDialog] = useState<boolean>(false);
  const [isReplacingPhoneNumber, setIsReplacingPhoneNumber] = useState<boolean>(false);

  const {
    data: getAccountByUserNameData,
    refetch: refetchAccount,
    loading,
  } = useQuery(GRAPHQL_API.USER_MANAGEMENT.QUERIES.getAccountByUserName, {
    variables: { userName: session?.idTokenClaims?.sub },
  });

  const accountData = getAccountByUserNameData?.accountByUserName;
  const accountId = accountData?.id;
  const emailToShow = getPrimaryOrFirstDevice(account?.emails?.filter(email => !!email));
  const phoneToShow = getPrimaryOrFirstDevice(account?.phoneNumbers?.filter(phone => !!phone));

  if (!accountId || loading) {
    return <Spinner width={48} height={48} mode="fullscreen" />;
  }

  const handlePhoneChange = () => {
    if (phoneToShow) {
      setIsReplacingPhoneNumber(true);
    }

    setShowPhoneDialog(true);
  };

  const handleEmailDialogClose = () => {
    refetchAccount();
    setShowEmailDialog(false);
  };

  const handlePhoneDialogClose = () => {
    if (phoneToShow) {
      setIsReplacingPhoneNumber(false);
    }

    refetchAccount();
    setShowPhoneDialog(false);
  };

  return (
    <>
      <Section title={t('account.contact-information')} data-testid="contact-info-section">
        <List className="sm-flex flex-column flex-gap-3">
          <UiConfigIf
            resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL]}
            allowedOperations={[UI_CONFIG_OPERATIONS.READ]}
          >
            <ContactItem
              title={t('account.email')}
              icon={<IconFacilitiesEmail width={32} height={32} />}
              collection="emails"
              account={account}
              onVerify={() => setShowEmailDialog(true)}
            />
          </UiConfigIf>
          <UiConfigIf
            resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER]}
            allowedOperations={[UI_CONFIG_OPERATIONS.READ]}
          >
            <ContactItem
              title={t('account.phone.title')}
              icon={<IconFacilitiesSms width={32} height={32} />}
              collection="phoneNumbers"
              account={account}
              onChange={handlePhoneChange}
              onVerify={() => setShowPhoneDialog(true)}
            />
          </UiConfigIf>
          <UiConfigIf
            resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS]}
            allowedOperations={[UI_CONFIG_OPERATIONS.READ]}
          >
            <ContactItem
              title={t('account.address')}
              icon={<IconGeneralLocation width={32} height={32} />}
              collection="addresses"
              account={account}
              link="/account/address"
            />
          </UiConfigIf>
        </List>
      </Section>
      {showEmailDialog && (
        <EmailVerificationDialog
          accountId={accountId}
          emailForOtpVerification={emailToShow?.value ?? null}
          setEmailAsPrimaryAfterVerification={!emailToShow?.primary}
          onClose={handleEmailDialogClose}
        />
      )}
      {showPhoneDialog && (
        <PhoneNumberVerificationDialog
          accountId={accountId}
          phoneNumberForOtpVerification={isReplacingPhoneNumber ? null : phoneToShow?.value}
          setPhoneNumberAsPrimaryAfterVerification={isReplacingPhoneNumber ? true : !phoneToShow?.primary}
          onClose={handlePhoneDialogClose}
        />
      )}
    </>
  );
};

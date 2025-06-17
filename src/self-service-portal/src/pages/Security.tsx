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

import {
  IconAuthenticatorPasskeys,
  IconAuthenticatorTotp,
  IconFacilitiesEmail,
  IconFacilitiesSms,
  IconGeneralArrowForward,
  IconGeneralLock,
} from '@icons';

import { ROUTE_PATHS } from '@/routes';
import { List, ListCell, ListRow, PageHeader } from '@shared/ui';
import { Section } from '@shared/ui/Section';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@auth/data-access/AuthProvider';
import { useQuery } from '@apollo/client';
import { GRAPHQL_API } from '@shared/data-access/API/GRAPHQL_API';
import { Account, DEVICE_TYPES } from '@shared/data-access/API';

interface AppData {
  name: string;
  message: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  link: string;
  testId: string;
}

export const Security = () => {
  const { t } = useTranslation();
  const { session } = useAuth();
  const { data: accountResponse } = useQuery(GRAPHQL_API.USER_MANAGEMENT.QUERIES.getAccountByUserName, {
    variables: { userName: session?.idTokenClaims?.sub },
  });
  const account = accountResponse?.accountByUserName;

  const getPhoneNumberMessage = (account: Account | null | undefined) => {
    if (!account?.phoneNumbers?.length) {
      return t('No phone number added yet');
    }

    if (account.phoneNumbers.length === 1) {
      return account.phoneNumbers.find(phone => phone?.primary)?.value || t('No phone number added yet');
    } else {
      return t('{{numberOfPhones}} phone numbers', { numberOfPhones: account.phoneNumbers.length });
    }
  };

  const getEmailMessage = (account: Account | null | undefined) => {
    if (!account?.emails?.length) {
      return t('No email address added yet');
    }

    if (account.emails.length === 1) {
      return account.emails.find(phone => phone?.primary)?.value || t('No email address added yet');
    } else {
      return t('{{numberOfEmails}} email addresses', { numberOfEmails: account.emails.length });
    }
  };

  const getDevicesMessage = (account: Account | null | undefined, deviceType: DEVICE_TYPES) => {
    const devices = account?.devices?.filter(device => device?.category?.name === deviceType);

    if (!devices?.length) {
      return t('No devices added yet');
    }

    if (devices.length === 1) {
      return t('1 device');
    } else {
      return t('{{numberOfDevices}} devices', { numberOfDevices: devices.length });
    }
  };

  const getMFAMessage = (account: Account | null | undefined) =>
    account?.mfaOptIn && !account?.mfaOptIn.preferences ? t('On') : t('Currently not used for your account');

  const data: AppData[] = [
    {
      name: t('Email addresses'),
      message: getEmailMessage(account),
      icon: IconFacilitiesEmail,
      link: ROUTE_PATHS.SECURITY_EMAIL,
      testId: 'email-address-value',
    },
    {
      name: t('Phone number'),
      message: getPhoneNumberMessage(account),
      icon: IconFacilitiesSms,
      link: ROUTE_PATHS.SECURITY_PHONE,
      testId: 'phone-number-value',
    },
    {
      name: t('Multi-factor Authentication'),
      message: getMFAMessage(account),
      icon: IconGeneralLock,
      link: ROUTE_PATHS.SECURITY_MFA,
      testId: 'mfa-value',
    },
    {
      name: t('OTP Authenticators'),
      message: getDevicesMessage(account, DEVICE_TYPES.TOTP),
      icon: IconAuthenticatorTotp,
      link: ROUTE_PATHS.SECURITY_OTP,
      testId: 'totp-value',
    },
    {
      name: t('Passkeys'),
      message: getDevicesMessage(account, DEVICE_TYPES.PASSKEYS),
      icon: IconAuthenticatorPasskeys,
      link: ROUTE_PATHS.SECURITY_PASSKEYS,
      testId: 'passkeys-value',
    },
  ];

  return (
    <>
      <PageHeader
        title={t('Security')}
        description={t('Settings and recommendations to protect the account')}
        icon={<IconGeneralLock width={128} height={128} />}
      />

      <Section title={t('How to log in to your Account')}>
        <p>{t('Make sure these details are up-to-date so you can always access your Account')}</p>
        <List className="block">
          {data.map((item, index) => (
            <Link to={'/' + item?.link} key={index}>
              <ListRow key={index} className="flex flex-center justify-between flex-gap-2 w100 button-transparent p2">
                <ListCell className="flex-40 flex flex-center flex-gap-2">
                  <item.icon width={48} height={48} />
                  {item?.name}
                </ListCell>
                {item?.message && (
                  <ListCell className="flex-20">
                    <span data-testid={item?.testId}>{item?.message}</span>
                  </ListCell>
                )}
                <ListCell>
                  <span className="button button-small button-transparent">
                    <IconGeneralArrowForward width={24} height={24} />
                  </span>
                </ListCell>
              </ListRow>
            </Link>
          ))}
        </List>
      </Section>
    </>
  );
};

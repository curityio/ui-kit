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
} from '@curity/ui-kit-icons';

import { ROUTE_PATHS } from '@/routes';
import { List, ListCell, ListRow } from '@shared/ui';
import { Section } from '@/shared/ui/section/Section';
import { Link } from 'react-router';
import { useTranslation } from 'react-i18next';
import { useAuth } from '@auth/data-access/AuthProvider';
import { useQuery } from '@apollo/client';
import { GRAPHQL_API } from '@shared/data-access/API/GRAPHQL_API';
import { Account, DEVICE_TYPES } from '@shared/data-access/API';
import { getPrimaryOrFirstDevice } from '@/shared/utils/get-primary-or-first-device';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { getMFAState } from '@/pages/security/MFA/utils/getMFAState';
import { MFA_STATES } from '@/pages/security/MFA/MFA';
import { PageHeader, toUiKitTranslation } from '@curity/ui-kit-component-library';

interface SecuritySectionConfig {
  name: string;
  message: string;
  icon: React.ComponentType<React.SVGProps<SVGSVGElement>>;
  link: string;
  testId: string;
  resources: UI_CONFIG_RESOURCES[];
}

export const Security = () => {
  const { t } = useTranslation();
  const uiKitT = toUiKitTranslation(t);
  const { session } = useAuth();
  const { data: accountResponse } = useQuery(GRAPHQL_API.USER_MANAGEMENT.QUERIES.getAccountByUserName, {
    variables: { userName: session?.idTokenClaims?.sub },
  });
  const account = accountResponse?.accountByUserName;

  const getPhoneNumberMessage = (account: Account | null | undefined) => {
    if (!account?.phoneNumbers?.length) {
      return t('security.no-phone-added');
    } else {
      return getPrimaryOrFirstDevice(account?.phoneNumbers)?.value || '';
    }
  };

  const getEmailMessage = (account: Account | null | undefined) => {
    if (!account?.emails?.length) {
      return t('security.no-email-added');
    } else {
      return getPrimaryOrFirstDevice(account?.emails)?.value || '';
    }
  };

  const getDevicesMessage = (account: Account | null | undefined, deviceType: DEVICE_TYPES) => {
    const devices = account?.devices?.filter(device => device?.category?.name === deviceType);
    const deviceTitle =
      deviceType === DEVICE_TYPES.TOTP ? t('security.otp-authenticators.authenticators') : t('security.passkeys.keys');

    if (!devices?.length) {
      return t('security.otp-authenticators.none-added', { deviceTitle });
    } else if (devices?.length === 1) {
      return t('security.otp-authenticators.single-added', { deviceTitle: deviceTitle });
    } else {
      return t('security.otp-authenticators.multiple-added', {
        numberOfDevices: devices?.length,
        deviceTitle,
      });
    }
  };

  const currentMFAState = getMFAState(account?.mfaOptIn);
  const MFAMessage =
    currentMFAState === MFA_STATES.OPTED_IN
      ? t('security.multi-factor-authentication.on')
      : t('security.multi-factor-authentication.inactive');

  const sections: SecuritySectionConfig[] = [
    {
      name: t('account.email.title'),
      message: getEmailMessage(account),
      icon: IconFacilitiesEmail,
      link: ROUTE_PATHS.ACCOUNT,
      testId: 'email-address',
      resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL],
    },
    {
      name: t('account.phone.title'),
      message: getPhoneNumberMessage(account),
      icon: IconFacilitiesSms,
      link: ROUTE_PATHS.ACCOUNT,
      testId: 'phone-number',
      resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER],
    },
    {
      name: t('security.otp-authenticators.title'),
      message: getDevicesMessage(account, DEVICE_TYPES.TOTP),
      icon: IconAuthenticatorTotp,
      link: `${ROUTE_PATHS.SECURITY}/${ROUTE_PATHS.SECURITY_OTP}`,
      testId: 'totp',
      resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP],
    },
    {
      name: t('security.passkeys.title'),
      message: getDevicesMessage(account, DEVICE_TYPES.PASSKEYS),
      icon: IconAuthenticatorPasskeys,
      link: `${ROUTE_PATHS.SECURITY}/${ROUTE_PATHS.SECURITY_PASSKEYS}`,
      testId: 'passkeys',
      resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSKEY],
    },
    {
      name: t('security.multi-factor-authentication.title'),
      message: MFAMessage,
      icon: IconGeneralLock,
      link: `${ROUTE_PATHS.SECURITY}/${ROUTE_PATHS.SECURITY_MFA}`,
      testId: 'mfa',
      resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA],
    },
  ];

  return (
    <>
      <PageHeader
        t={uiKitT}
        title={t('security.title')}
        description={t('security.description')}
        icon={<IconGeneralLock width={128} height={128} />}
        data-testid="security-page-header"
      />

      <Section title={t('security.how-to-log-in-to-your-account')}>
        <p>{t('security.access-reminder')}</p>
        <List className="block">
          {sections.map((section, index) => (
            <UiConfigIf key={index} resources={section.resources} allowedOperations={[UI_CONFIG_OPERATIONS.READ]}>
              <Link to={`/${section?.link}`} key={index}>
                <ListRow
                  key={index}
                  className="sm-flex flex-center justify-between flex-gap-2 w100 button-transparent p2"
                  data-testid={`security-${section?.testId}-list-row`}
                >
                  <ListCell className="flex-40 flex flex-center flex-gap-2">
                    <section.icon width={48} height={48} />
                    {section?.name}
                  </ListCell>
                  {section?.message && (
                    <ListCell className="flex-20">
                      <span data-testid={`${section?.testId}-value`}>{section?.message}</span>
                    </ListCell>
                  )}
                  <ListCell>
                    <span className="button button-small button-transparent">
                      <IconGeneralArrowForward width={24} height={24} />
                    </span>
                  </ListCell>
                </ListRow>
              </Link>
            </UiConfigIf>
          ))}
        </List>
      </Section>
    </>
  );
};

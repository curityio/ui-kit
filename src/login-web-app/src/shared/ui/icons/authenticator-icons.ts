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

import type { ComponentType, SVGProps } from 'react';
import {
  IconAuthenticatorApple,
  IconAuthenticatorAws,
  IconAuthenticatorBankid,
  IconAuthenticatorBitbucket,
  IconAuthenticatorBox,
  IconAuthenticatorCriipto,
  IconAuthenticatorDefault,
  IconAuthenticatorDropbox,
  IconAuthenticatorDuo,
  IconAuthenticatorEmail,
  IconAuthenticatorEncap,
  IconAuthenticatorFacebook,
  IconAuthenticatorFreja,
  IconAuthenticatorGithub,
  IconAuthenticatorGoogle,
  IconAuthenticatorGroup,
  IconAuthenticatorHtml,
  IconAuthenticatorInstagram,
  IconAuthenticatorLinkedin,
  IconAuthenticatorNetid,
  IconAuthenticatorOidc,
  IconAuthenticatorOpenidWallet,
  IconAuthenticatorPasskeys,
  IconAuthenticatorPing,
  IconAuthenticatorSalesforce,
  IconAuthenticatorSaml,
  IconAuthenticatorSaml2,
  IconAuthenticatorSignicat,
  IconAuthenticatorSiths,
  IconAuthenticatorSlack,
  IconAuthenticatorSms,
  IconAuthenticatorStackexchange,
  IconAuthenticatorTotp,
  IconAuthenticatorUser,
  IconAuthenticatorWebauthn,
  IconAuthenticatorWindows,
  IconAuthenticatorX,
} from '@curity/ui-kit-icons';

export type AuthenticatorIcon = ComponentType<SVGProps<SVGSVGElement>>;

export const AUTHENTICATOR_ICONS: Record<string, AuthenticatorIcon> = {
  aws: IconAuthenticatorAws,
  bankid: IconAuthenticatorBankid,
  bitbucket: IconAuthenticatorBitbucket,
  box: IconAuthenticatorBox,
  criipto: IconAuthenticatorCriipto,
  dropbox: IconAuthenticatorDropbox,
  duo: IconAuthenticatorDuo,
  email: IconAuthenticatorEmail,
  encap: IconAuthenticatorEncap,
  facebook: IconAuthenticatorFacebook,
  'freja-eid': IconAuthenticatorFreja,
  github: IconAuthenticatorGithub,
  google: IconAuthenticatorGoogle,
  group: IconAuthenticatorGroup,
  'html-form': IconAuthenticatorHtml,
  instagram: IconAuthenticatorInstagram,
  linkedin: IconAuthenticatorLinkedin,
  'netidaccess-os': IconAuthenticatorNetid,
  oidc: IconAuthenticatorOidc,
  'openid-wallet': IconAuthenticatorOpenidWallet,
  passkeys: IconAuthenticatorPasskeys,
  pingfederate: IconAuthenticatorPing,
  salesforce: IconAuthenticatorSalesforce,
  saml: IconAuthenticatorSaml,
  saml2: IconAuthenticatorSaml2,
  signicat: IconAuthenticatorSignicat,
  'sign-in-with-apple': IconAuthenticatorApple,
  siths: IconAuthenticatorSiths,
  slack: IconAuthenticatorSlack,
  sms: IconAuthenticatorSms,
  stackexchange: IconAuthenticatorStackexchange,
  totp: IconAuthenticatorTotp,
  twitter: IconAuthenticatorX,
  username: IconAuthenticatorUser,
  webauthn: IconAuthenticatorWebauthn,
  windows: IconAuthenticatorWindows,
  'windows-live': IconAuthenticatorWindows,
  x: IconAuthenticatorX,
};

export function resolveAuthenticatorIcon(authenticatorType: string | undefined): AuthenticatorIcon {
  return AUTHENTICATOR_ICONS[authenticatorType ?? ''] ?? IconAuthenticatorDefault;
}

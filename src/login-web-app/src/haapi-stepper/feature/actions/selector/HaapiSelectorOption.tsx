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

import { HaapiStepperForm } from '../form/HaapiStepperForm';
import { useHaapiStepperForm } from '../form/HaapiStepperFormContext';
import type {
  HaapiStepperClientOperationAction,
  HaapiStepperFormAction,
  HaapiStepperNextStep,
} from '../../stepper/haapi-stepper.types';

interface HaapiSelectorOptionProps {
  action: HaapiStepperFormAction;
  onSubmit: HaapiStepperNextStep<HaapiStepperFormAction | HaapiStepperClientOperationAction>;
}

type AuthenticatorIcon = ComponentType<SVGProps<SVGSVGElement>>;

const AUTHENTICATOR_ICONS: Record<string, AuthenticatorIcon> = {
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

/**
 * Renders a single selector option (an authenticator choice) as a social-style button
 * with an authenticator-specific color and icon. Delegates submission to the wrapped
 * `HaapiStepperForm` so existing form behaviour (validation, payload building) is preserved.
 */
export function HaapiSelectorOption({ action, onSubmit }: HaapiSelectorOptionProps) {
  const authenticatorType = action.properties?.authenticatorType;

  return (
    <HaapiStepperForm action={action} onSubmit={onSubmit}>
      {() => <HaapiSelectorOptionButton authenticatorType={authenticatorType} />}
    </HaapiStepperForm>
  );
}

interface HaapiSelectorOptionButtonProps {
  authenticatorType: string | undefined;
}

function HaapiSelectorOptionButton({ authenticatorType }: HaapiSelectorOptionButtonProps) {
  const { action } = useHaapiStepperForm();
  const label = action.model.actionTitle ?? action.title ?? authenticatorType ?? '';
  const Icon = AUTHENTICATOR_ICONS[authenticatorType ?? ''] ?? IconAuthenticatorDefault;
  const authenticatorClass = authenticatorType ? `button-${authenticatorType}` : 'button-social-single-color';

  return (
    <button
      data-testid="haapi-form-submit-button"
      className={`haapi-stepper-selector-option ${authenticatorClass}`}
      type="submit"
    >
      <span className="icon" aria-hidden="true">
        <Icon />
      </span>
      {label}
    </button>
  );
}

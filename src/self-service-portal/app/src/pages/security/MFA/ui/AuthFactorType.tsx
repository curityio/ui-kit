import { MFA_REGISTRABLE_FACTORS } from '../MFA.tsx';
import { RegistrableFactor, RegisteredFactor } from '../../../../shared/data-access/API';
import { IconFacilitiesEmail, IconFacilitiesSms, IconAuthenticatorTotp, IconAuthenticatorPasskeys } from '@icons';
import { t } from 'i18next';

export interface AuthFactorTypeProps {
  registrableFactor: RegistrableFactor | RegisteredFactor;
}

export const AuthFactorType = ({ registrableFactor }: AuthFactorTypeProps) => {
  let icon;
  const ICON_SIZE = 48;

  switch (registrableFactor.type) {
    case MFA_REGISTRABLE_FACTORS.EMAIL:
      icon = <IconFacilitiesEmail width={ICON_SIZE} height={ICON_SIZE} />;
      break;
    case MFA_REGISTRABLE_FACTORS.PHONE:
      icon = <IconFacilitiesSms width={ICON_SIZE} height={ICON_SIZE} />;
      break;
    case MFA_REGISTRABLE_FACTORS.TOTP:
      icon = <IconAuthenticatorTotp width={ICON_SIZE} height={ICON_SIZE} />;
      break;
    case MFA_REGISTRABLE_FACTORS.PASSKEYS:
      icon = <IconAuthenticatorPasskeys width={ICON_SIZE} height={ICON_SIZE} />;
      break;
    default:
      icon = null;
  }

  return (
    <div className="inline-flex flex-center flex-gap-1">
      {icon}
      <span>{t(registrableFactor.type!)}</span>
    </div>
  );
};

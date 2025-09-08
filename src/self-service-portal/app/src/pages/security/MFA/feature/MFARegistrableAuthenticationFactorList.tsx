import { MFA_REGISTRABLE_FACTORS } from '../MFA.tsx';
import { AuthFactorType } from '../ui/AuthFactorType.tsx';
import {
  Account,
  DEVICE_TYPES,
  RegisteredFactor,
  RegistrableFactor,
  StringMultiValuedValue,
} from '../../../../shared/data-access/API';
import { DataTable, Button } from '../../../../shared/ui';
import { Column } from '../../../../shared/ui/data-table/typings.ts';
import { Toggle } from '../../../../shared/ui/toggle/Toggle.tsx';
import { getPrimaryOrFirstDevice } from '../../../../shared/utils/get-primary-or-first-device.ts';
import { useUiConfigAreOperationsAllowed } from '../../../../ui-config/hooks/useUiConfigAreOperationsAllowed.ts';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '../../../../ui-config/typings.ts';
import { t } from 'i18next';

export interface MFARegistrableAuthenticationFactorListProps {
  account: Account;
  factors: RegistrableFactor[];
  isDisplayMode?: boolean;
  registeredFactors?: (RegistrableFactor | RegisteredFactor)[];
  factorToggled?: (factor: RegistrableFactor, isRegistered: boolean) => void;
  factorDeviceAdded?: (factor: RegistrableFactor) => void;
  factorDeviceVerified?: (factor: RegistrableFactor, device: StringMultiValuedValue) => void;
}

export const MFARegistrableAuthenticationFactorList = ({
  account,
  factors,
  isDisplayMode = false,
  registeredFactors = [],
  factorToggled,
  factorDeviceAdded,
  factorDeviceVerified,
}: MFARegistrableAuthenticationFactorListProps) => {
  const registrableAuthFactorsTableColumns: Column<RegistrableFactor>[] = [
    { key: 'type', label: t('type'), customRender: factor => <AuthFactorType registrableFactor={factor} /> },
    {
      key: 'hasDevices',
      label: t('alias'),
      customRender: registrableFactor => devicesColumnCustomRender(registrableFactor, account),
    },
  ];
  const customActions = (factor: RegistrableFactor) =>
    getRegistrableAuthFactorTableCustomActions(
      isDisplayMode,
      account,
      factor,
      registeredFactors,
      factorToggled,
      factorDeviceAdded,
      factorDeviceVerified
    );

  const factorPermissionsMap: Partial<Record<UI_CONFIG_RESOURCES, { read: boolean; mutate: boolean }>> = {
    [UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL]: {
      read: useUiConfigAreOperationsAllowed([UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL], [UI_CONFIG_OPERATIONS.READ]),
      mutate: useUiConfigAreOperationsAllowed(
        [UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL],
        [UI_CONFIG_OPERATIONS.UPDATE]
      ),
    },
    [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER]: {
      read: useUiConfigAreOperationsAllowed(
        [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER],
        [UI_CONFIG_OPERATIONS.READ]
      ),
      mutate: useUiConfigAreOperationsAllowed(
        [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER],
        [UI_CONFIG_OPERATIONS.UPDATE]
      ),
    },
    [UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP]: {
      read: useUiConfigAreOperationsAllowed([UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP], [UI_CONFIG_OPERATIONS.READ]),
      mutate: useUiConfigAreOperationsAllowed(
        [UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP],
        [UI_CONFIG_OPERATIONS.CREATE]
      ),
    },
    [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSKEY]: {
      read: useUiConfigAreOperationsAllowed([UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSKEY], [UI_CONFIG_OPERATIONS.READ]),
      mutate: useUiConfigAreOperationsAllowed(
        [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSKEY],
        [UI_CONFIG_OPERATIONS.CREATE]
      ),
    },
  };
  const filteredRegistrableFactors = factors?.filter(factor => {
    let factorResource;
    switch (factor.type) {
      case MFA_REGISTRABLE_FACTORS.EMAIL:
        factorResource = UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL;
        break;
      case MFA_REGISTRABLE_FACTORS.PHONE:
        factorResource = UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER;
        break;
      case MFA_REGISTRABLE_FACTORS.TOTP:
        factorResource = UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP;
        break;
      case MFA_REGISTRABLE_FACTORS.PASSKEYS:
        factorResource = UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSKEY;
        break;
      default:
        return false;
    }
    const permissions = factorPermissionsMap[factorResource];
    const showRegistrableFactor =
      (permissions?.read && permissions?.mutate) || (permissions?.read && factor?.hasDevices);
    return showRegistrableFactor;
  });
  return (
    <DataTable
      columns={registrableAuthFactorsTableColumns}
      title={t('security.multi-factor-authentication.available-methods')}
      data={filteredRegistrableFactors}
      customActions={isDisplayMode ? undefined : customActions}
      showCreate={false}
      showSearch={false}
      showDelete={false}
      data-testid="mfa-registrable-auth-factors-list"
    />
  );
};

const getRegistrableAuthFactorTableCustomActions = (
  isDisplayMode: boolean,
  account: Account,
  authFactor: RegistrableFactor,
  registeredFactors?: (RegistrableFactor | RegisteredFactor)[],
  factorToggled?: (factor: RegistrableFactor, isRegistered: boolean) => void,
  factorDeviceAdded?: (factor: RegistrableFactor) => void,
  factorDeviceVerified?: (factor: RegistrableFactor, device: StringMultiValuedValue) => void
) => {
  /*
   * Registrable methods specifications:
   * - An Auth Factor can be registered/enabled only if `hasDevices:true`
   * - "device" can be of type MFA_REGISTRABLE_FACTORS (sms, email, totp, or passkey)
   * - `hasDevices` is true when there is a device that can immediately be used to authenticate:
   *    - For MFA_REGISTRABLE_FACTORS.EMAIL and MFA_REGISTRABLE_FACTORS.PHONE this is when the user has a verified "device" (email or phone) that is `primary:true`.
   *    - For MFA_REGISTRABLE_FACTORS.TOTP and MFA_REGISTRABLE_FACTORS.PASSKEYS this is when there is at least one device.
   * - For MFA_REGISTRABLE_FACTORS.EMAIL and MFA_REGISTRABLE_FACTORS.PHONE:
   *   - The frontend only displays one "device" (email or phone) at most, even when multiple are available.
   *     The frontend picks the `primary:true` "device" or the first one in the collection if no `primary:true`.
   *   - If no `primary:true` "device" is available, the frontend will set the "device" as `primary:true` after
   *     the user verifies it. After that, `hasDevices:true` will be set, and the user can enable the Auth Factor.
   * - MFA_REGISTRABLE_FACTORS.EMAIL is guaranteed to have at least one "device" (email), so we only handle "device"
   *   verification
   * - MFA_REGISTRABLE_FACTORS.PHONE could be missing, so we need to handle the "device" creation besides verification
   */
  if (isDisplayMode || !registeredFactors || !factorToggled || !factorDeviceAdded) {
    return null;
  } else if (authFactor.hasDevices) {
    const factorIsRegistered = registeredFactors.some(registeredFactor => registeredFactor.acr === authFactor.acr);

    return (
      <Toggle
        label="security.multi-factor-authentication.enable"
        checked={factorIsRegistered}
        onChange={() => factorToggled(authFactor, !factorIsRegistered)}
        data-testid="mfa-factor-toggle"
      />
    );
  } else {
    if (authFactor.type === MFA_REGISTRABLE_FACTORS.EMAIL) {
      const deviceToVerify = getPrimaryOrFirstDevice(account?.emails as StringMultiValuedValue[])!;

      return (
        <Button
          onClick={() => factorDeviceVerified?.(authFactor, deviceToVerify)}
          title={t('account.verify') + ' ' + t(authFactor.type!.toLowerCase())}
          className="button button-tiny button-primary-outline"
          data-testid={`mfa-verify-auth-factor-device-${authFactor.type}`}
        />
      );
    } else if (authFactor.type === MFA_REGISTRABLE_FACTORS.PHONE) {
      const deviceToVerify = getPrimaryOrFirstDevice(account?.phoneNumbers as StringMultiValuedValue[]);

      if (deviceToVerify) {
        return (
          <Button
            onClick={() => factorDeviceVerified?.(authFactor, deviceToVerify)}
            title={t('account.verify') + ' ' + t(authFactor.type!.toLowerCase())}
            className="button button-tiny button-primary-outline"
            data-testid={`mfa-verify-auth-factor-device-${authFactor.type}`}
          />
        );
      }
    }

    return (
      <Button
        onClick={() => factorDeviceAdded(authFactor)}
        title={t('security.multi-factor-authentication.add-new') + ' ' + t(authFactor.type!.toLowerCase())}
        className="button button-tiny button-primary-outline"
        data-testid={`mfa-create-auth-factor-device-${authFactor.type}`}
      />
    );
  }
};

const devicesColumnCustomRender = (registrableFactor: RegistrableFactor, account: Account) => {
  switch (registrableFactor.type) {
    case MFA_REGISTRABLE_FACTORS.EMAIL:
      return getPrimaryOrFirstDevice(account?.emails as StringMultiValuedValue[])?.value || null;

    case MFA_REGISTRABLE_FACTORS.PHONE:
      return getPrimaryOrFirstDevice(account?.phoneNumbers as StringMultiValuedValue[])?.value || null;

    case MFA_REGISTRABLE_FACTORS.TOTP:
      return (
        account?.devices
          ?.filter(device => device?.category?.name === DEVICE_TYPES.TOTP)
          .map(device => device?.alias || device?.deviceId)
          .join(', ') || null
      );

    case MFA_REGISTRABLE_FACTORS.PASSKEYS:
      return (
        account?.devices
          ?.filter(device => device?.category?.name === DEVICE_TYPES.PASSKEYS)
          .map(device => device!.alias || device?.deviceId)
          .join(', ') || null
      );

    default:
      break;
  }
};

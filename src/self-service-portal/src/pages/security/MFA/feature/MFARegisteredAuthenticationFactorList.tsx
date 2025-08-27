import { RegisteredFactor } from '@/shared/data-access/API';
import { DataTable } from '@/shared/ui';
import { ConfirmButton } from '@/shared/ui/ConfirmButton';
import { Column } from '@/shared/ui/data-table/typings';
import { getFormattedDate } from '@/shared/utils/date';
import { t } from 'i18next';
import { AuthFactorType } from '../ui/AuthFactorType';
import { UI_CONFIG_RESOURCES, UI_CONFIG_OPERATIONS } from '@/ui-config/typings';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';

export interface MFARegisteredAuthenticationFactorListProps {
  factors: RegisteredFactor[];
  factorDisabled?: (factor: RegisteredFactor) => void;
}

export const MFARegisteredAuthenticationFactorList = ({
  factors,
  factorDisabled,
}: MFARegisteredAuthenticationFactorListProps) => {
  const registeredAuthFactorsTableColumns: Column<RegisteredFactor>[] = [
    { key: 'type', label: t('type'), customRender: factor => <AuthFactorType registrableFactor={factor} /> },
    {
      key: 'changedAt',
      label: t('security.multi-factor-authentication.enabled'),
      customRender: (factor: RegisteredFactor) => getFormattedDate(factor.changedAt as number),
    },
  ];

  const customActions = (authFactor: RegisteredFactor) =>
    factorDisabled ? (
      <UiConfigIf
        resources={[UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA]}
        allowedOperations={[UI_CONFIG_OPERATIONS.MFA_REMOVE_FACTOR]}
      >
        <ConfirmButton
          className="button-tiny button-primary-outline"
          dialogConfig={{ title: t('security.multi-factor-authentication.disable-method') }}
          dialogMessage={t('security.multi-factor-authentication.confirm-disable', {
            factorName: authFactor.type?.toUpperCase(),
          })}
          aria-label={t('security.multi-factor-authentication.disable')}
          title={t('security.multi-factor-authentication.disable')}
          onConfirm={() => factorDisabled(authFactor)}
          disabled={factors?.length < 2}
        />
      </UiConfigIf>
    ) : null;

  return (
    <DataTable
      columns={registeredAuthFactorsTableColumns}
      title={t('security.multi-factor-authentication.active-methods')}
      data={factors}
      customActions={customActions}
      showCreate={false}
      showSearch={false}
      showDelete={false}
      data-testid="mfa-registered-auth-factors-list"
    />
  );
};

import {
  IconActionAutoLinkAccount,
  IconActionMultiFactor,
  IconAuthenticatorPasskeys,
  IconAuthenticatorTotp,
  IconCapabilityResourceOwnerPasswordCredentials,
  IconFacilitiesEmail,
  IconFacilitiesSms,
  IconGeneralLocation,
  IconGeneralLock,
  IconToken,
  IconUserDataSources,
  IconUserManagement,
} from '@icons';
import { ROUTE_PATHS } from '@/routes';
import { List, ListCell, ListRow } from '@/shared/ui';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';

export const Sidebar = () => {
  const { t } = useTranslation();
  const sidebarItems = [
    {
      path: ROUTE_PATHS.ACCOUNT,
      name: 'Account Details',
      icon: IconUserManagement,
      resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_NAME, UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS],
      children: [
        {
          path: ROUTE_PATHS.ACCOUNT_ADDRESS,
          name: 'Address',
          icon: IconGeneralLocation,
          resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_ADDRESS],
        },
      ],
    },
    {
      path: ROUTE_PATHS.LINKED_ACCOUNTS,
      name: 'Linked Accounts',
      icon: IconActionAutoLinkAccount,
      resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_LINKED_ACCOUNTS],
    },
    {
      path: ROUTE_PATHS.SECURITY,
      name: 'Security',
      icon: IconGeneralLock,
      resources: [
        UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP,
        UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL,
        UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER,
      ],
      children: [
        {
          path: ROUTE_PATHS.SECURITY_OTP,
          name: 'OTP Authenticators',
          icon: IconAuthenticatorTotp,
          resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_TOTP],
        },
        {
          path: ROUTE_PATHS.SECURITY_EMAIL,
          name: 'Email',
          icon: IconFacilitiesEmail,
          resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_EMAIL],
        },
        {
          path: ROUTE_PATHS.SECURITY_PHONE,
          name: 'Phone',
          icon: IconFacilitiesSms,
          resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PHONE_NUMBER],
        },
        {
          path: ROUTE_PATHS.SECURITY_PASSWORD,
          name: 'Password',
          icon: IconCapabilityResourceOwnerPasswordCredentials,
          resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSWORD],
        },
        {
          path: ROUTE_PATHS.SECURITY_MFA,
          name: 'Multi-factor Authentication',
          icon: IconActionMultiFactor,
          resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_OPTIN_MFA],
        },
        {
          path: ROUTE_PATHS.SECURITY_PASSKEYS,
          name: 'Passkeys',
          icon: IconAuthenticatorPasskeys,
          resources: [UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSKEYS],
        },
      ],
    },
    {
      path: ROUTE_PATHS.APPS_AND_SERVICES,
      name: 'Apps and Services',
      icon: IconUserDataSources,
      resources: [UI_CONFIG_RESOURCES.GRANTED_AUTHORIZATIONS_GRANTED_AUTHORIZATIONS],
    },
    {
      path: ROUTE_PATHS.SESSIONS,
      name: 'Sessions',
      icon: IconToken,
      resources: [UI_CONFIG_RESOURCES.SESSIONS_SESSIONS],
    },
  ];

  return (
    <nav role="navigation" aria-label={`${t('Sidebar')}`} id="sidebar-navigation">
      <List className="block" role="group">
        {sidebarItems.map((item, index) => (
          <UiConfigIf
            key={index}
            resources={item.resources}
            allowedOperations={[UI_CONFIG_OPERATIONS.READ]}
            displayWithPartialResourcePermissions={true}
          >
            <ListRow key={index} className="block" role="treeitem" aria-expanded="true">
              <ListCell className="block">
                <NavLink to={item.path} className="button button-small button-transparent w100 justify-reset">
                  <item.icon width={36} height={36} />
                  {t(item.name)}
                </NavLink>
                {item?.children && (
                  <List className="ml3 m0">
                    {item?.children?.map((childItem, childIndex) => (
                      <UiConfigIf
                        key={childIndex}
                        resources={childItem.resources}
                        allowedOperations={[UI_CONFIG_OPERATIONS.READ]}
                      >
                        <ListRow key={childIndex} role="treeitem">
                          <ListCell className="block w100">
                            <NavLink
                              to={childItem.path}
                              className="button button-small button-transparent w100 justify-reset"
                            >
                              <childItem.icon width={24} height={24} />
                              {t(childItem.name)}
                            </NavLink>
                          </ListCell>
                        </ListRow>
                      </UiConfigIf>
                    ))}
                  </List>
                )}
              </ListCell>
            </ListRow>
          </UiConfigIf>
        ))}
      </List>
    </nav>
  );
};

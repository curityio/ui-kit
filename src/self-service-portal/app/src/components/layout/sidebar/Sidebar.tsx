import { AUTHENTICATED_ROUTES, USSPRouteConfig } from '@/routes';
import { List, ListCell, ListRow, toUiKitTranslation } from '@curity/ui-kit-component-library';
import { NavLink } from 'react-router';
import { useTranslation } from 'react-i18next';
import { UI_CONFIG_OPERATIONS, UI_CONFIG_RESOURCES } from '@/ui-config/typings';
import { UiConfigIf } from '@/ui-config/feature/UiConfigIf';

export const Sidebar = () => {
  const { t } = useTranslation();
  const uiKitT = toUiKitTranslation(t);

  const sidebarItems = AUTHENTICATED_ROUTES.filter(route => !!route.sidebarTitle);

  return (
    <nav role="navigation" aria-label={`${t('sidebar')}`} id="sidebar-navigation">
      <List className="block" role="group">
        {sidebarItems.map((item, index) => (
          <UiConfigIf
            key={index}
            resources={item.resources}
            allowedOperations={[UI_CONFIG_OPERATIONS.READ]}
            displayWithPartialResourcePermissions={true}
          >
            <ListRow t={uiKitT} key={index} className="block" role="treeitem" aria-expanded="true">
              <ListCell className="block">
                <NavLink
                  to={item.path!}
                  className="button button-small button-transparent w100 justify-reset"
                  data-testid={getSidebarItemTestId('sidebar', item.sidebarTitle! || item.title!)}
                >
                  {item.icon && (
                    <item.icon
                      data-testid={getSidebarItemTestId('sidebar-icon', item.sidebarTitle! || item.title!)}
                      width={36}
                      height={36}
                    />
                  )}
                  {t(item.sidebarTitle || item.title!)}
                </NavLink>
                {item?.children && (
                  <List className="ml3 m0">
                    {(item.children as USSPRouteConfig[])
                      ?.filter(route => !!route.sidebarTitle)
                      ?.map((childItem, childIndex) => (
                        <UiConfigIf
                          key={childIndex}
                          resources={childItem.resources}
                          allowedOperations={
                            childItem.resources?.includes(UI_CONFIG_RESOURCES.USER_MANAGEMENT_PASSWORD)
                              ? [UI_CONFIG_OPERATIONS.UPDATE]
                              : [UI_CONFIG_OPERATIONS.READ]
                          }
                        >
                          <ListRow t={uiKitT} key={childIndex} role="treeitem">
                            <ListCell className="block w100">
                              <NavLink
                                to={`${item.path!}/${childItem.path!}`}
                                className="button button-small button-transparent w100 justify-reset"
                                data-testid={getSidebarItemTestId(
                                  'sidebar-child',
                                  childItem.sidebarTitle! || childItem.title!
                                )}
                              >
                                {childItem.icon && (
                                  <childItem.icon
                                    data-testid={getSidebarItemTestId(
                                      'sidebar-child-icon',
                                      childItem.sidebarTitle! || childItem.title!
                                    )}
                                    width={24}
                                    height={24}
                                  />
                                )}
                                {t(childItem.sidebarTitle || childItem.title!)}
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

const getSidebarItemTestId = (prefix: string, name: string): string =>
  `${prefix}-${name.replace(/\s+/g, '-').toLowerCase()}`;

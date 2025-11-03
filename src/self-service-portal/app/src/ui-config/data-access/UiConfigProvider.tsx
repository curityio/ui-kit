import { BOOTSTRAP_UI_CONFIG, BootstrapUiConfig } from '@/BOOTSTRAP_UI_CONFIG';
import { setupI18nTranslations } from '@/i18n/setup-translations';
import { Spinner } from '@/shared/ui/Spinner';
import {
  GrantedAuthorizationsResources,
  UI_CONFIG_OPERATIONS,
  UI_CONFIG_RESOURCE_GROUPS,
  UiConfig,
  UiConfigMetadataResponse,
  UserManagementResources,
} from '@/ui-config/typings';
import { createContext, useContext, useEffect, useState } from 'react';
import { getLocaleFromURI } from '@/util.ts';

export interface UiConfigProviderProps {
  children: React.ReactNode;
}

const UiConfigContext = createContext<UiConfig | undefined>(undefined);

export const UiConfigProvider = ({ children }: UiConfigProviderProps) => {
  const [uiConfig, setUiConfig] = useState<UiConfig | undefined>(undefined);
  const [, setError] = useState();

  const rethrowBootstrapErrorSoItIsCatchedByTheRouteErrorBoundary = () => {
    setError(() => {
      throw new Error('Error bootstrapping the User Self Service Portal, please contact support');
    });
  };

  useEffect(() => {
    resolveConfig(BOOTSTRAP_UI_CONFIG)
      .then(config => {
        setupI18nTranslations(config.messages);
        setUiConfig(config);
      })
      .catch(rethrowBootstrapErrorSoItIsCatchedByTheRouteErrorBoundary);
  }, []);

  return uiConfig ? (
    <UiConfigContext.Provider value={uiConfig}>{children}</UiConfigContext.Provider>
  ) : (
    <Spinner width={48} height={48} mode="fullscreen" />
  );
};

export const useUiConfig = () => {
  const uiConfig = useContext(UiConfigContext);

  if (uiConfig === undefined) {
    throw new Error('useUiConfig must be used by descendants of UiConfigProvider');
  }

  return uiConfig;
};

async function resolveConfig(bootstrapConfig: BootstrapUiConfig): Promise<UiConfig> {
  const localeParam = getLocaleFromURI();
  let requestURI = `${bootstrapConfig.PATHS.BACKEND}${bootstrapConfig.PATHS.METADATA}`;

  if (localeParam) {
    requestURI += `?${localeParam}`;
  }

  const uiConfigMetadataResponse = await fetch(requestURI, {
    credentials: 'include',
  });

  if (uiConfigMetadataResponse.status !== 200) {
    throw new Error('Failed to fetch metadata');
  }

  const uiConfigMetadataResponseJSON: UiConfigMetadataResponse = await uiConfigMetadataResponse.json();
  const { accessControlPolicy, messages, endpoints } = uiConfigMetadataResponseJSON;
  const invalidMetadataResponse = !accessControlPolicy || !messages || !endpoints;
  const invalidEndpoints = !endpoints.oauthAgent || (!endpoints.userManagement && !endpoints.grantedAuthorization);

  if (invalidMetadataResponse || invalidEndpoints) {
    throw new Error('Invalid metadata response');
  }

  const normalizedUiConfig = normalizeUiConfig({
    ...bootstrapConfig,
    accessControlPolicy,
    PATHS: {
      ...bootstrapConfig.PATHS,
      OAUTH_AGENT: endpoints.oauthAgent,
      USER_MANAGEMENT_API: endpoints.userManagement,
      GRANTED_AUTHORIZATION_API: endpoints.grantedAuthorization,
    },
    messages,
  });

  return normalizedUiConfig;
}

const normalizeUiConfig = (uiConfig: UiConfig): UiConfig => {
  const userManagementResourcesAllowedOperations =
    uiConfig.accessControlPolicy.resourceGroups?.[UI_CONFIG_RESOURCE_GROUPS.USER_MANAGEMENT]?.resources;
  const userManagementResourcesNormalizedAllowedOperations = uiConfig?.PATHS?.USER_MANAGEMENT_API
    ? userManagementResourcesAllowedOperations
    : resetAllowedResourcesOperations(userManagementResourcesAllowedOperations);
  const grantedAuthorizationsResourcesAllowedOperations =
    uiConfig.accessControlPolicy.resourceGroups?.[UI_CONFIG_RESOURCE_GROUPS.GRANTED_AUTHORIZATIONS]?.resources;
  const grantedAuthorizationsResourcesNormalizedAllowedOperations = uiConfig?.PATHS?.GRANTED_AUTHORIZATION_API
    ? grantedAuthorizationsResourcesAllowedOperations
    : resetAllowedResourcesOperations(grantedAuthorizationsResourcesAllowedOperations);
  const addressResourceAllowedOperations =
    userManagementResourcesNormalizedAllowedOperations?.address?.operations || [];
  const addressResourceNormalizedAllowedOperations: (
    | UI_CONFIG_OPERATIONS.CREATE
    | UI_CONFIG_OPERATIONS.READ
    | UI_CONFIG_OPERATIONS.UPDATE
    | UI_CONFIG_OPERATIONS.DELETE
  )[] = addressResourceAllowedOperations?.includes(UI_CONFIG_OPERATIONS.UPDATE)
    ? [...addressResourceAllowedOperations, UI_CONFIG_OPERATIONS.CREATE, UI_CONFIG_OPERATIONS.DELETE]
    : addressResourceAllowedOperations;

  return {
    ...uiConfig,
    accessControlPolicy: {
      resourceGroups: {
        [UI_CONFIG_RESOURCE_GROUPS.USER_MANAGEMENT]: userManagementResourcesNormalizedAllowedOperations
          ? {
              resources: {
                ...userManagementResourcesNormalizedAllowedOperations,
                address: {
                  operations: addressResourceNormalizedAllowedOperations,
                },
              },
            }
          : undefined,
        [UI_CONFIG_RESOURCE_GROUPS.GRANTED_AUTHORIZATIONS]: grantedAuthorizationsResourcesNormalizedAllowedOperations
          ? {
              resources: grantedAuthorizationsResourcesNormalizedAllowedOperations,
            }
          : undefined,
      },
    },
  };
};

const resetAllowedResourcesOperations = <T extends UserManagementResources | GrantedAuthorizationsResources>(
  resourceOperations: T = {} as T
): T => {
  return Object.keys(resourceOperations).reduce((resources, resourceName) => {
    return {
      ...resources,
      [resourceName]: {
        operations: [],
      },
    };
  }, {} as T);
};

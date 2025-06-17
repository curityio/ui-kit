import { BOOTSTRAP_UI_CONFIG, BootstrapUiConfig } from '@/BOOTSTRAP_UI_CONFIG';
import { setupI18nTranslations } from '@/i18n/setup-translations';
import { Spinner } from '@/shared/ui/Spinner';
import { UiConfig } from '@/ui-config/typings';
import { UI_CONFIG } from '@/ui-config/ui-config';
import { createContext, useContext, useEffect, useState } from 'react';

export interface UiConfigProviderProps {
  children: React.ReactNode;
}

const UiConfigContext = createContext<UiConfig | undefined>(undefined);

export const UiConfigProvider = ({ children }: UiConfigProviderProps) => {
  const [uiConfig, setUiConfig] = useState<UiConfig | undefined>(undefined);

  useEffect(() => {
    // TODO: resolve more parts of the config from the backend's metadata endpoint (WIP)
    // TODO: Remove associated hardcoded resources (UI_CONFIG and TRANSLATION_RESOURCES) when fetching UiConfig from the backend is available
    // TODO handle errors in this promise
    resolveConfig(BOOTSTRAP_UI_CONFIG).then(config => {
      setupI18nTranslations(config.translations);
      setUiConfig(config);
    });
  }, []);

  return uiConfig ? <UiConfigContext.Provider value={uiConfig}>{children}</UiConfigContext.Provider> : <Spinner />;
};

export const useUiConfig = () => {
  const uiConfig = useContext(UiConfigContext);

  if (uiConfig === undefined) {
    throw new Error('useUiConfig must be used by descendants of UiConfigProvider');
  }

  return uiConfig;
};

async function resolveConfig(bootstrapConfig: BootstrapUiConfig): Promise<UiConfig> {
  const metadataResponse = await fetch(`${bootstrapConfig.PATHS.BACKEND}${bootstrapConfig.PATHS.METADATA}`, {
    credentials: 'omit',
  });
  if (metadataResponse.status !== 200) {
    throw new Error('Failed to fetch metadata');
  }
  const metadata = await metadataResponse.json();

  return {
    ...UI_CONFIG,
    ...bootstrapConfig,
    PATHS: {
      ...bootstrapConfig.PATHS,
      OAUTH_AGENT: metadata.endpoints.oauthAgent,
      USER_MANAGEMENT_API: metadata.endpoints.userManagement,
      GRANTED_AUTHORIZATION_API: metadata.endpoints.grantedAuthorization,
    },
  };
}

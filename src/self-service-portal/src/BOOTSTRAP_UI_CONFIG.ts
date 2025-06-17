export interface BootstrapUiConfig {
  PATHS: {
    BACKEND: string;
    APP_BASE: string;
    METADATA: string;
  };
  css: unknown;
  messages: unknown;
  templates: unknown;
}

export const BOOTSTRAP_UI_CONFIG: BootstrapUiConfig =
  window.__CONFIG__ !== undefined
    ? {
        PATHS: {
          APP_BASE: window.__CONFIG__.appBasePath,
          BACKEND: window.__CONFIG__.bffBaseUrl,
          METADATA: window.__CONFIG__.metadataPath,
        },
        css: {},
        messages: {},
        templates: {},
      }
    : {
        PATHS: {
          APP_BASE: import.meta.env.VITE_APP_APP_BASE_PATH,
          BACKEND: import.meta.env.VITE_APP_BFF_BASE_URL,
          METADATA: import.meta.env.VITE_APP_METADATA_PATH,
        },
        css: {},
        messages: {},
        templates: {},
      };

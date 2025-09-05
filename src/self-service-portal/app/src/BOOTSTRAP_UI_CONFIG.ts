export interface BootstrapUiConfig {
  PATHS: {
    BACKEND: string;
    APP_BASE: string;
    METADATA: string;
  };
  theme: {
    logoImage?: string;
    loginImage?: string;
  };
}

export const BOOTSTRAP_UI_CONFIG: BootstrapUiConfig =
  window.__CONFIG__ !== undefined
    ? {
        PATHS: {
          APP_BASE: window.__CONFIG__.appBasePath,
          BACKEND: window.__CONFIG__.bffBaseUrl,
          METADATA: window.__CONFIG__.metadataPath,
        },
        theme: {
          logoImage: window.__CONFIG__.theme.logoImage,
          loginImage: window.__CONFIG__.theme.loginImage,
        },
      }
    : {
        PATHS: {
          APP_BASE: import.meta.env.VITE_APP_APP_BASE_PATH,
          BACKEND: import.meta.env.VITE_APP_BFF_BASE_URL,
          METADATA: import.meta.env.VITE_APP_METADATA_PATH,
        },
        theme: {
          logoImage: import.meta.env.VITE_THEME_LOGO,
          loginImage: import.meta.env.VITE_THEME_INTRO_IMG,
        },
      };

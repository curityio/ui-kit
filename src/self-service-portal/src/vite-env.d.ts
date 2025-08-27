/// <reference types="vite/client" />
/// <reference types="vite/client" />

interface ImportMetaEnv {
  readonly VITE_APP_APP_BASE_PATH: string;
  readonly VITE_APP_BFF_BASE_URL: string;
  readonly VITE_APP_METADATA_PATH: string;
  readonly VITE_THEME_LOGO: string;
  readonly VITE_THEME_LOGIN_IMAGE: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}

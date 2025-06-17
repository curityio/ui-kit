import { TRANSLATION_RESOURCES } from '@/i18n/translations';
import { UiConfig, UI_CONFIG_OPERATIONS } from '@/ui-config/typings';

// TODO: Remove when final UI Config is available (it will probably be fetched from the backend's metadata endpoint (WIP))
export const UI_CONFIG: UiConfig = {
  resourceGroups: {
    userManagement: {
      resources: {
        name: {
          operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.UPDATE],
        },
        address: {
          operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.UPDATE],
        },
        phoneNumber: {
          operations: [
            UI_CONFIG_OPERATIONS.READ,
            UI_CONFIG_OPERATIONS.CREATE,
            UI_CONFIG_OPERATIONS.DELETE,
            UI_CONFIG_OPERATIONS.SET_PRIMARY,
          ],
        },
        email: {
          operations: [
            UI_CONFIG_OPERATIONS.READ,
            UI_CONFIG_OPERATIONS.CREATE,
            UI_CONFIG_OPERATIONS.DELETE,
            UI_CONFIG_OPERATIONS.SET_PRIMARY,
          ],
        },
        totp: {
          operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.CREATE, UI_CONFIG_OPERATIONS.DELETE],
        },
        linkedAccounts: {
          operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.DELETE],
        },
        grantedAuthorizations: {
          operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.DELETE],
        },
        'optin-mfa': {
          operations: [
            UI_CONFIG_OPERATIONS.READ,
            UI_CONFIG_OPERATIONS.READ_RECOVERY_INFO,
            UI_CONFIG_OPERATIONS.DELETE_FACTOR,
            UI_CONFIG_OPERATIONS.RESET,
          ],
        },
        password: {
          operations: [UI_CONFIG_OPERATIONS.UPDATE],
        },
        passkeys: {
          operations: [UI_CONFIG_OPERATIONS.UPDATE],
        },
      },
    },
    grantedAuthorizations: {
      resources: {
        grantedAuthorizations: {
          operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.DELETE],
        },
      },
    },
  },
  translations: TRANSLATION_RESOURCES,
  PATHS: {
    BACKEND: '',
    APP_BASE: '',
    OAUTH_AGENT: '',
    METADATA: '',
    USER_MANAGEMENT_API: '',
    GRANTED_AUTHORIZATION_API: '',
  },
  css: {},
  messages: {},
  templates: {},
};

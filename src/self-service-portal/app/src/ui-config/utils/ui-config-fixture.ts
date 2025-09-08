import { UiConfig, UI_CONFIG_OPERATIONS } from '../typings.ts';

export const UI_CONFIG: UiConfig = {
  accessControlPolicy: {
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
            operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.UPDATE],
          },
          email: {
            operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.UPDATE],
          },
          linkedAccounts: {
            operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.DELETE],
          },
          password: {
            operations: [UI_CONFIG_OPERATIONS.UPDATE],
          },
          totp: {
            operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.CREATE, UI_CONFIG_OPERATIONS.DELETE],
          },
          passkey: {
            operations: [UI_CONFIG_OPERATIONS.READ, UI_CONFIG_OPERATIONS.CREATE, UI_CONFIG_OPERATIONS.DELETE],
          },
          'optin-mfa': {
            operations: [
              UI_CONFIG_OPERATIONS.READ,
              UI_CONFIG_OPERATIONS.MFA_SETUP,
              UI_CONFIG_OPERATIONS.MFA_ADD_FACTOR,
              UI_CONFIG_OPERATIONS.MFA_REMOVE_FACTOR,
              UI_CONFIG_OPERATIONS.MFA_RESET_RECOVERY_CODES,
              UI_CONFIG_OPERATIONS.MFA_RESET,
            ],
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
  },
  messages: {},
  PATHS: {
    BACKEND: '',
    APP_BASE: '',
    OAUTH_AGENT: '',
    METADATA: '',
    USER_MANAGEMENT_API: '',
    GRANTED_AUTHORIZATION_API: '',
  },
  theme: {
    logoImage: '',
    loginImage: '',
  },
};

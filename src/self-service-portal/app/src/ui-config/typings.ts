import { BootstrapUiConfig } from '../BOOTSTRAP_UI_CONFIG.ts';

export enum UI_CONFIG_OPERATIONS {
  READ = 'read',
  UPDATE = 'update',
  CREATE = 'create',
  DELETE = 'delete',
  MFA_SETUP = 'setup',
  MFA_ADD_FACTOR = 'add-factor',
  MFA_REMOVE_FACTOR = 'remove-factor',
  MFA_RESET_RECOVERY_CODES = 'reset-recovery-codes',
  MFA_RESET = 'reset',
}

export enum UI_CONFIG_RESOURCE_GROUPS {
  USER_MANAGEMENT = 'userManagement',
  GRANTED_AUTHORIZATIONS = 'grantedAuthorizations',
}

export enum UI_CONFIG_RESOURCES {
  USER_MANAGEMENT_NAME = 'userManagement.name',
  USER_MANAGEMENT_ADDRESS = 'userManagement.address',
  USER_MANAGEMENT_PHONE_NUMBER = 'userManagement.phoneNumber',
  USER_MANAGEMENT_EMAIL = 'userManagement.email',
  USER_MANAGEMENT_LINKED_ACCOUNTS = 'userManagement.linkedAccounts',
  USER_MANAGEMENT_PASSWORD = 'userManagement.password',
  USER_MANAGEMENT_PASSKEY = 'userManagement.passkey',
  USER_MANAGEMENT_TOTP = 'userManagement.totp',
  USER_MANAGEMENT_OPTIN_MFA = 'userManagement.optin-mfa',
  GRANTED_AUTHORIZATIONS_GRANTED_AUTHORIZATIONS = 'grantedAuthorizations.grantedAuthorizations',
}

export interface ResourceOperations<T extends UI_CONFIG_OPERATIONS[]> {
  operations: T;
}

export interface UserManagementResources {
  name?: ResourceOperations<(UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.UPDATE)[]>;
  address?: ResourceOperations<
    (
      | UI_CONFIG_OPERATIONS.CREATE
      | UI_CONFIG_OPERATIONS.READ
      | UI_CONFIG_OPERATIONS.UPDATE
      | UI_CONFIG_OPERATIONS.DELETE
    )[]
  >;
  email?: ResourceOperations<(UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.UPDATE)[]>;
  phoneNumber?: ResourceOperations<(UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.UPDATE)[]>;
  totp?: ResourceOperations<(UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.CREATE | UI_CONFIG_OPERATIONS.DELETE)[]>;
  passkey?: ResourceOperations<
    (UI_CONFIG_OPERATIONS.CREATE | UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.DELETE)[]
  >;
  linkedAccounts?: ResourceOperations<(UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.DELETE)[]>;
  password?: ResourceOperations<UI_CONFIG_OPERATIONS.UPDATE[]>;
  'optin-mfa'?: ResourceOperations<
    (
      | UI_CONFIG_OPERATIONS.READ
      | UI_CONFIG_OPERATIONS.MFA_SETUP
      | UI_CONFIG_OPERATIONS.MFA_ADD_FACTOR
      | UI_CONFIG_OPERATIONS.MFA_REMOVE_FACTOR
      | UI_CONFIG_OPERATIONS.MFA_RESET_RECOVERY_CODES
      | UI_CONFIG_OPERATIONS.MFA_RESET
    )[]
  >;
}

export interface GrantedAuthorizationsResources {
  grantedAuthorizations?: ResourceOperations<(UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.DELETE)[]>;
}

export interface UiConfig extends BootstrapUiConfig {
  PATHS: BootstrapUiConfig['PATHS'] & {
    OAUTH_AGENT: string;
    USER_MANAGEMENT_API?: string;
    GRANTED_AUTHORIZATION_API?: string;
  };
  accessControlPolicy: UiConfigAccessControlPolicy;
  messages: {
    [key: string]: string;
  };
}

export interface UiConfigAccessControlPolicy {
  resourceGroups: {
    [UI_CONFIG_RESOURCE_GROUPS.USER_MANAGEMENT]?: {
      resources: UserManagementResources;
    };
    [UI_CONFIG_RESOURCE_GROUPS.GRANTED_AUTHORIZATIONS]?: {
      resources: GrantedAuthorizationsResources;
    };
  };
}

export interface UiConfigIfRouteProps {
  children: React.ReactNode;
  allowedOperations?: UI_CONFIG_OPERATIONS[];
  allowAccessWithPartialResourcePermissions?: boolean;
}

export interface UiConfigIfProps {
  resources?: UI_CONFIG_RESOURCES[];
  allowedOperations?: UI_CONFIG_OPERATIONS[];
  displayWithPartialResourcePermissions?: boolean;
  children: React.ReactNode;
}

export interface UiConfigMetadataResponse {
  accessControlPolicy: UiConfigAccessControlPolicy;
  endpoints: {
    oauthAgent: string;
    userManagement?: string;
    grantedAuthorization?: string;
  };
  messages: {
    [key: string]: string;
  };
}

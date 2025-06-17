import { BootstrapUiConfig } from '../BOOTSTRAP_UI_CONFIG';

export enum UI_CONFIG_OPERATIONS {
  READ = 'read',
  UPDATE = 'update',
  CREATE = 'create',
  DELETE = 'delete',
  SET_PRIMARY = 'set-primary',
  READ_RECOVERY_INFO = 'read-recovery-info',
  DELETE_FACTOR = 'delete-factor',
  RESET = 'reset',
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
  USER_MANAGEMENT_TOTP = 'userManagement.totp',
  USER_MANAGEMENT_LINKED_ACCOUNTS = 'userManagement.linkedAccounts',
  USER_MANAGEMENT_GRANTED_AUTHORIZATIONS = 'userManagement.grantedAuthorizations',
  USER_MANAGEMENT_OPTIN_MFA = 'userManagement.optin-mfa',
  USER_MANAGEMENT_PASSWORD = 'userManagement.password',
  USER_MANAGEMENT_PASSKEYS = 'userManagement.passkeys',
  GRANTED_AUTHORIZATIONS_GRANTED_AUTHORIZATIONS = 'grantedAuthorizations.grantedAuthorizations',
  // TODO: Verify this resource/API's naming
  SESSIONS_SESSIONS = 'sessions.sessions',
}

export interface ResourceOperations<T extends UI_CONFIG_OPERATIONS[]> {
  operations: T | null | undefined | [];
}

export interface UserManagementResources {
  name: ResourceOperations<(UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.UPDATE)[]>;
  address: ResourceOperations<(UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.UPDATE)[]>;
  phoneNumber: ResourceOperations<
    (
      | UI_CONFIG_OPERATIONS.READ
      | UI_CONFIG_OPERATIONS.CREATE
      | UI_CONFIG_OPERATIONS.DELETE
      | UI_CONFIG_OPERATIONS.SET_PRIMARY
    )[]
  >;
  email: ResourceOperations<
    (
      | UI_CONFIG_OPERATIONS.READ
      | UI_CONFIG_OPERATIONS.CREATE
      | UI_CONFIG_OPERATIONS.DELETE
      | UI_CONFIG_OPERATIONS.SET_PRIMARY
    )[]
  >;
  totp: ResourceOperations<(UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.CREATE | UI_CONFIG_OPERATIONS.DELETE)[]>;
  linkedAccounts: ResourceOperations<(UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.DELETE)[]>;
  grantedAuthorizations: ResourceOperations<(UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.DELETE)[]>;
  'optin-mfa': ResourceOperations<
    (
      | UI_CONFIG_OPERATIONS.READ
      | UI_CONFIG_OPERATIONS.READ_RECOVERY_INFO
      | UI_CONFIG_OPERATIONS.DELETE_FACTOR
      | UI_CONFIG_OPERATIONS.RESET
    )[]
  >;
  password: ResourceOperations<UI_CONFIG_OPERATIONS.UPDATE[]>;
  passkeys: ResourceOperations<UI_CONFIG_OPERATIONS.UPDATE[]>;
}

export interface GrantedAuthorizationsResources {
  grantedAuthorizations: ResourceOperations<(UI_CONFIG_OPERATIONS.READ | UI_CONFIG_OPERATIONS.DELETE)[]>;
}

export interface UiConfig extends BootstrapUiConfig {
  PATHS: BootstrapUiConfig['PATHS'] & {
    OAUTH_AGENT: string;
    USER_MANAGEMENT_API: string;
    GRANTED_AUTHORIZATION_API: string;
  };
  resourceGroups: {
    [UI_CONFIG_RESOURCE_GROUPS.USER_MANAGEMENT]: {
      resources: UserManagementResources;
    };
    [UI_CONFIG_RESOURCE_GROUPS.GRANTED_AUTHORIZATIONS]: {
      resources: GrantedAuthorizationsResources;
    };
  };
  translations: {
    [key: string]: string;
  };
}

export interface UiConfigIfRouteProps {
  children: React.ReactNode;
  allowAccessWithPartialResourcePermissions?: boolean;
}

export interface UiConfigIfProps {
  resources?: UI_CONFIG_RESOURCES[];
  allowedOperations?: UI_CONFIG_OPERATIONS[];
  displayWithPartialResourcePermissions?: boolean;
  children: React.ReactNode;
}

import { USER_MANAGEMENT_API_OPERATIONS } from '@/shared/data-access/API/user-management/api';

export const USER_MANAGEMENT_API_ERROR_MESSAGES: Record<USER_MANAGEMENT_API_OPERATIONS, string> = {
  // QUERIES
  [USER_MANAGEMENT_API_OPERATIONS.GET_ACCOUNT_BY_USERNAME]: 'error.account.fetch-by-username',
  [USER_MANAGEMENT_API_OPERATIONS.GET_ACCOUNTS]: 'error.account.fetch-all',
  [USER_MANAGEMENT_API_OPERATIONS.GET_ACCOUNTS_WITHOUT_SORTING]: 'error.account.fetch-unsorted',
  [USER_MANAGEMENT_API_OPERATIONS.GET_ACCOUNT_BY_ID]: 'error.account.fetch-by-id',
  [USER_MANAGEMENT_API_OPERATIONS.GET_ACCOUNT_BY_PHONE_NUMBER]: 'error.account.fetch-by-phone',
  [USER_MANAGEMENT_API_OPERATIONS.GET_CREDENTIAL_POLICY]: 'error.security.password.fetch-policy',

  // MUTATIONS
  [USER_MANAGEMENT_API_OPERATIONS.ADD_DEVICE_TO_ACCOUNT_BY_ACCOUNT_ID]: 'error.security.otp-authenticators.add',
  [USER_MANAGEMENT_API_OPERATIONS.UPDATE_DEVICE_FROM_ACCOUNT_BY_ACCOUNT_ID]: 'error.security.otp-authenticators.update',
  [USER_MANAGEMENT_API_OPERATIONS.DELETE_OPT_IN_MFA_FACTOR_FROM_ACCOUNT_BY_ACCOUNT_ID]:
    'error.security.multi-factor-authentication.delete-factor',
  [USER_MANAGEMENT_API_OPERATIONS.RESET_OPT_IN_MFA_STATE_BY_ACCOUNT_ID]:
    'error.security.multi-factor-authentication.reset-state',
  [USER_MANAGEMENT_API_OPERATIONS.UPDATE_ACCOUNT_BY_ID]: 'error.account.update',
  [USER_MANAGEMENT_API_OPERATIONS.CREATE_ACCOUNT]: 'error.account.create',
  [USER_MANAGEMENT_API_OPERATIONS.DELETE_ACCOUNT_BY_ID]: 'error.account.delete',
  [USER_MANAGEMENT_API_OPERATIONS.DELETE_DEVICE_FROM_ACCOUNT_BY_ACCOUNT_ID]: 'error.security.otp-authenticators.delete',
  [USER_MANAGEMENT_API_OPERATIONS.DELETE_LINK_FROM_ACCOUNT_BY_ACCOUNT_ID]: 'error.linked-accounts.delete',
  [USER_MANAGEMENT_API_OPERATIONS.START_VERIFY_TOTP_DEVICE]: 'error.security.otp-authenticators.start-totp',
  [USER_MANAGEMENT_API_OPERATIONS.COMPLETE_VERIFY_TOTP_DEVICE]: 'error.security.otp-authenticators.complete-totp',
  [USER_MANAGEMENT_API_OPERATIONS.START_VERIFY_EMAIL_ADDRESS]: 'error.account.email.send-code.',
  [USER_MANAGEMENT_API_OPERATIONS.COMPLETE_VERIFY_EMAIL_ADDRESS]: 'error.account.email.complete-verification',
  [USER_MANAGEMENT_API_OPERATIONS.DELETE_EMAIL_ADDRESS]: 'error.account.email.delete',
  [USER_MANAGEMENT_API_OPERATIONS.UPDATE_PRIMARY_EMAIL_ADDRESS]: 'error.account.email.update-primary',
  [USER_MANAGEMENT_API_OPERATIONS.START_VERIFY_PHONE_NUMBER]: 'error.account.phone.send-code',
  [USER_MANAGEMENT_API_OPERATIONS.COMPLETE_VERIFY_PHONE_NUMBER]: 'error.account.phone.complete-verification',
  [USER_MANAGEMENT_API_OPERATIONS.DELETE_PHONE_NUMBER]: 'error.account.phone.delete',
  [USER_MANAGEMENT_API_OPERATIONS.UPDATE_PRIMARY_PHONE_NUMBER]: 'error.account.phone.update-primary',
  [USER_MANAGEMENT_API_OPERATIONS.VALIDATE_PASSWORD_AND_UPDATE_ACCOUNT_BY_ID]:
    'error.security.password.validate-update',
  [USER_MANAGEMENT_API_OPERATIONS.ADD_OPT_IN_MFA_FACTOR_TO_ACCOUNT_BY_ACCOUNT_ID]:
    'error.security.multi-factor-authentication.add-factor',
  [USER_MANAGEMENT_API_OPERATIONS.OPT_OUT_FROM_OPT_IN_MFA_BY_ACCOUNT_ID]:
    'error.security.multi-factor-authentication.opt-out',
  [USER_MANAGEMENT_API_OPERATIONS.START_OPT_IN_MFA_SETUP_BY_ACCOUNT_ID]:
    'error.security.multi-factor-authentication.setup-start',
  [USER_MANAGEMENT_API_OPERATIONS.COMPLETE_OPT_IN_MFA_SETUP_BY_ACCOUNT_ID]:
    'error.security.multi-factor-authentication.setup-complete',
  [USER_MANAGEMENT_API_OPERATIONS.START_OPT_IN_MFA_RESET_RECOVERY_CODES_BY_ACCOUNT_ID]:
    'error.security.multi-factor-authentication.recovery-start',
  [USER_MANAGEMENT_API_OPERATIONS.COMPLETE_OPT_IN_MFA_RESET_RECOVERY_CODES_BY_ACCOUNT_ID]:
    'error.security.multi-factor-authentication.recovery-complete',
  [USER_MANAGEMENT_API_OPERATIONS.START_VERIFY_PASSKEY]: 'error.security.passkeys.verify',
  [USER_MANAGEMENT_API_OPERATIONS.COMPLETE_VERIFY_PASSKEY]: 'error.security.passkeys.verify',
};

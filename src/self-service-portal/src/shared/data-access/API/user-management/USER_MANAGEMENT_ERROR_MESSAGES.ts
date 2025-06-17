import { USER_MANAGEMENT_API_OPERATIONS } from '@/shared/data-access/API/user-management/api';

export const USER_MANAGEMENT_API_ERROR_MESSAGES: Record<USER_MANAGEMENT_API_OPERATIONS, string> = {
  // QUERIES
  [USER_MANAGEMENT_API_OPERATIONS.GET_ACCOUNT_BY_USERNAME]: 'Failed to retrieve account by username.',
  [USER_MANAGEMENT_API_OPERATIONS.GET_ACCOUNTS]: 'Failed to retrieve accounts.',
  [USER_MANAGEMENT_API_OPERATIONS.GET_ACCOUNTS_WITHOUT_SORTING]: 'Failed to retrieve unsorted accounts.',
  [USER_MANAGEMENT_API_OPERATIONS.GET_ACCOUNT_BY_ID]: 'Failed to retrieve account by ID.',
  [USER_MANAGEMENT_API_OPERATIONS.GET_ACCOUNT_BY_PHONE_NUMBER]: 'Failed to retrieve account by phone number.',
  [USER_MANAGEMENT_API_OPERATIONS.GET_CREDENTIAL_POLICY]: 'Failed to retrieve credential policy.',

  // MUTATIONS
  [USER_MANAGEMENT_API_OPERATIONS.ADD_DEVICE_TO_ACCOUNT_BY_ACCOUNT_ID]: 'Failed to add device to account.',
  [USER_MANAGEMENT_API_OPERATIONS.UPDATE_DEVICE_FROM_ACCOUNT_BY_ACCOUNT_ID]: 'Failed to update device on account.',
  [USER_MANAGEMENT_API_OPERATIONS.DELETE_OPT_IN_MFA_FACTOR_FROM_ACCOUNT_BY_ACCOUNT_ID]:
    'Failed to delete MFA factor from account.',
  [USER_MANAGEMENT_API_OPERATIONS.RESET_OPT_IN_MFA_STATE_BY_ACCOUNT_ID]: 'Failed to reset MFA state. Please retry.',
  [USER_MANAGEMENT_API_OPERATIONS.UPDATE_ACCOUNT_BY_ID]: 'Failed to update account.',
  [USER_MANAGEMENT_API_OPERATIONS.CREATE_ACCOUNT]: 'Failed to create account.',
  [USER_MANAGEMENT_API_OPERATIONS.DELETE_ACCOUNT_BY_ID]: 'Failed to delete account.',
  [USER_MANAGEMENT_API_OPERATIONS.DELETE_DEVICE_FROM_ACCOUNT_BY_ACCOUNT_ID]: 'Failed to delete device from account.',
  [USER_MANAGEMENT_API_OPERATIONS.DELETE_LINK_FROM_ACCOUNT_BY_ACCOUNT_ID]: 'Failed to delete linked account.',
  [USER_MANAGEMENT_API_OPERATIONS.START_VERIFY_TOTP_DEVICE]: 'Failed to start TOTP verification. Please retry.',
  [USER_MANAGEMENT_API_OPERATIONS.COMPLETE_VERIFY_TOTP_DEVICE]: 'Failed to complete TOTP verification. Please retry.',
  [USER_MANAGEMENT_API_OPERATIONS.START_VERIFY_EMAIL_ADDRESS]: 'Failed to send verification code. Please retry.',
  [USER_MANAGEMENT_API_OPERATIONS.COMPLETE_VERIFY_EMAIL_ADDRESS]:
    'Failed to complete email verification. Please retry by entering the 6-digit code sent to your email.',
  [USER_MANAGEMENT_API_OPERATIONS.DELETE_EMAIL_ADDRESS]: 'Failed to delete email address.',
  [USER_MANAGEMENT_API_OPERATIONS.UPDATE_PRIMARY_EMAIL_ADDRESS]: 'Failed to update primary email address.',
  [USER_MANAGEMENT_API_OPERATIONS.START_VERIFY_PHONE_NUMBER]: 'Failed to send verification code. Please retry.',
  [USER_MANAGEMENT_API_OPERATIONS.COMPLETE_VERIFY_PHONE_NUMBER]:
    'Failed to complete phone number verification. Please retry by entering the 6-digit code sent to your phone number.',
  [USER_MANAGEMENT_API_OPERATIONS.DELETE_PHONE_NUMBER]: 'Failed to delete phone number.',
  [USER_MANAGEMENT_API_OPERATIONS.UPDATE_PRIMARY_PHONE_NUMBER]: 'Failed to update primary phone number.',
  [USER_MANAGEMENT_API_OPERATIONS.VALIDATE_PASSWORD_AND_UPDATE_ACCOUNT_BY_ID]:
    'Failed to validate and update password.',
  [USER_MANAGEMENT_API_OPERATIONS.START_VERIFY_PASSKEY]: 'Failed to verify passkey.',
  [USER_MANAGEMENT_API_OPERATIONS.COMPLETE_VERIFY_PASSKEY]: 'Failed to verify passkey.',
};

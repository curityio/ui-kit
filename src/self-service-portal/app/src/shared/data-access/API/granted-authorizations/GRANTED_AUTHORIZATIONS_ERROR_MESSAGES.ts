import { GRANTED_AUTHORIZATIONS_API_OPERATIONS } from './api.ts';

export const GRANTED_AUTHORIZATIONS_API_ERROR_MESSAGES: Record<GRANTED_AUTHORIZATIONS_API_OPERATIONS, string> = {
  // QUERIES
  [GRANTED_AUTHORIZATIONS_API_OPERATIONS.GET_GRANTED_AUTHORIZATIONS_BY_OWNER]:
    'error.security.multi-factor-authentication.fetch-authorizations-by-owner',
  [GRANTED_AUTHORIZATIONS_API_OPERATIONS.GET_GRANTED_AUTHORIZATIONS_BY_OWNER_AND_CLIENT]:
    'error.security.multi-factor-authentication.fetch-authorizations-by-owner-client',

  // MUTATIONS
  [GRANTED_AUTHORIZATIONS_API_OPERATIONS.REVOKE_GRANTED_AUTHORIZATIONS_BY_OWNER]:
    'error.security.multi-factor-authentication.revoke-authorizations-by-owner',
  [GRANTED_AUTHORIZATIONS_API_OPERATIONS.REVOKE_GRANTED_AUTHORIZATIONS_BY_OWNER_AND_CLIENT]:
    'error.security.multi-factor-authentication.revoke-authorizations-by-owner-client',
};

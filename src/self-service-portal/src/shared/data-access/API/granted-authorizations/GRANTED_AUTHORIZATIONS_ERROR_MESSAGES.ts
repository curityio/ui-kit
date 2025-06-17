import { GRANTED_AUTHORIZATIONS_API_OPERATIONS } from '@/shared/data-access/API/granted-authorizations/api';

export const GRANTED_AUTHORIZATIONS_API_ERROR_MESSAGES: Record<GRANTED_AUTHORIZATIONS_API_OPERATIONS, string> = {
  // QUERIES
  [GRANTED_AUTHORIZATIONS_API_OPERATIONS.GET_GRANTED_AUTHORIZATIONS_BY_OWNER]:
    'Failed to retrieve granted authorizations by owner.',
  [GRANTED_AUTHORIZATIONS_API_OPERATIONS.GET_GRANTED_AUTHORIZATIONS_BY_OWNER_AND_CLIENT]:
    'Failed to retrieve granted authorizations by owner and client.',

  // MUTATIONS
  [GRANTED_AUTHORIZATIONS_API_OPERATIONS.REVOKE_GRANTED_AUTHORIZATIONS_BY_OWNER]:
    'Failed to revoke granted authorizations by owner.',
  [GRANTED_AUTHORIZATIONS_API_OPERATIONS.REVOKE_GRANTED_AUTHORIZATIONS_BY_OWNER_AND_CLIENT]:
    'Failed to revoke granted authorizations by owner and client.',
};

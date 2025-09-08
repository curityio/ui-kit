import {
  GetGrantedAuthorizationsByOwnerAndClientDocument,
  GetGrantedAuthorizationsByOwnerDocument,
  RevokeGrantedAuthorizationsByOwnerAndClientDocument,
  RevokeGrantedAuthorizationsByOwnerDocument,
} from '../graphql-codegen-typings-queries-and-mutations/graphql.ts';

export enum GRANTED_AUTHORIZATIONS_API_OPERATIONS {
  // QUERIES
  GET_GRANTED_AUTHORIZATIONS_BY_OWNER = 'getGrantedAuthorizationsByOwner',
  GET_GRANTED_AUTHORIZATIONS_BY_OWNER_AND_CLIENT = 'getGrantedAuthorizationsByOwnerAndClient',

  // MUTATIONS
  REVOKE_GRANTED_AUTHORIZATIONS_BY_OWNER = 'revokeGrantedAuthorizationsByOwner',
  REVOKE_GRANTED_AUTHORIZATIONS_BY_OWNER_AND_CLIENT = 'revokeGrantedAuthorizationsByOwnerAndClient',
}

export const GRANTED_AUTHORIZATION_API = {
  QUERIES: {
    [GRANTED_AUTHORIZATIONS_API_OPERATIONS.GET_GRANTED_AUTHORIZATIONS_BY_OWNER]:
      GetGrantedAuthorizationsByOwnerDocument,
    [GRANTED_AUTHORIZATIONS_API_OPERATIONS.GET_GRANTED_AUTHORIZATIONS_BY_OWNER_AND_CLIENT]:
      GetGrantedAuthorizationsByOwnerAndClientDocument,
  },
  MUTATIONS: {
    [GRANTED_AUTHORIZATIONS_API_OPERATIONS.REVOKE_GRANTED_AUTHORIZATIONS_BY_OWNER]:
      RevokeGrantedAuthorizationsByOwnerDocument,
    [GRANTED_AUTHORIZATIONS_API_OPERATIONS.REVOKE_GRANTED_AUTHORIZATIONS_BY_OWNER_AND_CLIENT]:
      RevokeGrantedAuthorizationsByOwnerAndClientDocument,
  },
};

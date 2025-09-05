import { GRAPQL_API_ENDPOINTS } from './index.ts';
import { GRANTED_AUTHORIZATION_API } from './granted-authorizations/api.ts';
import { USER_MANAGEMENT_API } from './user-management/api.ts';

export const GRAPHQL_API = {
  [GRAPQL_API_ENDPOINTS.USER_MANAGEMENT]: USER_MANAGEMENT_API,
  [GRAPQL_API_ENDPOINTS.GRANTED_AUTHORIZATION]: GRANTED_AUTHORIZATION_API,
};

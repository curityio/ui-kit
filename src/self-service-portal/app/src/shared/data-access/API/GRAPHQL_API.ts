import { GRAPQL_API_ENDPOINTS } from '@/shared/data-access/API';
import { GRANTED_AUTHORIZATION_API } from '@/shared/data-access/API/granted-authorizations/api';
import { USER_MANAGEMENT_API } from '@/shared/data-access/API/user-management/api';

export const GRAPHQL_API = {
  [GRAPQL_API_ENDPOINTS.USER_MANAGEMENT]: USER_MANAGEMENT_API,
  [GRAPQL_API_ENDPOINTS.GRANTED_AUTHORIZATION]: GRANTED_AUTHORIZATION_API,
};

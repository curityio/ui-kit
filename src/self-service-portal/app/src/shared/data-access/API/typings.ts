import { useQuery } from '@apollo/client';

export type GraphQLAPIQuery = typeof useQuery;

export enum GRAPQL_API_ENDPOINTS {
  USER_MANAGEMENT = 'USER_MANAGEMENT',
  GRANTED_AUTHORIZATION = 'GRANTED_AUTHORIZATION',
}

export interface GraphQLAPIProviderProps {
  children?: React.ReactNode;
}

export enum DEVICE_TYPES {
  TOTP = 'totp',
  PASSKEYS = 'webauthn/passkeys',
}

/**
 * The capability fields a database client can enable. The GraphQL type has
 * one nullable field per capability; a non-null value means enabled.
 */
export const CAPABILITY_KEYS = [
  'code',
  'implicit',
  'resource_owner_password',
  'assertion',
  'assisted_token',
  'backchannel',
  'client_credentials',
  'introspection',
  'token_exchange',
  'oauth_token_exchange',
  'haapi',
] as const;

export type CapabilityKey = (typeof CAPABILITY_KEYS)[number];

export type DatabaseClientCapabilities = Partial<
  Record<CapabilityKey, { type: string } | null>
>;

export interface DatabaseClientNode {
  client_id: string;
  name: string | null;
  status: string;
  capabilities: DatabaseClientCapabilities;
  meta: {
    created: string;
    lastModified: string;
    warnings: string[] | null;
  };
}

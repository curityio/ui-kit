import {
  CAPABILITY_KEYS,
  CapabilityKey,
  DatabaseClientCapabilities,
} from '../../shared/data-access/graphql/db-clients/types';

/**
 * The capabilities a client has enabled — the non-null capability fields —
 * in a stable order.
 */
export const activeCapabilities = (
  capabilities: DatabaseClientCapabilities | null | undefined,
): CapabilityKey[] => CAPABILITY_KEYS.filter(key => capabilities?.[key]);

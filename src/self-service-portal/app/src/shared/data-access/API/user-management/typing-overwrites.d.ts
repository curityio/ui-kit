/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { CredentialRuleDescriptor as BaseCredentialRuleDescriptor } from '@/shared/data-access/API';

/**
 * Overrides the `CredentialRuleDescriptor` type because it is declared as an `interface`
 * in the GraphQL schema, which means the `__typename` field is not included in the
 * generated type definition.
 *
 * The `__typename` field is required in the frontend to identify the specific rule type.
 *
 * This affects the field:
 * `credentialUpdateRules: [CredentialRuleDescriptor!]`
 * (defined in: src/shared/data-access/API/user-management/schemas/user_management_api.graphqls:2025)
 */

interface CredentialRuleDescriptor extends BaseCredentialRuleDescriptor {
  __typename: string;
  message?: string | null;
  detailedMessage?: string | null;
  minimum?: number | null;
  maximum?: number | null;
}

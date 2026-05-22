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

import {
  HAAPI_ACTION_CLIENT_OPERATIONS,
  HAAPI_ACTION_TYPES,
  HaapiAction,
  HaapiBankIdClientOperationAction,
} from '../../../../../data-access/types/haapi-action.types';

export const isBankIdClientOperation = (action: HaapiAction): action is HaapiBankIdClientOperationAction =>
  action.template === HAAPI_ACTION_TYPES.CLIENT_OPERATION &&
  action.model.name === HAAPI_ACTION_CLIENT_OPERATIONS.BANKID;

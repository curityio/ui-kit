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

import { HaapiBankIdClientOperationAction } from '../../../../../data-access/types/haapi-action.types';
import { HaapiFetchFormAction } from '../../../../../data-access/types/haapi-fetch.types';
import { openBankIdApp } from './open-bankid-app';

export async function runBankIdAuthentication(action: HaapiBankIdClientOperationAction): Promise<HaapiFetchFormAction> {
  openBankIdApp(action);

  const nextAction = action.model.continueActions[0];

  return Promise.resolve({ action: nextAction });
}

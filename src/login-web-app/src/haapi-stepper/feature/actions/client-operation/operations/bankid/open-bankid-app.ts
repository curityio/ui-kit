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

import { HaapiBankIdClientOperationAction } from '../../../../../data-access';
import { isMobileDevice } from '../../../../../util/isMobileDevice';

export function openBankIdApp(action: HaapiBankIdClientOperationAction) {
  const token = action.model.arguments.autoStartToken;
  const bankIDAppHref = isMobileDevice()
    ? `https://app.bankid.com/?autostarttoken=${token}`
    : `bankid:///?autostarttoken=${token}`;

  const anchor = document.createElement('a');
  anchor.href = bankIDAppHref;
  anchor.referrerPolicy = 'origin';
  anchor.click();
}

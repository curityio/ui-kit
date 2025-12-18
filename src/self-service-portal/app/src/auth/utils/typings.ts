/*
 * Copyright (C) 2024 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { EndLoginRequest, SessionResponse } from '@curity/token-handler-js-assistant/lib/types';

export type AuthContextType = {
  startLogin: () => Promise<void>;
  endLogin: (request: EndLoginRequest) => Promise<SessionResponse>;
  refresh: () => Promise<void>;
  logout: () => Promise<void>;
  session?: SessionResponse;
};

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

/**
 * HAAPI view names that the LWA ships built-in step render interceptors for
 * (see `VIEW_NAME_BUILT_IN_UIS_MAP` in `./viewname-built-in-uis`).
 *
 * Members map one-to-one to entries in the built-in registry: adding a new member here
 * must be accompanied by a matching interceptor registration.
 */
export enum HaapiStepperViewNameBuiltInUI {
  BANKID = 'authenticator/bankid/wait/index',
}

/*
 * Copyright (C) 2026 Curity AB. All rights reserved.
 *
 * The contents of this file are the property of Curity AB.
 * You may not copy or use this file, in either source code
 * or executable form, except in compliance with terms
 * set by Curity AB.
 *
 * For further information, please contact Curity AB.
 */

import { HaapiFormAction } from './haapi-action.types';
import { HaapiLink } from './haapi-step.types';

/**
 * Haapi action used for HAAPI requests via the haapiFetch library (@curity/identityserver-haapi-web-driver)
 */
export type HaapiFetchAction = HaapiFetchFormAction | HaapiLink;

export interface HaapiFetchFormAction {
  action: HaapiFormAction;
  payload?: HaapiFetchPayload;
}

/**
 * Haapi payload used for HAAPI requests via the haapiFetch library (@curity/identityserver-haapi-web-driver)
 */
export type HaapiFetchPayload = ReadonlyMap<string, string> | Record<string, unknown>;

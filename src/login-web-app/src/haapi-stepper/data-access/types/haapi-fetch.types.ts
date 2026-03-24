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

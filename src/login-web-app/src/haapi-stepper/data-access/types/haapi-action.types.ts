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

import { StringWithAutocomplete } from '../../util';
import { HaapiFormActionModel } from './haapi-form.types';

// ============================================================================
// Action Enums
// ============================================================================

/**
 * Action template type constants
 */
export enum HAAPI_ACTION_TYPES {
  FORM = 'form',
  CLIENT_OPERATION = 'client-operation',
  SELECTOR = 'selector',
}

// ============================================================================
// Action Types
// ============================================================================

/**
 * Union of all action types
 */
export type HaapiAction = HaapiFormAction | HaapiClientOperationAction | HaapiSelectorAction;

/**
 * Generic properties object for extensibility
 */
export type GenericProperties = Record<string, unknown>;

/**
 * Base properties for all actions
 */
interface HaapiBaseAction {
  /** Template that defines the model used in an action */
  template: HAAPI_ACTION_TYPES;
  /** Kind of the action. The kind of an action specializes its meaning, allowing clients that support a certain "kind" to provide an improved user experience. */
  kind: string;
  /** Title of the action. Should be human-readable. */
  title?: string;
  /** Model associated with the action. Each template type has its own model schema.*/
  model: unknown;
}

/**
 * Form action for user input
 */
export interface HaapiFormAction extends HaapiBaseAction {
  template: HAAPI_ACTION_TYPES.FORM;
  kind: HAAPI_FORM_ACTION_KINDS_TYPE;
  model: HaapiFormActionModel;
  properties?: {
    /** Contains the authenticator type. It is present when the action represents an authenticator option */
    authenticatorType?: string;
    [key: string]: unknown;
  };
}

/**
 * Poll form action for continuing the polling process
 */
export interface HaapiPollFormAction extends HaapiFormAction {
  kind: HAAPI_FORM_ACTION_KINDS.POLL;
}

/**
 * Cancel form action for stopping the polling process
 */
export interface HaapiCancelFormAction extends HaapiFormAction {
  kind: HAAPI_FORM_ACTION_KINDS.CANCEL;
}

export type HAAPI_FORM_ACTION_KINDS_TYPE = StringWithAutocomplete<HAAPI_FORM_ACTION_KINDS>;

export enum HAAPI_FORM_ACTION_KINDS {
  REDIRECT = 'redirect',
  CANCEL = 'cancel',
  POLL = 'poll',
  LOGIN = 'login',
  AUTHENTICATOR_SELECTOR = 'authenticator-selector',
  AUTHENTICATOR_SELECTOR_OPTION = 'select-authenticator',
  CONTINUE = 'continue',
  USER_REGISTER = 'user-register',
}

export enum HAAPI_ACTION_CLIENT_OPERATIONS {
  EXTERNAL_BROWSER_FLOW = 'external-browser-flow',
  BANKID = 'bankid',
  WEBAUTHN_AUTHENTICATION = 'webauthn-authentication',
  WEBAUTHN_REGISTRATION = 'webauthn-registration',
  /*
   * @deprecated
   */
  ENCAP_AUTO_ACTIVATION = 'encap-auto-activation',
}

/**
 * Base client operation model
 */
export interface HaapiBaseClientOperationModel {
  /** Name of the operation. Defines the arguments to be used. */
  name: HAAPI_ACTION_CLIENT_OPERATIONS;
  /** “Arguments associated with the action. Each operation has its own arguments schema. */
  arguments: unknown;
  /** Actions to continue with after operation completes */
  continueActions: HaapiAction[];
  /** Actions available if operation fails */
  errorActions?: HaapiAction[];
}

/**
 * Client operation actions instruct a client to perform an out-of-band action, such as launching an application or use some other device.
 *
 * Operations are identified by a `name` and may require specific metadata, provided by the `arguments` object.
 *
 * A client operation includes `continueActions` - which allow the client to proceed with the flow after the operation is completed - and, optionally, `errorActions` - which can be used if the operation ends with an error.
 *
 * All clients must support at least the `external-browser-flow` operation, which requires opening a browser.
 *
 * Other operations that the Curity Identity Server ships with (and may be supported by fully compliant clients) are:
 *
 * * bankid
 * * encap-auto-activation
 * * webauthn-registration
 * * webauthn-authentication
 */
export interface HaapiClientOperationAction extends HaapiBaseAction {
  template: HAAPI_ACTION_TYPES.CLIENT_OPERATION;
  model: HaapiBaseClientOperationModel;
}

/**
 * Client operation external browser flow action
 */
export interface HaapiExternalBrowserFlowClientOperationAction extends HaapiClientOperationAction {
  model: HaapiExternalBrowserClientOperationModel;
}

/**
 * The `external-browser-flow` client operation instructs a client that an external browser needs to be used to continue the flow. The client should open a browser window/tab using the URL contained in the `href` field of the operation `arguments`. The client then needs to wait until the external browser sub-flow is completed, before resuming the HAAPI flow using the action inside `continueActions`.
 *
 * When the external browser sub-flow is completed, the browser sends back a nonce to the client, which should then be submitted in the `context` field of the continuation action in order to resume the flow. The mechanism used to pass the nonce back to the client depends on the client type (native or browser-based).
 *
 * **Native clients**
 *
 * On a native client, the nonce is returned by redirecting the browser back to the application by using an HTTP URI or a custom scheme URI associated to the application. The nonce will be present in the query-string.
 *
 * A client should proceed as follows:
 *
 * 1. Add the redirect URL to the browser launch’s URL by appending the `redirect_uri` query-string parameter to the URL contained in `href`. The redirect URI needs to be registered for the client.
 * 2. Open the browser.
 * 3. When the browser flow ends, the browser is redirected to the client and the nonce is supplied in the `_resume_nonce` query-string parameter.
 *
 * **Browser-based clients**
 *
 * On a browser-based client, the external browser window returns the nonce by posting a message to the opener window (via `postMessage`).
 *
 * A client should proceed as follows:
 *
 * 1. Set up an event listener for the `message` event (via `window.addEventListener`).
 * 2. Add its origin to the browser launch’s URL by appending the `for_origin` query-string parameter to the URL contained in `href`.
 * 3. Open a new window/tab (via `window.open`).
 * 4. When the browser flow ends, a `message` event is received in the event listener and the nonce is supplied in the event's `data` field. The client should validate that the event's `source` is the previously created window.
 *
 * After receiving the nonce, a client may close the external window (via `window.close`) to bring the user focus back to the main application window, possibly after a short delay.
 */
export interface HaapiExternalBrowserClientOperationModel extends HaapiBaseClientOperationModel {
  name: HAAPI_ACTION_CLIENT_OPERATIONS.EXTERNAL_BROWSER_FLOW;
  arguments: HaapiExternalBrowserArguments;
  continueActions: [HaapiFormAction];
}

/**
 * External browser flow arguments
 */
export interface HaapiExternalBrowserArguments {
  /** The URL where the browser window should be opened. */
  href: string;
}

/**
 * Client operation WebAuthn registration action
 */
export interface HaapiWebAuthnRegistrationClientOperationAction extends HaapiClientOperationAction {
  model: HaapiWebAuthnRegistrationClientOperationModel;
}

export interface HaapiWebAuthnRegistrationClientOperationModel extends HaapiBaseClientOperationModel {
  name: HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_REGISTRATION;
  arguments:
    | { credentialCreationOptions: HaapiPublicKeyCredentialCreationOptions }
    | {
        platformCredentialCreationOptions?: HaapiPublicKeyCredentialCreationOptions;
        crossPlatformCredentialCreationOptions?: HaapiPublicKeyCredentialCreationOptions;
      };
  continueActions: [HaapiFormAction];
}

export interface HaapiPublicKeyCredentialCreationOptions {
  publicKey: PublicKeyCredentialCreationOptionsJSON;
}

/**
 * Client operation WebAuthn authentication action
 */
export interface HaapiWebAuthnAuthenticationClientOperationAction extends HaapiClientOperationAction {
  model: HaapiWebAuthnAuthenticationClientOperationModel;
}

export interface HaapiWebAuthnAuthenticationClientOperationModel extends HaapiBaseClientOperationModel {
  name: HAAPI_ACTION_CLIENT_OPERATIONS.WEBAUTHN_AUTHENTICATION;
  arguments: {
    credentialRequestOptions: {
      publicKey: PublicKeyCredentialRequestOptionsJSON;
    };
  };
  continueActions: [HaapiFormAction];
}

/**
 * Client operation BankId action
 */
export interface HaapiBankIdClientOperationAction extends HaapiClientOperationAction {
  model: HaapiBankIdClientOperationModel;
}

export interface HaapiBankIdClientOperationModel extends HaapiBaseClientOperationModel {
  name: HAAPI_ACTION_CLIENT_OPERATIONS.BANKID;
  arguments: {
    href: string;
    autoStartToken: string;
    redirect?: string;
  };
  continueActions: [HaapiFormAction];
}

/**
 * Selector actions are used to let the user select between different options.
 * Each option is given by an action which the user can choose to follow.
 */
export interface HaapiSelectorAction extends HaapiBaseAction {
  template: HAAPI_ACTION_TYPES.SELECTOR;
  model: HaapiSelectorActionModel;
  properties?: GenericProperties;
}

/**
 * Selector action model
 */
export interface HaapiSelectorActionModel {
  /** Options to select from */
  options: HaapiAction[];
}

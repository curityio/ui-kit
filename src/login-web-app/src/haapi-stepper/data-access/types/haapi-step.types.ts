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
  HaapiAction,
  HaapiCancelFormAction,
  HaapiClientOperationAction,
  HaapiFormAction,
  HaapiPollFormAction,
} from './haapi-action.types';

/**
 * Step/representation type constants
 */
export enum HAAPI_STEPS {
  AUTHENTICATION = 'authentication-step',
  REGISTRATION = 'registration-step',
  USER_CONSENT = 'user-consent-step',
  CONSENTOR = 'consentor-step',
  POLLING = 'polling-step',
  REDIRECTION = 'redirection-step',
  CONTINUE_SAME = 'continue-same-step',
  COMPLETED_WITH_SUCCESS = 'oauth-authorization-response',
}

/**
 * Problem type constants
 */
export enum HAAPI_PROBLEM_STEPS {
  AUTHENTICATION_FAILED = 'https://curity.se/problems/authentication-failed',
  INVALID_INPUT = 'https://curity.se/problems/invalid-input',
  INCORRECT_CREDENTIALS = 'https://curity.se/problems/incorrect-credentials',
  UNEXPECTED = 'https://curity.se/problems/unexpected',
  TOO_MANY_ATTEMPTS = 'https://curity.se/problems/too-many-attempts',
  GENERIC_USER_ERROR = 'https://curity.se/problems/generic-user-error',
  SESSION_TOKEN_MISMATCH = 'https://curity.se/problems/mismatch-between-session-and-access-token',
  COMPLETED_WITH_ERROR = 'https://curity.se/problems/error-authorization-response',
}

export type HaapiStep =
  | HaapiActionStep
  | HaapiRedirectionStep
  | HaapiContinueSameStep
  | HaapiCompletedStep
  | HaapiErrorStep;

export type HaapiActionStep =
  | HaapiAuthenticationStep
  | HaapiRegistrationStep
  | HaapiUserConsentStep
  | HaapiConsentorStep
  | HaapiPollingStep;

export type HaapiCompletedStep = HaapiCompletedWithSuccessStep | HaapiCompletedWithErrorStep;

export type HaapiErrorStep = HaapiAppError | HaapiInputError;

/**
 * AppErrors can not be resolved in the step (action form) they originated, so
 * they need to be handled at the application level (e.g. show a dedicated error page)
 * and/or require restarting the stepper flow.
 * As any other Problem, they might include UserMessages and Links that need to be
 * displayed to the user.
 */
export type HaapiAppError = HaapiUnrecoverableProblemStep | HaapiUnexpectedProblemStep;

/**
 * InputErrors can be resolved in the step (form) they originated.
 * They should be handled while keeping the step's UI, providing the Problem's
 * UserMessages and Links, and allowing the user to correct the input and resubmit.
 */
export type HaapiInputError = HaapiInputValidationProblemStep | HaapiAuthenticationFailedProblemStep;

// ============================================================================
// Step/Representation Types
// ============================================================================

/**
 * Base properties for all steps
 */
interface HaapiBaseStep {
  /** The type of a step, which defines the schema for the step. */
  type: HAAPI_STEPS | HAAPI_PROBLEM_STEPS;
  /** Additional metadata about the response */
  metadata?: HaapiMetadata;
}

export interface HaapiActionBaseStep extends HaapiBaseStep {
  /**
   * Possible actions a user or the client may choose to take to continue the flow.
   * If only one action is available and the action does not require user input, a client can elect to follow it automatically.
   * Actions requiring user interaction may not be hidden or skipped by the client.
   */
  actions: HaapiAction[];
  /** User messages. Should be displayed to users to help them understand the context of an interaction. */
  messages?: HaapiUserMessage[];
  /**
   * Array of hyperlinks that may be used to offer an user alternative flows. The "main" flow the user is expected to take should use "actions" instead.
   * Links can be used, for example, to divert the user to register an account or a device from a login page.
   */
  links?: HaapiLink[];
}

/**
 * An Authentication Step allows users to make progress towards authenticating themselves. The client should display all
 * actions provided by the server, as well as any messages and links, to let the user decide how to better proceed to the
 * next step.
 */
export interface HaapiAuthenticationStep extends HaapiActionBaseStep {
  type: HAAPI_STEPS.AUTHENTICATION;
}

/**
 * Registration Step allows users to register with a new account. Actions included in such step should always be related
 * to registering new user accounts or cancelling the flow.
 */
export interface HaapiRegistrationStep extends HaapiActionBaseStep {
  type: HAAPI_STEPS.REGISTRATION;
}

/**
 * A User Consent Step allows users to review which identity attributes will be made available to the client and decide if
 * they want to allow it. The client should display all actions provided by the server, as well as any messages and links,
 * to let the user decide how to better proceed to the next step.
 */
export interface HaapiUserConsentStep extends HaapiActionBaseStep {
  type: HAAPI_STEPS.USER_CONSENT;
}

/**
 * A Consentor Step allows additional processing during delegation and token issuance, at the end of the authorization
 * flow. The client should display all actions provided by the server, as well as any messages and links, to let the user
 * decide how to better proceed to the next step.
 */
export interface HaapiConsentorStep extends HaapiActionBaseStep {
  type: HAAPI_STEPS.CONSENTOR;
}

/**
 * Polling step requires a client to poll using one of the provided actions. The client may use a polling interval of its
 * choosing, usually a few seconds. While polling, the client should display any links or messages provided in the
 * response from the server, as well as a visual indicator to make it clear that the server is performing some work while
 * waiting for some external action to be completed.
 */
export interface HaapiPollingStep extends HaapiActionBaseStep {
  type: HAAPI_STEPS.POLLING;
  /** Polling-specific properties */
  properties: HaapiPollingStepProperties;
  /**
   * Polling steps must contain one poll action and, optionally, a cancel action to allow the user to abort the operation.
   * Other actions may be included that allow the client to present related alternatives to the user (e.g. a client operation action to launch a native appication).
   */
  actions: (HaapiPollFormAction | HaapiFormAction | HaapiCancelFormAction | HaapiClientOperationAction)[];
}

export interface HaapiPollingStepProperties {
  /** Current status of the polling process. */
  status: HAAPI_POLLING_STATUS;
  /** Subject who is expected to perform some action while the client polls waiting for such action. */
  recipientOfCommunication?: string;
  /** Polling session maximum time in seconds before the session expires. */
  maxWaitTime?: number;
  /** Polling session remaining time in seconds before the session expires. */
  maxWaitRemainingTime?: number;
}

/**
 * Polling status constants
 */
export enum HAAPI_POLLING_STATUS {
  DONE = 'done',
  FAILED = 'failed',
  PENDING = 'pending',
}

/**
 * A Redirection Step is used to inform the client it should automatically redirect the user. The client can assume there
 * will be a single action to follow, requiring no user interaction.
 */
export interface HaapiRedirectionStep extends HaapiBaseStep {
  type: HAAPI_STEPS.REDIRECTION;
  /** There must be a single form-action containing only hidden fields (i.e. no user interaction is required) to allow the client to automatically follow the action. */
  actions: [HaapiFormAction];
}

/**
 * A continue-same-step tells the client that it should continue on the same step because no progress could be made. It
 * can only occur when the client had, in the previous step, alternative "continueActions" and implies that the user
 * should try one of the previous alternative actions to proceed.
 */
export interface HaapiContinueSameStep extends HaapiBaseStep {
  type: HAAPI_STEPS.CONTINUE_SAME;
  /** Messages explaining why no progress was made */
  messages?: HaapiUserMessage[];
}

/**
 * An OAuth Authorization Response provides the client with the authorization response parameters, such as `code` and
 * `state`. It signals the end of the authorization request flow.
 */
export interface HaapiCompletedWithSuccessStep extends HaapiBaseStep {
  type: HAAPI_STEPS.COMPLETED_WITH_SUCCESS;
  /**
   * Properties object with the OAuth Authorization Response parameters, such as `code` and `state`.
   * See https://www.iana.org/assignments/oauth-parameters/oauth-parameters.xhtml#parameters for more information.
   */
  properties: HaapiCompletedWithSuccessStepOAuthAuthorizationResponseProperties;
  /** User messages. Should be displayed to users to help them understand the context of an interaction. */
  messages?: HaapiUserMessage[];
  /**
   * Array of hyperlinks that may be used to offer an user alternative flows. The "main" flow the user is expected to take should use "actions" instead.
   * Links can be used, for example, to divert the user to register an account or a device from a login page.
   */
  links?: HaapiLink[];
}

/**
 * OAuth authorization response properties
 */
export interface HaapiCompletedWithSuccessStepOAuthAuthorizationResponseProperties {
  scope?: string;
  state?: string;
  iss?: string;
  code?: string;
  access_token?: string;
  token_type?: string;
  expires_in?: string;
  id_token?: string;
  session_state?: string;
  [key: string]: string | undefined;
}

/**
 * Problem response indicates an error occurred on the server. Responses of this type obey the schema defined in
 * [RFC-7807](https://tools.ietf.org/html/rfc7807) (Problem Details for HTTP APIs).
 */
export interface HaapiProblemStepBase extends HaapiBaseStep {
  /** Title of the problem */
  title?: string;
  /** User messages. Should be displayed to users to help them understand the context of an interaction. */
  messages?: HaapiUserMessage[];
  /**
   * Array of hyperlinks that may be used to offer an user alternative flows. The "main" flow the user is expected to take should use "actions" instead.
   * Links can be used, for example, to divert the user to register an account or a device from a login page.
   */
  links?: HaapiLink[];
}

export interface HaapiUnrecoverableProblemStep extends HaapiProblemStepBase {
  type: HAAPI_PROBLEM_STEPS.GENERIC_USER_ERROR;
}

export interface HaapiUnexpectedProblemStep extends HaapiProblemStepBase {
  type: HAAPI_PROBLEM_STEPS.UNEXPECTED | HAAPI_PROBLEM_STEPS.SESSION_TOKEN_MISMATCH;
}

/**
 * An error representation analogous to the OAuth 2.0 error format.
 */
export interface HaapiCompletedWithErrorStep extends HaapiProblemStepBase {
  type: HAAPI_PROBLEM_STEPS.COMPLETED_WITH_ERROR;
  /** OAuth error code */
  error: string;
  /** Human-readable error description */
  error_description?: string;
  /** Issuer identifier */
  iss?: string;
}

/**
 * An error that occurs when an invalid form is submitted.
 */
export interface HaapiInputValidationProblemStep extends HaapiProblemStepBase {
  type: HAAPI_PROBLEM_STEPS.INVALID_INPUT;
  /** Array containing information about each invalid form field. */
  invalidFields: HaapiInvalidField[];
}

export interface HaapiAuthenticationFailedProblemStep extends HaapiProblemStepBase {
  type:
    | HAAPI_PROBLEM_STEPS.INCORRECT_CREDENTIALS
    | HAAPI_PROBLEM_STEPS.AUTHENTICATION_FAILED
    | HAAPI_PROBLEM_STEPS.TOO_MANY_ATTEMPTS;
}

/**
 * Invalid field information
 */
export interface HaapiInvalidField {
  /** Name of the field. */
  name: string;
  /** Reason for invalidity */
  reason: 'missing' | 'invalidValue';
  /** Additional details about the error */
  detail?: string;
}

// ============================================================================
// Common Interfaces
// ============================================================================

/**
 * Element category constants for data helpers
 */
export enum HAAPI_STEPPER_ELEMENT_TYPES {
  ACTION = 'action',
  LINK = 'link',
  MESSAGE = 'message',
}

/**
 * User messages. Should be displayed to users to help them understand the context of an interaction.
 */
export interface HaapiUserMessage {
  /** the text of the message to be displayed */
  text: string;
  /** The class of a message. Clients can use this to display messages differently, similar to CSS classes. */
  classList?: string[];
}

/**
 * Array of hyperlinks that may be used to offer an user alternative flows. The "main" flow the user is expected to take should use "actions" instead.
 * Links can be used, for example, to divert the user to register an account or a device from a login page.
 */
export interface HaapiLink {
  /** Target URI of the link. */
  href: string;
  /** Relation of the link. */
  rel: string;
  /** A hint for the media type of the resource being linked. */
  type?: string;
  /** Title of the link. Should be human-readable. */
  title?: string;
}

/**
 * Object with additional information about the response. A client may ignore the information present in this object.
 */
export interface HaapiMetadata {
  /** The value for a custom template area defined for the client or authenticator */
  templateArea?: string;
  /** The name for the view that produced the response */
  viewName?: string;
}

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

import { MEDIA_TYPES } from '../../../shared/util/types/media.types';
import { HaapiAction } from './haapi-action.types';

// ============================================================================
// Form Field Enums
// ============================================================================

/**
 * Form field type constants
 */
export enum HAAPI_FORM_FIELDS {
  HIDDEN = 'hidden',
  TEXT = 'text',
  PASSWORD = 'password',
  USERNAME = 'username',
  SELECT = 'select',
  CONTEXT = 'context',
  CHECKBOX = 'checkbox',
}

/**
 * HTTP method constants
 */
export enum HTTP_METHODS {
  GET = 'GET',
  HEAD = 'HEAD',
  POST = 'POST',
  PUT = 'PUT',
  PATCH = 'PATCH',
  DELETE = 'DELETE',
  OPTIONS = 'OPTIONS',
}

// ============================================================================
// Form Field Types
// ============================================================================

/**
 * Union of all form field types
 */
export type HaapiFormField =
  | HaapiHiddenFormField
  | HaapiTextFormField
  | HaapiPasswordFormField
  | HaapiUsernameFormField
  | HaapiContextFormField
  | HaapiSelectFormField
  | HaapiCheckboxFormField;

export type VisibleHaapiFormField = Exclude<HaapiFormField, HaapiHiddenFormField>;

/**
 * Base form field properties
 */
interface HaapiBaseFormField {
  /** Name of the field. */
  name: string;
  /** Label describing the purpose of the field to the user. */
  label?: string;
  /** A hint for possible values of the field. */
  placeholder?: string;
  /** Value of the field. */
  value?: string;
  /** Whether the field is required. Defaults to true. */
  required?: boolean;
}

/**
 * Hidden form field (not visible to user)
 */
export interface HaapiHiddenFormField extends HaapiBaseFormField {
  type: HAAPI_FORM_FIELDS.HIDDEN;
  value: string;
}

/**
 * Text input field with optional kind specification
 */
export interface HaapiTextFormField extends HaapiBaseFormField {
  type: HAAPI_FORM_FIELDS.TEXT;
  /** Kind of the field. The kind of a field specializes its meaning, allowing clients that support a certain "kind" to provide an improved user experience. */
  kind?: string;
  /** Minimum number of characters the field value must contain. */
  minLength?: number;
  /** Maximum number of characters the field value must contain. */
  maxLength?: number;
}

/**
 * Password input field
 */
export interface HaapiPasswordFormField extends HaapiBaseFormField {
  type: HAAPI_FORM_FIELDS.PASSWORD;
}

/**
 * Username input field
 */
export interface HaapiUsernameFormField extends HaapiBaseFormField {
  type: HAAPI_FORM_FIELDS.USERNAME;
}

/**
 * Context field for additional data
 */
export interface HaapiContextFormField extends HaapiBaseFormField {
  type: HAAPI_FORM_FIELDS.CONTEXT;
}

/**
 * Option for select fields
 */
export interface HaapiSelectOption {
  /** Label describing the option. */
  label: string;
  /** Value of the option. */
  value: string;
  /** Whether the option is selected by default. */
  selected?: boolean;
}

/**
 * Select dropdown field
 */
export interface HaapiSelectFormField extends HaapiBaseFormField {
  type: HAAPI_FORM_FIELDS.SELECT;
  /** Options to be presented to the user. */
  options: HaapiSelectOption[];
}

/**
 * Checkbox input field
 */
export interface HaapiCheckboxFormField extends HaapiBaseFormField {
  type: HAAPI_FORM_FIELDS.CHECKBOX;
  /** The initial checked state */
  checked?: boolean;
  /** Whether the initial checked state is changeable */
  readonly?: boolean;
}

export interface HaapiFormActionModel {
  /** HTTP method. */
  method: HTTP_METHODS;
  /** Target URI. */
  href: string;
  /** Title of the action of the model, typically visible to the user as a button label. Should be human-readable. */
  actionTitle?: string;
  fields?: HaapiFormField[];
  /** Media-type used to represent the form's contents. */
  type?: MEDIA_TYPES;
  /** Actions to continue with after success */
  continueActions?: HaapiAction[];
  /** Actions available if form submission fails */
  errorActions?: HaapiAction[];
}

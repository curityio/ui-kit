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
 * Preserves string literal types in a union with `string`.
 * This provides autocomplete for the literal types (T)
 * while still allowing any other string.
 */
export type StringWithAutocomplete<T extends string> = T | (string & {});

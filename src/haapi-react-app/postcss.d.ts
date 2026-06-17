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

declare module 'postcss-extend-rule' {
  import type { Plugin } from 'postcss';
  function postcssExtendRule(opts?: Record<string, unknown>): Plugin;
  export default postcssExtendRule;
}

declare module 'postcss-import' {
  import type { Plugin } from 'postcss';
  function postcssImport(opts?: Record<string, unknown>): Plugin;
  export default postcssImport;
}

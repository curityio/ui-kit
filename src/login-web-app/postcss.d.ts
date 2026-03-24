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

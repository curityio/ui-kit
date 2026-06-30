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

/*
 * Ambient stubs so the example typecheck (`npm run typecheck`) can resolve modules that aren't real
 * dependencies of this docs project.
 *
 * Why stub instead of installing them:
 *  - The third-party UI libs below (antd, icons, recaptcha) are used ONLY inside example playgrounds,
 *    and Sandpack pulls them from a CDN at runtime — they were never docs dependencies. Installing them
 *    just to typecheck would drag their large dependency trees into this project for no runtime benefit.
 *  - The point of the example typecheck is to catch drift in *SDK and catalog* usage (the fixtures in
 *    `examples/catalog.ts` are typed against the SDK). We don't need to type-check the third-party UI
 *    calls — so we declare those modules as `any` and keep the dependency surface small. The trade-off is
 *    that misuse of an antd/recaptcha API isn't caught here (it would surface in the running playground).
 *
 * The `*.module.css` stub covers the CSS-module imports in the SDK source that the examples pull in
 * transitively (e.g. Spinner) — the SDK's own build provides this via its vite client types.
 */

declare module 'antd';
declare module '@ant-design/icons';
declare module '@google-recaptcha/react';

declare module '*.module.css' {
  const classes: { readonly [key: string]: string };
  export default classes;
}

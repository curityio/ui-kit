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
 * Shorthand ambient declarations for the third-party packages a few docs examples import. They keep the
 * SDK's manifest free of doc-only devDependencies: the examples still compile (typed `any` for these
 * packages), and the type-checking that matters — the examples' use of the SDK's own API — stays fully
 * strict via the real `@curity/haapi-react-sdk/*` sources. The docs playground installs the real packages
 * at runtime (see the docgen's KNOWN_DEPS), so misuse still surfaces there.
 *
 * If a real dependency on one of these is hoisted into the workspace by another package, TypeScript
 * resolves its actual types instead — these shorthands are only the fallback.
 */

declare module 'antd';
declare module '@ant-design/icons';
declare module '@google-recaptcha/react';

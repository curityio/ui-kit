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
 * Runtime stand-in for the sandbox-only packages the docs examples import (antd, @ant-design/icons,
 * @google-recaptcha/react): the code playground installs them from the CDN, the workspace doesn't ship
 * them. `vitest.config.ts` aliases those packages here so the docs-examples smoke test can execute the
 * examples; every export just renders its children. Type-checking is unaffected — tsc types the imports
 * from `third-party.d.ts`.
 */

import type { ReactNode } from 'react';

interface StubProps {
  children?: ReactNode;
}
const stub = ({ children }: StubProps): ReactNode => children ?? null;

// antd
export const Button = stub;
export const Card = stub;
export const Select = stub;
export const Tabs = stub;
export const Typography = Object.assign(({ children }: StubProps): ReactNode => children ?? null, {
  Title: stub,
  Text: stub,
  Paragraph: stub,
});
export const List = Object.assign(({ children }: StubProps): ReactNode => children ?? null, { Item: stub });

// @ant-design/icons
export const PhoneOutlined = stub;

// @google-recaptcha/react
export const GoogleReCaptchaProvider = stub;
export const GoogleReCaptchaCheckbox = stub;

export default {};

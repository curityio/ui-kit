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
 * examples. Every export renders its children AND the content hiding in data-driven props (`Tabs`
 * items, `Select` options, `List` renderItem) — otherwise the example logic inside those props would
 * never run under the smoke test. Type-checking is unaffected — tsc types the imports from
 * `third-party.d.ts`.
 */

import { createElement, Fragment, type ReactNode } from 'react';

interface StubProps {
  children?: ReactNode;
  items?: { key?: string | number; label?: ReactNode; children?: ReactNode }[];
  options?: { label?: ReactNode }[];
  dataSource?: unknown[];
  renderItem?: (item: never, index: number) => ReactNode;
}
const stub = ({ children, items, options, dataSource, renderItem }: StubProps): ReactNode =>
  createElement(
    Fragment,
    null,
    children,
    items?.map((item, index) => createElement(Fragment, { key: item.key ?? index }, item.label, item.children)),
    options?.map((option, index) => createElement(Fragment, { key: index }, option.label)),
    renderItem
      ? dataSource?.map((item, index) => createElement(Fragment, { key: index }, renderItem(item as never, index)))
      : null
  );

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

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

import path from 'node:path';
import { fileURLToPath } from 'node:url';
import type { Config } from '@docusaurus/types';
import type * as Preset from '@docusaurus/preset-classic';

// This docs site sits inside the SDK package, next to the component source: `src/haapi-react-sdk/{docs,
// haapi-stepper}`. The API Reference pages are generated as real Markdown from the SDK's TSDoc by
// `scripts/emit-api-reference.mjs` (driven by `api-reference.entries.mjs`), so no build-time plugin is
// needed — Docusaurus gets native headings, anchors and table of contents.

/**
 * Docusaurus site for the HAAPI React SDK docs. It is standalone inside the SDK package
 * (`src/haapi-react-sdk/docs`) — see the README / the plan.
 */
const config: Config = {
  title: 'HAAPI React SDK',
  tagline: 'Interactive HAAPI React SDK documentation',
  url: 'http://localhost',
  baseUrl: '/',
  favicon: 'img/favicon.png',
  onBrokenLinks: 'throw',
  onBrokenAnchors: 'throw',
  onBrokenMarkdownLinks: 'throw',

  presets: [
    [
      'classic',
      {
        docs: {
          // `content/` is fully generated (build-sandpack-sdk, split-docs, emit-api-reference,
          // emit-examples) — kept out of the default `docs/` to avoid a confusing `docs/docs` nesting.
          path: 'content',
          routeBasePath: '/',
          sidebarPath: './sidebars.ts',
        },
        blog: false,
        theme: {
          customCss: './src/css/custom.css',
        },
      } satisfies Preset.Options,
    ],
  ],

  themeConfig: {
    navbar: {
      title: 'HAAPI React SDK',
      logo: {
        alt: 'Curity',
        src: 'img/curity-logo.svg',
        srcDark: 'img/curity-logo-white.svg',
      },
      items: [],
    },
    footer: {
      style: 'light',
      copyright: `Copyright © ${new Date().getFullYear()} Curity AB.`,
    },
    // The API Reference pages nest several levels of TSDoc headings (Customization → dimensions →
    // elements → examples); surface them in the right-hand table of contents.
    tableOfContents: {
      minHeadingLevel: 2,
      maxHeadingLevel: 4,
    },
  } satisfies Preset.ThemeConfig,
};

export default config;

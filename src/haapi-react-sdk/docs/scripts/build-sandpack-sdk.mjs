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

/**
 * Builds the Sandpack virtual-file map for the HAAPI React SDK closure: the SDK's raw source is
 * placed under `/node_modules/@curity/haapi-react-sdk/**` so Sandpack's in-browser bundler resolves
 * the same deep subpath imports the app uses (proven by the resolution spike). The private peers
 * (`@curity/ui-kit-icons`, `@curity/identityserver-haapi-web-driver`) are supplied separately as a
 * tiny stub + a canned-data mock (see `src/sandpack/closure.ts`).
 *
 * Output: `src/generated/sdkSource.json` — a `{ '/node_modules/@curity/haapi-react-sdk/<rel>': code }`
 * map consumed by the Sandpack player. Run via `npm run docs:gen` (wired into pre-docs hooks).
 *
 * The docs site is standalone inside the SDK package (`src/haapi-react-sdk/docs`): the SDK source is
 * bundled from the sibling `../haapi-stepper`, and the example data is owned by `examples/catalog.ts` —
 * neither this script nor the closure reach into the previewer app.
 */

import { readFileSync, readdirSync, writeFileSync, mkdirSync, statSync } from 'node:fs';
import { dirname, join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import postcss from 'postcss';
import postcssImport from 'postcss-import';
import postcssExtend from 'postcss-extend-rule';

const scriptDir = dirname(fileURLToPath(import.meta.url));
// The SDK's component source lives in the sibling `haapi-stepper` directory, next to the docs site under
// the same SDK package (`src/haapi-react-sdk/{docs,haapi-stepper}`).
const sdkRoot = join(scriptDir, '../../haapi-stepper');
const outFile = join(scriptDir, '../src/generated/sdkSource.json');

// Production CSS the previewer loads (`@css/styles.css`), with its `@import` of the ui-kit CSS lib
// inlined into a single stylesheet so the sandbox can serve it as one `/styles.css`.
const appCssFile = join(scriptDir, '../../../haapi-react-app/src/shared/util/css/styles.css');
const stylesOutFile = join(scriptDir, '../src/generated/curityStyles.json');

// The real (prebuilt) @curity/ui-kit-icons bundle, so the SDK's icons match production.
const iconsDistFile = join(scriptDir, '../../../common/icons/dist/index.js');
const iconsOutFile = join(scriptDir, '../src/generated/curityIcons.json');

// The shared example config, served to the sandbox as `/config.ts` so example snippets can
// `import { config } from './config'` instead of declaring it inline.
const exampleConfigFile = join(scriptDir, '../examples/config.ts');
const exampleConfigOutFile = join(scriptDir, '../src/generated/exampleConfig.json');

// The single source of truth for the docs' example data (`examples/catalog.ts`), copied verbatim into
// the sandbox as `/catalog.ts` so the web-driver mock and `/StepSelect.tsx` serve the SAME data the docs
// render. It only imports `@curity/haapi-react-sdk/*` (present in the closure).
const catalogFile = join(scriptDir, '../examples/catalog.ts');
const catalogOutFile = join(scriptDir, '../src/generated/catalog.json');

// The SDK's own README, surfaced as the docs landing/first page (as MDX, so `{@see_example}` markers
// can become live `<DocExample>` playgrounds). Front matter is prepended — single source of truth.
const readmeFile = join(sdkRoot, 'README.md');
// Underscore prefix → Docusaurus ignores this long source; `split-docs.mjs` splits it into `content/overview/`.
const readmeOutFile = join(scriptDir, '../content/_overview.mdx');

// Every docs example file (examples/*.tsx) as { <basename>: <source> }, so MDX pages (the
// README/overview) can mount any of them as a live playground via `<DocExample id="…">`, and the closure
// can serve the preview-scaffolding components (ExamplePreviewer/StepSelect/StepDataDetails/
// AutoSubmitForm) to the sandbox.
const examplesDir = join(scriptDir, '../examples');
const examplesOutFile = join(scriptDir, '../src/generated/examples.json');
// Per-example third-party dependency map (id → { pkg: version }), auto-detected from each example's imports.
const exampleDepsOutFile = join(scriptDir, '../src/generated/exampleDeps.json');

const INCLUDE_EXT = /\.(ts|tsx|css)$/;
const EXCLUDE = [
  /\.d\.ts$/,
  /\.spec\./,
  /\.test\./,
  /[./]config\./,
  /\/tests?\//,
  /\/dist\//,
  /\/node_modules\//,
  /\/coverage\//,
  /setup/i,
];

/** @param {string} dir @param {string[]} acc */
function walk(dir, acc = []) {
  for (const entry of readdirSync(dir)) {
    const full = join(dir, entry);
    if (statSync(full).isDirectory()) {
      if (entry === 'node_modules' || entry === 'dist' || entry === 'coverage') continue;
      walk(full, acc);
    } else {
      acc.push(full);
    }
  }
  return acc;
}

const PKG_PREFIX = '/node_modules/@curity/haapi-react-sdk';

const files = {
  // Minimal package.json so the bundler treats the virtual tree as a package; snippets import deep
  // subpaths (resolved file-by-file with extension fallback), so no `exports` map is needed.
  [`${PKG_PREFIX}/package.json`]: JSON.stringify({ name: '@curity/haapi-react-sdk', version: '0.0.0' }),
};

let count = 0;
for (const full of walk(sdkRoot)) {
  const rel = relative(sdkRoot, full).split('\\').join('/');
  if (!INCLUDE_EXT.test(rel) || EXCLUDE.some(re => re.test(rel))) continue;
  // Snippets import `@curity/haapi-react-sdk/haapi-stepper/<rel>`, so keep the `haapi-stepper/` segment
  // in the virtual path (the SDK package's source root is `haapi-stepper/`).
  files[`${PKG_PREFIX}/haapi-stepper/${rel}`] = readFileSync(full, 'utf8');
  count++;
}

mkdirSync(dirname(outFile), { recursive: true });
writeFileSync(outFile, JSON.stringify(files));
const bytes = Buffer.byteLength(JSON.stringify(files));
console.log(
  `[build-sandpack-sdk] wrote ${count} SDK files (${(bytes / 1024 / 1024).toFixed(2)} MB) to ${relative(process.cwd(), outFile)}`
);

// Process the app styles exactly like the previewer's PostCSS pipeline: inline the `@import` of the
// ui-kit CSS lib (postcss-import) and resolve the `@extend` rules the `.haapi-stepper-*` classes rely
// on (postcss-extend-rule). The result is plain CSS the sandbox can serve as `/styles.css`.
const rawCss = readFileSync(appCssFile, 'utf8');
const processed = await postcss([postcssImport(), postcssExtend()]).process(rawCss, { from: appCssFile });
writeFileSync(stylesOutFile, JSON.stringify(processed.css));
console.log(
  `[build-sandpack-sdk] wrote processed Curity CSS (${(Buffer.byteLength(processed.css) / 1024).toFixed(0)} KB) to ${relative(process.cwd(), stylesOutFile)}`
);

const iconsDist = readFileSync(iconsDistFile, 'utf8');
writeFileSync(iconsOutFile, JSON.stringify(iconsDist));
console.log(
  `[build-sandpack-sdk] wrote @curity/ui-kit-icons bundle (${(Buffer.byteLength(iconsDist) / 1024).toFixed(0)} KB) to ${relative(process.cwd(), iconsOutFile)}`
);

writeFileSync(exampleConfigOutFile, JSON.stringify(readFileSync(exampleConfigFile, 'utf8')));
console.log(`[build-sandpack-sdk] wrote example config to ${relative(process.cwd(), exampleConfigOutFile)}`);

// Copy the example catalog source verbatim — the sandbox serves it as `/catalog.ts`, the single source
// of truth shared by the web-driver mock and the step selector (no evaluation, no duplication).
writeFileSync(catalogOutFile, JSON.stringify(readFileSync(catalogFile, 'utf8')));
console.log(`[build-sandpack-sdk] wrote example catalog to ${relative(process.cwd(), catalogOutFile)}`);

// Third-party npm packages an example may import, and the sandbox deps each pulls in. Detected from the
// example's own imports (below) so every playground — Examples, API Reference, Overview — installs exactly
// what it needs, with no per-example dependency list to maintain.
// antd v5 (not the workspace's v6) — v6 deep-imports `@rc-component/picker/locale/*`, which Sandpack's
// CDN resolver can't fetch; v5 uses `rc-picker` and loads cleanly. The example components (Button, Select,
// Card, List, Typography, Tabs) are API-compatible across both.
const KNOWN_DEPS = {
  antd: { antd: '^5.0.0', '@ant-design/icons': '^5.0.0' },
  '@ant-design/icons': { '@ant-design/icons': '^5.0.0' },
  // `@google-recaptcha/react` imports `@google-recaptcha/core` internally, so the sandbox needs both.
  '@google-recaptcha/react': { '@google-recaptcha/react': '^2.4.2', '@google-recaptcha/core': '^1.1.3' },
};
const importsPackage = (source, pkg) =>
  new RegExp(`from ['"]${pkg.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}(?:['"]|/)`).test(source);

// Emit the examples map first so `<DocExample>` can resolve any id the README references.
const examplesMap = {};
const exampleDeps = {};
for (const f of readdirSync(examplesDir)) {
  if (!f.endsWith('.tsx')) continue;
  const source = readFileSync(join(examplesDir, f), 'utf8').replace(/^﻿?\s*\/\*[\s\S]*?\*\/\s*/, m =>
    /copyright/i.test(m) ? '' : m
  );
  const id = f.replace(/\.tsx$/, '');
  examplesMap[id] = source;
  const deps = {};
  for (const [pkg, versions] of Object.entries(KNOWN_DEPS)) {
    if (importsPackage(source, pkg)) Object.assign(deps, versions);
  }
  if (Object.keys(deps).length) exampleDeps[id] = deps;
}
writeFileSync(examplesOutFile, JSON.stringify(examplesMap));
writeFileSync(exampleDepsOutFile, JSON.stringify(exampleDeps));
console.log(
  `[build-sandpack-sdk] wrote ${Object.keys(examplesMap).length} docs examples (${Object.keys(exampleDeps).length} with extra deps) to ${relative(process.cwd(), examplesOutFile)}`
);

// The overview README is the docs landing at the site root (`slug: /`): the root opens on the overview
// intro, and each `##` section (Previewer, Glossary, …) becomes its own page under the Overview category.
const readmeFrontMatter = '---\nslug: /\nsidebar_position: 1\n---\n\n';
const docExampleImport = "import DocExample from '@site/src/components/DocExample';\n\n";
let readmeBody = readFileSync(readmeFile, 'utf8')
  // Drop repo/npm-only blocks (e.g. "how to run the docs") wrapped in `<!-- docs:skip -->…<!-- /docs:skip -->`
  // so they show in the GitHub/npm README but not inside the docs site itself.
  .replace(/<!--\s*docs:skip\s*-->[\s\S]*?<!--\s*\/docs:skip\s*-->\s*/g, '')
  // A normal markdown link to a docs example file → a live `<DocExample>` playground. Authored as a real
  // link (e.g. `[See example](./docs/examples/DefaultRendering.tsx)`) so it stays clickable in the
  // GitHub-rendered README; the docs upgrade it to a runnable version. Runs before the relative-link
  // strip below, which would otherwise reduce it to plain text.
  .replace(
    /\[([^\]]+)\]\([^)]*examples\/([A-Za-z0-9_]+)\.tsx\)/g,
    (_, label, id) => `<DocExample id="${id}" label="${label.replace(/"/g, '&quot;')}" />`
  )
  // Drop the code fence that immediately precedes a playground: the GitHub README shows the snippet and
  // the link, but in the docs the playground makes the snippet redundant — keep only the playground. The
  // body uses a tempered match (no ``` inside) so it strips only the single adjacent fence, never
  // spanning intervening fences/prose to reach a later playground.
  .replace(/```[^\n]*\n(?:(?!```)[\s\S])*?```\s*(<DocExample\b[^>]*\/>)/g, '$1')
  // The README's other relative links (e.g. `[Step types](./data-access/...)`) point at SDK source files
  // that have no docs page, so rewrite them to the file on GitHub — clickable in both the repo README and
  // the docs site. Resolved relative to the SDK package dir; absolute (https) and intra-page (#) links are
  // left untouched.
  .replace(/\[([^\]]+)\]\((\.\.?\/[^)]*)\)/g, (_, label, rel) => {
    let dir = 'src/haapi-react-sdk/haapi-stepper';
    let rest = rel;
    while (rest.startsWith('../')) {
      dir = dir.split('/').slice(0, -1).join('/');
      rest = rest.slice(3);
    }
    rest = rest.replace(/^\.\//, '');
    return `[${label}](https://github.com/curityio/ui-kit/blob/main/${dir}/${rest})`;
  });
const hasExamples = readmeBody.includes('<DocExample');
mkdirSync(dirname(readmeOutFile), { recursive: true });
writeFileSync(readmeOutFile, readmeFrontMatter + (hasExamples ? docExampleImport : '') + readmeBody);
console.log(`[build-sandpack-sdk] wrote SDK README to ${relative(process.cwd(), readmeOutFile)}`);

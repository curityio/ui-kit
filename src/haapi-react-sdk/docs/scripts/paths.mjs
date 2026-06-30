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
 * The one place that knows the docs workspace layout. Every generator imports its directories from here,
 * so moving a directory (e.g. `content/`, `src/generated/`) is a one-line change in this file instead of
 * a hunt across each script.
 */

import { dirname, join } from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPTS_DIR = dirname(fileURLToPath(import.meta.url));

// ── Roots ────────────────────────────────────────────────────────────────────
/** The docs workspace root (`src/haapi-react-sdk/docs`). */
export const DOCS_ROOT = join(SCRIPTS_DIR, '..');
/** The SDK package root (`src/haapi-react-sdk`) — holds the overview README and the component source. */
export const SDK_ROOT = join(DOCS_ROOT, '..');
/** The SDK component source (`src/haapi-react-sdk/haapi-stepper`) — the TSDoc and types live here. */
export const STEPPER_ROOT = join(SDK_ROOT, 'haapi-stepper');

// ── Sources (authored) ─────────────────────────────────────────────────────────
/** Authored example apps bundled into the playgrounds. */
export const EXAMPLES_DIR = join(DOCS_ROOT, 'examples');
/** The SDK overview README — source for the docs landing page. */
export const README_FILE = join(SDK_ROOT, 'README.md');
/** Production CSS the previewer loads, inlined into the sandbox stylesheet (a sibling workspace). */
export const APP_CSS_FILE = join(SDK_ROOT, '..', 'haapi-react-app/src/shared/util/css/styles.css');
/** The prebuilt `@curity/ui-kit-icons` bundle, so the sandbox icons match production (a sibling workspace). */
export const ICONS_DIST_FILE = join(SDK_ROOT, '..', 'common/icons/dist/index.js');

// ── Results (generated, git-ignored) ─────────────────────────────────────────────
/** Generated Docusaurus content tree (MDX pages). */
export const CONTENT_DIR = join(DOCS_ROOT, 'content');
/** Generated Sandpack/example data the site imports (kept under `src/` so components can import it). */
export const GENERATED_DIR = join(DOCS_ROOT, 'src', 'generated');

// ── GitHub source links ───────────────────────────────────────────────────────
/** Base for linking SDK source files on GitHub (used when rewriting the README's relative links). */
export const GITHUB_BLOB_BASE = 'https://github.com/curityio/ui-kit/blob/main';
/** The README's directory relative to the repo root — the base the README's relative links resolve from. */
export const REPO_README_DIR = 'src/haapi-react-sdk';

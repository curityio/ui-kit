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
 * Checks that Markdown headings in the SDK's TSDoc comments and README use sentence case (first word
 * capitalised, the rest lower-case) while preserving known acronyms (HAAPI, UI, API, …). These headings
 * surface verbatim on the docs pages, so inconsistent casing (`## CUSTOMIZATION`, `## Error Handling`)
 * shows through.
 *
 *   node scripts/check-tsdoc-headings.mjs         # warn: list non-conforming headings (exit 0)
 *   node scripts/check-tsdoc-headings.mjs --fix   # rewrite headings in place
 *
 * Wired into the pre-docs hooks in warn mode so inconsistencies are surfaced without failing the build.
 */

import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const SCRIPT_DIR = path.dirname(fileURLToPath(import.meta.url));
const SDK_ROOT = path.resolve(SCRIPT_DIR, '..', '..');
const ROOTS = [path.join(SDK_ROOT, 'haapi-stepper')];
const FIX = process.argv.includes('--fix');

// Canonical casing for tokens that must not be lower-cased, keyed by their lower-case form.
const ACRONYMS = new Map(
  [
    'HAAPI',
    'UI',
    'UIs',
    'API',
    'APIs',
    'SDK',
    'RFC',
    'URL',
    'URLs',
    'CSS',
    'HTML',
    'JSON',
    'OAuth',
    'OIDC',
    'OTP',
    'TOTP',
    'SMS',
    'QR',
    'BankID',
    'DPoP',
    'PAR',
    'CIBA',
    'DCR',
    'VC',
    'VCs',
    'JWT',
    'TLS',
    'mTLS',
    'HTTP',
    'HTTPS',
    'ID',
    'IDs',
    'TSDoc',
  ].map(token => [token.toLowerCase(), token])
);

/** Case one hyphen-separated segment: preserve acronyms, capitalize only when asked, else lower-case. */
function caseSegment(segment, capitalize) {
  const lower = segment.toLowerCase();
  if (ACRONYMS.has(lower)) {
    return ACRONYMS.get(lower);
  }
  return capitalize ? segment.charAt(0).toUpperCase() + segment.slice(1).toLowerCase() : lower;
}

/**
 * Convert a heading's text to sentence case: capitalize the first word, lower-case the rest, preserve
 * known acronyms (including within hyphenated words, e.g. `Non-HAAPI`), and leave inline code spans
 * (`` `Symbol` ``) untouched since they are identifiers, not prose.
 */
function toSentenceCase(text) {
  let firstWordSeen = false;
  return text
    .split(/(\s+)/)
    .map(token => {
      if (/^\s*$/.test(token)) {
        return token;
      }
      // Inline code is an identifier — never re-case it, but it still counts as a word.
      if (token.includes('`')) {
        firstWordSeen = true;
        return token;
      }
      // Split a word into leading punctuation, the alphanumeric core, and the trailing remainder.
      const match = token.match(/^([^A-Za-z0-9]*)([A-Za-z0-9][A-Za-z0-9'-]*)?([\s\S]*)$/);
      if (!match || !match[2]) {
        return token;
      }
      const [, pre, core, post] = match;
      const cased = core
        .split('-')
        .map((segment, index) => caseSegment(segment, !firstWordSeen && index === 0))
        .join('-');
      firstWordSeen = true;
      return pre + cased + post;
    })
    .join('');
}

// A Markdown heading, optionally inside a TSDoc comment (` * ## Title`). Captures prefix, hashes, title.
const HEADING = /^(\s*\*?\s*)(#{1,6})\s+(.+?)\s*$/;
const isComment = line => /^\s*\*/.test(line);

function collectFiles(dir, acc) {
  for (const dirent of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, dirent.name);
    if (dirent.isDirectory()) {
      if (dirent.name !== 'node_modules') {
        collectFiles(full, acc);
      }
    } else if (/\.(ts|tsx)$/.test(dirent.name) || dirent.name === 'README.md') {
      acc.push(full);
    }
  }
  return acc;
}

const files = ROOTS.flatMap(root => (fs.existsSync(root) ? collectFiles(root, []) : []));
// The SDK README now lives at the package root (an overview of the whole SDK, not just the stepper). It
// surfaces verbatim on the docs Overview pages, so include it in the same heading-casing check.
const sdkReadme = path.join(SDK_ROOT, 'README.md');
if (fs.existsSync(sdkReadme)) {
  files.push(sdkReadme);
}
let warnings = 0;
let fixed = 0;

for (const file of files) {
  const isMarkdown = file.endsWith('.md');
  const lines = fs.readFileSync(file, 'utf8').split('\n');
  let changed = false;

  const next = lines.map(line => {
    const match = line.match(HEADING);
    // In source files only treat headings inside comments; in Markdown, any heading line.
    if (!match || (!isMarkdown && !isComment(line))) {
      return line;
    }
    const [, prefix, hashes, title] = match;
    const expected = toSentenceCase(title);
    if (expected === title) {
      return line;
    }
    warnings += 1;
    const rel = path.relative(SDK_ROOT, file);
    if (FIX) {
      fixed += 1;
      changed = true;
      return `${prefix}${hashes} ${expected}`;
    }
    // eslint-disable-next-line no-console
    console.warn(`${rel}: "${title}" → "${expected}"`);
    return line;
  });

  if (changed) {
    fs.writeFileSync(file, next.join('\n'));
  }
}

// eslint-disable-next-line no-console
console.log(
  FIX
    ? `[check-tsdoc-headings] fixed ${fixed} heading(s) in ${files.length} files.`
    : `[check-tsdoc-headings] ${warnings} non-conforming heading(s)${warnings ? ' — run with --fix to normalize' : ''}.`
);

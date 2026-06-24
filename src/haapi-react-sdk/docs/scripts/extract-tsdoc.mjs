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
 * Extracts an SDK export's TSDoc into Markdown for the API Reference pages. Returns an ordered list of
 * blocks — prose (the leading comment + `@description`/`@example` text) and example references (the
 * `{@see_example <path> <label>}` markers) — and renders them to MDX: prose verbatim, each marker as a
 * `<DocExample id=… />` (resolved at runtime from the generated examples map) in the snippet's place.
 *
 * `emit-api-reference.mjs` writes the result straight into `docs/api-reference/**`, so the pages are
 * real Markdown — Docusaurus builds the right-hand table of contents and heading anchors natively.
 */

import ts from 'typescript';
import fs from 'node:fs';
import path from 'node:path';

const INLINE_TAG = /\{@\w+[^}]*\}/g;
// An inline `{@see_example <path> <label>}` marker placed right under a code snippet (brace-wrapped so it
// stays embedded in the description instead of terminating it the way a block tag would).
const SEE_EXAMPLE = /\{@see_example\s+([^}]+)\}/g;
// A TSDoc `{@link target | text}` (also `{@link target text}` / `{@link target}`) symbol reference.
const LINK_TAG = /\{@link\s+([^}]+)\}/g;

/**
 * Render a `{@link target | text}` tag to Markdown. When `resolveLink(symbol)` returns a docs URL the tag
 * becomes a real link; otherwise the display text is kept as inline code so the reference stays visible
 * instead of being dropped by the inline-tag strip.
 */
function renderLinkTag(body, resolveLink) {
  const trimmed = body.trim();
  let target = trimmed;
  let label = trimmed;
  const pipe = trimmed.indexOf('|');
  if (pipe !== -1) {
    target = trimmed.slice(0, pipe).trim();
    label = trimmed.slice(pipe + 1).trim() || target;
  } else {
    const space = trimmed.search(/\s/);
    if (space !== -1) {
      target = trimmed.slice(0, space);
      label = trimmed.slice(space + 1).trim();
    }
  }
  // Resolve on the bare symbol, dropping any `.member`/`#member` suffix.
  const url = resolveLink(target.split(/[.#]/)[0]);
  return url ? `[${label}](${url})` : `\`${label}\``;
}

/** A marker target is an example when it points to a `*.tsx` file under `examples/`. */
const isExampleLink = target => target.endsWith('.tsx') && target.includes('/examples/');

/**
 * A `{@see_example <path> <label>}` body → `{ id, label }` (the `*.tsx` token gives the example id — its
 * base name — the rest is the label). Returns `null` when no example path is present. The path itself is
 * never read here: `<DocExample id>` resolves the source from the generated examples map at runtime.
 */
function parseExampleRef(content) {
  const tokens = content.trim().split(/\s+/);
  const target = tokens.find(isExampleLink);
  if (!target) {
    return null;
  }
  const id = path.basename(target, '.tsx');
  const label = tokens
    .filter(token => token !== target)
    .join(' ')
    .trim();
  return { id, label: label || id };
}

/** Every `{@see_example …}` marker in `text` → `{ id, label }`. */
function exampleMarkers(text) {
  const refs = [];
  for (const [, content] of text.matchAll(SEE_EXAMPLE)) {
    const ref = parseExampleRef(content);
    if (ref) {
      refs.push(ref);
    }
  }
  return refs;
}

/**
 * Build an ordered `blocks` list for the named export in `file`: `{ type: 'prose', markdown }` and
 * `{ type: 'example', id, label }`. Each `{@see_example}` marker becomes an example block in place; the
 * snippet immediately above it (the fenced code the marker documents) is dropped, while other fences are
 * kept as illustrative code. Headings are down-shifted one level so the TSDoc's top heading sits under
 * the page H1.
 */
export function extractDocBlocks(file, exportName, resolveLink = () => null) {
  const doc = readDoc(file, exportName);
  if (!doc) {
    return [];
  }

  const proseParts = [ts.getTextOfJSDocComment(doc.jsDoc.comment)];
  for (const tag of doc.jsDoc.tags ?? []) {
    const tagName = tag.tagName?.text;
    if (tagName === 'description' || tagName === 'example') {
      proseParts.push(ts.getTextOfJSDocComment(tag.comment));
    }
  }
  const prose = proseParts.filter(Boolean).join('\n\n');

  const cleanProse = segment =>
    segment
      // Resolve `{@link Symbol}` references first, before the inline-tag strip removes them.
      .replace(LINK_TAG, (_, body) => renderLinkTag(body, resolveLink))
      .replace(INLINE_TAG, '')
      // Relative markdown links (`[x](./…)` / `[x](../…)`) point at SDK source or sibling docs files that
      // don't resolve as docs routes — they'd fail the build's `onBrokenLinks: throw`. Strip them to plain
      // text (keep the label); absolute (https) and intra-page (#) links are left intact.
      .replace(/\[([^\]]+)\]\(\.\.?\/[^)]*\)/g, '$1')
      .replace(/^(#{1,6})(?=\s)/gm, hashes => (hashes.length < 6 ? '#'.repeat(hashes.length + 1) : hashes))
      .replace(/\n{3,}/g, '\n\n')
      .trim();

  const blocks = [];
  const rendered = new Set();
  const addExample = ref => {
    if (ref && !rendered.has(ref.id)) {
      rendered.add(ref.id);
      blocks.push({ type: 'example', id: ref.id, label: ref.label });
    }
  };

  let cursor = 0;
  const pushProse = text => {
    const markdown = cleanProse(text);
    if (markdown) {
      blocks.push({ type: 'prose', markdown });
    }
  };
  // A `{@see_example}` marker sits right after the snippet it documents; that snippet's fenced code is
  // removed (the example replaces it) while earlier fences are kept. The body forbids an inner ``` so the
  // match is only the final fence, not a span across several.
  const stripTrailingFence = text => text.replace(/```[^\n]*\n(?:(?!```)[\s\S])*```\s*$/, '');
  for (const match of prose.matchAll(SEE_EXAMPLE)) {
    pushProse(stripTrailingFence(prose.slice(cursor, match.index)));
    cursor = match.index + match[0].length;
    addExample(parseExampleRef(match[1]));
  }
  pushProse(prose.slice(cursor));

  // Markers that live in tags the prose doesn't include (e.g. `@param`/`@returns`) aren't positioned
  // inline above — append them at the end so they're not lost. Scans the raw comment.
  exampleMarkers(doc.raw).forEach(addExample);

  return blocks;
}

/** Render extracted blocks to an MDX body: prose verbatim, examples as `<DocExample>` tags. */
export function blocksToMdx(blocks) {
  return blocks
    .map(block =>
      block.type === 'prose'
        ? block.markdown
        : `<DocExample id="${block.id}" label="${block.label.replace(/"/g, '&quot;')}" />`
    )
    .join('\n\n');
}

/** Whether any block is an example (so the page needs the `DocExample` import). */
export const hasExamples = blocks => blocks.some(block => block.type === 'example');

/** The JSDoc node of the named export in `file` plus its raw comment text, or `null`. */
function readDoc(file, exportName) {
  const source = fs.readFileSync(file, 'utf8');
  const sourceFile = ts.createSourceFile(file, source, ts.ScriptTarget.Latest, true, ts.ScriptKind.TSX);

  let found = null;

  const declares = node => {
    if (ts.isVariableStatement(node)) {
      return node.declarationList.declarations.some(d => ts.isIdentifier(d.name) && d.name.text === exportName);
    }
    if (
      ts.isFunctionDeclaration(node) ||
      ts.isClassDeclaration(node) ||
      ts.isInterfaceDeclaration(node) ||
      ts.isTypeAliasDeclaration(node)
    ) {
      return node.name?.text === exportName;
    }
    return false;
  };

  const visit = node => {
    if (found) {
      return;
    }
    if (declares(node)) {
      const jsDoc = ts.getJSDocCommentsAndTags(node).find(ts.isJSDoc);
      if (jsDoc) {
        found = { jsDoc, raw: jsDoc.getText(sourceFile) };
      }
      return;
    }
    ts.forEachChild(node, visit);
  };
  visit(sourceFile);

  return found;
}

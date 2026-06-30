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

import SandpackPlayer from './SandpackPlayer';
import { haapiClosureFiles } from '../sandpack/closure';
import examples from '../generated/examples.json';
import exampleDeps from '../generated/exampleDeps.json';

interface DocExampleProps {
  /**
   * The example's file basename under `examples/` (e.g. `DefaultRendering`), used to look up its source
   * in the generated examples map. Resolved by the generators from the *path* an author references — it is
   * not written by hand (see the component doc below).
   */
  id: string;
  /** Accessible label for the playground section. */
  label?: string;
  /**
   * Extra npm dependencies to install in the sandbox, beyond react/react-dom and the SDK closure.
   * Used by examples that pull in a third-party library (e.g. the captcha example's
   * `@google-recaptcha/react`).
   */
  dependencies?: Record<string, string>;
}

/**
 * Mounts a docs example (`examples/<id>.tsx`) as a live Sandpack playground over the shared HAAPI sandbox
 * closure.
 *
 * This is an internal mount point emitted **only by the docs generators** — it is never authored by hand,
 * and the `id` is not part of the authoring surface. Sources reference examples by *path*:
 *   - TSDoc: `{@see_example <path> <label>}` markers → `emit-api-reference`
 *   - README / markdown: `[<label>](…/examples/<name>.tsx)` links → `build-sandpack-sdk`
 * Each generator resolves that path to the example's `id` (its file basename) and emits `<DocExample id=…>`.
 */
export default function DocExample({ id, label, dependencies }: DocExampleProps) {
  const code = (examples as Record<string, string>)[id];

  if (!code) {
    // eslint-disable-next-line no-console
    console.warn(`[DocExample] unknown example id: ${id}`);
    return null;
  }

  // Third-party deps auto-detected from the example's imports, plus any explicit override.
  const autoDeps = (exampleDeps as Record<string, Record<string, string>>)[id] ?? {};

  return (
    <section aria-label={label} style={{ marginBottom: '2rem' }}>
      <SandpackPlayer
        files={{ ...haapiClosureFiles, '/App.tsx': code }}
        dependencies={{ react: '^19.0.0', 'react-dom': '^19.0.0', ...autoDeps, ...dependencies }}
        activeFile="/App.tsx"
      />
    </section>
  );
}

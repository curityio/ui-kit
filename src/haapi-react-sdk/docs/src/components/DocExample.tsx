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
  /** Base name of an example file under `examples/` (e.g. `DefaultRendering`). */
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
 * Mounts a docs example (`examples/<id>.tsx`) as a live Sandpack playground. Used by any MDX page —
 * hand-written (Overview) or generated (Examples, and the API Reference pages, where the generator emits
 * a `<DocExample>` for each `{@see_example}` marker) — all reusing the shared HAAPI sandbox closure.
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

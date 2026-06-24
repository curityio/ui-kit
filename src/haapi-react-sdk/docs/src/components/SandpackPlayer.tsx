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

import BrowserOnly from '@docusaurus/BrowserOnly';
import type { SandpackFiles } from '@codesandbox/sandpack-react';

interface SandpackPlayerProps {
  /** Virtual files for the sandbox (snippet, `/App.tsx`, virtual `node_modules`, mocks). */
  files: SandpackFiles;
  /** npm deps resolved from the CDN (react/react-dom come from the template). */
  dependencies?: Record<string, string>;
  /** Which file the editor opens on. */
  activeFile?: string;
  /** Editor/preview height in px. Defaults to 480; taller examples (e.g. the step-catalog preview) pass more. */
  editorHeight?: number;
}

/**
 * Renders a CodeSandbox Sandpack playground. Sandpack relies on browser APIs, so it is mounted
 * client-only via Docusaurus `BrowserOnly` (and the library is `require`d lazily to avoid SSR).
 */
export default function SandpackPlayer({ files, dependencies = {}, activeFile, editorHeight }: SandpackPlayerProps) {
  // Previewer-wrapped examples stack a step selector + step-data panel around the step, so they need
  // more height than a plain example to show the tallest step (e.g. the authenticator selector).
  const appFile = files['/App.tsx'];
  const appCode = typeof appFile === 'string' ? appFile : (appFile?.code ?? '');
  const height = editorHeight ?? (appCode.includes('ExamplePreviewer') ? 720 : 480);
  return (
    <BrowserOnly fallback={<div>Loading playground…</div>}>
      {() => {
        // eslint-disable-next-line @typescript-eslint/no-require-imports
        const { Sandpack } = require('@codesandbox/sandpack-react') as typeof import('@codesandbox/sandpack-react');
        return (
          <>
            <Sandpack
              template="react-ts"
              theme="auto"
              files={files}
              customSetup={{ dependencies }}
              options={{
                activeFile,
                // Only the snippet is shown as a tab; the SDK closure, mocks, config and styles stay hidden.
                visibleFiles: activeFile ? [activeFile] : undefined,
                editorHeight: height,
                showLineNumbers: true,
              }}
            />
            <p
              className="haapi-playground-hint"
              style={{ margin: '0.5rem 0 0', fontSize: '0.85rem', opacity: 0.75 }}
            >
              ✏️ Interactive — edit the code and the preview updates live.
            </p>
          </>
        );
      }}
    </BrowserOnly>
  );
}

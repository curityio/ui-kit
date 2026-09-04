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

import { fileURLToPath } from 'node:url';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// Sandbox-only packages the docs examples import (installed by the code playground, not the workspace):
// resolve them to a stub so Vite can transform the examples; `DocsExamples.spec.tsx` mocks the exports.
const sandboxPackageStub = fileURLToPath(new URL('./docs/_harness/sandbox-package-stub.ts', import.meta.url));

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      antd: sandboxPackageStub,
      '@ant-design/icons': sandboxPackageStub,
      '@google-recaptcha/react': sandboxPackageStub,
    },
  },
  test: {
    globals: true, // Enables global `describe`, `it`, etc.
    environment: 'jsdom', // Simulates a browser environment
    setupFiles: './setupTests.ts',
  },
});

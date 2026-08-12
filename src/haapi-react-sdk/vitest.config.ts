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

import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';

// https://vitest.dev/config/
export default defineConfig({
  plugins: [react()],
  test: {
    globals: true, // Enables global `describe`, `it`, etc.
    environment: 'jsdom', // Simulates a browser environment
    setupFiles: './setupTests.ts',
  },
});

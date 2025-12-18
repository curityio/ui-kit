/// <reference types="vitest" />
import { defineConfig } from 'vitest/config'; // Changed from 'vite' to 'vitest/config' for type support
import react from '@vitejs/plugin-react';
import { resolve } from 'path';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [react(), tsconfigPaths()],
  resolve: {
    alias: {
      '@components': resolve(__dirname, 'src/components'),
      '@': resolve(__dirname, 'src'),
    },
  },
  // You can likely remove the 'build' block here since vitest doesn't use it,
  // but keeping it doesn't hurt. The critical part is below:

  test: {
    globals: true, // Fixes "ReferenceError: expect is not defined"
    environment: 'jsdom', // Fixes "ReferenceError: document is not defined"
    setupFiles: ['./setupTests.ts'], // Ensures your setup file runs before tests
    css: true, // Optional: Processes CSS if your components rely on it
  },
});

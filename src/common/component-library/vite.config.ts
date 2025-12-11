import react from '@vitejs/plugin-react';
import { defineConfig } from 'vitest/config';
import path from 'path';
import basicSsl from '@vitejs/plugin-basic-ssl';

// https://vitejs.dev/config/
export default defineConfig({
  base: './',
  server: {
    host: true,
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@components': path.resolve(__dirname, './src/components'),
    },
  },
  plugins: [react(), basicSsl()],
  test: {
    globals: true, // Enables global `describe`, `it`, etc.
    environment: 'jsdom', // Simulates a browser environment
    setupFiles: './setupTests.ts',
  },
});

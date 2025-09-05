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
      '@auth': path.resolve(__dirname, './src/auth'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@util': path.resolve(__dirname, './src/util'),
      '@packages': path.resolve(__dirname, './src/packages'),
      '@icons': path.resolve(__dirname, 'src/packages/icons'),
      '@css': path.resolve(__dirname, 'src/packages/css'),
    },
  },
  plugins: [react(), basicSsl()],
  test: {
    globals: true, // Enables global `describe`, `it`, etc.
    environment: 'jsdom', // Simulates a browser environment
    setupFiles: './setupTests.ts',
  },
  optimizeDeps: {
    exclude: ['@curity-internal/css'],
  },
});

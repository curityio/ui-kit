/// <reference types="vitest" />
import basicSsl from '@vitejs/plugin-basic-ssl';
import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import postcssExtendRule from 'postcss-extend-rule';
import postcssImport from 'postcss-import';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
  plugins: [react(), basicSsl()],
  base: './',
  css: {
    postcss: {
      plugins: [postcssImport(), postcssExtendRule()],
    },
  },
  server: {
    port: 8443,
    proxy: {
      // Expects Identity Server to be listening on https://localhost:9443
      // Proxy requests that are not for paths/files on this project (using negative lookahead on the regex)
      '^/(?!($|@|\\?|src/|node_modules/|fonts/|images/|[^\\.]+\\.html))': {
        target: 'https://localhost:9443',
        secure: false,
      },
    },
  },
  build: {
    rollupOptions: {
      input: ['index.html', 'loader.vm.html'],
    },
  },
  test: {
    globals: true, // Enables global `describe`, `it`, etc.
    environment: 'jsdom', // Simulates a browser environment
    setupFiles: './setupTests.ts',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@styles': path.resolve(__dirname, './src/shared/util/styles'),
      '@util': path.resolve(__dirname, './src/util'),
      '@packages': path.resolve(__dirname, './src/shared/packages'),
      '@icons': path.resolve(__dirname, './src/shared/ui/icons'),
      '@css': path.resolve(__dirname, './src/shared/util/css'),
    },
  },
});

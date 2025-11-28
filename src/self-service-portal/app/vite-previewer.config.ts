/*
 * Copyright (C) 2025 Curity AB. All rights reserved.
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
import path from 'path';

const previewerPlugin = () => ({
    name: 'previewer-plugin',
    configureServer(server) {
        server.middlewares.use((req, res, next) => {
            if(req.url.startsWith('/previewer/') && !req.url.includes('.')) {
                req.url = '/previewer.html';
            }
            next();
        })
    },
})

// https://vitejs.dev/config/
export default defineConfig({
  base: '/',
  server: {
    host: true,
    open: '/previewer',
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
      '@auth': path.resolve(__dirname, './src/auth'),
      '@shared': path.resolve(__dirname, './src/shared'),
      '@styles': path.resolve(__dirname, './src/styles'),
      '@util': path.resolve(__dirname, './src/util'),
    },
  },
  plugins: [react(), previewerPlugin()],
  test: {
    globals: true, // Enables global `describe`, `it`, etc.
    environment: 'jsdom', // Simulates a browser environment
    setupFiles: './setupTests.ts',
  },
});

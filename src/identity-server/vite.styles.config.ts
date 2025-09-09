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


/* Bundle CSS */

import { defineConfig } from "vite";
import path from "path";
import { createSharedPlugins } from "./vite.plugins";

const OUTPUT_DIR = path.resolve(__dirname, "build/curity/");

export default defineConfig({
  plugins: createSharedPlugins(),
  build: {
    outDir: OUTPUT_DIR,
    cssCodeSplit: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: Infinity,
    assetsInlineLimit: 0,
    rollupOptions: {
      input: {
        styles: path.resolve(__dirname, "styles/index.js"),
      },
      output: {
        entryFileNames: "webroot/assets/js/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.names?.some((n) => n.endsWith(".css"))) {
            return "webroot/assets/css/main.css";
          }
          return "webroot/assets/[ext]/[name][extname]";
        },
      },
    },
  },
});

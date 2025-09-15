// src/identity-server/vite.config.ts
import { defineConfig } from "vite";
import path from "path";
import { createSharedPlugins } from "./vite.plugins";

const OUTPUT_DIR = path.resolve(__dirname, "build/curity/");

export default defineConfig(({ mode }) => {
  const shared = {
    plugins: createSharedPlugins(),
    build: {
      outDir: OUTPUT_DIR,
      cssCodeSplit: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: Infinity,
      assetsInlineLimit: 0,
    },
  };

  if (mode === "styles") {
    return {
      ...shared,
      build: {
        ...shared.build,
        emptyOutDir: true, // clean once
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
    };
  }

  if (mode === "ui") {
    return {
      ...shared,
      build: {
        ...shared.build,
        emptyOutDir: false, // don't wipe styles
        lib: {
          entry: path.resolve(__dirname, "scripts/curity-ui.js"),
          name: "curityui",
          formats: ["iife"],
          fileName: () => "webroot/assets/js/curity-ui.js",
        },
      },
    };
  }

  // Default: fail loudly so it's clear a mode is required
  throw new Error(
    'Set a mode: use "--mode styles" or "--mode ui" (see package.json scripts).'
  );
});


import { defineConfig } from "vite";
import path from "path";
import { createSharedPlugins } from "./vite.plugins";

const OUTPUT_DIR = path.resolve(__dirname, "build/curity/");

const shouldSilence = (msg: string) =>
  msg.includes("didn't resolve at build time") &&
  (msg.includes("assets/"));

export default defineConfig(({ mode }) => {
  const shared = {
    plugins: createSharedPlugins(),

    customLogger: {
      hasWarned: false,
      hasErrorLogged: false,
      clearScreen: () => {},
      info(msg: string | any) { console.info(msg); },
      warn(msg: string | any, opts?: any) {
        if (typeof msg === "string" && shouldSilence(msg)) return;
        console.warn(msg);
      },
      warnOnce(msg: string | any, opts?: any) {
        if (typeof msg === "string" && shouldSilence(msg)) return;
        console.warn(msg);
      },
      error(msg: string | any, opts?: any) { console.error(msg); }
    },
    build: {
      outDir: OUTPUT_DIR,
      cssCodeSplit: false,
      reportCompressedSize: false,
      chunkSizeWarningLimit: Infinity,
      assetsInlineLimit: 0,

      rollupOptions: {
        onwarn(warning: any, warn: (warning: any) => void) {
          const text = typeof warning.message === "string" ? warning.message : "";
          if (
            text.includes("assets/fonts") ||
            text.includes("assets/images") ||
            (text.includes("referenced in") && text.includes("didn't resolve at build time"))
          ) {
            return;
          }
          warn(warning);
        },
      },
    },
  };

  if (mode === "styles") {
    return {
      ...shared,
      build: {
        ...shared.build,
        emptyOutDir: false,
        rollupOptions: {
          ...shared.build.rollupOptions,
          input: { styles: path.resolve(__dirname, "styles/index.js") },
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
      plugins: [
        ...shared.plugins,
        {
          name: "wrap-commonjs-as-iife",
          generateBundle(_, bundle) {
            for (const fileName in bundle) {
              const chunk = bundle[fileName];
              if (chunk.type === "chunk" && fileName.includes("curity-ui")) {
                // Vite's lib mode with CommonJS source produces:
                chunk.code = chunk.code
                  .replace(/^\(function\(\)\{\"use strict\";/, "var curityui=(function(){")
                  .replace("module.exports=", "return ");
              }
            }
          },
        },
      ],
      build: {
        ...shared.build,
        emptyOutDir: false,
        lib: {
          entry: path.resolve(__dirname, "scripts/curity-ui.js"),
          name: "curityui",
          formats: ["iife"],
          fileName: () => "webroot/assets/js/curity-ui.js",
        },
        rollupOptions: {
          ...shared.build.rollupOptions,
          external: ["jQuery"],
          output: {
            globals: {
              jQuery: "jQuery",
            },
          },
        },
      },
    };
  }

  throw new Error('Set a mode: use "--mode styles" or "--mode ui" (see package.json scripts).');
});

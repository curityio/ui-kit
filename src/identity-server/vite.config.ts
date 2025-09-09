import { defineConfig, normalizePath, type PluginOption } from "vite";
import fs from "fs";
import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";

const OUTPUT_DIR = path.resolve(__dirname, "build/curity/");


export default defineConfig({
  root: ".",

  build: {
    outDir: OUTPUT_DIR,
    emptyOutDir: true,
    cssCodeSplit: false,
    reportCompressedSize: false,
    chunkSizeWarningLimit: Infinity,
    assetsInlineLimit: 0,

    assetsInclude: (file) => {
      return !/\.(png|jpe?g|gif|svg|webp)$/.test(file);
    },

    rollupOptions: {
      input: {
        "curity-ui": path.resolve(__dirname, "scripts/curity-ui.js"),
        styles: path.resolve(__dirname, "styles/index.js"),
      },
      output: {
        entryFileNames: "webroot/assets/js/[name].js",
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.endsWith(".css")) {
            return "webroot/assets/css/main.css";
          }

          return "webroot/assets/[ext]/[name][extname]";
        },
      },
    },
  },

  plugins: [
    {
      name: "preserve-css-url-references",
      transform(code, id) {
        if (!id.endsWith(".css")) return null;

        return {
          code,
          map: null,
        };
      },
    },
    {
      name: "remove-temp-files",
      closeBundle: {
        sequential: true,
        order: "post",
        handler() {
          const stylesJsPath = path.join(OUTPUT_DIR, "assets/js/styles.js");
          if (fs.existsSync(stylesJsPath)) {
            fs.unlinkSync(stylesJsPath);
            console.log(
              "\x1b[32m%s\x1b[0m",
              "✔︎ Cleanup temporary styles.js file"
            );
          }

          const imgFormats = ["png", "jpg", "jpeg", "gif", "svg"];
          for (const format of imgFormats) {
            const imgDir = path.join(OUTPUT_DIR, `assets/${format}`);
            if (fs.existsSync(imgDir)) {
              fs.rmSync(imgDir, { recursive: true, force: true });
              console.log(
                "\x1b[32m%s\x1b[0m",
                `✔︎ Cleanup extracted image files`
              );
            }
          }

          console.log(
            "\x1b[32m%s\x1b[0m",
            `✔︎ Copied jquery.min.js to build folder`
          );
        },
      },
    } as PluginOption,

    viteStaticCopy({
      targets: [
        {
          src: "./images/*",
          dest: "webroot/assets/images",
        },
        {
          src: "./messages/overrides/*",
          dest: "webroot/messages/overrides",
        },
        {
          src: "./messages/template-areas/*",
          dest: "webroot/messages/template-areas",
        },
        {
          src: "./templates/overrides/*",
          dest: "webroot/templates/overrides",
        },
        {
          src: "./templates/template-areas/*",
          dest: "webroot/templates/template-areas",
        },
        {
          src: "./node_modules/jquery/dist/jquery.min.js",
          dest: "webroot/assets/js/lib",
        },
        {
          src: normalizePath(
            path.resolve(__dirname, "../common/assets/fonts/*")
          ),
          dest: "webroot/assets/fonts",
        },
      ],
    }) as PluginOption,
  ],
});

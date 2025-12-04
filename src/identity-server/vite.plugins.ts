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


/* Copy assets to the build directory using Vite plugin viteStaticCopy */


import path from "path";
import { viteStaticCopy } from "vite-plugin-static-copy";
import fs from "fs";
import { normalizePath, type PluginOption } from "vite";

const OUTPUT_DIR = path.resolve(__dirname, "build/");

export function createSharedPlugins(): PluginOption[] {
  return [
    viteStaticCopy({
      targets: [
        {
          src: "./images/*",
          dest: "webroot/assets/images",
        },
        {
          src: "./messages/overrides/*",
          dest: "messages/overrides",
        },
        {
          src: "./messages/template-areas/*",
          dest: "messages/template-areas",
        },
        {
          src: "./templates/overrides/*",
          dest: "templates/overrides",
        },
        {
          src: "./templates/template-areas/*",
          dest: "templates/template-areas",
        },
        {
          src: normalizePath(
            path.resolve(__dirname, "../common/css/lib/src/curity-theme.css")
          ),
          dest: "webroot/assets/css",
        },
        {
          src: normalizePath(
            path.resolve(__dirname, "../../node_modules/jquery/dist/jquery.min.js")
          ),
          dest: "webroot/assets/js/lib",
          rename: "jquery-3.5.1.min.js"
        },
        {
          src: normalizePath(
            path.resolve(__dirname, "../common/assets/fonts/*")
          ),
          dest: "webroot/assets/fonts",
        },
      ],
    }) as PluginOption,
    {
      name: "remove-temp-files",
      closeBundle: {
        sequential: true,
        order: "post",
        handler() {
          const stylesJsPath = path.join(OUTPUT_DIR, "webroot/assets/js/styles.js");
          if (fs.existsSync(stylesJsPath)) {
            fs.unlinkSync(stylesJsPath);
            console.log(
              "\x1b[32m%s\x1b[0m",
              "✔︎ Cleanup temporary styles.js file"
            );
          }

          const imgFormats = ["png", "jpg", "jpeg", "gif", "svg"];
          for (const format of imgFormats) {
            const imgDir = path.join(OUTPUT_DIR, `webroot/assets/${format}`);
            if (fs.existsSync(imgDir)) {
              fs.rmSync(imgDir, { recursive: true, force: true });
              console.log(
                "\x1b[32m%s\x1b[0m",
                `✔︎ Cleanup extracted ${format} image files`
              );
            }
          }

          console.log(
            "\x1b[32m%s\x1b[0m",
            `✔︎ Copied jquery-3.5.1.min.js to build folder`
          );
        },
      },
    } as PluginOption,
  ];
}

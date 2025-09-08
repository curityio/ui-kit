import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import dts from "rollup-plugin-dts";
import { terser } from "rollup-plugin-terser";

const isSSP = process.env.BUILD_VARIANT === "ssp";

export default defineConfig([
  {
    input: isSSP ? "src-ssp/index.ts" : "src/index.ts",
    output: {
      file: isSSP ? "dist-ssp/index.js" : "dist/index.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: isSSP ? "./tsconfig.ssp.json" : "./tsconfig.json",
        sourceMap: true,
        inlineSources: true,
      }),
      terser(),
    ],
  },
]);

import commonjs from "@rollup/plugin-commonjs";
import resolve from "@rollup/plugin-node-resolve";
import typescript from "@rollup/plugin-typescript";
import { defineConfig } from "rollup";
import { terser } from "rollup-plugin-terser";

export default defineConfig([
  {
    input: "src/index.ts",
    output: {
      file: "dist/index.js",
      format: "esm",
      sourcemap: true,
    },
    plugins: [
      resolve(),
      commonjs(),
      typescript({
        tsconfig: "./tsconfig.json",
        sourceMap: true,
        inlineSources: true,
      }),
      terser(),
    ],
  },
]);

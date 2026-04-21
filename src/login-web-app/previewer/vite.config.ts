import react from '@vitejs/plugin-react';
import * as path from 'node:path';
import postcssExtendRule from 'postcss-extend-rule';
import postcssImport from 'postcss-import';
import { defineConfig } from 'vite';

// https://vite.dev/config/
export default defineConfig({
    plugins: [react()],
    publicDir: path.resolve(__dirname, '../public'),
    css: {
        postcss: {
            plugins: [postcssImport(), postcssExtendRule()],
        },
    },
    resolve: {
        alias: {
            '@css': path.resolve(__dirname, '../src/shared/util/css'),
        },
    },
});

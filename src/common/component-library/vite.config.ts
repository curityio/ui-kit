import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import dts from 'vite-plugin-dts';
import tsconfigPaths from 'vite-tsconfig-paths';
import { resolve } from 'path';

export default defineConfig({
  plugins: [
    react(),
    tsconfigPaths(),
    // Declaration-file generation is type-only and not needed for runtime previews
    // (e.g. the StackBlitz previewer boot). Skip it when SKIP_DTS is set to speed up the build.
    ...(process.env.SKIP_DTS
      ? []
      : [
          dts({
            insertTypesEntry: true,
            tsconfigPath: './tsconfig.app.json',
            rollupTypes: true,
          }),
        ]),
  ],
  server: {
    open: false,
    port: 5175,
  },
  build: {
    lib: {
      entry: resolve(__dirname, 'src/index.ts'),
      name: 'CurityComponentLibrary',
      fileName: 'component-library',
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react-router'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
          'react-router': 'ReactRouter',
        },
      },
    },
  },
});

import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    open: false,
    port: 5174,
  },
  build: {
    minify: true,
    target: 'esnext',
    rollupOptions: {
      output: {
        entryFileNames: `[name].js`,
        chunkFileNames: `[name].js`,
        assetFileNames: `[name].[ext]`,
      },
    },
  },
})

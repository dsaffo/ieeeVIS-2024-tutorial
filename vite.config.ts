import { defineConfig, normalizePath } from 'vite'

export default defineConfig({
  worker: {
    format: 'es',
  },
  server: {
    hmr: true
  }
})

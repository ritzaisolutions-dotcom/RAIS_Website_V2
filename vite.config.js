import { defineConfig } from 'vite'

export default defineConfig({
  root: 'html files',
  publicDir: '../',
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: '../dist',
    emptyOutDir: true
  }
})

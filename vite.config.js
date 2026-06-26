import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        impressum: resolve(__dirname, 'impressum.html'),
        datenschutz: resolve(__dirname, 'datenschutz.html')
      }
    }
  }
})

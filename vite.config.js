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
        datenschutz: resolve(__dirname, 'datenschutz.html'),
        aqut: resolve(__dirname, 'aqut.html'),
        referenzen: resolve(__dirname, 'referenzen.html'),
        zusammenarbeit: resolve(__dirname, 'zusammenarbeit.html'),
        ueberUns: resolve(__dirname, 'ueber-uns.html'),
        persoenlichkeit: resolve(__dirname, 'persoenlichkeit.html')
      }
    }
  }
})

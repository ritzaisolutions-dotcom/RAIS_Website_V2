import { defineConfig } from 'vite'
import { resolve } from 'path'

export default defineConfig({
  server: {
    port: 5173,
    open: true
  },
  plugins: [
    {
      name: 'roi-praemissen-pretty-url',
      configureServer(server) {
        server.middlewares.use((req, res, next) => {
          const url = req.url || ''
          if (url === '/roi-praemissen' || url.startsWith('/roi-praemissen?')) {
            req.url = url.replace('/roi-praemissen', '/roi-praemissen.html')
          }
          next()
        })
      }
    }
  ],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
    rollupOptions: {
      input: {
        main: resolve(__dirname, 'index.html'),
        impressum: resolve(__dirname, 'impressum.html'),
        datenschutz: resolve(__dirname, 'datenschutz.html'),
        aqut: resolve(__dirname, 'ams.html'),
        referenzen: resolve(__dirname, 'referenzen.html'),
        zusammenarbeit: resolve(__dirname, 'zusammenarbeit.html'),
        ueberUns: resolve(__dirname, 'ueber-uns.html'),
        persoenlichkeit: resolve(__dirname, 'persoenlichkeit.html'),
        aiRoadmap: resolve(__dirname, 'ai-roadmap.html'),
        akut: resolve(__dirname, 'akut.html'),
        roiPraemissen: resolve(__dirname, 'roi-praemissen.html'),
        // Flaggschiff-Systemseiten. Erzeugt von scripts/build-pages.mjs aus
        // allen Eintraegen mit `slug` in scripts/systemakte-data.mjs.
        // Kein Globbing hier: wer dort einen Slug ergaenzt, traegt die Seite
        // auch hier ein, sonst landet sie nicht in dist/.
        sysAnfragen: resolve(__dirname, 'system-anfragen-qualifizieren.html'),
        sysSupport: resolve(__dirname, 'system-support-agent.html'),
        sysOnboarding: resolve(__dirname, 'system-onboarding.html'),
        sysDokumente: resolve(__dirname, 'system-dokumente-auslesen.html'),
        sysReporting: resolve(__dirname, 'system-reporting.html')
      }
    }
  }
})

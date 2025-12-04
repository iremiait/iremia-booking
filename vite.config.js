import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import prerender from 'vite-plugin-prerender'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    prerender({
      // Percorso della build
      staticDir: path.join(__dirname, 'dist'),
      // Route da pre-renderizzare
      routes: ['/'],
      // Renderer
      renderer: '@prerenderer/renderer-puppeteer',
      rendererOptions: {
        // Aspetta che tutto sia caricato
        renderAfterDocumentEvent: 'render-event',
        // Timeout
        renderAfterTime: 5000,
        headless: true
      },
      postProcess(renderedRoute) {
        // Ottimizzazione finale dell'HTML
        renderedRoute.html = renderedRoute.html
          .replace(/<script (.*?)>/gi, '<script $1 defer>')
        return renderedRoute
      }
    })
  ],
  server: {
    port: 3000,
    open: true
  }
})

import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// SPA fallback plugin to handle client-side routing
const spaFallback = () => {
  return {
    name: 'spa-fallback',
    configureServer(server) {
      // Return a function that runs after Vite's middleware is set up
      return () => {
        // Add middleware to catch all non-file routes
        // Vite's static file middleware runs first, so files from public/ are served before this
        server.middlewares.use((req, res, next) => {
          const url = req.url.split('?')[0]
          
          // Skip Vite internal requests
          if (
            url.startsWith('/@') || 
            url.startsWith('/node_modules') || 
            url.startsWith('/src') ||
            url.startsWith('/assets')
          ) {
            return next()
          }
          
          // Skip root path
          if (url === '/') {
            return next()
          }
          
          // Skip if it's a file with extension (like .pdf, .png, .js, .css, etc.)
          // This allows PDFs and other static files from public directory to be served normally
          // Explicitly check for PDF and other common file extensions
          if (/\.(pdf|png|jpg|jpeg|gif|svg|ico|js|css|json|xml|txt|woff|woff2|ttf|eot)$/i.test(url)) {
            return next()
          }
          
          // For SPA routes (like /projects, /experience), rewrite to index.html
          // This ensures Vite processes the HTML with all its transformations
          req.url = '/index.html'
          next()
        })
      }
    }
  }
}

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), spaFallback()],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  build: {
    // Ensure favicon is properly included in build
    rollupOptions: {
      output: {
        // Preserve favicon file name
        assetFileNames: (assetInfo) => {
          if (assetInfo.name && assetInfo.name.includes('r.jpg')) {
            return '[name][extname]'
          }
          return 'assets/[name]-[hash][extname]'
        }
      }
    }
  },
  // Ensure favicon is served from public directory
  publicDir: 'public',
  server: {
    port: 3000,
    open: true,
    fs: {
      strict: false
    }
  }
})
// Performance optimizations

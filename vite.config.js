import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
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

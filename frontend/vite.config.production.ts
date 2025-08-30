import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// Production configuration optimized for high traffic
export default defineConfig({
  plugins: [react()],
  
  build: {
    // Optimize bundle size
    rollupOptions: {
      output: {
        manualChunks: {
          // Separate vendor libraries for better caching
          vendor: ['react', 'react-dom'],
          router: ['react-router-dom'],
          ui: ['@chakra-ui/react', 'framer-motion'],
          maps: ['leaflet', 'react-leaflet'],
          utils: ['@tanstack/react-query', 'i18next', 'react-i18next']
        }
      }
    },
    // Increase chunk size warning limit
    chunkSizeWarningLimit: 1000,
    // Enable source maps for production debugging
    sourcemap: true,
    // Minify for production
    minify: 'terser',
    terserOptions: {
      compress: {
        drop_console: true, // Remove console.log in production
        drop_debugger: true
      }
    }
  },

  // Production server configuration
  server: {
    proxy: {
      '/api': {
        target: process.env.VITE_API_URL || 'https://api.yourdomain.com',
        changeOrigin: true,
        secure: true
      }
    }
  },

  // Optimize dependencies
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@chakra-ui/react',
      'framer-motion',
      'leaflet',
      'react-leaflet'
    ]
  },

  // Define environment variables
  define: {
    __APP_VERSION__: JSON.stringify(process.env.npm_package_version),
    __BUILD_TIME__: JSON.stringify(new Date().toISOString())
  }
})

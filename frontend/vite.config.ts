import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import autoprefixer from 'autoprefixer'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Skip TypeScript type checking during build
      tsDecorators: true,
    })
  ],
  
  // Optimize for memory usage
  build: {
    target: 'esnext',
    minify: 'esbuild',
    rollupOptions: {
      // Reduce memory usage during build
      maxParallelFileOps: 1,  // Reduced from 2 to 1
      cache: false,
      output: {
        // Split chunks more aggressively to reduce memory
        manualChunks: {
          vendor: ['react', 'react-dom'],
          chakra: ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
          routing: ['react-router-dom'],
          query: ['@tanstack/react-query'],
        },
        // Smaller chunk sizes
        chunkFileNames: 'js/[name]-[hash].js',
        entryFileNames: 'js/[name]-[hash].js',
        assetFileNames: 'assets/[name]-[hash].[ext]'
      }
    },
    chunkSizeWarningLimit: 500,  // Reduced from 1000 to 500
    // Reduce concurrent processing
    assetsInlineLimit: 0,  // Don't inline any assets
  },
  server: {
    host: '0.0.0.0',
    port: 5174,
    allowedHosts: [
      'localhost',
      '127.0.0.1',
      '0.0.0.0',
      '.ngrok-free.app',
      '.ngrok.io',
      '.ngrok.app'
    ],
    cors: true,
    proxy: {
      '/api': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
        configure: (proxy, _options) => {
          proxy.on('error', (err, _req, _res) => {
            console.log('proxy error', err);
          });
          proxy.on('proxyReq', (_proxyReq, req, _res) => {
            console.log('Sending Request to the Target:', req.method, req.url);
          });
          proxy.on('proxyRes', (proxyRes, req, _res) => {
            console.log('Received Response from the Target:', proxyRes.statusCode, req.url);
          });
        },
      },
      '/admin': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
      },
      '/static': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
      },
      '/media': {
        target: 'http://localhost:8001',
        changeOrigin: true,
        secure: false,
      }
    }
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    target: 'es2015',
    cssTarget: 'chrome80',
    rollupOptions: {
      output: {
        manualChunks: {
          // Core React libraries
          'react-core': ['react', 'react-dom'],
          'react-router': ['react-router-dom'],
          
          // UI libraries
          'chakra-ui': ['@chakra-ui/react', '@emotion/react', '@emotion/styled', 'framer-motion'],
          'heroicons': ['@heroicons/react'],
          
          // Data management
          'react-query': ['@tanstack/react-query'],
          
          // Utilities
          'utils': ['lodash'],
          
          // Maps and location
          'maps': ['leaflet', 'react-leaflet', 'react-leaflet-cluster'],
          
          // Forms and inputs
          'forms': ['react-select', 'react-color'],
          
          // Internationalization
          'i18n': ['i18next', 'react-i18next'],
          
          // Syntax highlighting
          'syntax': ['react-syntax-highlighter'],
          
          // SEO and meta
          'seo': ['react-helmet-async'],
        },
        chunkFileNames: (chunkInfo) => {
          const facadeModuleId = chunkInfo.facadeModuleId ? chunkInfo.facadeModuleId.split('/').pop() : 'chunk';
          return `assets/js/[name]-[hash].js`;
        },
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: (assetInfo) => {
          if (!assetInfo.name) return `assets/[ext]/[name]-[hash].[ext]`;
          const info = assetInfo.name.split('.');
          const ext = info[info.length - 1];
          if (/png|jpe?g|svg|gif|tiff|bmp|ico/i.test(ext)) {
            return `assets/images/[name]-[hash].[ext]`;
          }
          if (/css/i.test(ext)) {
            return `assets/css/[name]-[hash].[ext]`;
          }
          return `assets/[ext]/[name]-[hash].[ext]`;
        },
      },
    },
    chunkSizeWarningLimit: 1000,
    // Enable compression for production builds
    reportCompressedSize: true,
    // Optimize dependencies
    commonjsOptions: {
      include: [/node_modules/],
    },
  },
  // Strip all console calls and debugger statements from production builds
  esbuild: mode === 'production' ? { 
    drop: ['console', 'debugger'],
    pure: ['console.log', 'console.info', 'console.debug', 'console.warn'],
    // Skip TypeScript type checking
    target: 'es2015',
    format: 'esm',
  } : {
    // Skip TypeScript type checking in development too
    target: 'es2015',
  },
  define: {
    'process.env.VITE_API_URL': JSON.stringify(process.env.VITE_API_URL || 'http://localhost:8001'),
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-router-dom',
      '@chakra-ui/react',
      '@heroicons/react/24/outline',
      '@heroicons/react/24/solid',
      '@tanstack/react-query',
      'lodash',
      'date-fns',
    ],
    exclude: [
      '@tanstack/react-query-devtools', // Exclude dev tools from production
    ],
  },
  css: {
    devSourcemap: false,
    // PostCSS configuration is handled by postcss.config.js
  },
  // Performance optimizations
  experimental: {
    renderBuiltUrl(filename, { hostType }) {
      if (hostType === 'js') {
        return { js: `/${filename}` };
      } else {
        return { relative: true };
      }
    },
  },
}))

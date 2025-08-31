import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'

// https://vite.dev/config/
export default defineConfig(({ mode }) => ({
  plugins: [
    react({
      // Skip TypeScript type checking during build
      tsDecorators: true,
    })
  ],
  

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
    sourcemap: false, // Disabled for memory optimization
    minify: 'esbuild', // Faster than terser, uses less memory
    target: 'es2015',
    cssTarget: 'chrome80',
    rollupOptions: {
      // Aggressive memory optimization for large dependency trees
      maxParallelFileOps: 1, // Serialize operations to minimize memory peaks
      cache: false, // Disable cache to prevent memory issues
      // Reduce memory pressure during bundling
      treeshake: {
        preset: 'smallest',
        moduleSideEffects: false,
      },
      output: {
        // More aggressive chunking for better memory management
        manualChunks(id) {
          // Core libraries
          if (id.includes('react') && !id.includes('react-router') && !id.includes('react-select')) {
            return 'react-core';
          }
          if (id.includes('react-router')) {
            return 'react-router';
          }
          
          // Heavy UI libraries - split more granularly  
          if (id.includes('@chakra-ui') || id.includes('@emotion')) {
            return 'chakra-ui';
          }
          if (id.includes('framer-motion')) {
            return 'framer-motion'; // Separate heavy animation library
          }
          if (id.includes('@heroicons')) {
            return 'heroicons';
          }
          
          // Data management
          if (id.includes('@tanstack/react-query')) {
            return 'react-query';
          }
          
          // Maps - heavy bundle, separate
          if (id.includes('leaflet')) {
            return 'maps';
          }
          
          // Forms
          if (id.includes('react-select') || id.includes('react-color')) {
            return 'forms';
          }
          
          // Internationalization
          if (id.includes('i18next')) {
            return 'i18n';
          }
          
          // Heavy syntax highlighting - separate
          if (id.includes('react-syntax-highlighter')) {
            return 'syntax';
          }
          
          // SEO
          if (id.includes('react-helmet')) {
            return 'seo';
          }
          
          // Vendor fallback
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
        chunkFileNames: 'assets/js/[name]-[hash].js',
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
    chunkSizeWarningLimit: 500, // Smaller chunks for better memory management
    reportCompressedSize: false, // Skip compression reporting to save memory
    commonjsOptions: {
      include: [/node_modules/],
    },
    assetsInlineLimit: 0, // Never inline assets to save memory
    // Additional memory optimizations
    emptyOutDir: true,
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
      'react-fast-compare', // Fix ES module import issue
      'void-elements', // Fix ES module import issue with html-parse-stringify
      'html-parse-stringify', // Fix ES module import issue
      'fast-json-stable-stringify', // Prevent potential CommonJS issues
    ],
         exclude: [
       '@tanstack/react-query-devtools', // Exclude dev tools from production
     ],
    // Force dependency optimization for memory efficiency
    force: mode === 'production',
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

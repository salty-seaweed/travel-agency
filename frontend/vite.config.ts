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
        // Disable manual chunking completely to fix React hook issues
        manualChunks: {
          // Simple, safe chunking that doesn't break React
          'react-vendor': ['react', 'react-dom', 'react-dom/client'],
          'ui-vendor': ['@chakra-ui/react', '@emotion/react', '@emotion/styled'],
          'router-vendor': ['react-router-dom'],
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
  resolve: {
    alias: {
      // Ensure single React instance to fix useLayoutEffect issues
      'react': 'react',
      'react-dom': 'react-dom',
    },
    dedupe: ['react', 'react-dom'],
  },
  optimizeDeps: {
    include: [
      'react',
      'react-dom',
      'react-dom/client',
      'react/jsx-runtime',
      'react-router-dom',
    ],
    exclude: [
      '@tanstack/react-query-devtools',
    ],
    force: false,
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

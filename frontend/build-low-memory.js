#!/usr/bin/env node

// Low-memory build script for Vercel
const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

console.log('🔧 Starting low-memory build process...');

// Set aggressive memory limits
process.env.NODE_OPTIONS = '--max-old-space-size=3072 --no-warnings --max-semi-space-size=32 --optimize-for-size';

// Clean dist directory
const distPath = path.join(__dirname, 'dist');
if (fs.existsSync(distPath)) {
  console.log('🧹 Cleaning dist directory...');
  fs.rmSync(distPath, { recursive: true, force: true });
}

try {
  // Run Vite build with memory optimizations
  console.log('⚡ Building with Vite (memory optimized)...');
  execSync('npx vite build --mode production --emptyOutDir', {
    stdio: 'inherit',
    cwd: __dirname,
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=3072 --no-warnings --max-semi-space-size=32 --optimize-for-size --gc-interval=100',
      VITE_BUILD_CHUNK_SIZE_LIMIT: '300'
    }
  });
  
  console.log('✅ Build completed successfully!');
  
  // Clean up unnecessary files to reduce deployment size
  console.log('🧹 Cleaning up build artifacts...');
  const distFiles = fs.readdirSync(distPath, { recursive: true });
  
  // Remove source map files if any
  distFiles.forEach(file => {
    if (typeof file === 'string' && file.endsWith('.map')) {
      const mapPath = path.join(distPath, file);
      if (fs.existsSync(mapPath)) {
        fs.unlinkSync(mapPath);
        console.log(`   Removed: ${file}`);
      }
    }
  });
  
  console.log('✅ Build cleanup completed!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

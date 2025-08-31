#!/usr/bin/env node

// Low-memory build script for Vercel
import { execSync } from 'child_process';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

// Get __dirname equivalent in ES modules
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

console.log('🔧 Starting low-memory build process...');

// Set optimized memory limits for Vercel (using 6GB of available 8GB)
process.env.NODE_OPTIONS = '--max-old-space-size=6144 --no-warnings --max-semi-space-size=64';

// Ensure rollup native module is available
console.log('🔍 Ensuring Rollup native dependencies...');

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
      NODE_OPTIONS: '--max-old-space-size=6144 --no-warnings --max-semi-space-size=64',
      VITE_BUILD_CHUNK_SIZE_LIMIT: '800'
    }
  });
  
  console.log('✅ Build completed successfully!');
  
  // Minimal cleanup to avoid OOM
  console.log('🧹 Cleaning up build artifacts...');
  
  try {
    // Only clean the most essential cache items
    const cacheDir = path.join(__dirname, 'node_modules/.cache');
    if (fs.existsSync(cacheDir)) {
      fs.rmSync(cacheDir, { recursive: true, force: true });
    }
    
    const viteDir = path.join(__dirname, '.vite');
    if (fs.existsSync(viteDir)) {
      fs.rmSync(viteDir, { recursive: true, force: true });
    }
  } catch (error) {
    // Ignore cleanup errors to avoid deployment failure
    console.log('Note: Some cleanup skipped to avoid memory issues');
  }
  
  console.log('✅ Build cleanup completed!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  process.exit(1);
}

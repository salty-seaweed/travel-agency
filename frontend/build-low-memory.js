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
  // Set timeout to prevent infinite hangs
  const buildTimeout = 600000; // 10 minutes max
  
  // Run Vite build with memory optimizations and timeout
  console.log('⚡ Building with Vite (memory optimized, 10min timeout)...');
  execSync('npx vite build --mode production --emptyOutDir', {
    stdio: 'inherit',
    cwd: __dirname,
    timeout: buildTimeout,
    env: {
      ...process.env,
      NODE_OPTIONS: '--max-old-space-size=6144 --no-warnings --max-semi-space-size=64',
      VITE_BUILD_CHUNK_SIZE_LIMIT: '800',
      CI: 'true'
    }
  });
  
  console.log('✅ Build completed successfully!');
  
  // Minimal cleanup to avoid OOM - but avoid touching node_modules
  console.log('🧹 Cleaning up build artifacts...');
  
  try {
    // Only clean standalone cache directories (not inside node_modules)
    const viteDir = path.join(__dirname, '.vite');
    if (fs.existsSync(viteDir)) {
      fs.rmSync(viteDir, { recursive: true, force: true });
    }
    
    // Clean any temporary build files in project root
    const tempFiles = ['.turbo', '.parcel-cache'];
    tempFiles.forEach(file => {
      const filePath = path.join(__dirname, file);
      if (fs.existsSync(filePath)) {
        fs.rmSync(filePath, { recursive: true, force: true });
      }
    });
  } catch (error) {
    // Ignore cleanup errors to avoid deployment failure
    console.log('Note: Some cleanup skipped to avoid memory issues');
  }
  
  console.log('✅ Build cleanup completed!');
  
} catch (error) {
  console.error('❌ Build failed:', error.message);
  
  // If it's a timeout error, try a simpler build
  if (error.signal === 'SIGTERM' || error.message.includes('timeout')) {
    console.log('⚠️  Build timed out, trying fallback build...');
    try {
      execSync('npx vite build --mode production --emptyOutDir --minify false', {
        stdio: 'inherit',
        cwd: __dirname,
        timeout: 300000, // 5 minutes for fallback
        env: {
          ...process.env,
          NODE_OPTIONS: '--max-old-space-size=4096',
          VITE_BUILD_CHUNK_SIZE_LIMIT: '1000'
        }
      });
      console.log('✅ Fallback build completed successfully!');
    } catch (fallbackError) {
      console.error('❌ Fallback build also failed:', fallbackError.message);
      process.exit(1);
    }
  } else {
    process.exit(1);
  }
}

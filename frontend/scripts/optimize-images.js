import fs from 'fs';
import path from 'path';
import sharp from 'sharp';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  inputDir: path.join(__dirname, '../public/images'),
  outputDir: path.join(__dirname, '../public/images/optimized'),
  sizes: {
    thumbnail: { width: 150, height: 150 },
    small: { width: 400, height: 300 },
    medium: { width: 800, height: 600 },
    large: { width: 1200, height: 900 },
    hero: { width: 1920, height: 1080 }
  },
  quality: {
    jpeg: 80,
    webp: 85,
    avif: 80
  }
};

// Ensure output directory exists
if (!fs.existsSync(config.outputDir)) {
  fs.mkdirSync(config.outputDir, { recursive: true });
}

// Get all image files
function getImageFiles(dir) {
  const files = fs.readdirSync(dir);
  return files.filter(file => {
    const ext = path.extname(file).toLowerCase();
    return ['.jpg', '.jpeg', '.png', '.webp'].includes(ext);
  });
}

// Optimize a single image
async function optimizeImage(inputPath, outputPath, options) {
  try {
    const { width, height, quality, format } = options;
    
    let pipeline = sharp(inputPath);
    
    // Resize if dimensions provided
    if (width || height) {
      pipeline = pipeline.resize(width, height, {
        fit: 'cover',
        position: 'center'
      });
    }
    
    // Apply format-specific optimizations
    switch (format) {
      case 'jpeg':
        pipeline = pipeline.jpeg({ 
          quality: quality.jpeg,
          progressive: true,
          mozjpeg: true
        });
        break;
      case 'webp':
        pipeline = pipeline.webp({ 
          quality: quality.webp,
          effort: 6
        });
        break;
      case 'avif':
        pipeline = pipeline.avif({ 
          quality: quality.avif,
          effort: 9
        });
        break;
    }
    
    await pipeline.toFile(outputPath);
    
    // Get file size
    const stats = fs.statSync(outputPath);
    const originalStats = fs.statSync(inputPath);
    const compressionRatio = ((originalStats.size - stats.size) / originalStats.size * 100).toFixed(1);
    
    return {
      path: outputPath,
      size: stats.size,
      originalSize: originalStats.size,
      compressionRatio: `${compressionRatio}%`
    };
  } catch (error) {
    console.error(`Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

// Process all images
async function processImages() {
  const imageFiles = getImageFiles(config.inputDir);
  
  console.log(`Found ${imageFiles.length} images to optimize...`);
  
  let totalOriginalSize = 0;
  let totalOptimizedSize = 0;
  
  for (const filename of imageFiles) {
    const inputPath = path.join(config.inputDir, filename);
    const baseName = path.parse(filename).name;
    
    console.log(`\nProcessing: ${filename}`);
    
    // Get original file size
    const originalStats = fs.statSync(inputPath);
    totalOriginalSize += originalStats.size;
    
    // Create optimized versions for each size and format
    for (const [sizeName, dimensions] of Object.entries(config.sizes)) {
      const sizeDir = path.join(config.outputDir, sizeName);
      if (!fs.existsSync(sizeDir)) {
        fs.mkdirSync(sizeDir, { recursive: true });
      }
      
      // Create JPEG version
      const jpegPath = path.join(sizeDir, `${baseName}.jpg`);
      const jpegResult = await optimizeImage(inputPath, jpegPath, {
        ...dimensions,
        quality: config.quality,
        format: 'jpeg'
      });
      
      if (jpegResult) {
        totalOptimizedSize += jpegResult.size;
        console.log(`  ${sizeName}.jpg: ${(jpegResult.size / 1024).toFixed(1)}KB (${jpegResult.compressionRatio} smaller)`);
      }
      
      // Create WebP version
      const webpPath = path.join(sizeDir, `${baseName}.webp`);
      const webpResult = await optimizeImage(inputPath, webpPath, {
        ...dimensions,
        quality: config.quality,
        format: 'webp'
      });
      
      if (webpResult) {
        totalOptimizedSize += webpResult.size;
        console.log(`  ${sizeName}.webp: ${(webpResult.size / 1024).toFixed(1)}KB (${webpResult.compressionRatio} smaller)`);
      }
      
      // Create AVIF version (for modern browsers)
      const avifPath = path.join(sizeDir, `${baseName}.avif`);
      const avifResult = await optimizeImage(inputPath, avifPath, {
        ...dimensions,
        quality: config.quality,
        format: 'avif'
      });
      
      if (avifResult) {
        totalOptimizedSize += avifResult.size;
        console.log(`  ${sizeName}.avif: ${(avifResult.size / 1024).toFixed(1)}KB (${avifResult.compressionRatio} smaller)`);
      }
    }
  }
  
  // Summary
  console.log('\n' + '='.repeat(50));
  console.log('OPTIMIZATION SUMMARY');
  console.log('='.repeat(50));
  console.log(`Original total size: ${(totalOriginalSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Optimized total size: ${(totalOptimizedSize / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Total savings: ${((totalOriginalSize - totalOptimizedSize) / 1024 / 1024).toFixed(2)}MB`);
  console.log(`Compression ratio: ${((totalOriginalSize - totalOptimizedSize) / totalOriginalSize * 100).toFixed(1)}%`);
  console.log(`\nOptimized images saved to: ${config.outputDir}`);
}

// Run the optimization
processImages().catch(console.error);

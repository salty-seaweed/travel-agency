import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Configuration
const config = {
  srcDir: path.join(__dirname, '../src'),
  imageMappings: {
    // Map original images to their optimized versions
    '/images/ishan1.jpg': '/images/optimized/medium/ishan1.webp',
    '/images/ishan45.jpg': '/images/optimized/medium/ishan45.webp',
    '/images/ishan46.jpg': '/images/optimized/medium/ishan46.webp',
    '/images/ishan47.jpg': '/images/optimized/medium/ishan47.webp',
    '/images/ishan48.jpg': '/images/optimized/medium/ishan48.webp',
    '/images/ishan49.jpg': '/images/optimized/medium/ishan49.webp',
    '/images/ishan50.jpg': '/images/optimized/medium/ishan50.webp',
    '/images/ishan51.jpg': '/images/optimized/medium/ishan51.webp',
    '/images/ishan52.jpg': '/images/optimized/medium/ishan52.webp',
    '/images/ishan53.jpg': '/images/optimized/medium/ishan53.webp',
    '/images/ishan54.jpg': '/images/optimized/medium/ishan54.webp',
    '/images/ishan55.jpg': '/images/optimized/medium/ishan55.webp',
    '/images/ishan56.jpg': '/images/optimized/medium/ishan56.webp',
    '/images/ishan57.jpg': '/images/optimized/medium/ishan57.webp',
    '/images/ishan58.jpg': '/images/optimized/medium/ishan58.webp',
    '/images/ishan59.jpg': '/images/optimized/medium/ishan59.webp',
    '/images/ishan60.jpg': '/images/optimized/medium/ishan60.webp',
    '/images/ishan61.jpg': '/images/optimized/medium/ishan61.webp',
    '/images/ishan62.jpg': '/images/optimized/medium/ishan62.webp',
    '/images/ishan63.jpg': '/images/optimized/medium/ishan63.webp',
    '/images/ishan64.jpg': '/images/optimized/medium/ishan64.webp',
    '/images/ishan65.jpg': '/images/optimized/medium/ishan65.webp',
    '/images/ishan66.jpg': '/images/optimized/medium/ishan66.webp',
    '/images/ishan67.jpg': '/images/optimized/medium/ishan67.webp',
    '/images/ishan68.jpg': '/images/optimized/medium/ishan68.webp',
    '/images/ishan69.jpg': '/images/optimized/medium/ishan69.webp',
    '/images/ishan70.jpg': '/images/optimized/medium/ishan70.webp',
    '/images/ishan74.jpg': '/images/optimized/medium/ishan74.webp',
    '/images/ishan75.jpg': '/images/optimized/medium/ishan75.webp',
    '/images/ishan76.jpg': '/images/optimized/medium/ishan76.webp',
    '/images/ishan111.jpg': '/images/optimized/medium/ishan111.webp',
    '/images/ishan112.jpg': '/images/optimized/medium/ishan112.webp',
    '/images/ishan113.jpg': '/images/optimized/medium/ishan113.webp',
    '/images/ishan114.jpg': '/images/optimized/medium/ishan114.webp',
    '/images/ishan115.jpg': '/images/optimized/medium/ishan115.webp',
    '/images/ishan116.jpg': '/images/optimized/medium/ishan116.webp',
  }
};

// Get all TypeScript/React files
function getSourceFiles(dir) {
  const files = [];
  
  function traverse(currentDir) {
    const items = fs.readdirSync(currentDir);
    
    for (const item of items) {
      const fullPath = path.join(currentDir, item);
      const stat = fs.statSync(fullPath);
      
      if (stat.isDirectory() && !item.startsWith('.') && item !== 'node_modules') {
        traverse(fullPath);
      } else if (stat.isFile() && /\.(tsx?|jsx?)$/.test(item)) {
        files.push(fullPath);
      }
    }
  }
  
  traverse(dir);
  return files;
}

// Update image references in a file
function updateImageReferences(filePath) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  for (const [originalPath, optimizedPath] of Object.entries(config.imageMappings)) {
    // Replace exact matches
    if (content.includes(originalPath)) {
      content = content.replace(new RegExp(originalPath.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), optimizedPath);
      updated = true;
    }
    
    // Also replace with quotes around the path
    const quotedOriginal = `"${originalPath}"`;
    const quotedOptimized = `"${optimizedPath}"`;
    if (content.includes(quotedOriginal)) {
      content = content.replace(new RegExp(quotedOriginal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), quotedOptimized);
      updated = true;
    }
    
    const singleQuotedOriginal = `'${originalPath}'`;
    const singleQuotedOptimized = `'${optimizedPath}'`;
    if (content.includes(singleQuotedOriginal)) {
      content = content.replace(new RegExp(singleQuotedOriginal.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'), 'g'), singleQuotedOptimized);
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    return true;
  }
  
  return false;
}

// Main function
async function updateAllImageReferences() {
  console.log('Scanning for source files...');
  const sourceFiles = getSourceFiles(config.srcDir);
  
  console.log(`Found ${sourceFiles.length} source files to process...`);
  
  let updatedFiles = 0;
  
  for (const filePath of sourceFiles) {
    const relativePath = path.relative(config.srcDir, filePath);
    
    if (updateImageReferences(filePath)) {
      console.log(`Updated: ${relativePath}`);
      updatedFiles++;
    }
  }
  
  console.log(`\nUpdated ${updatedFiles} files with optimized image references.`);
  console.log('\nNext steps:');
  console.log('1. Run: npm run optimize-images');
  console.log('2. Replace <img> and <Image> components with <ResponsiveImage>');
  console.log('3. Test the website performance improvements');
}

// Run the script
updateAllImageReferences().catch(console.error);

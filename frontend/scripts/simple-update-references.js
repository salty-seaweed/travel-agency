import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const srcDir = path.join(__dirname, '../src');

// Get all React/TypeScript files
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

console.log('Scanning for files...');
const sourceFiles = getSourceFiles(srcDir);
console.log(`Found ${sourceFiles.length} source files`);

let totalUpdated = 0;

for (const filePath of sourceFiles) {
  let content = fs.readFileSync(filePath, 'utf8');
  let updated = false;
  
  // Replace the large image references with optimized ones
  const replacements = [
    ['/images/ishan1.jpg', '/images/optimized/medium/ishan1.webp'],
    ['/images/ishan45.jpg', '/images/optimized/medium/ishan45.webp'],
    ['/images/ishan46.jpg', '/images/optimized/medium/ishan46.webp'],
    ['/images/ishan47.jpg', '/images/optimized/medium/ishan47.webp'],
    ['/images/ishan48.jpg', '/images/optimized/medium/ishan48.webp'],
    ['/images/ishan49.jpg', '/images/optimized/medium/ishan49.webp'],
    ['/images/ishan50.jpg', '/images/optimized/medium/ishan50.webp'],
    ['/images/ishan51.jpg', '/images/optimized/medium/ishan51.webp'],
    ['/images/ishan52.jpg', '/images/optimized/medium/ishan52.webp'],
    ['/images/ishan53.jpg', '/images/optimized/medium/ishan53.webp'],
    ['/images/ishan111.jpg', '/images/optimized/medium/ishan111.webp'],
    ['/images/ishan112.jpg', '/images/optimized/medium/ishan112.webp'],
    ['/images/ishan113.jpg', '/images/optimized/medium/ishan113.webp'],
    ['/images/ishan114.jpg', '/images/optimized/medium/ishan114.webp'],
    ['/images/ishan115.jpg', '/images/optimized/medium/ishan115.webp'],
    ['/images/ishan116.jpg', '/images/optimized/medium/ishan116.webp'],
    ['/images/ishan63.jpg', '/images/optimized/medium/ishan63.webp'],
    ['/images/ishan64.jpg', '/images/optimized/medium/ishan64.webp'],
    ['/images/ishan65.jpg', '/images/optimized/medium/ishan65.webp'],
    ['/images/ishan66.jpg', '/images/optimized/medium/ishan66.webp'],
    ['/images/ishan67.jpg', '/images/optimized/medium/ishan67.webp'],
    ['/images/ishan74.jpg', '/images/optimized/medium/ishan74.webp'],
    ['/images/ishan75.jpg', '/images/optimized/medium/ishan75.webp'],
    ['/images/ishan76.jpg', '/images/optimized/medium/ishan76.webp'],
  ];
  
  for (const [original, optimized] of replacements) {
    if (content.includes(original)) {
      content = content.replaceAll(original, optimized);
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(filePath, content, 'utf8');
    const relativePath = path.relative(srcDir, filePath);
    console.log(`Updated: ${relativePath}`);
    totalUpdated++;
  }
}

console.log(`\nUpdated ${totalUpdated} files with optimized image references.`);
console.log('Your website is now using optimized images!');

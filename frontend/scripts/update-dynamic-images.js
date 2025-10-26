import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const filesToUpdate = [
  'src/components/experiences-homepage/sections/HeroSection.tsx',
  'src/components/experiences-homepage/sections/DestinationsSection.tsx', 
  'src/components/experiences-homepage/sections/ActivitiesSection.tsx',
  'src/components/ResponsiveImage.tsx'
];

console.log('Updating dynamic image references...');

for (const filePath of filesToUpdate) {
  const fullPath = path.join(__dirname, '..', filePath);
  
  if (!fs.existsSync(fullPath)) {
    console.log(`Skipping ${filePath} - file not found`);
    continue;
  }
  
  let content = fs.readFileSync(fullPath, 'utf8');
  let updated = false;
  
  // Update random image generation to use optimized paths
  const patterns = [
    // Pattern 1: /images/ishan${Math.floor(Math.random() * 20) + 51}.jpg
    [
      /\/images\/ishan\$\{Math\.floor\(Math\.random\(\) \* 20\) \+ 51\}\.jpg/g,
      '/images/optimized/medium/ishan${Math.floor(Math.random() * 20) + 51}.webp'
    ],
    // Pattern 2: /images/ishan${experience.id + 50}.jpg
    [
      /\/images\/ishan\$\{experience\.id \+ 50\}\.jpg/g,
      '/images/optimized/medium/ishan${experience.id + 50}.webp'
    ],
    // Pattern 3: Fallback in ResponsiveImage
    [
      /\/images\/optimized\/thumbnail\/ishan1\.jpg/g,
      '/images/optimized/thumbnail/ishan1.webp'
    ]
  ];
  
  for (const [pattern, replacement] of patterns) {
    if (pattern.test(content)) {
      content = content.replace(pattern, replacement);
      updated = true;
    }
  }
  
  if (updated) {
    fs.writeFileSync(fullPath, content, 'utf8');
    console.log(`✓ Updated: ${filePath}`);
  } else {
    console.log(`- No changes needed: ${filePath}`);
  }
}

console.log('\nDynamic image references updated!');
console.log('Your website will now serve optimized WebP images instead of large JPEGs.');

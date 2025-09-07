/**
 * Image Converter Service
 * Main orchestrator that combines analysis and processing for smart image conversion
 */

import { imageAnalyzer, ImageAnalysisResult } from '../utils/imageAnalysis';
import { imageProcessor, ProcessedImage, ProcessingOptions } from '../utils/imageProcessor';

// Inline utility functions to avoid import issues
const isExternalImage = (url: string): boolean => {
  try {
    const urlObj = new URL(url);
    return urlObj.origin !== window.location.origin;
  } catch {
    return false;
  }
};

const isCorsEnabled = (url: string): boolean => {
  // Common CORS-enabled image services
  const corsEnabledDomains = [
    'images.unsplash.com',
    'picsum.photos',
    'via.placeholder.com',
    'placehold.co',
    'loremflickr.com'
  ];
  
  try {
    const urlObj = new URL(url);
    return corsEnabledDomains.some(domain => urlObj.hostname.includes(domain));
  } catch {
    return false;
  }
};

export interface ConversionPreset {
  name: string;
  width: number;
  height: number;
  quality: number;
  format: 'jpeg' | 'png' | 'webp' | 'avif';
  smartCrop: boolean;
  backgroundColor?: string;
}

export interface ConversionResult {
  original: {
    src: string;
    analysis: ImageAnalysisResult;
  };
  processed: {
    thumbnail: ProcessedImage;
    card: ProcessedImage;
    hero: ProcessedImage;
    original: ProcessedImage;
  };
  metadata: {
    conversionTime: number;
    totalSize: number;
    compressionRatio: number;
  };
}

export interface ConversionOptions {
  presets?: Partial<ConversionPreset>[];
  forceReanalysis?: boolean;
  cacheResults?: boolean;
  onProgress?: (stage: string, progress: number) => void;
}

// Predefined presets for common use cases
export const CONVERSION_PRESETS: Record<string, ConversionPreset> = {
  thumbnail: {
    name: 'thumbnail',
    width: 150,
    height: 150,
    quality: 0.7,
    format: 'webp',
    smartCrop: true
  },
  card: {
    name: 'card',
    width: 400,
    height: 300,
    quality: 0.8,
    format: 'webp',
    smartCrop: true,
    backgroundColor: '#f7fafc'
  },
  hero: {
    name: 'hero',
    width: 1200,
    height: 600,
    quality: 0.9,
    format: 'webp',
    smartCrop: true
  },
  original: {
    name: 'original',
    width: 1920,
    height: 1080,
    quality: 0.95,
    format: 'webp',
    smartCrop: false
  }
};

export class ImageConverter {
  private cache = new Map<string, ConversionResult>();
  private analysisCache = new Map<string, ImageAnalysisResult>();

  /**
   * Convert an image using smart analysis and processing
   */
  async convertImage(
    imageSrc: string, 
    options: ConversionOptions = {}
  ): Promise<ConversionResult> {
    const startTime = performance.now();
    
    // Check cache first
    if (options.cacheResults && this.cache.has(imageSrc)) {
      return this.cache.get(imageSrc)!;
    }

    try {
      options.onProgress?.('analyzing', 0.1);
      
      // Step 1: Analyze the image
      const analysis = await this.analyzeImage(imageSrc, options.forceReanalysis);
      
      options.onProgress?.('processing', 0.3);
      
      // Step 2: Process different sizes
      const processed = await this.processImageVariants(imageSrc, analysis, options);
      
      options.onProgress?.('finalizing', 0.9);
      
      // Step 3: Calculate metadata
      const endTime = performance.now();
      const totalSize = Object.values(processed).reduce((sum, img) => sum + img.size, 0);
      const originalSize = analysis.width * analysis.height * 4; // Rough estimate
      const compressionRatio = totalSize / originalSize;
      
      const result: ConversionResult = {
        original: {
          src: imageSrc,
          analysis
        },
        processed,
        metadata: {
          conversionTime: endTime - startTime,
          totalSize,
          compressionRatio
        }
      };

      // Cache the result
      if (options.cacheResults) {
        this.cache.set(imageSrc, result);
      }

      options.onProgress?.('complete', 1.0);
      
      return result;
    } catch (error) {
      console.error('Image conversion failed:', error);
      throw new Error(`Failed to convert image: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  /**
   * Analyze an image with caching
   */
  private async analyzeImage(imageSrc: string, forceReanalysis: boolean = false): Promise<ImageAnalysisResult> {
    if (!forceReanalysis && this.analysisCache.has(imageSrc)) {
      return this.analysisCache.get(imageSrc)!;
    }

    const analysis = await imageAnalyzer.analyzeImage(imageSrc);
    this.analysisCache.set(imageSrc, analysis);
    return analysis;
  }

  /**
   * Process image variants based on analysis
   */
  private async processImageVariants(
    imageSrc: string, 
    analysis: ImageAnalysisResult, 
    options: ConversionOptions
  ): Promise<ConversionResult['processed']> {
    const presets = options.presets || [
      CONVERSION_PRESETS.thumbnail,
      CONVERSION_PRESETS.card,
      CONVERSION_PRESETS.hero,
      CONVERSION_PRESETS.original
    ];

    const processed: ConversionResult['processed'] = {} as any;

    // Process each preset
    for (const preset of presets) {
      const processingOptions: ProcessingOptions = {
        width: preset.width,
        height: preset.height,
        quality: preset.quality,
        format: preset.format,
        backgroundColor: preset.backgroundColor
      };

      // Add smart crop if enabled
      if (preset.smartCrop && analysis.recommendedCrop.score > 0.5) {
        processingOptions.cropRegion = {
          x: analysis.recommendedCrop.x,
          y: analysis.recommendedCrop.y,
          width: analysis.recommendedCrop.width,
          height: analysis.recommendedCrop.height
        };
      }

      processed[preset.name as keyof ConversionResult['processed']] = 
        await imageProcessor.processImage(imageSrc, processingOptions);
    }

    return processed;
  }

  /**
   * Convert multiple images in batch
   */
  async convertBatch(
    imageSrcs: string[], 
    options: ConversionOptions = {}
  ): Promise<ConversionResult[]> {
    const results: ConversionResult[] = [];
    const total = imageSrcs.length;

    for (let i = 0; i < imageSrcs.length; i++) {
      const imageSrc = imageSrcs[i];
      
      try {
        const result = await this.convertImage(imageSrc, {
          ...options,
          onProgress: (stage, progress) => {
            const overallProgress = (i + progress) / total;
            options.onProgress?.(`Processing ${i + 1}/${total}: ${stage}`, overallProgress);
          }
        });
        
        results.push(result);
      } catch (error) {
        console.error(`Failed to convert image ${i + 1}/${total}:`, error);
        // Continue with other images
      }
    }

    return results;
  }

  /**
   * Get optimized image URL for a specific use case
   */
  async getOptimizedImage(
    imageSrc: string, 
    useCase: 'thumbnail' | 'card' | 'hero' | 'original' = 'card'
  ): Promise<string> {
    // Skip processing for local images (they don't need conversion)
    if (this.isLocalImage(imageSrc)) {
      return imageSrc;
    }

    // Check if this is an external image that might have CORS issues
    if (isExternalImage(imageSrc) && !isCorsEnabled(imageSrc)) {
      console.warn('External image without CORS support, using original:', imageSrc);
      return imageSrc;
    }

    try {
      const result = await this.convertImage(imageSrc, { cacheResults: true });
      return result.processed[useCase].url;
    } catch (error) {
      console.warn('Image conversion failed, returning original:', error);
      return imageSrc;
    }
  }

  /**
   * Check if image is local (doesn't need conversion)
   */
  private isLocalImage(url: string): boolean {
    return url.startsWith('/') || 
           url.includes('localhost') || 
           url.includes('127.0.0.1') ||
           url.startsWith(window.location.origin);
  }

  /**
   * Preload and convert images for better performance
   */
  async preloadImages(imageSrcs: string[]): Promise<void> {
    const promises = imageSrcs.map(src => 
      this.convertImage(src, { cacheResults: true }).catch(() => {
        // Silently fail for preloading
      })
    );
    
    await Promise.all(promises);
  }

  /**
   * Clear cache to free memory
   */
  clearCache(): void {
    // Clean up object URLs
    for (const result of this.cache.values()) {
      Object.values(result.processed).forEach(img => {
        imageProcessor.constructor.cleanupUrl(img.url);
      });
    }
    
    this.cache.clear();
    this.analysisCache.clear();
  }

  /**
   * Get cache statistics
   */
  getCacheStats(): { size: number; memoryUsage: number } {
    let memoryUsage = 0;
    
    for (const result of this.cache.values()) {
      memoryUsage += result.metadata.totalSize;
    }
    
    return {
      size: this.cache.size,
      memoryUsage
    };
  }

  /**
   * Create a responsive image set for modern browsers
   */
  async createResponsiveImageSet(imageSrc: string): Promise<{
    srcSet: string;
    sizes: string;
    fallback: string;
  }> {
    const result = await this.convertImage(imageSrc, { cacheResults: true });
    
    const srcSet = [
      `${result.processed.thumbnail.url} 150w`,
      `${result.processed.card.url} 400w`,
      `${result.processed.hero.url} 1200w`,
      `${result.processed.original.url} 1920w`
    ].join(', ');

    const sizes = '(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw';
    
    return {
      srcSet,
      sizes,
      fallback: result.processed.card.url
    };
  }
}

// Export singleton instance
export const imageConverter = new ImageConverter();

// Utility functions for common use cases
export const convertImageForCard = (imageSrc: string) => 
  imageConverter.getOptimizedImage(imageSrc, 'card');

export const convertImageForThumbnail = (imageSrc: string) => 
  imageConverter.getOptimizedImage(imageSrc, 'thumbnail');

export const convertImageForHero = (imageSrc: string) => 
  imageConverter.getOptimizedImage(imageSrc, 'hero');

export const preloadPackageImages = (packages: any[]) => {
  const imageSrcs = packages
    .flatMap(pkg => pkg.images || [])
    .map(img => img.image)
    .filter(Boolean);
  
  return imageConverter.preloadImages(imageSrcs);
};

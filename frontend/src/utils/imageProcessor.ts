/**
 * Image Processing Module
 * Handles actual image manipulation, cropping, resizing, and format conversion
 */

export interface ProcessingOptions {
  width: number;
  height: number;
  quality?: number;
  format?: 'jpeg' | 'png' | 'webp' | 'avif';
  cropRegion?: {
    x: number;
    y: number;
    width: number;
    height: number;
  };
  backgroundColor?: string;
  blur?: number;
  sharpen?: boolean;
}

export interface ProcessedImage {
  blob: Blob;
  url: string;
  width: number;
  height: number;
  format: string;
  size: number; // in bytes
  processingTime: number; // in ms
}

export class ImageProcessor {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Process an image with the given options
   */
  async processImage(imageSrc: string, options: ProcessingOptions): Promise<ProcessedImage> {
    const startTime = performance.now();
    
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Try with CORS first
      img.crossOrigin = 'anonymous';
      
      img.onload = async () => {
        try {
          const result = await this.performProcessing(img, options);
          const endTime = performance.now();
          
          resolve({
            ...result,
            processingTime: endTime - startTime
          });
        } catch (error) {
          // If processing fails due to CORS, return original image
          console.warn('Image processing failed, returning original:', error);
          resolve(this.getFallbackProcessedImage(imageSrc, options, startTime));
        }
      };
      
      img.onerror = () => {
        // If CORS fails, try without CORS
        const fallbackImg = new Image();
        fallbackImg.onload = async () => {
          try {
            const result = await this.performProcessing(fallbackImg, options);
            const endTime = performance.now();
            
            resolve({
              ...result,
              processingTime: endTime - startTime
            });
          } catch (error) {
            console.warn('Fallback processing failed, returning original:', error);
            resolve(this.getFallbackProcessedImage(imageSrc, options, startTime));
          }
        };
        fallbackImg.onerror = () => {
          console.warn('Image loading failed completely, returning original');
          resolve(this.getFallbackProcessedImage(imageSrc, options, startTime));
        };
        fallbackImg.src = imageSrc;
      };
      
      img.src = imageSrc;
    });
  }

  /**
   * Perform the actual image processing
   */
  private async performProcessing(img: HTMLImageElement, options: ProcessingOptions): Promise<Omit<ProcessedImage, 'processingTime'>> {
    const { width, height, cropRegion, backgroundColor, blur, sharpen } = options;
    
    // Set canvas size
    this.canvas.width = width;
    this.canvas.height = height;
    
    // Clear canvas with background color if specified
    if (backgroundColor) {
      this.ctx.fillStyle = backgroundColor;
      this.ctx.fillRect(0, 0, width, height);
    }

    // Apply image smoothing
    this.ctx.imageSmoothingEnabled = true;
    this.ctx.imageSmoothingQuality = 'high';

    // Calculate source and destination dimensions
    let sourceX = 0, sourceY = 0, sourceWidth = img.width, sourceHeight = img.height;
    let destX = 0, destY = 0, destWidth = width, destHeight = height;

    // Apply crop region if specified
    if (cropRegion) {
      sourceX = cropRegion.x;
      sourceY = cropRegion.y;
      sourceWidth = cropRegion.width;
      sourceHeight = cropRegion.height;
    }

    // Calculate scaling to fit destination while maintaining aspect ratio
    const scaleX = destWidth / sourceWidth;
    const scaleY = destHeight / sourceHeight;
    const scale = Math.min(scaleX, scaleY);

    // Center the image
    const scaledWidth = sourceWidth * scale;
    const scaledHeight = sourceHeight * scale;
    destX = (destWidth - scaledWidth) / 2;
    destY = (destHeight - scaledHeight) / 2;

    // Draw the image
    this.ctx.drawImage(
      img,
      sourceX, sourceY, sourceWidth, sourceHeight,
      destX, destY, scaledWidth, scaledHeight
    );

    // Apply post-processing effects
    if (blur && blur > 0) {
      this.applyBlur(blur);
    }

    if (sharpen) {
      this.applySharpen();
    }

    // Convert to blob
    const format = options.format || 'webp';
    const quality = options.quality || 0.8;
    
    const blob = await this.canvasToBlob(format, quality);
    const url = URL.createObjectURL(blob);

    return {
      blob,
      url,
      width,
      height,
      format,
      size: blob.size
    };
  }

  /**
   * Apply blur effect to the canvas
   */
  private applyBlur(radius: number): void {
    this.ctx.filter = `blur(${radius}px)`;
    this.ctx.drawImage(this.canvas, 0, 0);
    this.ctx.filter = 'none';
  }

  /**
   * Apply sharpening effect to the canvas
   */
  private applySharpen(): void {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const width = this.canvas.width;
    const height = this.canvas.height;

    // Simple unsharp mask
    const kernel = [
      0, -1, 0,
      -1, 5, -1,
      0, -1, 0
    ];

    const newData = new Uint8ClampedArray(data);

    for (let y = 1; y < height - 1; y++) {
      for (let x = 1; x < width - 1; x++) {
        for (let c = 0; c < 3; c++) { // RGB channels only
          let sum = 0;
          for (let ky = -1; ky <= 1; ky++) {
            for (let kx = -1; kx <= 1; kx++) {
              const idx = ((y + ky) * width + (x + kx)) * 4 + c;
              sum += data[idx] * kernel[(ky + 1) * 3 + (kx + 1)];
            }
          }
          const idx = (y * width + x) * 4 + c;
          newData[idx] = Math.max(0, Math.min(255, sum));
        }
      }
    }

    this.ctx.putImageData(new ImageData(newData, width, height), 0, 0);
  }

  /**
   * Convert canvas to blob with specified format and quality
   */
  private async canvasToBlob(format: string, quality: number): Promise<Blob> {
    return new Promise((resolve, reject) => {
      this.canvas.toBlob(
        (blob) => {
          if (blob) {
            resolve(blob);
          } else {
            reject(new Error('Failed to convert canvas to blob'));
          }
        },
        `image/${format}`,
        quality
      );
    });
  }

  /**
   * Create a thumbnail from an image
   */
  async createThumbnail(imageSrc: string, size: number = 150): Promise<ProcessedImage> {
    return this.processImage(imageSrc, {
      width: size,
      height: size,
      format: 'webp',
      quality: 0.7
    });
  }

  /**
   * Create a card-optimized image
   */
  async createCardImage(imageSrc: string, width: number = 400, height: number = 300): Promise<ProcessedImage> {
    return this.processImage(imageSrc, {
      width,
      height,
      format: 'webp',
      quality: 0.8,
      backgroundColor: '#f7fafc' // Light gray background
    });
  }

  /**
   * Create a hero image (large, high quality)
   */
  async createHeroImage(imageSrc: string, width: number = 1200, height: number = 600): Promise<ProcessedImage> {
    return this.processImage(imageSrc, {
      width,
      height,
      format: 'webp',
      quality: 0.9
    });
  }

  /**
   * Create multiple sizes of an image
   */
  async createImageSet(imageSrc: string, sizes: Array<{width: number, height: number, name: string}>): Promise<Record<string, ProcessedImage>> {
    const results: Record<string, ProcessedImage> = {};
    
    for (const size of sizes) {
      results[size.name] = await this.processImage(imageSrc, {
        width: size.width,
        height: size.height,
        format: 'webp',
        quality: 0.8
      });
    }
    
    return results;
  }

  /**
   * Clean up object URLs to prevent memory leaks
   */
  static cleanupUrl(url: string): void {
    if (url.startsWith('blob:')) {
      URL.revokeObjectURL(url);
    }
  }

  /**
   * Get fallback processed image when processing fails
   */
  private getFallbackProcessedImage(imageSrc: string, options: ProcessingOptions, startTime: number): ProcessedImage {
    const endTime = performance.now();
    
    // Create a simple blob from the original image URL
    return fetch(imageSrc)
      .then(response => response.blob())
      .then(blob => ({
        blob,
        url: imageSrc, // Use original URL
        width: options.width,
        height: options.height,
        format: options.format || 'jpeg',
        size: blob.size,
        processingTime: endTime - startTime
      }))
      .catch(() => {
        // Ultimate fallback - return a placeholder
        const canvas = document.createElement('canvas');
        canvas.width = options.width;
        canvas.height = options.height;
        const ctx = canvas.getContext('2d')!;
        
        // Draw a simple placeholder
        ctx.fillStyle = options.backgroundColor || '#f7fafc';
        ctx.fillRect(0, 0, options.width, options.height);
        
        ctx.fillStyle = '#a0aec0';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Image', options.width / 2, options.height / 2 - 10);
        ctx.fillText('Unavailable', options.width / 2, options.height / 2 + 10);
        
        return canvas.toBlob().then(blob => ({
          blob: blob!,
          url: URL.createObjectURL(blob!),
          width: options.width,
          height: options.height,
          format: options.format || 'png',
          size: blob!.size,
          processingTime: endTime - startTime
        }));
      });
  }

  /**
   * Get optimal format based on browser support
   */
  static getOptimalFormat(): 'webp' | 'jpeg' | 'png' {
    const canvas = document.createElement('canvas');
    canvas.width = 1;
    canvas.height = 1;
    
    // Test WebP support
    if (canvas.toDataURL('image/webp').indexOf('data:image/webp') === 0) {
      return 'webp';
    }
    
    // Test JPEG support
    if (canvas.toDataURL('image/jpeg').indexOf('data:image/jpeg') === 0) {
      return 'jpeg';
    }
    
    // Fallback to PNG
    return 'png';
  }
}

// Export singleton instance
export const imageProcessor = new ImageProcessor();

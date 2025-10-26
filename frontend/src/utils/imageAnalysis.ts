/**
 * Image Analysis Module
 * Analyzes images to detect important regions, faces, and optimal crop areas
 */

export interface ImageAnalysisResult {
  width: number;
  height: number;
  aspectRatio: number;
  dominantColors: string[];
  importantRegions: Region[];
  faces: FaceRegion[];
  recommendedCrop: CropRegion;
  quality: 'high' | 'medium' | 'low';
}

export interface Region {
  x: number;
  y: number;
  width: number;
  height: number;
  importance: number; // 0-1 scale
  type: 'subject' | 'background' | 'text' | 'object';
}

export interface FaceRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  confidence: number;
}

export interface CropRegion {
  x: number;
  y: number;
  width: number;
  height: number;
  score: number; // 0-1 scale
}

export class ImageAnalyzer {
  private canvas: HTMLCanvasElement;
  private ctx: CanvasRenderingContext2D;

  constructor() {
    this.canvas = document.createElement('canvas');
    this.ctx = this.canvas.getContext('2d')!;
  }

  /**
   * Analyze an image and return detailed analysis
   */
  async analyzeImage(imageSrc: string): Promise<ImageAnalysisResult> {
    return new Promise((resolve, reject) => {
      const img = new Image();
      
      // Try with CORS first
      img.crossOrigin = 'anonymous';
      
      img.onload = () => {
        try {
          const result = this.performAnalysis(img);
          resolve(result);
        } catch (error) {
          // If analysis fails due to CORS, return a fallback analysis
          console.warn('Image analysis failed, using fallback:', error);
          resolve(this.getFallbackAnalysis(imageSrc));
        }
      };
      
      img.onerror = () => {
        // If CORS fails, try without CORS
        const fallbackImg = new Image();
        fallbackImg.onload = () => {
          try {
            const result = this.performAnalysis(fallbackImg);
            resolve(result);
          } catch (error) {
            console.warn('Fallback analysis failed, using default:', error);
            resolve(this.getFallbackAnalysis(imageSrc));
          }
        };
        fallbackImg.onerror = () => {
          console.warn('Image loading failed completely, using default analysis');
          resolve(this.getFallbackAnalysis(imageSrc));
        };
        fallbackImg.src = imageSrc;
      };
      
      img.src = imageSrc;
    });
  }

  /**
   * Perform the actual image analysis
   */
  private performAnalysis(img: HTMLImageElement): ImageAnalysisResult {
    const { width, height } = img;
    const aspectRatio = width / height;

    // Set canvas size
    this.canvas.width = width;
    this.canvas.height = height;
    this.ctx.drawImage(img, 0, 0);

    // Analyze image
    const dominantColors = this.extractDominantColors();
    const importantRegions = this.detectImportantRegions();
    const faces = this.detectFaces();
    const recommendedCrop = this.calculateOptimalCrop(importantRegions, faces, aspectRatio);
    const quality = this.assessImageQuality(width, height);

    return {
      width,
      height,
      aspectRatio,
      dominantColors,
      importantRegions,
      faces,
      recommendedCrop,
      quality
    };
  }

  /**
   * Extract dominant colors from the image
   */
  private extractDominantColors(): string[] {
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    const data = imageData.data;
    const colorMap = new Map<string, number>();

    // Sample every 10th pixel for performance
    for (let i = 0; i < data.length; i += 40) {
      const r = data[i];
      const g = data[i + 1];
      const b = data[i + 2];
      const color = `#${r.toString(16).padStart(2, '0')}${g.toString(16).padStart(2, '0')}${b.toString(16).padStart(2, '0')}`;
      colorMap.set(color, (colorMap.get(color) || 0) + 1);
    }

    // Get top 5 colors
    return Array.from(colorMap.entries())
      .sort((a, b) => b[1] - a[1])
      .slice(0, 5)
      .map(([color]) => color);
  }

  /**
   * Detect important regions using edge detection and color analysis
   */
  private detectImportantRegions(): Region[] {
    const regions: Region[] = [];
    const imageData = this.ctx.getImageData(0, 0, this.canvas.width, this.canvas.height);
    
    // Simple edge detection and region analysis
    const blockSize = 50; // Analyze in 50x50 blocks
    const blocksX = Math.floor(this.canvas.width / blockSize);
    const blocksY = Math.floor(this.canvas.height / blockSize);

    for (let y = 0; y < blocksY; y++) {
      for (let x = 0; x < blocksX; x++) {
        const importance = this.calculateBlockImportance(imageData, x * blockSize, y * blockSize, blockSize);
        
        if (importance > 0.3) { // Threshold for important regions
          regions.push({
            x: x * blockSize,
            y: y * blockSize,
            width: blockSize,
            height: blockSize,
            importance,
            type: this.classifyRegionType(imageData, x * blockSize, y * blockSize, blockSize)
          });
        }
      }
    }

    return regions;
  }

  /**
   * Calculate importance of a block based on color variance and edges
   */
  private calculateBlockImportance(imageData: ImageData, x: number, y: number, size: number): number {
    const data = imageData.data;
    let colorVariance = 0;
    let edgeStrength = 0;
    let pixelCount = 0;

    for (let dy = 0; dy < size && y + dy < this.canvas.height; dy++) {
      for (let dx = 0; dx < size && x + dx < this.canvas.width; dx++) {
        const idx = ((y + dy) * this.canvas.width + (x + dx)) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        
        // Calculate color variance
        const brightness = (r + g + b) / 3;
        colorVariance += Math.abs(brightness - 128) / 128;
        
        // Simple edge detection
        if (dx > 0 && dy > 0) {
          const prevIdx = ((y + dy - 1) * this.canvas.width + (x + dx - 1)) * 4;
          const prevBrightness = (data[prevIdx] + data[prevIdx + 1] + data[prevIdx + 2]) / 3;
          edgeStrength += Math.abs(brightness - prevBrightness) / 255;
        }
        
        pixelCount++;
      }
    }

    const avgVariance = colorVariance / pixelCount;
    const avgEdgeStrength = edgeStrength / pixelCount;
    
    return Math.min(1, (avgVariance + avgEdgeStrength) / 2);
  }

  /**
   * Classify region type based on color and texture
   */
  private classifyRegionType(imageData: ImageData, x: number, y: number, size: number): Region['type'] {
    // Simple classification based on color analysis
    const data = imageData.data;
    let totalBrightness = 0;
    let pixelCount = 0;

    for (let dy = 0; dy < size && y + dy < this.canvas.height; dy++) {
      for (let dx = 0; dx < size && x + dx < this.canvas.width; dx++) {
        const idx = ((y + dy) * this.canvas.width + (x + dx)) * 4;
        const r = data[idx];
        const g = data[idx + 1];
        const b = data[idx + 2];
        totalBrightness += (r + g + b) / 3;
        pixelCount++;
      }
    }

    const avgBrightness = totalBrightness / pixelCount;
    
    if (avgBrightness > 200) return 'background';
    if (avgBrightness < 50) return 'text';
    return 'subject';
  }

  /**
   * Detect faces using a simple heuristic (placeholder for real face detection)
   */
  private detectFaces(): FaceRegion[] {
    // This is a placeholder. In a real implementation, you'd use a face detection library
    // like face-api.js or integrate with a cloud service
    return [];
  }

  /**
   * Calculate optimal crop region based on important regions and faces
   */
  private calculateOptimalCrop(regions: Region[], faces: FaceRegion[], targetAspectRatio: number): CropRegion {
    // If we have faces, prioritize them
    if (faces.length > 0) {
      return this.cropAroundFaces(faces, targetAspectRatio);
    }

    // Otherwise, crop around important regions
    if (regions.length > 0) {
      return this.cropAroundRegions(regions, targetAspectRatio);
    }

    // Fallback to center crop
    return this.centerCrop(targetAspectRatio);
  }

  /**
   * Crop around detected faces
   */
  private cropAroundFaces(faces: FaceRegion[], targetAspectRatio: number): CropRegion {
    if (faces.length === 0) return this.centerCrop(targetAspectRatio);

    // Find bounding box of all faces
    const minX = Math.min(...faces.map(f => f.x));
    const minY = Math.min(...faces.map(f => f.y));
    const maxX = Math.max(...faces.map(f => f.x + f.width));
    const maxY = Math.max(...faces.map(f => f.y + f.height));

    // Add padding around faces
    const padding = Math.max(this.canvas.width, this.canvas.height) * 0.1;
    const faceWidth = maxX - minX + padding * 2;
    const faceHeight = maxY - minY + padding * 2;

    // Calculate crop dimensions
    let cropWidth = faceWidth;
    let cropHeight = faceHeight;

    if (faceWidth / faceHeight > targetAspectRatio) {
      cropHeight = cropWidth / targetAspectRatio;
    } else {
      cropWidth = cropHeight * targetAspectRatio;
    }

    // Center the crop around faces
    const cropX = Math.max(0, Math.min(this.canvas.width - cropWidth, minX - padding));
    const cropY = Math.max(0, Math.min(this.canvas.height - cropHeight, minY - padding));

    return {
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight,
      score: 0.9 // High score for face-based crops
    };
  }

  /**
   * Crop around important regions
   */
  private cropAroundRegions(regions: Region[], targetAspectRatio: number): CropRegion {
    // Find the most important region
    const mostImportant = regions.reduce((prev, current) => 
      prev.importance > current.importance ? prev : current
    );

    // Calculate crop around the most important region
    const padding = Math.max(this.canvas.width, this.canvas.height) * 0.2;
    const cropX = Math.max(0, mostImportant.x - padding);
    const cropY = Math.max(0, mostImportant.y - padding);
    const cropWidth = Math.min(this.canvas.width - cropX, mostImportant.width + padding * 2);
    const cropHeight = Math.min(this.canvas.height - cropY, mostImportant.height + padding * 2);

    // Adjust to target aspect ratio
    let finalWidth = cropWidth;
    let finalHeight = cropHeight;

    if (cropWidth / cropHeight > targetAspectRatio) {
      finalHeight = finalWidth / targetAspectRatio;
    } else {
      finalWidth = finalHeight * targetAspectRatio;
    }

    // Ensure crop stays within image bounds
    const finalX = Math.max(0, Math.min(this.canvas.width - finalWidth, cropX));
    const finalY = Math.max(0, Math.min(this.canvas.height - finalHeight, cropY));

    return {
      x: finalX,
      y: finalY,
      width: finalWidth,
      height: finalHeight,
      score: mostImportant.importance
    };
  }

  /**
   * Center crop fallback
   */
  private centerCrop(targetAspectRatio: number): CropRegion {
    const { width, height } = this.canvas;
    let cropWidth = width;
    let cropHeight = height;

    if (width / height > targetAspectRatio) {
      cropWidth = height * targetAspectRatio;
    } else {
      cropHeight = width / targetAspectRatio;
    }

    const cropX = (width - cropWidth) / 2;
    const cropY = (height - cropHeight) / 2;

    return {
      x: cropX,
      y: cropY,
      width: cropWidth,
      height: cropHeight,
      score: 0.5 // Medium score for center crop
    };
  }

  /**
   * Assess image quality based on dimensions
   */
  private assessImageQuality(width: number, height: number): 'high' | 'medium' | 'low' {
    const megapixels = (width * height) / 1000000;
    
    if (megapixels >= 2) return 'high';
    if (megapixels >= 0.5) return 'medium';
    return 'low';
  }

  /**
   * Get fallback analysis when image analysis fails
   */
  private getFallbackAnalysis(imageSrc: string): ImageAnalysisResult {
    // Try to extract dimensions from URL if possible
    const urlParams = new URLSearchParams(imageSrc.split('?')[1]);
    const width = parseInt(urlParams.get('w') || '800');
    const height = parseInt(urlParams.get('h') || '600');
    
    return {
      width,
      height,
      aspectRatio: width / height,
      dominantColors: ['#f7fafc', '#e2e8f0', '#cbd5e0'], // Default gray colors
      importantRegions: [{
        x: width * 0.25,
        y: height * 0.25,
        width: width * 0.5,
        height: height * 0.5,
        importance: 0.8,
        type: 'subject' as const
      }],
      faces: [],
      recommendedCrop: this.centerCrop(width / height),
      quality: this.assessImageQuality(width, height)
    };
  }
}

// Export singleton instance
export const imageAnalyzer = new ImageAnalyzer();

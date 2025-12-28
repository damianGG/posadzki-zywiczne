/**
 * Custom Cloudinary image loader for Next.js Image component
 * Automatically applies optimizations for better mobile experience
 */

export interface CloudinaryLoaderParams {
  src: string;
  width: number;
  quality?: number;
}

/**
 * Helper function to parse Cloudinary URLs
 * Returns null if not a valid Cloudinary upload URL
 */
function parseCloudinaryUrl(src: string): { baseUrl: string; imagePath: string } | null {
  if (!src.includes('res.cloudinary.com')) {
    return null;
  }

  const urlParts = src.split('/upload/');
  if (urlParts.length !== 2) {
    return null;
  }

  return {
    baseUrl: urlParts[0],
    imagePath: urlParts[1]
  };
}

/**
 * Helper function to build quality transformations
 */
function buildQualityTransformations(quality?: number): string[] {
  const transformations: string[] = [];
  
  if (quality) {
    transformations.push(`q_${quality}`);
  } else {
    // Use auto quality for best results
    transformations.push('q_auto:best');
  }
  
  return transformations;
}

/**
 * Default Cloudinary loader function for Next.js Image component
 * Only applies transformations to Cloudinary URLs
 */
export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderParams): string {
  const parsedUrl = parseCloudinaryUrl(src);
  
  if (!parsedUrl) {
    return src;
  }

  // Build transformation string
  const transformations: string[] = [];
  
  // Width transformation for responsive images
  transformations.push(`w_${width}`);
  
  // Quality transformations
  transformations.push(...buildQualityTransformations(quality));
  
  // Auto format (WebP/AVIF when supported by browser)
  transformations.push('f_auto');
  
  // DPR auto for retina displays
  transformations.push('dpr_auto');
  
  // Combine transformations
  const transformString = transformations.join(',');
  
  // Rebuild the URL with transformations
  return `${parsedUrl.baseUrl}/upload/${transformString}/${parsedUrl.imagePath}`;
}

/**
 * Helper function to check if a URL is a Cloudinary URL
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.includes('res.cloudinary.com');
}

/**
 * Get optimized Cloudinary URL with specific transformations
 */
export function getOptimizedCloudinaryUrl(
  src: string,
  options: {
    width?: number;
    height?: number;
    quality?: number;
    crop?: 'fill' | 'fit' | 'scale' | 'limit';
    format?: 'auto' | 'webp' | 'avif' | 'jpg' | 'png';
    dpr?: 'auto' | number | false;
  } = {}
): string {
  const parsedUrl = parseCloudinaryUrl(src);
  
  if (!parsedUrl) {
    return src;
  }

  const transformations: string[] = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  
  // Use shared quality transformation logic
  transformations.push(...buildQualityTransformations(options.quality));
  
  if (options.crop) transformations.push(`c_${options.crop}`);
  
  // Format handling
  if (options.format === 'auto') {
    transformations.push('f_auto');
  } else if (options.format) {
    transformations.push(`f_${options.format}`);
  }

  // DPR transformation (default: auto for retina displays)
  if (options.dpr !== false) {
    if (options.dpr === 'auto' || options.dpr === undefined) {
      transformations.push('dpr_auto');
    } else if (typeof options.dpr === 'number') {
      transformations.push(`dpr_${options.dpr}`);
    }
  }

  const transformString = transformations.join(',');
  return `${parsedUrl.baseUrl}/upload/${transformString}/${parsedUrl.imagePath}`;
}

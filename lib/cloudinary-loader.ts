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
  // More strict validation: must start with https://res.cloudinary.com
  if (!src.startsWith('https://res.cloudinary.com/')) {
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
 * Mobile-optimized Cloudinary loader that prioritizes full height
 * Uses portrait aspect ratio and crop to fill for better mobile viewing
 */
export function cloudinaryLoaderMobile({ src, width, quality }: CloudinaryLoaderParams): string {
  const parsedUrl = parseCloudinaryUrl(src);
  
  if (!parsedUrl) {
    return src;
  }

  // Build transformation string optimized for mobile portrait viewing
  const transformations: string[] = [];
  
  // Width constraint
  transformations.push(`w_${width}`);
  
  // Height constraint - use aspect ratio that fills mobile screen vertically
  // Most mobile screens are around 16:9 or taller, so use ~1.5:1 aspect ratio (portrait)
  const height = Math.round(width * 1.5); // 3:2 portrait aspect ratio
  transformations.push(`h_${height}`);
  
  // Crop to fill - ensures image fills the space even if cropping is needed
  transformations.push('c_fill');
  
  // Gravity auto - intelligently focuses on the most important part of the image
  transformations.push('g_auto');
  
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
 * Uses strict validation to prevent URL manipulation attacks
 */
export function isCloudinaryUrl(url: string): boolean {
  return url.startsWith('https://res.cloudinary.com/');
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
    gravity?: 'auto' | 'face' | 'faces' | 'center';
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
  if (options.gravity) transformations.push(`g_${options.gravity}`);
  
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

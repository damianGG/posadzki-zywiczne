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
 * Default Cloudinary loader function for Next.js Image component
 * Only applies transformations to Cloudinary URLs
 */
export default function cloudinaryLoader({ src, width, quality }: CloudinaryLoaderParams): string {
  // If it's not a Cloudinary URL, return as-is
  if (!src.includes('res.cloudinary.com')) {
    return src;
  }

  // Parse the Cloudinary URL
  // Format: https://res.cloudinary.com/cloud_name/image/upload/...
  const urlParts = src.split('/upload/');
  
  if (urlParts.length !== 2) {
    // Not a standard Cloudinary upload URL, return as-is
    return src;
  }

  // Build transformation string
  const transformations: string[] = [];
  
  // Width transformation for responsive images
  transformations.push(`w_${width}`);
  
  // Quality transformation (if specified)
  if (quality) {
    transformations.push(`q_${quality}`);
  } else {
    // Use auto quality for best results
    transformations.push('q_auto:best');
  }
  
  // Auto format (WebP/AVIF when supported by browser)
  transformations.push('f_auto');
  
  // DPR auto for retina displays
  transformations.push('dpr_auto');
  
  // Combine transformations
  const transformString = transformations.join(',');
  
  // Rebuild the URL with transformations
  return `${urlParts[0]}/upload/${transformString}/${urlParts[1]}`;
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
  } = {}
): string {
  if (!isCloudinaryUrl(src)) {
    return src;
  }

  const urlParts = src.split('/upload/');
  if (urlParts.length !== 2) {
    return src;
  }

  const transformations: string[] = [];

  if (options.width) transformations.push(`w_${options.width}`);
  if (options.height) transformations.push(`h_${options.height}`);
  if (options.quality) transformations.push(`q_${options.quality}`);
  if (options.crop) transformations.push(`c_${options.crop}`);
  
  // Format handling
  if (options.format === 'auto') {
    transformations.push('f_auto');
  } else if (options.format) {
    transformations.push(`f_${options.format}`);
  }

  // Default to auto quality if not specified
  if (!options.quality) {
    transformations.push('q_auto:best');
  }

  // DPR auto for retina displays
  transformations.push('dpr_auto');

  const transformString = transformations.join(',');
  return `${urlParts[0]}/upload/${transformString}/${urlParts[1]}`;
}

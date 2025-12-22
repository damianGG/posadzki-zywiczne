import { ConfiguratorInput, ConfiguratorResult } from '@/types/ecommerce';

// Bucket size options in m²
const BUCKET_SIZES = [10, 20, 30, 40, 50, 60, 80, 100];

// R10 anti-slip surcharge in PLN
export const R10_SURCHARGE = 500;

/**
 * Round area up to the nearest bucket size
 */
export function roundAreaToBucket(area: number): number {
  for (const size of BUCKET_SIZES) {
    if (area <= size) {
      return size;
    }
  }
  return BUCKET_SIZES[BUCKET_SIZES.length - 1];
}

/**
 * Determine resin type based on underfloor heating
 */
export function determineType(underfloorHeating: boolean): 'EP' | 'PU' {
  return underfloorHeating ? 'PU' : 'EP';
}

/**
 * Generate SKU based on configurator inputs
 * Format: GAR-{EP|PU}-{BUCKET}[-R10][-COLOR]
 */
export function generateSKU(input: ConfiguratorInput): string {
  const bucket = roundAreaToBucket(input.area);
  const type = determineType(input.underfloorHeating);
  
  let sku = `GAR-${type}-${bucket}`;
  
  if (input.antiSlip === 'R10') {
    sku += '-R10';
  }
  
  if (input.color) {
    sku += `-${input.color.toUpperCase()}`;
  }
  
  return sku;
}

/**
 * Calculate recommended kit configuration
 */
export function calculateRecommendedKit(input: ConfiguratorInput): ConfiguratorResult {
  const bucket = roundAreaToBucket(input.area);
  const type = determineType(input.underfloorHeating);
  const hasR10 = input.antiSlip === 'R10';
  const sku = generateSKU(input);
  
  return {
    sku,
    type,
    bucketSize: bucket,
    hasR10,
    color: input.color,
  };
}

/**
 * Calculate final price with modifiers
 */
export function calculatePrice(basePrice: number, hasR10: boolean): number {
  let finalPrice = basePrice;
  
  if (hasR10) {
    finalPrice += R10_SURCHARGE;
  }
  
  return finalPrice;
}

/**
 * Generate a friendly kit name
 */
export function generateKitName(type: string, bucketSize: number, hasR10: boolean, color?: string): string {
  let name = `System ${type === 'PU' ? 'poliuretanowy' : 'epoksydowy'} ${bucketSize}m²`;
  
  if (hasR10) {
    name += ' z antypoślizgiem R10';
  }
  
  if (color) {
    name += ` - ${color}`;
  }
  
  return name;
}

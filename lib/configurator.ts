// Configurator logic for garage flooring kits

export interface ConfiguratorInput {
  area: number // in m²
  underfloorHeating: boolean
  antiSlip: 'none' | 'R10'
  color?: string
}

export interface ConfiguratorResult {
  sku: string
  type: 'EP' | 'PU'
  bucket: number
  hasR10: boolean
  color: string
  recommendedKit: string
}

const BUCKET_SIZES = [10, 20, 30, 40, 50, 60, 80, 100]

/**
 * Round up area to the nearest bucket size
 */
function roundToBucket(area: number): number {
  for (const bucket of BUCKET_SIZES) {
    if (area <= bucket) {
      return bucket
    }
  }
  return 100 // Max bucket size
}

/**
 * Generate SKU based on configurator inputs
 * Format: GAR-{EP|PU}-{BUCKET}[-R10][-COLOR]
 */
export function generateSKU(input: ConfiguratorInput): string {
  const bucket = roundToBucket(input.area)
  const type = input.underfloorHeating ? 'PU' : 'EP'
  const hasR10 = input.antiSlip === 'R10'
  const color = input.color || 'SZARY'

  let sku = `GAR-${type}-${bucket}`
  
  if (hasR10) {
    sku += '-R10'
  }
  
  if (color && color !== 'SZARY') {
    sku += `-${color.toUpperCase()}`
  }

  return sku
}

/**
 * Get configurator result from inputs
 */
export function getConfiguratorResult(input: ConfiguratorInput): ConfiguratorResult {
  const bucket = roundToBucket(input.area)
  const type = input.underfloorHeating ? 'PU' : 'EP'
  const hasR10 = input.antiSlip === 'R10'
  const color = input.color || 'SZARY'
  const sku = generateSKU(input)

  let recommendedKit = `Zestaw ${type === 'EP' ? 'Epoksydowy' : 'Poliuretanowy'} ${bucket}m²`
  
  if (hasR10) {
    recommendedKit += ' z antypoślizgiem R10'
  }
  
  if (color && color !== 'SZARY') {
    recommendedKit += ` - ${color}`
  }

  return {
    sku,
    type,
    bucket,
    hasR10,
    color,
    recommendedKit,
  }
}

/**
 * Available colors for configurator
 */
export const AVAILABLE_COLORS = [
  { value: 'SZARY', label: 'Szary' },
  { value: 'GRAFITOWY', label: 'Grafitowy' },
  { value: 'BEŻOWY', label: 'Beżowy' },
  { value: 'ZIELONY', label: 'Zielony' },
  { value: 'CZERWONY', label: 'Czerwony' },
  { value: 'NIEBIESKI', label: 'Niebieski' },
]

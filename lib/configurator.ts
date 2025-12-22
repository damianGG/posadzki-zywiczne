export interface ConfiguratorInput {
  area: number
  underfloorHeating: boolean
  antiSlip: 'none' | 'R10'
  color: string
}

export interface ConfiguratorResult {
  sku: string
  type: 'EP' | 'PU'
  bucketSize: number
  hasR10: boolean
  color: string
  recommendedKit: string
  description: string
}

const BUCKET_SIZES = [10, 20, 30, 40, 50, 60, 80, 100]

export function roundAreaToBucket(area: number): number {
  // Round up to the nearest bucket size
  for (const size of BUCKET_SIZES) {
    if (area <= size) {
      return size
    }
  }
  // If area is greater than 100, return 100 (or could handle differently)
  return 100
}

export function calculateRecommendedKit(input: ConfiguratorInput): ConfiguratorResult {
  // Determine type based on underfloor heating
  const type: 'EP' | 'PU' = input.underfloorHeating ? 'PU' : 'EP'
  
  // Round area to bucket size
  const bucketSize = roundAreaToBucket(input.area)
  
  // Check if R10 is needed
  const hasR10 = input.antiSlip === 'R10'
  
  // Generate SKU
  let sku = `GAR-${type}-${bucketSize}`
  
  if (hasR10) {
    sku += '-R10'
  }
  
  if (input.color && input.color !== 'szary') {
    // Add color code (first 2 letters uppercase)
    const colorCode = input.color.substring(0, 2).toUpperCase()
    sku += `-${colorCode}`
  }
  
  // Generate description
  const typeDesc = type === 'PU' ? 'poliuretanowy' : 'epoksydowy'
  const heatingDesc = input.underfloorHeating 
    ? 'z ogrzewaniem podłogowym' 
    : 'bez ogrzewania podłogowego'
  const antiSlipDesc = hasR10 ? 'z powłoką antypoślizgową R10' : ''
  const colorDesc = input.color ? `w kolorze ${input.color}` : ''
  
  const description = [
    `Zestaw ${typeDesc} do garażu`,
    heatingDesc,
    `na powierzchnię do ${bucketSize}m²`,
    antiSlipDesc,
    colorDesc
  ]
    .filter(Boolean)
    .join(', ')
    .replace(/, ([^,]*)$/, ' $1') // Replace last comma with space
  
  return {
    sku,
    type,
    bucketSize,
    hasR10,
    color: input.color,
    recommendedKit: sku,
    description
  }
}

export function getConfiguratorPrice(result: ConfiguratorResult, basePrice: number, r10Surcharge: number = 200): number {
  let price = basePrice
  
  // Add R10 surcharge if applicable
  if (result.hasR10) {
    price += r10Surcharge
  }
  
  return price
}

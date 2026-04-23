import { ShopBundle, ShopCartSummary, ShopCatalog, ShopProduct, ShopResolvedBundleItem } from "@/types/shop"

const roundCurrency = (value: number) => Math.round(value * 100) / 100

export const roomTypeLabels: Record<string, string> = {
  garaz: "Garaż",
  piwnica: "Piwnica",
}

export function getRoomTypeLabel(roomType: string) {
  return roomTypeLabels[roomType] ?? roomType
}

export function estimatePerimeter(area: number) {
  // MVP assumes a near-square room to estimate mb-based extras like cokoły.
  return Math.max(0, 4 * Math.sqrt(area))
}

export function calculateBundleTotal(bundle: ShopBundle, area: number) {
  return roundCurrency(bundle.base_price + bundle.price_per_m2 * area)
}

export function calculateProductTotal(product: ShopProduct, area: number) {
  switch (product.pricing_model) {
    case "m2":
      return roundCurrency(product.price * area)
    case "mb":
      return roundCurrency(product.price * estimatePerimeter(area))
    case "unit":
    case "fixed":
    default:
      return roundCurrency(product.price)
  }
}

export function formatProductPricing(product: ShopProduct) {
  switch (product.pricing_model) {
    case "m2":
      return `${product.price.toFixed(0)} zł / m²`
    case "mb":
      return `${product.price.toFixed(0)} zł / mb`
    case "unit":
      return `${product.price.toFixed(0)} zł / szt.`
    case "fixed":
    default:
      return `${product.price.toFixed(0)} zł / zamówienie`
  }
}

export function resolveBundleItems(bundle: ShopBundle, products: ShopProduct[], area: number): ShopResolvedBundleItem[] {
  return (bundle.included_items ?? []).map((item) => {
    let quantity = item.quantity_value

    if (item.quantity_type === "per_m2") {
      quantity = item.quantity_value * area
    }

    if (item.quantity_type === "per_10m2") {
      quantity = Math.ceil(area / 10) * item.quantity_value
    }

    return {
      ...item,
      product: products.find((product) => product.product_id === item.product_id),
      quantity: roundCurrency(quantity),
    }
  })
}

export function getAvailableBundles(catalog: ShopCatalog, roomType: string, area: number) {
  return catalog.bundles
    .filter((bundle) => bundle.is_active !== false)
    .filter((bundle) => bundle.room_type === roomType)
    .filter((bundle) => area >= bundle.coverage_from_m2)
    .filter((bundle) => bundle.coverage_to_m2 == null || area <= bundle.coverage_to_m2)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
}

export function getRecommendedProducts(catalog: ShopCatalog, roomType: string, area: number, selectedBundleId?: string | null) {
  const ids = new Set<string>()

  catalog.recommendationRules
    .filter((rule) => rule.is_active !== false)
    .filter((rule) => rule.room_type === roomType)
    .filter((rule) => area >= rule.min_area)
    .filter((rule) => rule.max_area == null || area <= rule.max_area)
    .forEach((rule) => {
      rule.recommended_product_ids.forEach((id) => ids.add(id))
    })

  if (selectedBundleId) {
    const bundle = catalog.bundles.find((entry) => entry.variant_id === selectedBundleId)
    bundle?.recommended_product_ids?.forEach((id) => ids.add(id))
  }

  return catalog.products
    .filter((product) => product.is_active !== false)
    .filter((product) => ids.has(product.product_id))
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
}

export function getRecommendationCopy(catalog: ShopCatalog, roomType: string, area: number) {
  return catalog.recommendationRules
    .filter((rule) => rule.is_active !== false)
    .filter((rule) => rule.room_type === roomType)
    .filter((rule) => area >= rule.min_area)
    .find((rule) => rule.max_area == null || area <= rule.max_area)
}

export function getCartSummary(
  catalog: ShopCatalog,
  roomType: string,
  area: number,
  bundleId: string | null,
  addOnProductIds: string[]
): ShopCartSummary {
  const selectedBundle = catalog.bundles.find((bundle) => bundle.variant_id === bundleId) ?? null
  const selectedAddOns = catalog.products
    .filter((product) => addOnProductIds.includes(product.product_id))
    .map((product) => ({
      product,
      total: calculateProductTotal(product, area),
    }))

  const selectedBundleTotal = selectedBundle ? calculateBundleTotal(selectedBundle, area) : 0
  const total = roundCurrency(selectedBundleTotal + selectedAddOns.reduce((sum, item) => sum + item.total, 0))

  return {
    roomType,
    area,
    selectedBundle,
    selectedBundleTotal,
    selectedAddOns,
    total,
  }
}

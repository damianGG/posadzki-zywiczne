export type ShopPricingModel = "fixed" | "unit" | "m2" | "mb"
export type ShopQuantityType = "fixed" | "per_m2" | "per_10m2"

export interface ShopProduct {
  id?: string
  product_id: string
  name: string
  short_name?: string
  description: string
  category: string
  price: number
  pricing_model: ShopPricingModel
  unit_label?: string
  image_url?: string
  tags?: string[]
  applicable_room_types?: string[]
  is_featured?: boolean
  is_active?: boolean
  display_order?: number
}

export interface ShopBundleItem {
  product_id: string
  quantity_type: ShopQuantityType
  quantity_value: number
  unit_label?: string
  note?: string
}

export interface ShopBundle {
  id?: string
  variant_id: string
  name: string
  short_name?: string
  description: string
  room_type: string
  coverage_from_m2: number
  coverage_to_m2?: number | null
  base_price: number
  price_per_m2: number
  image_url?: string
  highlights?: string[]
  included_items?: ShopBundleItem[]
  recommended_product_ids?: string[]
  cta_label?: string
  is_active?: boolean
  display_order?: number
}

export interface ShopRecommendationRule {
  id?: string
  rule_id: string
  name: string
  title: string
  description?: string
  room_type: string
  min_area: number
  max_area?: number | null
  recommended_product_ids: string[]
  is_active?: boolean
  display_order?: number
}

export interface ShopCatalog {
  products: ShopProduct[]
  bundles: ShopBundle[]
  recommendationRules: ShopRecommendationRule[]
}

export interface ShopResolvedBundleItem extends ShopBundleItem {
  product?: ShopProduct
  quantity: number
}

export interface ShopCartSummary {
  roomType: string
  area: number
  selectedBundle: ShopBundle | null
  selectedBundleTotal: number
  selectedAddOns: Array<{
    product: ShopProduct
    total: number
  }>
  total: number
}

export interface ShopInquiryPayload {
  customerName: string
  email: string
  phone?: string
  notes?: string
  roomType: string
  area: number
  bundleId: string
  addOnProductIds: string[]
  baseColorId?: string
  baseColorName?: string
  flakeColorId?: string
  flakeColorName?: string
}

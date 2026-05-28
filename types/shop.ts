export type ShopPricingModel = "fixed" | "unit" | "m2" | "mb"
export type ShopQuantityType = "fixed" | "per_m2" | "per_10m2"
export type ShopConfiguratorStepId = "room" | "substrate" | "finish" | "floor-color" | "flake-color" | "area" | "plinth" | "result"
export type ShopConfiguratorOptionVisibility = "always" | "with-flakes" | "with-plinth" | "variant-match"
export type ShopConfiguratorRoomStatus = "active" | "coming-soon" | "inactive"

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

export interface ShopConfiguratorRoomVariant {
  id: string
  label: string
  description: string
  status?: ShopConfiguratorRoomStatus
  status_label?: string
  is_active?: boolean
  sort_order?: number
  image_url?: string
}

export interface ShopConfiguratorStepSetting {
  id: ShopConfiguratorStepId
  title: string
  question: string
  description?: string
  helper_text?: string
  is_active?: boolean
  next_label?: string
  sort_order?: number
}

export interface ShopConfiguratorOptionBase {
  id: string
  label: string
  description?: string
  is_active?: boolean
  sort_order?: number
  image_url?: string
}

export interface ShopConfiguratorSubstrateOption extends ShopConfiguratorOptionBase {}

export interface ShopConfiguratorFinishVariant extends ShopConfiguratorOptionBase {
  price_from: number
  price_unit_label?: string
  requires_flake_color: boolean
  badge?: string
}

export interface ShopConfiguratorColorOption extends ShopConfiguratorOptionBase {
  hex: string
  thumbnail_url?: string
}

export interface ShopConfiguratorFlakeColorOption extends ShopConfiguratorOptionBase {
  swatch_colors?: string[]
}

export interface ShopConfiguratorKitItem {
  id: string
  label: string
  description?: string
  is_active?: boolean
  sort_order?: number
  visibility?: ShopConfiguratorOptionVisibility
  finish_variant_ids?: string[]
}

export interface ShopConfiguratorCtaButton {
  id: string
  label: string
  href?: string
  variant?: "default" | "outline" | "secondary"
  is_active?: boolean
  sort_order?: number
}

export interface ShopConfiguratorAreaSettings {
  label: string
  quick_choices: number[]
  helper_text: string
  allowance_message: string
  min: number
  max: number
  step: number
}

export interface ShopConfiguratorPlinthSettings {
  question: string
  helper_text?: string
  enabled: boolean
  no_option_label: string
  no_option_description: string
  yes_option_label: string
  yes_option_description: string
  length_label: string
  length_hint: string
  price_per_mb: number
  unit_label: string
}

export interface ShopConfiguratorMessages {
  badge: string
  title: string
  description: string
  room_section_label: string
  result_title: string
  result_description: string
  result_allowance_message: string
  mock_cta_message: string
}

export interface ShopConfiguratorConfig {
  room_variants: ShopConfiguratorRoomVariant[]
  steps: ShopConfiguratorStepSetting[]
  substrate_options: ShopConfiguratorSubstrateOption[]
  finish_variants: ShopConfiguratorFinishVariant[]
  floor_colors: ShopConfiguratorColorOption[]
  flake_colors: ShopConfiguratorFlakeColorOption[]
  kit_items: ShopConfiguratorKitItem[]
  cta_buttons: ShopConfiguratorCtaButton[]
  area: ShopConfiguratorAreaSettings
  plinth: ShopConfiguratorPlinthSettings
  messages: ShopConfiguratorMessages
}

export interface ShopCatalog {
  products: ShopProduct[]
  bundles: ShopBundle[]
  recommendationRules: ShopRecommendationRule[]
  configuratorConfig: ShopConfiguratorConfig
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

export interface ShopConfiguratorSelections {
  roomVariantId: string | null
  substrateId: string | null
  finishVariantId: string | null
  floorColorId: string | null
  flakeColorId: string | null
  area: number
  wantsPlinth: boolean | null
  plinthLengthMb: number
}

export interface ShopInquiryPayload {
  customerName: string
  email: string
  phone?: string
  notes?: string
  roomType: string
  area: number
  bundleId: string
  addOnProductIds?: string[]
  baseColorId?: string
  baseColorName?: string
  flakeColorId?: string
  flakeColorName?: string
  roomVariantId?: string
  roomVariantName?: string
  substrateId?: string
  substrateName?: string
  finishVariantId?: string
  finishVariantName?: string
  floorColorId?: string
  floorColorName?: string
  wantsPlinth?: boolean
  plinthLengthMb?: number
  estimatedTotal?: number
}

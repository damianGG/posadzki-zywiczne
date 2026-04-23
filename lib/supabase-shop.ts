import { createClient, SupabaseClient } from "@supabase/supabase-js"

import { fallbackShopCatalog } from "@/data/shop-fallback"
import { ShopBundle, ShopCatalog, ShopProduct, ShopRecommendationRule } from "@/types/shop"

interface FetchOptions {
  includeInactive?: boolean
  useAdmin?: boolean
}

export function isShopSupabaseConfigured() {
  return Boolean((process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL) && process.env.SUPABASE_SERVICE_ROLE_KEY)
}

function getSupabaseAdmin(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl || !supabaseServiceKey) {
    return null
  }

  return createClient(supabaseUrl, supabaseServiceKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}

function getSupabasePublic(): SupabaseClient | null {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || process.env.SUPABASE_URL
  const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY

  if (!supabaseUrl || !supabaseAnonKey) {
    return getSupabaseAdmin()
  }

  return createClient(supabaseUrl, supabaseAnonKey)
}

export async function getAllShopProducts(options: FetchOptions = {}) {
  const supabase = options.useAdmin ? getSupabaseAdmin() : getSupabasePublic()
  if (!supabase) {
    return { success: true, data: fallbackShopCatalog.products }
  }

  const query = supabase.from("shop_products").select("*").order("display_order")
  const { data, error } = options.includeInactive ? await query : await query.eq("is_active", true)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: (data as ShopProduct[]) ?? [] }
}

export async function getAllShopBundles(options: FetchOptions = {}) {
  const supabase = options.useAdmin ? getSupabaseAdmin() : getSupabasePublic()
  if (!supabase) {
    return { success: true, data: fallbackShopCatalog.bundles }
  }

  const query = supabase.from("shop_bundles").select("*").order("display_order")
  const { data, error } = options.includeInactive ? await query : await query.eq("is_active", true)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: (data as ShopBundle[]) ?? [] }
}

export async function getAllShopRecommendationRules(options: FetchOptions = {}) {
  const supabase = options.useAdmin ? getSupabaseAdmin() : getSupabasePublic()
  if (!supabase) {
    return { success: true, data: fallbackShopCatalog.recommendationRules }
  }

  const query = supabase.from("shop_recommendation_rules").select("*").order("display_order")
  const { data, error } = options.includeInactive ? await query : await query.eq("is_active", true)

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: (data as ShopRecommendationRule[]) ?? [] }
}

export async function getShopCatalog(): Promise<ShopCatalog> {
  const [productsResult, bundlesResult, recommendationRulesResult] = await Promise.all([
    getAllShopProducts(),
    getAllShopBundles(),
    getAllShopRecommendationRules(),
  ])

  if (!productsResult.success || !bundlesResult.success || !recommendationRulesResult.success) {
    return fallbackShopCatalog
  }

  return {
    products: productsResult.data ?? [],
    bundles: bundlesResult.data ?? [],
    recommendationRules: recommendationRulesResult.data ?? [],
  }
}

export async function createShopProduct(data: ShopProduct) {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return { success: false, error: "Supabase not configured" }
  }

  const { data: result, error } = await supabase
    .from("shop_products")
    .insert(data)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: result as ShopProduct }
}

export async function updateShopProduct(productId: string, updates: Partial<ShopProduct>) {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return { success: false, error: "Supabase not configured" }
  }

  const { data: result, error } = await supabase
    .from("shop_products")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("product_id", productId)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: result as ShopProduct }
}

export async function createShopBundle(data: ShopBundle) {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return { success: false, error: "Supabase not configured" }
  }

  const { data: result, error } = await supabase
    .from("shop_bundles")
    .insert(data)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: result as ShopBundle }
}

export async function updateShopBundle(bundleId: string, updates: Partial<ShopBundle>) {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return { success: false, error: "Supabase not configured" }
  }

  const { data: result, error } = await supabase
    .from("shop_bundles")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("variant_id", bundleId)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: result as ShopBundle }
}

export async function createShopRecommendationRule(data: ShopRecommendationRule) {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return { success: false, error: "Supabase not configured" }
  }

  const { data: result, error } = await supabase
    .from("shop_recommendation_rules")
    .insert(data)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: result as ShopRecommendationRule }
}

export async function updateShopRecommendationRule(ruleId: string, updates: Partial<ShopRecommendationRule>) {
  const supabase = getSupabaseAdmin()
  if (!supabase) {
    return { success: false, error: "Supabase not configured" }
  }

  const { data: result, error } = await supabase
    .from("shop_recommendation_rules")
    .update({ ...updates, updated_at: new Date().toISOString() })
    .eq("rule_id", ruleId)
    .select()
    .single()

  if (error) {
    return { success: false, error: error.message }
  }

  return { success: true, data: result as ShopRecommendationRule }
}

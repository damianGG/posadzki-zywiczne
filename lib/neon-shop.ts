import { fallbackShopCatalog } from "@/data/shop-fallback"
import { insertRow, isDatabaseConfigured, query, queryOne, updateRow } from "@/lib/db"
import {
  ShopBundle,
  ShopCatalog,
  ShopConfiguratorConfig,
  ShopProduct,
  ShopRecommendationRule,
} from "@/types/shop"

interface FetchOptions {
  includeInactive?: boolean
  useAdmin?: boolean
}

const CONFIG_KEY = "kit-configurator"

export function isShopDatabaseConfigured() {
  return isDatabaseConfigured()
}

async function listShopTable<T>(table: string, fallback: T[], options: FetchOptions) {
  if (!isDatabaseConfigured()) {
    return { success: true, data: fallback }
  }

  try {
    const where = options.includeInactive ? "" : "where is_active = true"
    const rows = await query(`select * from ${table} ${where} order by display_order`)
    return { success: true, data: rows as T[] }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getAllShopProducts(options: FetchOptions = {}) {
  return listShopTable<ShopProduct>("shop_products", fallbackShopCatalog.products, options)
}

export async function getAllShopBundles(options: FetchOptions = {}) {
  return listShopTable<ShopBundle>("shop_bundles", fallbackShopCatalog.bundles, options)
}

export async function getAllShopRecommendationRules(options: FetchOptions = {}) {
  return listShopTable<ShopRecommendationRule>("shop_recommendation_rules", fallbackShopCatalog.recommendationRules, options)
}

export async function getShopConfiguratorConfig(_options: FetchOptions = {}) {
  if (!isDatabaseConfigured()) {
    return { success: true, data: fallbackShopCatalog.configuratorConfig }
  }

  try {
    const row = await queryOne<{ config: ShopConfiguratorConfig }>(
      "select config from shop_configurations where config_key = $1",
      [CONFIG_KEY]
    )
    return { success: true, data: row?.config ?? fallbackShopCatalog.configuratorConfig }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function getShopCatalog(): Promise<ShopCatalog> {
  const [productsResult, bundlesResult, recommendationRulesResult, configuratorConfigResult] = await Promise.all([
    getAllShopProducts(),
    getAllShopBundles(),
    getAllShopRecommendationRules(),
    getShopConfiguratorConfig(),
  ])

  if (!productsResult.success || !bundlesResult.success || !recommendationRulesResult.success || !configuratorConfigResult.success) {
    return fallbackShopCatalog
  }

  return {
    products: productsResult.data ?? [],
    bundles: bundlesResult.data ?? [],
    recommendationRules: recommendationRulesResult.data ?? [],
    configuratorConfig: configuratorConfigResult.data ?? fallbackShopCatalog.configuratorConfig,
  }
}

const NOT_CONFIGURED = "Neon database not configured"

async function createShopRow<T>(table: string, data: object) {
  if (!isDatabaseConfigured()) {
    return { success: false, error: NOT_CONFIGURED }
  }
  try {
    const row = await insertRow(table, { ...data })
    return { success: true, data: row as T }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

async function updateShopRow<T>(table: string, keyColumn: string, keyValue: string, updates: object) {
  if (!isDatabaseConfigured()) {
    return { success: false, error: NOT_CONFIGURED }
  }
  try {
    const row = await updateRow(table, keyColumn, keyValue, { ...updates })
    if (!row) return { success: false, error: "Record not found" }
    return { success: true, data: row as T }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

export async function createShopProduct(data: ShopProduct) {
  return createShopRow<ShopProduct>("shop_products", data)
}

export async function updateShopProduct(productId: string, updates: Partial<ShopProduct>) {
  return updateShopRow<ShopProduct>("shop_products", "product_id", productId, updates)
}

export async function createShopBundle(data: ShopBundle) {
  return createShopRow<ShopBundle>("shop_bundles", data)
}

export async function updateShopBundle(bundleId: string, updates: Partial<ShopBundle>) {
  return updateShopRow<ShopBundle>("shop_bundles", "variant_id", bundleId, updates)
}

export async function createShopRecommendationRule(data: ShopRecommendationRule) {
  return createShopRow<ShopRecommendationRule>("shop_recommendation_rules", data)
}

export async function updateShopRecommendationRule(ruleId: string, updates: Partial<ShopRecommendationRule>) {
  return updateShopRow<ShopRecommendationRule>("shop_recommendation_rules", "rule_id", ruleId, updates)
}

export async function upsertShopConfiguratorConfig(config: ShopConfiguratorConfig) {
  if (!isDatabaseConfigured()) {
    return { success: false, error: NOT_CONFIGURED }
  }

  try {
    const row = await queryOne<{ config: ShopConfiguratorConfig }>(
      `insert into shop_configurations (config_key, config, updated_at)
       values ($1, $2::jsonb, now())
       on conflict (config_key) do update set config = excluded.config, updated_at = now()
       returning config`,
      [CONFIG_KEY, JSON.stringify(config)]
    )
    return { success: true, data: row?.config ?? config }
  } catch (error) {
    return { success: false, error: error instanceof Error ? error.message : "Unknown error" }
  }
}

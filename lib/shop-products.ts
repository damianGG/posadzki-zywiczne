import { ShopCatalog, ShopProduct } from "@/types/shop"

export function getProductSlug(product: ShopProduct) {
  return product.slug?.trim() || product.product_id
}

export function isProductActive(product: ShopProduct) {
  return product.is_active !== false
}

export function getPublishedShopProducts(catalog: ShopCatalog) {
  return catalog.products
    .filter(isProductActive)
    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
}

export function getProductBySlug(catalog: ShopCatalog, slug: string) {
  return getPublishedShopProducts(catalog).find((product) => getProductSlug(product) === slug)
}

export function getResultStepProducts(catalog: ShopCatalog) {
  return catalog.products
    .filter(isProductActive)
    .filter((product) => product.show_in_configurator_result === true)
    .sort((a, b) => (a.result_display_order ?? a.display_order ?? 0) - (b.result_display_order ?? b.display_order ?? 0))
}

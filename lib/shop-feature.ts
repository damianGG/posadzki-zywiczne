/**
 * Safe rollout: this branch is preview-only by default.
 * Production remains disabled until SHOP_ENABLED=true is explicitly configured.
 */
export function isShopEnabled(): boolean {
  if (process.env.VERCEL_ENV === "production") return process.env.SHOP_ENABLED === "true"
  if (process.env.VERCEL_ENV === "preview") {
    return process.env.VERCEL_GIT_COMMIT_REF === "feature/shopify-store"
  }
  return process.env.SHOP_ENABLED === "true" || process.env.NODE_ENV === "development"
}

import { notFound } from "next/navigation"
import { isShopEnabled } from "@/lib/shop-feature"

export default function ShopLayout({ children }: { children: React.ReactNode }) {
  // Do not render any Shopify/Neon shop page when the rollout is disabled.
  if (!isShopEnabled()) notFound()
  return <>{children}</>
}

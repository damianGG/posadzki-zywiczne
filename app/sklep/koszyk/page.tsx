import type { Metadata } from "next"
import { ShopifyCartView } from "@/components/shop/shopify-cart-client"

export const metadata: Metadata = { title: "Koszyk | Sklep PosadzkiŻywiczne", robots: { index: false, follow: false } }
export default function CartPage() { return <ShopifyCartView /> }

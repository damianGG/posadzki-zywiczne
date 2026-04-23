import type { Metadata } from "next"

import StorefrontClient from "@/components/shop/storefront-client"
import { getShopCatalog } from "@/lib/supabase-shop"

export const metadata: Metadata = {
  title: "Sklep | Zestawy do posadzek żywicznych",
  description:
    "Skonfiguruj zestaw do garażu lub piwnicy na podstawie metrażu, dobierz rekomendowane produkty i wyślij zapytanie zakupowe.",
}

export default async function ShopPage() {
  const catalog = await getShopCatalog()

  return <StorefrontClient initialCatalog={catalog} />
}

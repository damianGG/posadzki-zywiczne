"use client"

import KitConfigurator from "@/components/shop/kit-configurator"
import { ShopCatalog } from "@/types/shop"

interface StorefrontClientProps {
  initialCatalog: ShopCatalog
}

export default function StorefrontClient({ initialCatalog }: StorefrontClientProps) {
  return <KitConfigurator catalog={initialCatalog} />
}

"use client"

import KitConfigurator from "@/components/shop/kit-configurator"
import { ShopCatalog } from "@/types/shop"

interface StorefrontClientProps {
  initialCatalog: ShopCatalog
}

export default function StorefrontClient({ initialCatalog }: StorefrontClientProps) {
  const colorId = typeof window === "undefined" ? null : new URLSearchParams(window.location.search).get("kolor")
  return <KitConfigurator catalog={initialCatalog} initialFloorColorId={colorId} />
}

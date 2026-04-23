import { NextRequest, NextResponse } from "next/server"

import { fallbackShopCatalog } from "@/data/shop-fallback"
import {
  createShopBundle,
  createShopProduct,
  createShopRecommendationRule,
  getAllShopBundles,
  getAllShopProducts,
  getAllShopRecommendationRules,
  updateShopBundle,
  updateShopProduct,
  updateShopRecommendationRule,
  isShopSupabaseConfigured,
} from "@/lib/supabase-shop"

export async function GET() {
  try {
    const [products, bundles, recommendationRules] = await Promise.all([
      getAllShopProducts({ includeInactive: true, useAdmin: true }),
      getAllShopBundles({ includeInactive: true, useAdmin: true }),
      getAllShopRecommendationRules({ includeInactive: true, useAdmin: true }),
    ])

    return NextResponse.json({
      products: products.success ? products.data ?? [] : fallbackShopCatalog.products,
      bundles: bundles.success ? bundles.data ?? [] : fallbackShopCatalog.bundles,
      recommendationRules: recommendationRules.success
        ? recommendationRules.data ?? []
        : fallbackShopCatalog.recommendationRules,
      fallbackMode: !isShopSupabaseConfigured() || !products.success || !bundles.success || !recommendationRules.success,
    })
  } catch (error) {
    console.error("Error loading shop admin data", error)
    return NextResponse.json({ error: "Nie udało się pobrać danych sklepu" }, { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, data } = body

    if (!type || !data) {
      return NextResponse.json({ error: "Brak typu lub danych" }, { status: 400 })
    }

    let result

    switch (type) {
      case "product":
        result = await createShopProduct(data)
        break
      case "bundle":
        result = await createShopBundle(data)
        break
      case "recommendation-rule":
        result = await createShopRecommendationRule(data)
        break
      default:
        return NextResponse.json({ error: "Nieobsługiwany typ rekordu" }, { status: 400 })
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error creating shop admin record", error)
    return NextResponse.json({ error: "Nie udało się zapisać rekordu" }, { status: 500 })
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = await request.json()
    const { type, id, updates } = body

    if (!type || !id || !updates) {
      return NextResponse.json({ error: "Brak wymaganych pól" }, { status: 400 })
    }

    let result

    switch (type) {
      case "product":
        result = await updateShopProduct(id, updates)
        break
      case "bundle":
        result = await updateShopBundle(id, updates)
        break
      case "recommendation-rule":
        result = await updateShopRecommendationRule(id, updates)
        break
      default:
        return NextResponse.json({ error: "Nieobsługiwany typ rekordu" }, { status: 400 })
    }

    if (!result.success) {
      return NextResponse.json({ error: result.error }, { status: 500 })
    }

    return NextResponse.json({ success: true, data: result.data })
  } catch (error) {
    console.error("Error updating shop admin record", error)
    return NextResponse.json({ error: "Nie udało się zaktualizować rekordu" }, { status: 500 })
  }
}

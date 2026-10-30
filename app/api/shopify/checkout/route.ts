import { NextRequest, NextResponse } from "next/server"
import { isShopEnabled } from "@/lib/shop-feature"
import { createShopifyCheckout, isShopifyConfigured } from "@/lib/shopify-storefront"

export const runtime = "nodejs"

export async function POST(request: NextRequest) {
  if (!isShopEnabled()) return new NextResponse("Not Found", { status: 404 })
  if (!isShopifyConfigured()) {
    return NextResponse.json({ error: "Sklep nie jest jeszcze połączony z Shopify." }, { status: 503 })
  }

  try {
    const size = Number(request.headers.get("content-length") || 0)
    if (size > 8192) return NextResponse.json({ error: "Żądanie jest za duże." }, { status: 413 })
    const payload = await request.json()
    const lines = payload?.lines
    if (!Array.isArray(lines) || lines.length < 1 || lines.length > 20 ||
      !lines.every((item: unknown) => {
        if (!item || typeof item !== "object") return false
        const row = item as Record<string, unknown>
        return typeof row.merchandiseId === "string" &&
          /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(row.merchandiseId) &&
          Number.isInteger(row.quantity) && (row.quantity as number) >= 1 && (row.quantity as number) <= 99
      })
    ) {
      return NextResponse.json({ error: "Nieprawidłowe produkty lub ilości." }, { status: 422 })
    }
    const checkoutUrl = await createShopifyCheckout(lines)
    return NextResponse.json({ checkoutUrl }, { headers: { "Cache-Control": "no-store" } })
  } catch (error) {
    console.error("Shopify checkout error:", error instanceof Error ? error.message : "unknown")
    return NextResponse.json({ error: "Nie udało się przygotować zamówienia. Spróbuj ponownie." }, { status: 502 })
  }
}

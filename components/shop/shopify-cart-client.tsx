"use client"

import { useEffect, useState } from "react"
import Link from "next/link"
import type { ShopifyProduct, ShopifyVariant } from "@/lib/shopify-storefront"

const CART_KEY = "pz-shopify-cart-v1"
const CART_EVENT = "pz-shopify-cart-update"

type CartLine = {
  merchandiseId: string
  productTitle: string
  variantTitle: string
  handle: string
  imageUrl: string | null
  price: string
  currencyCode: string
  quantity: number
}

function readLines(): CartLine[] {
  try {
    const raw = JSON.parse(localStorage.getItem(CART_KEY) || "[]")
    if (!Array.isArray(raw)) return []
    return raw.filter((line): line is CartLine =>
      line && typeof line.merchandiseId === "string" &&
      /^gid:\/\/shopify\/ProductVariant\/\d+$/.test(line.merchandiseId) &&
      Number.isInteger(line.quantity) && line.quantity > 0 && line.quantity <= 99
    ).slice(0, 20)
  } catch { return [] }
}

function saveLines(lines: CartLine[]) {
  localStorage.setItem(CART_KEY, JSON.stringify(lines))
  window.dispatchEvent(new Event(CART_EVENT))
}

function formatMoney(value: string | number, currencyCode: string) {
  return new Intl.NumberFormat("pl-PL", { style: "currency", currency: currencyCode }).format(Number(value))
}

export function ShopifyAddToCartButton({ product }: { product: ShopifyProduct }) {
  const variants = product.variants.nodes.filter(v => v.availableForSale)
  const [variantId, setVariantId] = useState(variants[0]?.id || "")
  const [message, setMessage] = useState("")
  const selected = variants.find(v => v.id === variantId)
  const add = () => {
    if (!selected) return
    try {
      const lines = readLines()
      const existing = lines.find(item => item.merchandiseId === selected.id)
      if (existing) existing.quantity = Math.min(99, existing.quantity + 1)
      else {
        if (lines.length >= 20) { setMessage("Koszyk może zawierać maksymalnie 20 pozycji."); return }
        lines.push({
          merchandiseId: selected.id, productTitle: product.title, variantTitle: selected.title,
          handle: product.handle, imageUrl: product.featuredImage?.url || null,
          price: selected.price.amount, currencyCode: selected.price.currencyCode, quantity: 1,
        })
      }
      saveLines(lines)
      setMessage("Dodano do koszyka.")
    } catch { setMessage("Nie można zapisać koszyka w tej przeglądarce.") }
  }
  return (
    <div className="space-y-3">
      {variants.length > 1 && (
        <label className="block text-sm font-medium">
          Wariant / opakowanie
          <select value={variantId} onChange={e => setVariantId(e.target.value)}
            className="mt-1 block w-full rounded-lg border border-zinc-300 bg-white p-3">
            {variants.map((variant: ShopifyVariant) => (
              <option key={variant.id} value={variant.id}>
                {variant.title} — {formatMoney(variant.price.amount, variant.price.currencyCode)}
              </option>
            ))}
          </select>
        </label>
      )}
      {selected && <p className="font-semibold">{formatMoney(selected.price.amount, selected.price.currencyCode)}</p>}
      <button type="button" onClick={add} disabled={!selected}
        className="w-full rounded-xl bg-zinc-950 px-5 py-3 font-semibold text-white hover:bg-zinc-800 disabled:cursor-not-allowed disabled:opacity-50">
        {selected ? "Dodaj do koszyka" : "Produkt niedostępny"}
      </button>
      {message && <p role="status" className="text-sm text-zinc-600">{message} <Link href="/sklep/koszyk" className="underline">Zobacz koszyk</Link></p>}
    </div>
  )
}

export function ShopifyCartView() {
  const [lines, setLines] = useState<CartLine[]>([])
  const [busy, setBusy] = useState(false)
  const [error, setError] = useState("")
  useEffect(() => {
    const sync = () => setLines(readLines())
    sync()
    window.addEventListener(CART_EVENT, sync)
    window.addEventListener("storage", sync)
    return () => { window.removeEventListener(CART_EVENT, sync); window.removeEventListener("storage", sync) }
  }, [])

  function changeQuantity(id: string, quantity: number) {
    const next = lines.map(item => item.merchandiseId === id ? { ...item, quantity } : item)
      .filter(item => item.quantity > 0)
    saveLines(next)
    setLines(next)
  }

  async function checkout() {
    setBusy(true); setError("")
    try {
      const response = await fetch("/api/shopify/checkout", {
        method: "POST", headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ lines: lines.map(item => ({ merchandiseId: item.merchandiseId, quantity: item.quantity })) }),
      })
      const body = await response.json()
      if (!response.ok || typeof body.checkoutUrl !== "string") {
        throw new Error(body.error || "Nie można rozpocząć płatności.")
      }
      window.location.assign(body.checkoutUrl)
    } catch (cause) { setError(cause instanceof Error ? cause.message : "Błąd połączenia z Shopify."); setBusy(false) }
  }

  const subtotal = lines.reduce((sum, item) => sum + Number(item.price) * item.quantity, 0)
  const currency = lines[0]?.currencyCode || "PLN"
  return (
    <section className="mx-auto max-w-4xl px-4 py-12">
      <h1 className="mb-8 text-3xl font-bold">Twój koszyk</h1>
      {!lines.length ? (
        <div className="rounded-2xl border border-zinc-200 p-8 text-center">
          <p>Koszyk jest pusty.</p>
          <Link href="/sklep/produkty" className="mt-4 inline-block font-semibold underline">Przeglądaj produkty</Link>
        </div>
      ) : (
        <div className="space-y-5">
          {lines.map(item => (
            <div key={item.merchandiseId} className="flex flex-wrap items-center gap-4 rounded-2xl border p-4">
              {item.imageUrl ? <img src={item.imageUrl} alt="" className="h-20 w-20 rounded-lg object-cover" /> : null}
              <div className="min-w-[170px] flex-1">
                <Link href={`/sklep/produkt/${item.handle}`} className="font-semibold hover:underline">{item.productTitle}</Link>
                <p className="text-sm text-zinc-500">{item.variantTitle}</p>
                <p className="text-sm">{formatMoney(item.price, item.currencyCode)} / szt.</p>
              </div>
              <label className="text-sm">Ilość
                <input aria-label={`Ilość ${item.productTitle}`} type="number" min={0} max={99}
                  value={item.quantity} onChange={event => {
                    const n = Number(event.target.value)
                    if (Number.isInteger(n) && n >= 0 && n <= 99) changeQuantity(item.merchandiseId, n)
                  }}
                  className="ml-2 w-16 rounded-md border p-2" />
              </label>
              <button type="button" onClick={() => changeQuantity(item.merchandiseId, 0)} className="text-sm underline">Usuń</button>
            </div>
          ))}
          <div className="rounded-2xl bg-zinc-50 p-6">
            <p className="text-xl font-bold">Orientacyjna suma: {formatMoney(subtotal, currency)}</p>
            <p className="mt-2 text-sm text-zinc-600">Ostateczna cena, podatki, dostępność i koszty dostawy są weryfikowane w Shopify przed płatnością.</p>
            {error && <p role="alert" className="mt-3 text-sm text-red-700">{error}</p>}
            <button type="button" disabled={busy} onClick={checkout}
              className="mt-5 rounded-xl bg-zinc-950 px-6 py-3 font-semibold text-white disabled:opacity-50">
              {busy ? "Łączenie z Shopify..." : "Przejdź do zamówienia"}
            </button>
          </div>
        </div>
      )}
    </section>
  )
}

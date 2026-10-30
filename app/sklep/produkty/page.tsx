import type { Metadata } from "next"
import Link from "next/link"
import { getShopifyProducts, isShopifyConfigured } from "@/lib/shopify-storefront"
import { ShopifyAddToCartButton } from "@/components/shop/shopify-cart-client"

export const dynamic = "force-dynamic"
export const metadata: Metadata = {
  title: "Produkty do posadzek żywicznych | Sklep PosadzkiŻywiczne",
  description: "Żywice, grunty, płatki dekoracyjne i akcesoria do wykonania posadzki. Sprawdź produkty, warianty i ceny.",
}

export default async function ProductsPage() {
  const configured = isShopifyConfigured()
  let products = [] as Awaited<ReturnType<typeof getShopifyProducts>>
  let error = false
  try { products = await getShopifyProducts() } catch (cause) {
    console.error("Shopify product listing:", cause instanceof Error ? cause.message : cause)
    error = true
  }
  const categories = Array.from(new Set(products.map(item => item.productType).filter(Boolean)))
  return (
    <main className="mx-auto max-w-7xl px-4 py-12">
      <nav className="mb-6 flex flex-wrap gap-4 text-sm text-zinc-600">
        <Link href="/sklep" className="underline">Zestawy DIY</Link>
        <Link href="/sklep/koszyk" className="underline">Koszyk</Link>
        <Link href="/kalkulator" className="underline">Kalkulator z wykonaniem</Link>
      </nav>
      <h1 className="text-3xl font-bold tracking-tight md:text-4xl">Materiały do posadzek żywicznych</h1>
      <p className="mt-3 max-w-3xl text-zinc-600">Kup pojedynczą żywicę, grunt, płatki dekoracyjne i akcesoria. Wybierz opakowanie na karcie produktu.</p>
      {categories.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{categories.map(category =>
        <span key={category} className="rounded-full border px-3 py-1 text-sm text-zinc-600">{category}</span>
      )}</div>}
      {!configured && (
        <div className="mt-10 rounded-2xl border border-amber-300 bg-amber-50 p-6 text-amber-900">
          Trwa konfiguracja połączenia Shopify. Katalog produktów nie został jeszcze udostępniony.
        </div>
      )}
      {configured && error && <p className="mt-10 rounded-2xl bg-red-50 p-6 text-red-800">Nie można obecnie pobrać produktów Shopify.</p>}
      {configured && !error && !products.length && <p className="mt-10 text-zinc-600">Nie ma jeszcze opublikowanych produktów w kanale Headless Shopify.</p>}
      <div className="mt-9 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {products.map(product => (
          <article key={product.id} className="flex flex-col overflow-hidden rounded-2xl border bg-white shadow-sm">
            <Link href={`/sklep/produkt/${product.handle}`} className="block">
              {product.featuredImage
                ? <img src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} className="aspect-[4/3] w-full object-cover" />
                : <div className="flex aspect-[4/3] items-center justify-center bg-zinc-100 text-zinc-500">Zdjęcie w przygotowaniu</div>}
            </Link>
            <div className="flex flex-1 flex-col gap-3 p-5">
              {product.productType && <p className="text-xs font-semibold uppercase tracking-wider text-zinc-500">{product.productType}</p>}
              <Link className="text-xl font-semibold hover:underline" href={`/sklep/produkt/${product.handle}`}>{product.title}</Link>
              <p className="line-clamp-3 flex-1 text-sm text-zinc-600">{product.description}</p>
              <ShopifyAddToCartButton product={product} />
            </div>
          </article>
        ))}
      </div>
    </main>
  )
}

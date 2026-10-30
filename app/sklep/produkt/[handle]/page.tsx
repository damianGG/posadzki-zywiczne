import type { Metadata } from "next"
import Link from "next/link"
import { notFound } from "next/navigation"
import { getShopifyProduct } from "@/lib/shopify-storefront"
import { ShopifyAddToCartButton } from "@/components/shop/shopify-cart-client"

type Props = { params: Promise<{ handle: string }> }

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { handle } = await params
  const product = await getShopifyProduct(handle).catch(() => null)
  return { title: product ? `${product.title} | PosadzkiŻywiczne` : "Produkt | PosadzkiŻywiczne",
    description: product?.description?.slice(0, 155) || "Produkty do posadzek żywicznych." }
}

export default async function ProductPage({ params }: Props) {
  const { handle } = await params
  if (!/^[a-z0-9][a-z0-9-]{0,199}$/.test(handle)) notFound()
  const product = await getShopifyProduct(handle).catch(() => null)
  if (!product) notFound()
  return (
    <main className="mx-auto max-w-6xl px-4 py-12">
      <nav className="mb-8 flex gap-4 text-sm text-zinc-600">
        <Link href="/sklep/produkty" className="underline">Wszystkie produkty</Link>
        <Link href="/sklep/koszyk" className="underline">Koszyk</Link>
      </nav>
      <div className="grid gap-10 md:grid-cols-2">
        <div>
          {product.featuredImage
            ? <img src={product.featuredImage.url} alt={product.featuredImage.altText || product.title} className="w-full rounded-3xl border object-cover" />
            : <div className="flex aspect-square items-center justify-center rounded-3xl bg-zinc-100">Zdjęcie w przygotowaniu</div>}
        </div>
        <div className="space-y-5">
          {product.productType && <p className="text-sm font-semibold uppercase tracking-wide text-zinc-500">{product.productType}</p>}
          <h1 className="text-3xl font-bold">{product.title}</h1>
          <p className="whitespace-pre-line leading-7 text-zinc-700">{product.description}</p>
          <ShopifyAddToCartButton product={product} />
          <p className="text-sm text-zinc-500">Przed zakupem sprawdź zgodność systemu, stan podłoża, kartę techniczną i warunki bezpiecznego stosowania.</p>
        </div>
      </div>
    </main>
  )
}

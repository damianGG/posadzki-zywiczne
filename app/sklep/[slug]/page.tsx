import type { Metadata } from "next"
import Image from "next/image"
import Link from "next/link"
import { notFound } from "next/navigation"

import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { getProductBySlug, getProductSlug, getPublishedShopProducts } from "@/lib/shop-products"
import { getBreadcrumbSchema } from "@/lib/structured-data"
import { formatProductPricing } from "@/lib/shop-engine"
import { getShopCatalog } from "@/lib/supabase-shop"

const defaultBaseUrl = "https://posadzkizywiczne.com"
const baseUrl = (() => {
  try {
    return new URL(process.env.NEXT_PUBLIC_SITE_URL ?? defaultBaseUrl)
  } catch {
    return new URL(defaultBaseUrl)
  }
})()

interface ShopProductPageProps {
  params: Promise<{
    slug: string
  }>
}

export async function generateStaticParams() {
  const catalog = await getShopCatalog()
  return getPublishedShopProducts(catalog).map((product) => ({
    slug: getProductSlug(product),
  }))
}

export async function generateMetadata({ params }: ShopProductPageProps): Promise<Metadata> {
  const { slug } = await params
  const catalog = await getShopCatalog()
  const product = getProductBySlug(catalog, slug)

  if (!product) {
    return {
      title: "Produkt nie znaleziony",
    }
  }

  const title = product.meta_title || product.page_title || product.name
  const description = product.meta_description || product.page_description || product.description
  const canonical = new URL(`/sklep/${getProductSlug(product)}`, baseUrl).toString()

  return {
    title,
    description,
    alternates: {
      canonical,
    },
    openGraph: {
      title,
      description,
      url: canonical,
      type: "website",
      images: product.gallery?.[0]?.url ? [{ url: product.gallery[0].url, alt: product.gallery[0].alt || product.name }] : undefined,
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
      images: product.gallery?.[0]?.url ? [product.gallery[0].url] : undefined,
    },
  }
}

export default async function ShopProductPage({ params }: ShopProductPageProps) {
  const { slug } = await params
  const catalog = await getShopCatalog()
  const product = getProductBySlug(catalog, slug)

  if (!product) {
    notFound()
  }

  const productUrl = new URL(`/sklep/${getProductSlug(product)}`, baseUrl).toString()
  const breadcrumbSchema = getBreadcrumbSchema([
    { name: "Strona główna", url: baseUrl.toString() },
    { name: "Sklep", url: new URL("/sklep", baseUrl).toString() },
    { name: product.name, url: productUrl },
  ])

  return (
    <main className="bg-zinc-50 py-10">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(breadcrumbSchema) }} />
      <div className="container mx-auto max-w-5xl space-y-6 px-4">
        <Link href="/sklep" className="inline-flex text-sm text-zinc-600 hover:text-zinc-900">
          ← Powrót do sklepu
        </Link>

        <Card className="rounded-3xl border-zinc-200">
          <CardHeader className="space-y-3">
            <CardTitle className="text-3xl">{product.page_title || product.name}</CardTitle>
            <CardDescription className="text-base text-zinc-600">{product.page_description || product.description}</CardDescription>
            <p className="text-sm font-medium text-zinc-800">{formatProductPricing(product)}</p>
          </CardHeader>
          <CardContent className="space-y-6">
            {product.gallery?.length ? (
              <div className="grid gap-4 md:grid-cols-2">
                {product.gallery.map((item, index) => (
                  <div key={index} className="overflow-hidden rounded-2xl border border-zinc-200 bg-white">
                    <Image src={item.url} alt={item.alt || product.name} width={720} height={480} className="h-auto w-full object-cover" />
                  </div>
                ))}
              </div>
            ) : null}

            {product.variants?.length ? (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Warianty produktu</h2>
                <div className="grid gap-3 md:grid-cols-2">
                  {product.variants
                    .filter((variant) => variant.is_active !== false)
                    .sort((a, b) => (a.display_order ?? 0) - (b.display_order ?? 0))
                    .map((variant) => (
                      <div key={variant.id} className="rounded-2xl border border-zinc-200 p-4">
                        <p className="font-medium text-zinc-900">{variant.name}</p>
                        {variant.description ? <p className="mt-1 text-sm text-zinc-600">{variant.description}</p> : null}
                        {typeof variant.price === "number" ? (
                          <p className="mt-2 text-sm text-zinc-800">
                            {variant.price.toFixed(2)} zł {variant.unit_label || ""}
                          </p>
                        ) : null}
                      </div>
                    ))}
                </div>
              </div>
            ) : null}

            {product.specifications?.length ? (
              <div className="space-y-3">
                <h2 className="text-xl font-semibold">Dane techniczne</h2>
                <div className="space-y-2 rounded-2xl border border-zinc-200 p-4">
                  {product.specifications.map((item, index) => (
                    <div key={index} className="flex flex-col justify-between gap-1 border-b border-zinc-100 pb-2 last:border-b-0 last:pb-0 md:flex-row">
                      <span className="text-sm text-zinc-500">{item.label}</span>
                      <span className="text-sm font-medium text-zinc-900">{item.value}</span>
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </CardContent>
        </Card>
      </div>
    </main>
  )
}

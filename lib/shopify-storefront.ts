/**
 * Server-side Shopify Storefront API adapter.
 * Only published, actually available Shopify products are returned.
 * Do not reuse the old Neon kit estimate as a checkout price.
 */
const API_VERSION = "2026-10"

export interface ShopifyMoney {
  amount: string
  currencyCode: string
}
export interface ShopifyVariant {
  id: string
  title: string
  availableForSale: boolean
  price: ShopifyMoney
}
export interface ShopifyProduct {
  id: string
  handle: string
  title: string
  description: string
  productType: string
  vendor: string
  availableForSale: boolean
  featuredImage: { url: string; altText: string | null } | null
  priceRange: { minVariantPrice: ShopifyMoney }
  variants: { nodes: ShopifyVariant[] }
}

type GraphqlResponse<T> = { data?: T; errors?: Array<{ message: string }> }

function domain(): string | null {
  const value = (process.env.SHOPIFY_STORE_DOMAIN || "").trim().toLowerCase()
  return /^[a-z0-9][a-z0-9-]*\.myshopify\.com$/.test(value) ? value : null
}

export function isShopifyConfigured(): boolean {
  return Boolean(domain() && process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN)
}

async function request<T>(query: string, variables: Record<string, unknown> = {}, cacheable = true): Promise<T> {
  const store = domain()
  const token = process.env.SHOPIFY_STOREFRONT_ACCESS_TOKEN
  if (!store || !token) throw new Error("Shopify nie jest jeszcze skonfigurowane.")
  const response = await fetch(`https://${store}/api/${API_VERSION}/graphql.json`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "X-Shopify-Storefront-Access-Token": token,
    },
    body: JSON.stringify({ query, variables }),
    ...(cacheable ? { next: { revalidate: 300 } } : { cache: "no-store" as const }),
  })
  if (!response.ok) throw new Error(`Shopify API: HTTP ${response.status}`)
  const json = (await response.json()) as GraphqlResponse<T>
  if (json.errors?.length) throw new Error(json.errors.map(e => e.message).join("; "))
  if (!json.data) throw new Error("Shopify zwróciło pustą odpowiedź.")
  return json.data
}

const productFields = `
  id handle title description productType vendor availableForSale
  featuredImage { url altText }
  priceRange { minVariantPrice { amount currencyCode } }
  variants(first: 30) {
    nodes { id title availableForSale price { amount currencyCode } }
  }
`

export async function getShopifyProducts(): Promise<ShopifyProduct[]> {
  if (!isShopifyConfigured()) return []
  const data = await request<{ products: { nodes: ShopifyProduct[] } }>(
    `query Products { products(first: 50) { nodes { ${productFields} } } }`
  )
  return data.products.nodes
}

export async function getShopifyProduct(handle: string): Promise<ShopifyProduct | null> {
  if (!isShopifyConfigured()) return null
  const data = await request<{ product: ShopifyProduct | null }>(
    `query Product($handle: String!) { product(handle: $handle) { ${productFields} } }`,
    { handle }
  )
  return data.product
}

export async function createShopifyCheckout(
  lines: Array<{ merchandiseId: string; quantity: number }>
): Promise<string> {
  const data = await request<{
    cartCreate: {
      cart: { checkoutUrl: string } | null
      userErrors: Array<{ message: string }>
    }
  }>(
    `mutation CreateCart($input: CartInput!) {
      cartCreate(input: $input) {
        cart { checkoutUrl }
        userErrors { message }
      }
    }`,
    { input: { lines } },
    false
  )
  const result = data.cartCreate
  if (result.userErrors.length || !result.cart) {
    throw new Error(result.userErrors.map(e => e.message).join("; ") || "Nie udało się utworzyć koszyka.")
  }
  const url = new URL(result.cart.checkoutUrl)
  const host = url.hostname.toLowerCase()
  const extraCheckoutHost = (process.env.SHOPIFY_CHECKOUT_DOMAIN || "").trim().toLowerCase()
  if (
    url.protocol !== "https:" ||
    !(host === domain() || host.endsWith(".myshopify.com") || host === "checkout.shopify.com" || (extraCheckoutHost && host === extraCheckoutHost))
  ) {
    throw new Error("Shopify zwróciło nieoczekiwany adres płatności.")
  }
  return url.toString()
}

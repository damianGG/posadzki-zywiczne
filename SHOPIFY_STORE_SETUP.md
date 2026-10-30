# Shopify headless — PosadzkiŻywiczne

## Status
Rollout staged on branch `feature/shopify-store`. No live payment configuration or catalog connection has been confirmed.

## Connection (performed by the store owner)
1. Create/connect the Shopify store using the Shopify app in ChatGPT or Shopify admin.
2. Install the **Headless** sales channel in Shopify and create a storefront.
3. Publish approved products/variants to Headless. Set Polish prices, correct VAT settings, physical inventory, delivery and payment options.
4. In Vercel (posadzki-zywiczne project) add **Preview-only** `SHOPIFY_STORE_DOMAIN` and `SHOPIFY_STOREFRONT_ACCESS_TOKEN`. Storefront public token is used exclusively by the server adapter; do not put private Shopify tokens in `NEXT_PUBLIC_*`.
5. Confirm Vercel deployment protection (SSO / Vercel Authentication) for *all previews* before sharing preview URLs.
6. Check `/sklep/produkty`, variant selection, `/sklep/koszyk`, cartCreate checkout redirection.
7. Use Shopify test payment mode. Test shipping restrictions, CLP/SDS disclosure, product classifications and checkout payment acceptance for resin products.
8. Independently verify technical product recipes, coverage and packaging before allowing checkout of DIY kits. **Never equate existing on-site labour estimate with a material basket.**

## Rollout
- Preview of branch `feature/shopify-store`: shop is accessible only behind Vercel protection.
- Production: shop is disabled unless `SHOP_ENABLED=true` is explicitly configured after launch approval.
- Middleware returns 404 for `/sklep/*` and `/api/shopify/*` when disabled, also protects direct endpoints.
- Navigation, calculator CTA and sitemap are gated separately.
- No credentials or live customer data are stored in this repository.

## Catalog model
- Single products: Shopify products + variants (weight/size/color), prices, stock and checkout.
- DIY kits: existing configurator for guidance only until a product-to-SKU bill of materials is audited and published to Shopify.
- Labour quote: existing calculator; keep pricing independently maintained.
- Shopify Storefront API pinned to `2026-10`, using products, product(handle), cartCreate/checkoutUrl.

## Operational caution
Delivery of hazardous mixtures can require different shipping handling; check each product's Safety Data Sheet section 14 and shipping providers. Add CLP labels and appropriate technical/SDS disclosures before sale.

# Sklep MVP - dokumentacja wdrożenia

## Co zostało dodane

- publiczna strona `/sklep` z konfiguracją zestawów pod metraż,
- warstwa danych sklepu w `lib/supabase-shop.ts`,
- logika doboru zestawów i rekomendacji w `lib/shop-engine.ts`,
- prosty koszyk zapytaniowy z wysyłką na `/api/shop/inquiry`,
- panel admina `/admin/sklep` do zarządzania produktami, zestawami i regułami rekomendacji,
- strony produktów pod `/sklep/[slug]` z treścią, SEO, galerią i wariantami,
- migracje Supabase:
  - `supabase/migrations/003_shop_mvp.sql`,
  - `supabase/migrations/004_shop_configurator_config.sql`,
  - `supabase/migrations/005_shop_products_content_and_variants.sql`,
  - `supabase/migrations/006_shop_products_landing_content.sql`.

## Model MVP

### Produkty
Tabela `shop_products` przechowuje produkty bazowe, dodatki i akcesoria. Cena może być liczona:
- za zamówienie (`fixed`),
- za sztukę (`unit`),
- za m² (`m2`),
- za metr bieżący (`mb`).

Dodatkowo produkt może mieć:
- flagę publikacji na końcu flow konfiguratora (`show_in_configurator_result`),
- osobną kolejność i typ prezentacji w wyniku (`result_display_order`, `result_display_type`),
- pola SEO i treści strony (`slug`, `page_title`, `page_description`, `meta_title`, `meta_description`),
- galerię, warianty i dane techniczne (`gallery`, `variants`, `specifications`),
- rozszerzone sekcje landing page (`video_url`, `technical_documents`, `application_steps`, `faq_items`).

### Zestawy
Tabela `shop_bundles` przechowuje warianty typu Start / Trwałość+ / Premium. Każdy zestaw ma:
- zakres metrażu,
- bazową cenę + stawkę za m²,
- listę elementów w zestawie (`included_items`),
- ręcznie wskazane produkty polecane (`recommended_product_ids`).

### Reguły rekomendacji
Tabela `shop_recommendation_rules` pozwala przypisać produkty polecane do typu pomieszczenia i zakresu metrażu.

## Jak uruchomić

1. Uruchom migracje `003_shop_mvp.sql`, `004_shop_configurator_config.sql`, `005_shop_products_content_and_variants.sql` i `006_shop_products_landing_content.sql` w Supabase.
2. Upewnij się, że w `.env` są ustawione:
   - `NEXT_PUBLIC_SUPABASE_URL` lub `SUPABASE_URL`,
   - `NEXT_PUBLIC_SUPABASE_ANON_KEY`,
   - `SUPABASE_SERVICE_ROLE_KEY`,
   - `EMAIL_USER`,
   - `EMAIL_PASS`,
   - opcjonalnie `ADMIN_EMAIL`.
3. Wejdź na `/sklep` aby sprawdzić publiczny storefront.
4. Wejdź na `/admin/sklep` aby zarządzać danymi sklepu.

## Uwaga o fallbacku

Jeśli Supabase nie jest skonfigurowany, storefront wykorzysta dane fallback zapisane lokalnie w `data/shop-fallback.ts`. Dzięki temu można rozwijać UI bez blokady na migracje.

## Co dalej

To wdrożenie kończy etap MVP. Następne kroki to:
- płatności,
- dostawa,
- statusy zamówień,
- integracje ERP/kurier,
- pełny checkout.

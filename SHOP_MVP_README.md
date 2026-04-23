# Sklep MVP - dokumentacja wdrożenia

## Co zostało dodane

- publiczna strona `/sklep` z konfiguracją zestawów pod metraż,
- warstwa danych sklepu w `lib/supabase-shop.ts`,
- logika doboru zestawów i rekomendacji w `lib/shop-engine.ts`,
- prosty koszyk zapytaniowy z wysyłką na `/api/shop/inquiry`,
- panel admina `/admin/sklep` do zarządzania produktami, zestawami i regułami rekomendacji,
- migracja Supabase `supabase/migrations/003_shop_mvp.sql`.

## Model MVP

### Produkty
Tabela `shop_products` przechowuje produkty bazowe, dodatki i akcesoria. Cena może być liczona:
- za zamówienie (`fixed`),
- za sztukę (`unit`),
- za m² (`m2`),
- za metr bieżący (`mb`).

### Zestawy
Tabela `shop_bundles` przechowuje warianty typu Start / Trwałość+ / Premium. Każdy zestaw ma:
- zakres metrażu,
- bazową cenę + stawkę za m²,
- listę elementów w zestawie (`included_items`),
- ręcznie wskazane produkty polecane (`recommended_product_ids`).

### Reguły rekomendacji
Tabela `shop_recommendation_rules` pozwala przypisać produkty polecane do typu pomieszczenia i zakresu metrażu.

## Jak uruchomić

1. Uruchom migrację `003_shop_mvp.sql` w Supabase.
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

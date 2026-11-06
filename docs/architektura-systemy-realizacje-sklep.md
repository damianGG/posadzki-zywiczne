# Architektura systemów, realizacji i przyszłego sklepu

## Strony i adresy
- /garaze, /parkingi, /hale-magazyny, /posadzki-elektrostatyczne itd.: istniejące usługi wykonawcze (bez migracji URL).
- /systemy: publiczny katalog czterech producentów Sika, Flowcrete, Sto, Sicon i rodzin zastosowań.
- /systemy/[slug]: strony rodzin systemów i kryteriów doboru, połączone z usługami.
- /systemy/materialy/[slug]: tymczasowe nieindeksowane karty informacyjne (bez ofert/price schema).
- /realizacje/[slug]: galeria + potwierdzone systemy i materiały + osobno propozycje alternatywnych technologii.
- /sklep: nadal 404 + noindex do momentu rzeczywistego uruchomienia transakcyjnego sklepu.

## Źródło prawdy
- `lib/floor-system-catalog.ts`: identyfikatory producentów, rodzin systemów i materiałów.
- `lib/realization-materials.ts`: jawne relacje `TechnologyLinks` i rozdzielenie referencji od rekomendacji.
- `types/realizacje.ts`: `technologyLinks` dla realizacji z CMS.
- `lib/neon-realizacje.ts`: `technology_links` z bazy Neon (po migracji).
- `db/migrations/007_realization_technology_links.sql`: opcjonalna migracja dla wpisów CMS.

## Zasady atrybucji
- `systemSlugs` to rzeczywiście potwierdzone systemy użyte na danej realizacji.
- `usedMaterialIds` to konkretne materiały potwierdzone kartami wykonania, fakturą materiałową lub innym wiarygodnym źródłem.
- `equivalentShopProductIds` to opcjonalne alternatywy DIY. Nie są produktami wykorzystanymi do wykonania realizacji.
- Uzupełniaj identyfikatory tylko po weryfikacji dokumentacji. **Nie** wnioskuj o producencie z koloru, zdjęcia, zastosowania ani nazw marketingowych.
- System katalogowy nie jest automatycznie certyfikowanym przez producenta kompletnym układem warstw. Weryfikuj kompatybilność i aktualne dokumenty techniczne.

## Wprowadzanie realnych powiązań
Dla realizacji przechowywanych w repozytorium dodaj wpis do `documentedRealizationMaterials` w `lib/realization-materials.ts`, np.:
```ts
"potwierdzony-slug-realizacji": {
  systemSlugs: ["sto-posadzki-esd"],
  usedMaterialIds: [],
  equivalentShopProductIds: [],
},
```
Taki wpis nie stanowi potwierdzenia użycia konkretnej żywicy. Dodaj `usedMaterialIds` dopiero gdy znasz jej dokładny model.

Dla realizacji z Neon wykonaj kontrolowaną aktualizację `technology_links` po wdrożeniu migracji. Następny etap obejmuje edytor tych relacji w panelu administracyjnym (z walidacją katalogu).

## Integracja ze sklepem Epovio/Shopify — kolejny etap
- Jeden identyfikator materiału wewnętrznego, mapowany na konkretne SKU i `shopProductId`/Shopify product variant, nigdy po zgadywanej nazwie.
- Dopiero po uruchomieniu sklepu pokazuj link do istniejącej, dostępnej do zakupu karty produktu. Nie kieruj klientów na `/sklep` dopóki middleware zwraca 404.
- Zestawy Epovio o podobnym efekcie prezentuj jako **alternatywę DIY**, nigdy jako materiał użyty w realizacji Sika/Sto/Flowcrete/Sicon.
- Oddziel kalkulator usługi wykonawczej od konfiguratora produktów DIY. Zachowaj aktualny adres `/kalkulator?typ=garaz` dla wyceny usługi.

## Przed uruchomieniem handlu
1. Sprawdzić listę produktów, materiały techniczne i prawa do sprzedaży marki.
2. Dodać prawdziwe SKU, opakowania, stany, podatki, dostawy, zwroty i checkout Shopify.
3. Przygotować indywidualne karty produktu, zdjęcia i instrukcje, a dopiero potem włączyć `/sklep`.
4. Dopiąć rozdzielenie opisu systemu, materiału technicznego i konkretnej oferty handlowej.
5. Monitorować zdarzenia kliknięć realizacja → materiał → koszyk oraz realizacja → wycena usługi.

## Weryfikacja
- `/systemy` i rodziny systemów działają, znajdują się w sitemap i menu.
- Strony kart materiałów mają robots noindex, follow, do czasu redakcyjnego wzbogacenia.
- Karty realizacji pokazują użyte materiały tylko przy jawnych relacjach.
- Stary katalog usług, realizacji i kalkulator pozostaje pod dotychczasowymi adresami.
- Sklep nadal ukryty: bez linków do nieistniejących stron zakupowych.

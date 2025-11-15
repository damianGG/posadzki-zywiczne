# Realizacje (Portfolio) - Dokumentacja Implementacji

## Przegląd

System realizacji to w pełni funkcjonalna sekcja portfolio do prezentacji projektów posadzek żywicznych. Rozwiązanie jest zoptymalizowane pod SEO, łatwe w zarządzaniu i skalowalne.

## Struktura Plików

```
├── types/
│   └── realizacje.ts                    # TypeScript typy dla realizacji
├── lib/
│   └── realizacje.ts                    # Funkcje do zarządzania danymi
├── data/
│   └── realizacje/
│       ├── README.md                    # Instrukcja dodawania projektów
│       ├── garaz-warszawa-2024.json     # Przykładowa realizacja garaż
│       ├── garaz-nowy-sacz-2024.json    # Przykładowa realizacja garaż
│       ├── balkon-krakow-2024.json      # Przykładowa realizacja balkon
│       ├── taras-wieliczka-2024.json    # Przykładowa realizacja taras
│       └── mieszkanie-rzeszow-2024.json # Przykładowa realizacja dom
├── app/
│   └── realizacje/
│       ├── page.tsx                     # Główna strona z listą realizacji
│       └── [slug]/
│           └── page.tsx                 # Strona szczegółów projektu
├── components/
│   └── realizacje-preview-section.tsx   # Komponent do wyświetlania na stronie głównej
└── blocks/
    └── header/
        └── header2.tsx                  # Zaktualizowany o link do realizacji
```

## Kategorie

System wspiera 3 kategorie realizacji:

1. **garaz** - Garaże i hale warsztatowe
2. **dom** - Domy i mieszkania (salony, kuchnie)
3. **balkon-taras** - Balkony i tarasy

## Funkcjonalności

### 1. Strona Główna Realizacji (`/realizacje`)

- Wyświetla wszystkie realizacje pogrupowane według kategorii
- Responsywny układ grid (1/2/3 kolumny)
- Każda karta zawiera:
  - Główne zdjęcie z efektem hover
  - Tytuł i opis
  - Lokalizację i powierzchnię
  - Badge z kategorią
- SEO metadata i OpenGraph

### 2. Strona Szczegółów Projektu (`/realizacje/[slug]`)

- Pełny opis projektu
- Główne zdjęcie w dużym formacie
- Szczegóły techniczne (powierzchnia, system, kolor, czas realizacji)
- Lista zastosowanych rozwiązań
- Galeria dodatkowych zdjęć
- Opinia klienta (jeśli dostępna)
- Sekcja z podobnymi projektami
- JSON-LD structured data dla SEO
- Breadcrumbs nawigacja

### 3. Komponent Preview

`RealizacjePreviewSection` - gotowy do użycia komponent, który można dodać na dowolną stronę (np. homepage) do wyświetlania najnowszych realizacji.

Przykład użycia:
```tsx
import RealizacjePreviewSection from '@/components/realizacje-preview-section';

// W komponencie strony:
<RealizacjePreviewSection 
  title="Nasze Najnowsze Realizacje"
  subtitle="Zobacz efekty naszej pracy"
  limit={3}
/>
```

## SEO Optymalizacja

### 1. Metadata
- Unikalne title i description dla każdej realizacji
- Keywords zoptymalizowane pod lokalne wyszukiwanie
- OpenGraph tags dla social media
- Canonical URLs

### 2. Structured Data (JSON-LD)
Każda strona projektu zawiera structured data typu Article:
```json
{
  "@context": "https://schema.org",
  "@type": "Article",
  "headline": "Tytuł realizacji",
  "description": "Opis...",
  "image": "URL do zdjęcia",
  "datePublished": "2024-10-15",
  "author": {...},
  "publisher": {...}
}
```

### 3. Sitemap
Wszystkie realizacje są automatycznie dodawane do sitemap.xml z:
- Priority: 0.8 (wysoki)
- Change frequency: monthly
- Last modified: data realizacji

## Jak Dodać Nową Realizację

### Krok 1: Przygotuj zdjęcia
- Umieść zdjęcia w `/public/garaz/`, `/public/mieszkanie/` lub innym folderze
- Zoptymalizuj rozmiar (maks 1-2 MB na zdjęcie)

### Krok 2: Utwórz plik JSON
W folderze `/data/realizacje/` utwórz nowy plik `nazwa-projektu-rok.json`:

```json
{
  "slug": "garaz-warszawa-2024",
  "title": "Posadzka żywiczna w garażu - Warszawa",
  "description": "Szczegółowy opis projektu z słowami kluczowymi...",
  "category": "garaz",
  "location": "Warszawa, Mokotów",
  "date": "2024-10-15",
  "images": {
    "main": "/garaz/main-photo.jpg",
    "gallery": [
      "/garaz/photo1.jpg",
      "/garaz/photo2.jpg"
    ]
  },
  "details": {
    "surface": "40 m²",
    "system": "Epoksyd z posypką kwarcową",
    "color": "Szary RAL 7037",
    "duration": "3 dni"
  },
  "features": [
    "Wysoka odporność na ścieranie",
    "Łatwe utrzymanie czystości",
    "Estetyczny wygląd"
  ],
  "keywords": [
    "posadzka żywiczna garaż",
    "epoksyd garaż Warszawa"
  ],
  "clientTestimonial": {
    "content": "Opinia klienta...",
    "author": "Pan Tomasz, Warszawa"
  }
}
```

### Krok 3: Zapisz i commit
Po zapisaniu pliku, projekt automatycznie pojawi się na stronie po następnym build.

## Najlepsze Praktyki SEO

1. **Title**: 50-70 znaków, zawiera lokalizację i typ projektu
2. **Description**: 150-200 znaków, szczegółowy opis z keywords
3. **Keywords**: 3-5 fraz, długi ogon + lokalizacja
4. **Images**: Optymalizowane pod wielkość, dobre jakości
5. **Features**: Konkretne korzyści dla klienta
6. **Testimonial**: Autentyczna opinia zwiększa konwersję

## Integracje

### Header (Nawigacja)
Link "Realizacje" został dodany do głównej nawigacji w `blocks/header/header2.tsx` jako drugi element menu (po "Strona Główna").

### Sitemap
Wszystkie realizacje są automatycznie dodawane do `sitemap.xml` przez funkcję w `app/sitemap.ts`.

### Homepage
Możesz dodać sekcję z najnowszymi realizacjami na stronie głównej używając komponentu `RealizacjePreviewSection`.

## Rozszerzanie Systemu

### Dodawanie Nowych Kategorii

1. Zaktualizuj typ w `types/realizacje.ts`:
```typescript
export type RealizacjaCategory = 'dom' | 'garaz' | 'balkon-taras' | 'nowa-kategoria';
```

2. Dodaj nazwę wyświetlaną w `lib/realizacje.ts`:
```typescript
export function getCategoryDisplayName(category: RealizacjaCategory): string {
  const names: Record<RealizacjaCategory, string> = {
    'dom': 'Domy i mieszkania',
    'garaz': 'Garaże',
    'balkon-taras': 'Balkony i tarasy',
    'nowa-kategoria': 'Nowa Kategoria',
  };
  return names[category];
}
```

3. Zaktualizuj metadata w `lib/realizacje.ts`:
```typescript
const byCategory: Record<RealizacjaCategory, number> = {
  'dom': 0,
  'garaz': 0,
  'balkon-taras': 0,
  'nowa-kategoria': 0,
};
```

## Bezpieczeństwo i Wydajność

- Wszystkie obrazy używają Next.js Image z automatyczną optymalizacją
- Static Site Generation (SSG) dla wszystkich stron realizacji
- Type-safe dzięki TypeScript
- Walidacja danych przez TypeScript interface
- Bezpieczne renderowanie HTML (React auto-escape)

## Wsparcie

Pełna dokumentacja dla użytkowników znajduje się w `/data/realizacje/README.md`.

Dla pytań technicznych, sprawdź:
- TypeScript types: `types/realizacje.ts`
- Funkcje pomocnicze: `lib/realizacje.ts`
- Przykładowe dane: pliki JSON w `data/realizacje/`

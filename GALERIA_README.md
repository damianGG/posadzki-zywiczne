# Galeria Zdjęć - Dokumentacja

## Opis funkcjonalności

Nowa strona `/galeria` agreguje wszystkie zdjęcia z realizacji posadzek żywicznych w jednym miejscu, umożliwiając łatwe przeglądanie całego portfolio.

## Struktura plików

```
app/galeria/
├── page.tsx           # Server component - agreguje zdjęcia z realizacji
└── galeria-client.tsx # Client component - interaktywna galeria
```

## Funkcjonalności

### 1. Agregacja zdjęć
- Automatycznie pobiera wszystkie zdjęcia ze wszystkich realizacji
- Zawiera zarówno zdjęcia główne jak i galerie zdjęć z każdej realizacji
- Każde zdjęcie posiada informacje o źródłowej realizacji

### 2. Widok siatki
- Responsywna siatka zdjęć:
  - Mobile: 2 kolumny
  - Tablet: 3 kolumny
  - Desktop: 4 kolumny
- Hover effect z pokazaniem kategorii realizacji
- Aspect ratio 1:1 dla wszystkich miniatur

### 3. Pełnoekranowy widok (TikTok style)

#### Navigation:
- **Klawiatura**: 
  - `Arrow Up` / `Arrow Down` - przewijanie między zdjęciami
  - `Escape` - zamknięcie galerii
- **Touch (Mobile)**:
  - Swipe up - następne zdjęcie (w dół)
  - Swipe down - poprzednie zdjęcie (w górę)
- **Przyciski**:
  - ChevronUp (góra) - poprzednie zdjęcie
  - ChevronDown (dół) - następne zdjęcie

#### Wyświetlanie:
- **Mobile**: `object-cover` - zdjęcie wypełnia cały ekran
- **Desktop**: `object-contain` - zachowanie proporcji

#### UI Elements:
- Licznik zdjęć (góra lewo)
- Przycisk zamknięcia (góra prawo)
- Informacje o realizacji (dół) - tytuł i kategoria z linkiem
- Wszystkie elementy UI mają semi-transparentne tło dla lepszej czytelności

### 4. SEO
- Pełne metadane dla wyszukiwarek
- Open Graph dla social media
- Canonical URL
- Revalidacja co 60 sekund

## Integracja z istniejącym kodem

### Header
Dodano link "Galeria" w menu między "Realizacje" a "Balkony i Tarasy":
```typescript
// blocks/header/header2.tsx
{
  title: "Galeria",
  href: "/galeria",
  description: "",
}
```

### Wykorzystywane komponenty
- `@/lib/realizacje` - pobieranie danych o realizacjach
- `@/lib/realizacje-helpers` - wyświetlanie nazw kategorii
- `@/components/ui/badge` - wyświetlanie kategorii
- `@/blocks/contact/contact1` - sekcja kontaktowa
- `@/blocks/cta/cta2` - call-to-action

## Responsywność

### Mobile (< 768px)
- Siatka 2 kolumny
- Pełnoekranowe zdjęcia (object-cover)
- Swipe gestures dla nawigacji
- Przyciski nawigacji wyśrodkowane w pionie

### Desktop (≥ 768px)
- Siatka 3-4 kolumny
- Zdjęcia zachowują proporcje (object-contain)
- Nawigacja strzałkami klawiatury
- Przyciski na górze i dole ekranu

## Performance

- Lazy loading obrazów przez Next.js Image
- Optymalizacja rozmiaru obrazów przez sizes attribute
- Revalidacja cache co 60 sekund
- Suspense boundary dla płynnego ładowania

## Accessibility

- ARIA labels dla przycisów nawigacji
- Wsparcie dla klawiatury
- Alt text dla wszystkich obrazów
- Semantic HTML

## Przyszłe usprawnienia (opcjonalne)

1. Filtrowanie po kategorii realizacji
2. Sortowanie (najnowsze/najstarsze)
3. Wyszukiwanie po nazwie realizacji
4. Infinite scroll w widoku siatki
5. Animacje przejść między zdjęciami
6. Download button dla zdjęć
7. Share button (social media)

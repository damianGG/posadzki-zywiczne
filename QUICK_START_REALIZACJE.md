# Quick Start - Lokalny skaner realizacji

## Dla użytkownika (dodawanie realizacji)

### Krok 1: Utwórz folder
```bash
mkdir public/realizacje/[miasto]-[ulica]-[typ]
```

Przykład: `warszawa-bemowo-balkon`

**Typy:** taras, balkon, garaz, mieszkanie, gastronomia, kuchnia, schody

### Krok 2: Dodaj zdjęcia
```bash
# Skopiuj zdjęcia do folderu
cp ~/zdjecia/*.jpg public/realizacje/warszawa-bemowo-balkon/
```

### Krok 3: Utwórz opis.json
```json
{
  "title": "Twój tytuł realizacji",
  "description": "Opis projektu...",
  "location": "Warszawa, Bemowo",
  "area": "20 m²",
  "technology": "Epoksyd",
  "type": "indywidualna",
  "tags": ["balkon", "epoksyd"],
  "features": [
    "Cecha 1",
    "Cecha 2"
  ],
  "keywords": [
    "słowo kluczowe 1",
    "słowo kluczowe 2"
  ]
}
```

### Krok 4: Uruchom skaner
```bash
node scripts/scan-realizacje.mjs
```

### Wynik:
✅ Plik `data/realizacje/warszawa-bemowo-balkon.json` utworzony
✅ Strona dostępna pod `/realizacje/warszawa-bemowo-balkon`

---

## Dla agenta AI (generowanie artykułów)

### Źródło danych
```typescript
import { getAllRealizacje } from '@/lib/realizacje';

// Pobierz wszystkie realizacje
const realizacje = getAllRealizacje();

// Każda realizacja zawiera:
// - title, description, location, date
// - category, type, tags
// - images: { main, gallery[] }
// - details: { surface, system, color, duration }
// - features[], keywords[]
// - clientTestimonial (opcjonalnie)
```

### Wykorzystanie do artykułów
1. **Dane już przetworzone** - wszystko w `data/realizacje/*.json`
2. **Struktura standaryzowana** - interfejs `Realizacja`
3. **Gotowe do użycia** - importuj z `lib/realizacje.ts`

### Przykładowy prompt dla generowania artykułu:
```
Na podstawie realizacji z pliku data/realizacje/[slug].json:
1. Utwórz artykuł blogowy (800-1200 słów)
2. Zawrzyj: wprowadzenie, opis techniczny, zalety, podsumowanie
3. Użyj keywords z realizacji dla SEO
4. Dodaj sekcję z galeria obrazów
5. Format: Markdown
```

---

## Integracja

### Istniejące funkcje (lib/realizacje.ts):
- `getAllRealizacje()` - wszystkie realizacje
- `getRealizacjaBySlug(slug)` - pojedyncza realizacja
- `getRealizacjeByCategory(category)` - filtrowanie po kategorii
- `getLatestRealizacje(limit)` - najnowsze realizacje

### Automatyczne generowanie stron:
- `app/realizacje/[slug]/page.tsx` - używa danych z JSON
- Dynamiczne ścieżki już skonfigurowane
- SEO meta tagi automatycznie generowane

---

## Workflow: Realizacja → Artykuł

1. **Użytkownik dodaje realizację:**
   - Folder + zdjęcia + opis.json
   - Uruchamia skaner
   
2. **System tworzy JSON:**
   - `data/realizacje/[slug].json`
   
3. **Agent AI (nowy PR):**
   - Odczytuje JSON
   - Generuje artykuł na blog
   - Tworzy plik MDX/MD
   
4. **Merge:**
   - Realizacja widoczna na `/realizacje/[slug]`
   - Artykuł widoczny na `/blog/[artykul]`

---

## Tips

- **Pierwsze zdjęcie alfabetycznie** = główne (użyj `0-glowne.jpg`)
- **Minimalne dane:** tylko `title` i `description`
- **Automatyczne:** slug, kategoria, ścieżki obrazów
- **Aktualizacje:** po edycji opis.json uruchom skaner ponownie

---

## Przykład kompletny

```bash
# 1. Utwórz strukturę
mkdir -p public/realizacje/krakow-kazimierz-taras
cd public/realizacje/krakow-kazimierz-taras

# 2. Dodaj opis
cat > opis.json << 'EOF'
{
  "title": "Taras z widokiem na Wawel - Kraków",
  "description": "Piękny taras z posadzką żywiczną...",
  "location": "Kraków, Kazimierz",
  "area": "30 m²",
  "technology": "Epoksyd UV",
  "tags": ["taras", "epoksyd", "uv-protect"],
  "features": ["Odporność UV", "Wodoszczelność"],
  "keywords": ["taras epoksyd kraków", "posadzka taras"]
}
EOF

# 3. Dodaj zdjęcia
cp ~/photos/taras-*.jpg .

# 4. Skanuj
cd ../../../
node scripts/scan-realizacje.mjs

# ✅ Gotowe!
```

Plik `data/realizacje/krakow-kazimierz-taras.json` utworzony i gotowy do wykorzystania!

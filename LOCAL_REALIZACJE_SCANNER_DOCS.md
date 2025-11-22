# Skaner Lokalnych Realizacji - Dokumentacja

## Opis

System do automatycznego skanowania lokalnych folderów z realizacjami i tworzenia/aktualizacji plików JSON używanych przez stronę Next.js.

## Struktura folderów

### Katalog źródłowy: `public/realizacje/`

Każda realizacja powinna mieć swój folder według schematu:

```
public/realizacje/[miasto]-[ulica]-[typ]/
```

Gdzie:
- `[miasto]` - nazwa miasta (np. "warszawa", "krakow")
- `[ulica]` - nazwa ulicy/dzielnicy (np. "mokotow", "kazimierz")
- `[typ]` - typ realizacji: `taras`, `balkon`, `garaz`, `mieszkanie`, `gastronomia`, `kuchnia`, `schody`

### Przykłady nazw folderów:

```
warszawa-mokotow-garaz
krakow-kazimierz-balkon
gdansk-wrzeszcz-mieszkanie
poznan-centrum-gastronomia
```

## Zawartość folderu realizacji

Każdy folder musi zawierać:

1. **Plik `opis.json`** - deskryptor z informacjami o projekcie
2. **Pliki graficzne** - zdjęcia realizacji (*.jpg, *.png, *.webp)

### Format pliku `opis.json`

```json
{
  "title": "Posadzka żywiczna w garażu - Warszawa Mokotów",
  "description": "Kompleksowa realizacja posadzki epoksydowej w garażu dwustanowiskowym...",
  "location": "Warszawa, Mokotów",
  "area": "40 m²",
  "technology": "Epoksyd z posypką kwarcową",
  "type": "indywidualna",
  "tags": ["garaż", "epoksyd", "antypoślizg"],
  "color": "Szary RAL 7037",
  "duration": "3 dni",
  "features": [
    "Wysoka odporność na ścieranie",
    "Łatwe utrzymanie czystości",
    "Antypoślizgowa powierzchnia"
  ],
  "keywords": [
    "posadzka żywiczna garaż",
    "epoksyd garaż Warszawa"
  ],
  "clientTestimonial": {
    "content": "Jestem bardzo zadowolony z wykonanej posadzki...",
    "author": "Pan Tomasz, Warszawa"
  }
}
```

### Pola wymagane:
- `title` - Tytuł realizacji
- `description` - Opis realizacji

### Pola opcjonalne:
- `location` - Lokalizacja (domyślnie: nazwa miasta z folderu)
- `area` - Powierzchnia (np. "40 m²")
- `technology` - Technologia (np. "Epoksyd")
- `type` - Typ: `indywidualna` lub `komercyjna` (domyślnie: `indywidualna`)
- `tags` - Tablica tagów
- `color` - Kolor
- `duration` - Czas realizacji
- `features` - Tablica cech/rozwiązań
- `keywords` - Tablica słów kluczowych SEO
- `clientTestimonial` - Opinia klienta (obiekt z `content` i `author`)

## Automatyczne mapowanie

### Kategorie

Typ z nazwy folderu jest automatycznie mapowany na kategorię:

| Typ z folderu | Kategoria |
|---------------|-----------|
| `taras` | balkony-tarasy |
| `balkon` | balkony-tarasy |
| `garaz` | mieszkania-domy |
| `mieszkanie` | mieszkania-domy |
| `dom` | mieszkania-domy |
| `gastronomia` | pomieszczenia-czyste |
| `kuchnia` | kuchnie |
| `schody` | schody |

### Obrazy

Pierwszy plik graficzny alfabetycznie = zdjęcie główne
Pozostałe pliki = galeria

Ścieżki do obrazów są generowane automatycznie:
```
/realizacje/[nazwa-folderu]/[nazwa-pliku]
```

### Slug

Slug jest generowany z nazwy folderu:
- Konwersja do małych liter
- Usunięcie niedozwolonych znaków
- Normalizacja myślników

Przykład: `Warszawa-Mokotów-Garaż` → `warszawa-mokotow-garaz`

## Użytkowanie

### Metoda 1: Skrypt CLI

```bash
# Uruchom skaner
npx tsx scripts/scan-realizacje.ts
```

Skrypt:
1. Skanuje wszystkie foldery w `public/realizacje/`
2. Tworzy/aktualizuje pliki JSON w `data/realizacje/`
3. Wyświetla szczegółowy raport

### Metoda 2: API Endpoint

```bash
# POST request
curl -X POST http://localhost:3000/api/scan-realizacje
```

Odpowiedź:
```json
{
  "success": true,
  "message": "Skanowanie zakończone pomyślnie",
  "stats": {
    "total": 5,
    "new": 2,
    "updated": 1,
    "unchanged": 2,
    "errors": 0,
    "orphaned": 0
  },
  "details": {
    "new": [...],
    "updated": [...],
    "errors": [...],
    "orphaned": [...]
  }
}
```

### Metoda 3: Programatyczna

```typescript
import { scanAllRealizacje, scanRealizacjaFolder } from '@/lib/local-realizacje-scanner';

// Skanuj wszystkie foldery
const results = await scanAllRealizacje();

// Lub skanuj pojedynczy folder
const result = await scanRealizacjaFolder(
  '/path/to/folder',
  'warszawa-mokotow-garaz'
);
```

## Workflow

### Dodawanie nowej realizacji

1. Utwórz folder w `public/realizacje/`:
   ```bash
   mkdir public/realizacje/warszawa-bemowo-balkon
   ```

2. Dodaj zdjęcia:
   ```bash
   # Skopiuj zdjęcia do folderu
   cp ~/zdjecia/*.jpg public/realizacje/warszawa-bemowo-balkon/
   ```

3. Utwórz `opis.json`:
   ```bash
   nano public/realizacje/warszawa-bemowo-balkon/opis.json
   ```

4. Uruchom skaner:
   ```bash
   npx tsx scripts/scan-realizacje.ts
   ```

5. Sprawdź wynik:
   ```bash
   ls data/realizacje/
   # Powinien pojawić się plik: warszawa-bemowo-balkon.json
   ```

### Aktualizacja istniejącej realizacji

1. Edytuj `opis.json` w odpowiednim folderze
2. Uruchom skaner ponownie
3. Plik JSON zostanie automatycznie zaktualizowany

## Statusy skanowania

- **new** - Nowa realizacja utworzona
- **updated** - Istniejąca realizacja zaktualizowana
- **unchanged** - Brak zmian w realizacji
- **error** - Błąd podczas przetwarzania

## Obsługa błędów

### Brak pliku opis.json
```
❌ ERROR: Brak pliku opis.json w folderze
```
**Rozwiązanie:** Utwórz plik `opis.json` w folderze

### Brak wymaganych pól
```
❌ ERROR: Brak wymaganych pól (title, description) w opis.json
```
**Rozwiązanie:** Dodaj pola `title` i `description` do `opis.json`

### Błąd parsowania JSON
```
❌ ERROR: Unexpected token...
```
**Rozwiązanie:** Sprawdź składnię JSON w pliku `opis.json`

### Brak zdjęć
**Uwaga:** Brak zdjęć nie powoduje błędu, ale realizacja będzie bez obrazów

## Osierocone realizacje

Skaner wykrywa realizacje, które istnieją w `data/realizacje/` ale nie mają odpowiadającego folderu w `public/realizacje/`.

```bash
⚠️  Znaleziono realizacje bez odpowiadających folderów:
   - stara-realizacja-2023
```

**Akcje:**
- Utwórz folder dla tej realizacji w `public/realizacje/`
- LUB usuń plik JSON z `data/realizacje/`

## Integracja z Next.js

Wygenerowane pliki JSON są automatycznie używane przez:

- `lib/realizacje.ts` - funkcje do pobierania realizacji
- `app/realizacje/[slug]/page.tsx` - strony realizacji
- `app/realizacje/page.tsx` - lista realizacji

Po uruchomieniu skanera, strony realizacji są natychmiast dostępne pod:
```
/realizacje/[slug]
```

## Przykładowa struktura kompletnego projektu

```
public/realizacje/
├── warszawa-mokotow-garaz/
│   ├── opis.json
│   ├── zdjecie-glowne.jpg
│   ├── zdjecie-1.jpg
│   └── zdjecie-2.jpg
├── krakow-kazimierz-balkon/
│   ├── opis.json
│   ├── balkon-przed.jpg
│   └── balkon-po.jpg
└── gdansk-wrzeszcz-mieszkanie/
    ├── opis.json
    ├── salon-1.jpg
    ├── salon-2.jpg
    └── kuchnia.jpg

↓ SKANER ↓

data/realizacje/
├── warszawa-mokotow-garaz.json
├── krakow-kazimierz-balkon.json
└── gdansk-wrzeszcz-mieszkanie.json

↓ NEXT.JS ↓

Website:
├── /realizacje/warszawa-mokotow-garaz
├── /realizacje/krakow-kazimierz-balkon
└── /realizacje/gdansk-wrzeszcz-mieszkanie
```

## Tips & Best Practices

### Nazewnictwo folderów
- Używaj małych liter
- Używaj myślników zamiast spacji
- Bądź konsekwentny w nazewnictwie

### Zdjęcia
- Używaj znaczących nazw plików (nie IMG_1234.jpg)
- Pierwsze zdjęcie alfabetycznie = główne (np. `0-glowne.jpg`)
- Optymalizuj rozmiar obrazów przed dodaniem

### opis.json
- Zachowaj poprawną składnię JSON
- Dodawaj wszystkie dostępne informacje
- Używaj słów kluczowych SEO

### Regularne skanowanie
```bash
# Dodaj do crontab lub uruchamiaj po dodaniu nowych realizacji
npx tsx scripts/scan-realizacje.ts
```

## FAQ

**Q: Czy mogę używać innych formatów niż JSON?**
A: Obecnie tylko JSON jest wspierany. YAML może być dodany w przyszłości.

**Q: Co jeśli zmienię nazwę folderu?**
A: Zostanie utworzona nowa realizacja. Stary plik JSON pozostanie (osierocony).

**Q: Jak usunąć realizację?**
A: Usuń folder z `public/realizacje/` i plik JSON z `data/realizacje/`

**Q: Czy skaner nadpisuje istniejące pliki?**
A: Tak, jeśli wykryje zmiany w `opis.json`. Status: "updated"

**Q: Czy mogę ręcznie edytować pliki JSON?**
A: Tak, ale pamiętaj że będą nadpisane przy następnym skanowaniu jeśli folder istnieje.

## Wsparcie

W razie problemów:
1. Sprawdź logi w konsoli
2. Zweryfikuj składnię `opis.json`
3. Upewnij się że folder ma poprawną nazwę
4. Sprawdź uprawnienia do zapisu w katalogach

# Migracja Bazy Danych - SEO Content Structure

## Przegląd

Ta migracja dodaje nowe kolumny do tabeli `realizacje` w Supabase, aby wspierać zoptymalizowaną strukturę treści SEO.

## Nowe Kolumny

### 1. `h1` (TEXT, NULLABLE)
Nagłówek H1 dla strony realizacji. Powinien być zbliżony do title, ale nie identyczny.

### 2. `content` (JSONB, NULLABLE)
Obiekt JSON zawierający wszystkie sekcje treści SEO:

```json
{
  "intro": "Wstęp 3-5 zdań",
  "whenToUse": "Kiedy rozwiązanie ma sens",
  "advantages": "Zalety rozwiązania",
  "disadvantages": "Wady i ograniczenia",
  "execution": "Wykonanie krok po kroku",
  "durability": "Trwałość i odporność",
  "pricing": "Cena – widełki + czynniki",
  "commonMistakes": "Najczęstsze błędy",
  "forWho": "Dla kogo to rozwiązanie",
  "localService": "Lokalizacja usług"
}
```

## SQL Migration Script

Uruchom następujący skrypt SQL w Supabase SQL Editor:

```sql
-- Dodaj kolumnę h1
ALTER TABLE realizacje 
ADD COLUMN IF NOT EXISTS h1 TEXT;

-- Dodaj kolumnę content (jeśli nie istnieje)
ALTER TABLE realizacje 
ADD COLUMN IF NOT EXISTS content JSONB;

-- Dodaj komentarze do dokumentacji
COMMENT ON COLUMN realizacje.h1 IS 'H1 heading for the page, similar to title but not identical (50-65 chars)';
COMMENT ON COLUMN realizacje.content IS 'SEO-optimized content sections as JSON object with intro, whenToUse, advantages, disadvantages, execution, durability, pricing, commonMistakes, forWho, localService';

-- Sprawdź czy kolumny zostały dodane
SELECT column_name, data_type, is_nullable 
FROM information_schema.columns 
WHERE table_name = 'realizacje' 
  AND column_name IN ('h1', 'content')
ORDER BY column_name;
```

## Weryfikacja

Po uruchomieniu migracji, sprawdź czy:

1. Kolumny zostały dodane:
```sql
SELECT h1, content FROM realizacje LIMIT 1;
```

2. Kolumna `content` akceptuje JSON:
```sql
UPDATE realizacje 
SET content = '{"intro": "Test intro"}'::jsonb 
WHERE slug = 'test-slug';
```

3. Kolumna `faq` już istnieje (dodana w poprzedniej migracji):
```sql
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'realizacje' 
  AND column_name = 'faq';
```

## Kompatybilność Wsteczna

### Istniejące realizacje
- Kolumny są nullable, więc istniejące realizacje będą działać bez zmian
- Nowe realizacje generowane przez AI będą miały wypełnione wszystkie pola
- Można stopniowo aktualizować stare realizacje poprzez panel admin

### Widok strony
- Szablon sprawdza czy content istnieje przed renderowaniem sekcji
- Jeśli content nie istnieje, sekcje nie są wyświetlane
- Zachowana kompatybilność ze starym formatem (tylko description)

## Rollback

Jeśli trzeba cofnąć migrację:

```sql
-- Usuń kolumny (UWAGA: utracisz dane w tych kolumnach!)
ALTER TABLE realizacje DROP COLUMN IF EXISTS h1;
ALTER TABLE realizacje DROP COLUMN IF EXISTS content;
```

## Post-Migration Tasks

Po migracji:

1. **Przetestuj dodawanie nowej realizacji** przez panel admin
2. **Sprawdź generowanie AI** - czy wypełnia wszystkie sekcje
3. **Zweryfikuj wyświetlanie** na stronie realizacji
4. **Zaktualizuj backup policy** - uwzględnij nowe kolumny

## Przykładowe Dane Testowe

Możesz użyć tego skryptu do dodania przykładowej realizacji z pełną strukturą SEO:

```sql
INSERT INTO realizacje (
  slug,
  title,
  h1,
  description,
  location,
  project_type,
  content,
  faq,
  images,
  tags,
  keywords,
  features
) VALUES (
  'warszawa-test-garaz-epoksyd',
  'Posadzka Epoksydowa w Garażu - Warszawa Mokotów',
  'Profesjonalna Posadzka Garażowa w Warszawie',
  'Kompleksowa realizacja posadzki epoksydowej w garażu na warszawskim Mokotowie.',
  'Warszawa, Mokotów',
  'garaz',
  '{
    "intro": "Posadzka epoksydowa w garażu to rozwiązanie łączące wytrzymałość z estetyką...",
    "whenToUse": "Rozwiązanie ma sens gdy potrzebujesz powierzchni odpornej na chemikalia...",
    "advantages": "Główne zalety to wysoka odporność na ścieranie...",
    "disadvantages": "Do wad należy konieczność profesjonalnego wykonania...",
    "execution": "Proces rozpoczynamy od przygotowania podłoża...",
    "durability": "W warunkach polskich posadzka wytrzymuje zmiany temperatury...",
    "pricing": "Orientacyjna cena to 80-150 zł/m²...",
    "commonMistakes": "Najczęstsze błędy to niewłaściwe przygotowanie podłoża...",
    "forWho": "Idealne dla właścicieli garaży prywatnych...",
    "localService": "Świadczymy usługi na terenie Warszawy i okolic..."
  }'::jsonb,
  '[
    {
      "question": "Jak długo schnie posadzka?",
      "answer": "Posadzka schnie powierzchniowo po 24h, pełną wytrzymałość osiąga po 7 dniach."
    }
  ]'::jsonb,
  '{
    "main": "https://example.com/image.jpg",
    "gallery": [{"url": "https://example.com/image.jpg", "alt": "Test"}]
  }'::jsonb,
  ARRAY['garaż', 'epoksyd', 'Warszawa'],
  ARRAY['posadzka epoksydowa warszawa', 'posadzka garażowa'],
  ARRAY['Odporna na chemikalia', 'Łatwa w utrzymaniu']
);
```

## Pytania i Problemy

### Kolumna `content` nie przyjmuje JSON?
Sprawdź czy użyłeś typu `JSONB` a nie `JSON`. JSONB jest zoptymalizowany dla PostgreSQL.

### Błąd przy insercie?
Upewnij się że JSON jest poprawnie sformatowany. Użyj `::jsonb` do rzutowania.

### Nie widzę nowych kolumn?
Odśwież połączenie z bazą lub sprawdź czy jesteś podłączony do właściwej bazy.

## Status Migracji

- [ ] SQL script uruchomiony
- [ ] Kolumny zweryfikowane
- [ ] Testowa realizacja dodana
- [ ] Strona przetestowana
- [ ] Backup zaktualizowany

## Changelog

### 2025-12-26
- Dodano kolumnę `h1` (TEXT, NULLABLE)
- Dodano kolumnę `content` (JSONB, NULLABLE)
- Zaktualizowano dokumentację

# Rozwiązanie problemu: "Could not find the 'is_included_in_floor_price' column"

## Problem
Po dodaniu nowej kolumny `is_included_in_floor_price` do tabeli `calculator_services` w Supabase, możesz otrzymać błąd:
```
Could not find the 'is_included_in_floor_price' column of 'calculator_services' in the schema cache
```

## Rozwiązanie

### Opcja 1: Odśwież cache w Supabase Dashboard (ZALECANE)
1. Zaloguj się do Supabase Dashboard
2. Przejdź do **Table Editor**
3. Wybierz tabelę `calculator_services`
4. Kliknij w **dowolny nagłówek kolumny** (np. "id" lub "name")
5. Odśwież stronę przeglądarki (F5)
6. Cache zostanie automatycznie zaktualizowany

### Opcja 2: Ponowne uruchomienie migracji
Jeśli powyższe nie pomoże, możesz ponownie uruchomić migrację:

1. Otwórz Supabase SQL Editor
2. Uruchom poniższe polecenie, aby upewnić się, że kolumna istnieje:
```sql
-- Sprawdź czy kolumna istnieje
SELECT column_name, data_type 
FROM information_schema.columns 
WHERE table_name = 'calculator_services' 
AND column_name = 'is_included_in_floor_price';

-- Jeśli kolumna nie istnieje, dodaj ją:
ALTER TABLE calculator_services 
ADD COLUMN IF NOT EXISTS is_included_in_floor_price BOOLEAN DEFAULT false;
```

3. Po uruchomieniu, odśwież Dashboard

### Opcja 3: Restart projektu Supabase (ostateczność)
1. W Supabase Dashboard przejdź do **Project Settings**
2. Znajdź opcję restart projektu
3. Po restarcie wszystkie zmiany w schemacie będą widoczne

## Weryfikacja
Po zastosowaniu którejś z powyższych metod, sprawdź czy problem został rozwiązany:

1. Przejdź do `/admin/kalkulator`
2. Otwórz zakładkę "Usługi"
3. Powinien być widoczny przełącznik "Usługa w cenie posadzki"
4. Zmień jego stan - nie powinno być błędów

## Dlaczego to się dzieje?
Supabase cachuje schemat bazy danych dla lepszej wydajności. Kiedy dodajemy nowe kolumny przez migracje SQL, czasami cache nie jest automatycznie odświeżany i trzeba to zrobić ręcznie.

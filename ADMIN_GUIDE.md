# Instrukcja Administracyjna - Konkurs Świąteczny

## Przeglądanie Zgłoszeń Konkursowych

### Sprawdzenie wszystkich zgłoszeń

Aby zobaczyć wszystkie zgłoszenia do konkursu, użyj API endpoint:

```bash
# Pobranie pierwszych 100 zgłoszeń
curl http://localhost:3000/api/contest-entries

# Lub w przeglądarce
http://localhost:3000/api/contest-entries
```

### Paginacja

Możesz przeglądać zgłoszenia strona po stronie:

```bash
# Pierwsza strona (50 zgłoszeń)
http://localhost:3000/api/contest-entries?limit=50&offset=0

# Druga strona (kolejne 50 zgłoszeń)
http://localhost:3000/api/contest-entries?limit=50&offset=50

# Trzecia strona
http://localhost:3000/api/contest-entries?limit=50&offset=100
```

### Sortowanie

Możesz sortować zgłoszenia według różnych pól:

```bash
# Najnowsze zgłoszenia (domyślnie)
http://localhost:3000/api/contest-entries?orderBy=created_at&order=desc

# Najstarsze zgłoszenia
http://localhost:3000/api/contest-entries?orderBy=created_at&order=asc

# Alfabetycznie według nazwiska
http://localhost:3000/api/contest-entries?orderBy=name&order=asc

# Według adresu email
http://localhost:3000/api/contest-entries?orderBy=email&order=asc
```

## Eksport do CSV

Aby wyeksportować wszystkie zgłoszenia do pliku CSV (Excel):

### W przeglądarce:
```
http://localhost:3000/api/contest-entries/export
```

### Przez terminal:
```bash
curl http://localhost:3000/api/contest-entries/export -o konkursy-$(date +%Y-%m-%d).csv
```

Plik CSV zawiera wszystkie dane:
- ID zgłoszenia
- Email
- Imię
- Kod konkursowy
- Data wygenerowania
- Status wysłania emaila
- Status otwarcia emaila
- Data utworzenia w bazie

## Statystyki

API endpoint `/api/contest-entries` zwraca statystyki:

```json
{
  "stats": {
    "total": 150,           // Łączna liczba zgłoszeń
    "emailsSent": 145,      // Liczba wysłanych emaili
    "emailsOpened": 30      // Liczba otwartych emaili (przyszła funkcja)
  }
}
```

## Zapytania w Supabase

Możesz też korzystać bezpośrednio z panelu Supabase:

### Wszystkie zgłoszenia
```sql
SELECT * FROM contest_entries 
ORDER BY created_at DESC;
```

### Zgłoszenia gdzie email nie został wysłany
```sql
SELECT * FROM contest_entries 
WHERE email_sent = false;
```

### Statystyki
```sql
SELECT 
  COUNT(*) as total_entries,
  SUM(CASE WHEN email_sent THEN 1 ELSE 0 END) as emails_sent,
  SUM(CASE WHEN email_opened THEN 1 ELSE 0 END) as emails_opened
FROM contest_entries;
```

### Najnowsze zgłoszenia (ostatnie 24h)
```sql
SELECT * FROM contest_entries 
WHERE created_at > NOW() - INTERVAL '24 hours'
ORDER BY created_at DESC;
```

### Zgłoszenia według dnia
```sql
SELECT 
  DATE(created_at) as date,
  COUNT(*) as entries_count
FROM contest_entries 
GROUP BY DATE(created_at)
ORDER BY date DESC;
```

## Ponowne Wysłanie Emaila

Jeśli uczestnik zgłosi, że nie otrzymał emaila, może użyć tego samego adresu email ponownie na stronie konkursu. System automatycznie:
1. Znajdzie istniejące zgłoszenie
2. Wyśle email z tym samym kodem ponownie
3. Zaktualizuje status `email_sent`

## Losowanie Zwycięzcy

### Metoda 1: Losowe ID z bazy danych

```sql
-- Wylosuj jednego zwycięzcę
SELECT * FROM contest_entries 
ORDER BY RANDOM() 
LIMIT 1;
```

### Metoda 2: Wydruk wszystkich kodów

1. Wyeksportuj CSV: `http://localhost:3000/api/contest-entries/export`
2. Otwórz w Excel/Google Sheets
3. Wydrukuj kolumnę z kodami
4. Przeprowadź fizyczne losowanie

## Bezpieczeństwo

⚠️ **WAŻNE:** Endpointy administracyjne nie są obecnie zabezpieczone hasłem!

W środowisku produkcyjnym powinieneś:
1. Dodać autoryzację (login/hasło)
2. Użyć Supabase Auth
3. Dodać tokeny JWT
4. Whitelist IP adresów

### Tymczasowe zabezpieczenie

Możesz dodać ograniczenie IP w Vercel lub dodać prosty token API:

```bash
# Przykład z tokenem
http://localhost:3000/api/contest-entries?token=twoj-tajny-token
```

## Wsparcie

W razie problemów:
- Sprawdź logi w Supabase Dashboard
- Sprawdź logi w Vercel Dashboard
- Skontaktuj się: biuro@posadzkizywiczne.com

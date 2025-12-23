# 🚀 Szybki Start - Integracja Supabase

## 📋 Kroki do uruchomienia (5-10 minut)

### 1️⃣ Utwórz Projekt Supabase
```
1. Idź na: https://app.supabase.com
2. Kliknij "New Project"
3. Wypełnij:
   - Name: posadzki-konkurs (lub dowolna nazwa)
   - Database Password: [zapisz to hasło]
   - Region: Central EU (Frankfurt)
4. Czekaj 2-3 minuty na utworzenie projektu
```

### 2️⃣ Utwórz Tabelę w Bazie Danych
```
1. W Supabase Dashboard, idź do: SQL Editor
2. Kliknij "New query"
3. Skopiuj całą zawartość pliku: supabase-schema.sql
4. Wklej do edytora
5. Kliknij "Run"
6. Sprawdź komunikat: "Success. No rows returned"
```

### 3️⃣ Pobierz Klucze API
```
1. W Supabase Dashboard, idź do: Settings → API
2. Znajdź sekcję "Project URL"
   - Skopiuj URL (np. https://abcdefgh.supabase.co)
3. Znajdź sekcję "Project API keys"
   - Skopiuj klucz "anon public"
```

### 4️⃣ Skonfiguruj Zmienne Środowiskowe
```bash
# Edytuj plik .env (utwórz go jeśli nie istnieje)
# Wklej to i zastąp wartościami z Supabase:

NEXT_PUBLIC_SUPABASE_URL=https://twoj-projekt-id.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...

# Istniejące zmienne email (nie zmieniaj jeśli już działają):
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password
ADMIN_EMAIL=biuro@posadzkizywiczne.com
```

### 5️⃣ Testowanie
```bash
# 1. Zainstaluj zależności (jeśli jeszcze nie)
npm install

# 2. Uruchom serwer lokalnie
npm run dev

# 3. Otwórz w przeglądarce
http://localhost:3000/konkurs

# 4. Wypełnij formularz i kliknij "Weź udział"

# 5. Sprawdź czy dane zapisały się w Supabase:
# - Idź do Supabase Dashboard
# - Kliknij: Table Editor → contest_entries
# - Powinno być widoczne Twoje zgłoszenie
```

## ✅ Weryfikacja działania

### Test 1: Formularz
- [ ] Otwórz http://localhost:3000/konkurs
- [ ] Wpisz imię i email
- [ ] Kliknij "Weź udział w konkursie"
- [ ] Powinieneś zobaczyć kod np. PXZ-A3B4C5D6

### Test 2: Baza Danych
- [ ] Idź do Supabase → Table Editor → contest_entries
- [ ] Sprawdź czy widzisz swoje zgłoszenie
- [ ] Sprawdź czy `email_sent` = true

### Test 3: Email
- [ ] Sprawdź skrzynkę email
- [ ] Powinieneś otrzymać email z kodem

### Test 4: Duplikat
- [ ] Spróbuj zgłosić ten sam email ponownie
- [ ] Powinieneś otrzymać komunikat: "Ten email był już użyty"

### Test 5: Admin Panel
- [ ] Otwórz: http://localhost:3000/api/contest-entries
- [ ] Powinieneś zobaczyć JSON z listą zgłoszeń

### Test 6: Eksport CSV
- [ ] Otwórz: http://localhost:3000/api/contest-entries/export
- [ ] Plik CSV powinien się pobrać

## 🆘 Rozwiązywanie Problemów

### Problem: "Missing Supabase credentials"
```
Rozwiązanie:
1. Sprawdź czy plik .env istnieje
2. Sprawdź czy zmienne zaczynają się od NEXT_PUBLIC_
3. Zrestartuj serwer (Ctrl+C, potem npm run dev)
```

### Problem: "Error creating entry"
```
Rozwiązanie:
1. Sprawdź czy tabela istnieje w Supabase
2. Sprawdź czy klucze API są poprawne
3. Sprawdź logi w Supabase Dashboard → Logs
```

### Problem: "Email not sending"
```
To NIE jest problem Supabase!
- Zgłoszenie zapisze się w bazie danych
- Sprawdź konfigurację EMAIL_USER i EMAIL_PASS
- Dane i tak są bezpieczne w Supabase
```

## 📊 Przydatne Komendy

### Sprawdź wszystkie zgłoszenia w Supabase
```sql
SELECT * FROM contest_entries ORDER BY created_at DESC;
```

### Policz zgłoszenia
```sql
SELECT COUNT(*) FROM contest_entries;
```

### Zobacz najnowsze zgłoszenie
```sql
SELECT * FROM contest_entries ORDER BY created_at DESC LIMIT 1;
```

### Sprawdź statystyki emaili
```sql
SELECT 
  COUNT(*) as total,
  SUM(CASE WHEN email_sent THEN 1 ELSE 0 END) as emails_sent
FROM contest_entries;
```

## 📚 Pełna Dokumentacja

- `IMPLEMENTATION_SUMMARY.md` - Kompletne podsumowanie
- `SUPABASE_INTEGRATION.md` - Szczegółowy przewodnik techniczny
- `ADMIN_GUIDE.md` - Instrukcje administracyjne
- `ARCHITECTURE.md` - Architektura systemu

## 🎯 Co dalej?

Po poprawnym uruchomieniu lokalnie:

1. **Wdróż na produkcję** (Vercel/inne)
   - Dodaj zmienne środowiskowe w ustawieniach hostingu
   - Deploy aplikacji

2. **Zabezpiecz endpointy admin** (zalecane)
   - Dodaj autoryzację do `/api/contest-entries`
   - Zobacz ADMIN_GUIDE.md → sekcja "Bezpieczeństwo"

3. **Testuj na produkcji**
   - Zgłoś testowe uczestnictwo
   - Sprawdź email
   - Sprawdź Supabase Dashboard

## ☎️ Pomoc

Problemy? Napisz:
- Email: biuro@posadzkizywiczne.com
- Tel: +48 507 384 619

---

**Status:** ✅ Gotowe do użycia  
**Czas setup:** ~10 minut  
**Bezpieczeństwo:** Zweryfikowane (0 alertów)

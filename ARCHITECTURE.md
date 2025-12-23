# Architektura Systemu Konkursowego z Supabase

```
┌─────────────────────────────────────────────────────────────────┐
│                    FRONT-END (Next.js)                          │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │         /konkurs - Strona Konkursowa                   │   │
│  │                                                         │   │
│  │  [Formularz]                                           │   │
│  │   - Imię ────────┐                                     │   │
│  │   - Email ───────┤                                     │   │
│  │   [Wyślij] ──────┘                                     │   │
│  └────────────────────────────────────────────────────────┘   │
│                          │                                      │
│                          │ POST /api/generate-code             │
│                          ▼                                      │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                   BACK-END API (Next.js API Routes)            │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  POST /api/generate-code                               │   │
│  │                                                         │   │
│  │  1. Walidacja danych (imię, email)                    │   │
│  │  2. Sprawdzenie duplikatu email ──────────┐           │   │
│  │  3. Generowanie unikalnego kodu           │           │   │
│  │  4. Zapis do Supabase ────────────────────┼──────┐   │   │
│  │  5. Wysłanie emaila                       │      │    │   │
│  │  6. Aktualizacja statusu email_sent       │      │    │   │
│  └────────────────────────────────────────────┘      │    │   │
│                                                       │    │   │
│  ┌────────────────────────────────────────────────┐  │    │   │
│  │  GET /api/contest-entries (ADMIN)            │  │    │   │
│  │                                               │  │    │   │
│  │  - Paginacja (limit, offset)                 │  │    │   │
│  │  - Sortowanie (orderBy, order)               │  │    │   │
│  │  - Statystyki ────────────────────────────────┼──┤    │   │
│  └────────────────────────────────────────────────┘  │    │   │
│                                                       │    │   │
│  ┌────────────────────────────────────────────────┐  │    │   │
│  │  GET /api/contest-entries/export (ADMIN)     │  │    │   │
│  │                                               │  │    │   │
│  │  - Eksport wszystkich zgłoszeń do CSV       │  │    │   │
│  └────────────────────────────────────────────────┘  │    │   │
│                                                       │    │   │
└───────────────────────────────────────────────────────┼────┼───┘
                                                        │    │
                                                        ▼    ▼
┌─────────────────────────────────────────────────────────────────┐
│                   SUPABASE (PostgreSQL)                         │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Tabela: contest_entries                               │   │
│  │                                                         │   │
│  │  ┌─────┬───────────┬──────────┬──────────┬──────────┐ │   │
│  │  │ id  │  email    │   name   │   code   │timestamp │ │   │
│  │  ├─────┼───────────┼──────────┼──────────┼──────────┤ │   │
│  │  │  1  │ a@ex.com  │ Jan      │ PXZ-ABC  │2025-...  │ │   │
│  │  │  2  │ b@ex.com  │ Anna     │ PXZ-DEF  │2025-...  │ │   │
│  │  │ ... │ ...       │ ...      │ ...      │...       │ │   │
│  │  └─────┴───────────┴──────────┴──────────┴──────────┘ │   │
│  │                                                         │   │
│  │  Dodatkowe pola:                                       │   │
│  │  - email_sent (Boolean)    - czy email wysłany       │   │
│  │  - email_opened (Boolean)  - czy email otwarty       │   │
│  │  - created_at (Timestamp)  - data utworzenia         │   │
│  │                                                         │   │
│  │  Indeksy:                                              │   │
│  │  - idx_contest_entries_email  (dla szybkiego lookup)  │   │
│  │  - idx_contest_entries_code   (dla szybkiego lookup)  │   │
│  │                                                         │   │
│  │  Security:                                             │   │
│  │  - Row Level Security (RLS) włączone                  │   │
│  │  - Polityki dla INSERT, SELECT, UPDATE                │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

                              │
                              ▼
┌─────────────────────────────────────────────────────────────────┐
│                   EMAIL SERVICE (nodemailer + Gmail)            │
│                                                                 │
│  ┌────────────────────────────────────────────────────────┐   │
│  │  Wysyłanie emaili potwierdzających                     │   │
│  │                                                         │   │
│  │  Temat: "Twój kod konkursowy – Świąteczny Konkurs"   │   │
│  │  Treść: HTML z kodem, grafiką, informacjami          │   │
│  │  Do: email uczestnika                                  │   │
│  │  Od: EMAIL_USER (z .env)                              │   │
│  └────────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         PRZEPŁYW DANYCH                         │
│                                                                 │
│  1. Użytkownik wypełnia formularz (imię + email)              │
│  2. Frontend wysyła POST do /api/generate-code                 │
│  3. Backend waliduje dane                                      │
│  4. Backend sprawdza czy email już istnieje w Supabase         │
│  5a. Jeśli TAK: ponownie wysyła email, zwraca istniejący kod  │
│  5b. Jeśli NIE: generuje nowy kod i zapisuje w Supabase       │
│  6. Backend wysyła email przez Gmail                           │
│  7. Backend aktualizuje pole email_sent w Supabase             │
│  8. Backend zwraca kod do Frontend                             │
│  9. Frontend pokazuje sukces i wyświetla kod                   │
│                                                                 │
│  Admin może:                                                    │
│  - Przeglądać wszystkie zgłoszenia: GET /api/contest-entries  │
│  - Eksportować do CSV: GET /api/contest-entries/export        │
│  - Wykonywać zapytania SQL bezpośrednio w Supabase Dashboard  │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                    ZMIENNE ŚRODOWISKOWE (.env)                  │
│                                                                 │
│  # Supabase                                                     │
│  NEXT_PUBLIC_SUPABASE_URL=https://xyz.supabase.co             │
│  NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...                          │
│                                                                 │
│  # Email (Gmail)                                                │
│  EMAIL_USER=your-email@gmail.com                               │
│  EMAIL_PASS=app-password-here                                  │
│  ADMIN_EMAIL=biuro@posadzkizywiczne.com                       │
└─────────────────────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────────────────────┐
│                         BEZPIECZEŃSTWO                          │
│                                                                 │
│  ✅ Walidacja danych wejściowych (email, imię)                 │
│  ✅ Zapobieganie SQL injection (whitelist orderBy)             │
│  ✅ Row Level Security (RLS) w Supabase                        │
│  ✅ Unikalne ograniczenia na email i code                      │
│  ✅ Kryptograficznie bezpieczne generowanie kodów (crypto)    │
│  ✅ Zmienne środowiskowe dla wrażliwych danych                │
│  ✅ CodeQL scan: 0 alertów                                     │
│                                                                 │
│  ⚠️  DO ZROBIENIA: Zabezpieczenie endpointów admin            │
└─────────────────────────────────────────────────────────────────┘
```

## Legenda

- `┌──┐` - Komponenty systemu
- `│  │` - Granice komponentów
- `▼ ▲` - Kierunek przepływu danych
- `────` - Połączenia między komponentami

## Pliki w projekcie

```
posadzki-zywiczne/
├── lib/
│   └── supabase.ts                           # Konfiguracja Supabase
├── app/
│   ├── konkurs/
│   │   └── page.tsx                          # Strona formularza konkursu
│   └── api/
│       ├── generate-code/
│       │   └── route.ts                      # API generowania kodów
│       └── contest-entries/
│           ├── route.ts                      # API przeglądania zgłoszeń
│           └── export/
│               └── route.ts                  # API eksportu CSV
├── supabase-schema.sql                       # Schemat bazy danych
├── .env.example                              # Przykładowa konfiguracja
├── SUPABASE_INTEGRATION.md                   # Dokumentacja techniczna
├── ADMIN_GUIDE.md                            # Instrukcja dla admina
├── IMPLEMENTATION_SUMMARY.md                 # Podsumowanie implementacji
└── ARCHITECTURE.md                           # Ten plik
```

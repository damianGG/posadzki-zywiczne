# Admin Panel dla Kalkulatora Posadzek - Dokumentacja

## Przegląd

Utworzony został panel administracyjny do zarządzania kalkulatorem posadzek żywicznych. Panel pozwala na:
- Edycję cen za m²/mb
- Zmianę opisów i nazw
- Zarządzanie zdjęciami usług
- Włączanie/wyłączanie opcji
- Zarządzanie dostępnością pomieszczeń

## Struktura Bazy Danych (Supabase)

Utworzono 5 nowych tabel w Supabase:

### 1. `calculator_surface_types` - Rodzaje powierzchni
- `type_id` - ID typu (podstawowa, akrylowa, zacierana)
- `name` - Nazwa wyświetlana
- `description` - Opis
- `price_per_m2` - Cena za m²
- `image_url` - URL zdjęcia
- `properties` - Właściwości (JSON array)
- `is_active` - Czy aktywny

### 2. `calculator_colors` - Kolory RAL
- `color_id` - ID koloru
- `name` - Nazwa wyświetlana
- `ral_code` - Kod RAL
- `additional_price` - Dopłata za m²
- `thumbnail_url` - Miniatura
- `preview_url` - Podgląd
- `is_active` - Czy aktywny

### 3. `calculator_services` - Usługi
- `service_id` - ID usługi
- `name` - Nazwa
- `description` - Opis
- `category` - Kategoria (przygotowanie, wykończenie, ochrona, logistyka)
- `price_per_m2` - Cena za m² (opcjonalnie)
- `price_per_mb` - Cena za mb (opcjonalnie)
- `price_fixed` - Cena stała (opcjonalnie)
- `image_url` - URL zdjęcia
- `is_mandatory` - Czy obowiązkowe
- `is_default` - Czy domyślnie wybrane
- `is_active` - Czy aktywne

### 4. `calculator_room_types` - Typy pomieszczeń
- `room_id` - ID pomieszczenia
- `name` - Nazwa
- `description` - Opis
- `icon` - Ikona (emoji)
- `is_available` - Czy dostępne

### 5. `calculator_concrete_states` - Stany betonu
- `state_id` - ID stanu
- `name` - Nazwa
- `description` - Opis
- `additional_price` - Dopłata za m²

## Migracja Bazy Danych

Plik migracji: `supabase/migrations/002_calculator_settings.sql`

### Uruchomienie migracji:

1. **Lokalnie z Supabase CLI:**
```bash
supabase migration up
```

2. **Ręcznie w Supabase Dashboard:**
- Przejdź do SQL Editor w Supabase Dashboard
- Skopiuj zawartość pliku `002_calculator_settings.sql`
- Wykonaj SQL

3. **Automatycznie (jeśli masz CI/CD):**
- Migracja zostanie automatycznie zastosowana przy następnym deploy

## API Endpoints

### GET `/api/admin/calculator-settings`
Pobiera wszystkie ustawienia kalkulatora.

**Query Parameters:**
- `type` (opcjonalnie): `surface-types`, `colors`, `services`, `room-types`, `concrete-states`

**Odpowiedź:**
```json
{
  "surfaceTypes": [...],
  "colors": [...],
  "services": [...],
  "roomTypes": [...],
  "concreteStates": [...]
}
```

### PUT `/api/admin/calculator-settings`
Aktualizuje ustawienia.

**Body:**
```json
{
  "type": "surface-type|color|service|room-type|concrete-state",
  "id": "type_id|color_id|service_id|room_id|state_id",
  "updates": {
    "name": "Nowa nazwa",
    "price_per_m2": 250,
    ...
  }
}
```

## Panel Administracyjny

### Dostęp
URL: `/admin/kalkulator`

### Funkcje:
- **5 zakładek** do zarządzania różnymi częściami kalkulatora
- **Edycja w miejscu** - zmiany zapisują się automatycznie po utracie focus
- **Przełączniki aktywności** - szybkie włączanie/wyłączanie opcji
- **Podgląd zdjęć** - natychmiastowy podgląd wgranych obrazów
- **Kategorie usług** - automatyczne grupowanie
- **Status obowiązkowych** - wizualne oznaczenie usług obowiązkowych
- **✨ Upload zdjęć przez Cloudinary** - bezpośrednie przesyłanie zdjęć z panelu administracyjnego

### Screenshoty interfejsu:
1. Zakładka "Powierzchnie" - edycja rodzajów powierzchni
2. Zakładka "Kolory" - zarządzanie kolorami RAL
3. Zakładka "Usługi" - edycja usług z cenami
4. Zakładka "Pomieszczenia" - zarządzanie typami pomieszczeń
5. Zakładka "Stan betonu" - edycja stanów podłoża

## Upload Zdjęć przez Cloudinary

### Przegląd
Panel administracyjny kalkulatora obsługuje bezpośrednie przesyłanie zdjęć przez Cloudinary. Każde pole z obrazem zawiera:
- **Pole tekstowe** - do ręcznego wpisania URL (np. z zewnętrznych źródeł)
- **Przycisk Cloudinary Upload** - do bezpośredniego przesłania zdjęcia

### Jak używać:
1. Kliknij przycisk "Prześlij przez Cloudinary" przy wybranym polu
2. Wybierz zdjęcie z komputera lub zrób zdjęcie aparatem
3. Zdjęcie zostanie automatycznie przesłane do Cloudinary
4. URL zdjęcia zostanie automatycznie wstawiony do pola i zapisany w bazie

### Organizacja folderów na Cloudinary:
- **`kalkulator/surface-types`** - zdjęcia typów powierzchni
- **`kalkulator/colors`** - miniatury i podglądy kolorów
- **`kalkulator/services`** - zdjęcia usług

### Limity:
- Maksymalnie 1 zdjęcie na pole
- Maksymalny rozmiar pliku: 10MB
- Obsługiwane formaty: JPG, JPEG, PNG, WebP, GIF

### Wymagane zmienne środowiskowe:
```env
NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME=twoja-cloudinary-nazwa
NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET=posadzki-realizacje
```

Zmienne te są już skonfigurowane w systemie - ta sama konfiguracja co w panelu realizacji.

## Naprawione Problemy z Emailem

### Problem
Email nie był wysyłany z powodu braku walidacji zmiennych środowiskowych.

### Rozwiązanie
Dodano do `/app/api/send-pdf/route.ts`:

1. **Walidację zmiennych środowiskowych:**
```typescript
if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
  return error
}
```

2. **Weryfikację transportera:**
```typescript
await transporter.verify()
```

3. **Szczegółowe komunikaty błędów:**
- Brak EMAIL_USER/EMAIL_PASS
- Brak ADMIN_EMAIL
- Błędy SMTP
- Błędy weryfikacji

### Wymagane Zmienne Środowiskowe

W pliku `.env` dodaj:

```env
# Email Configuration
EMAIL_USER=twoj-email@gmail.com
EMAIL_PASS=haslo-aplikacji-gmail
ADMIN_EMAIL=biuro@posadzkizywiczne.com
```

### Konfiguracja Gmail

1. Włącz 2FA w Gmail
2. Wygeneruj hasło aplikacji: https://myaccount.google.com/apppasswords
3. Użyj tego hasła jako `EMAIL_PASS`

## Jak Testować

### 1. Uruchom migrację Supabase
```bash
cd supabase
supabase migration up
```

### 2. Sprawdź czy tabele zostały utworzone
```sql
SELECT * FROM calculator_surface_types;
SELECT * FROM calculator_colors;
SELECT * FROM calculator_services;
```

### 3. Skonfiguruj email
Dodaj do `.env`:
```env
EMAIL_USER=twoj-email@gmail.com
EMAIL_PASS=haslo-aplikacji
ADMIN_EMAIL=admin@example.com
```

### 4. Uruchom aplikację
```bash
npm run dev
```

### 5. Testuj panel admina
- Przejdź do `/admin/kalkulator`
- Zaloguj się (używając istniejącego mechanizmu auth)
- Edytuj ceny, opisy, zdjęcia
- Testuj upload zdjęć przez Cloudinary
- Sprawdź czy zmiany są widoczne w kalkulatorze na `/kalkulator`

### 6. Testuj wysyłanie emaili
- Wypełnij kalkulator na `/kalkulator`
- Kliknij "Wyślij kosztorys emailem"
- Podaj email
- Sprawdź czy email dotarł (do klienta i admina)

## Następne Kroki

### Do zrobienia przez developera:
1. ✅ Uruchom migrację Supabase
2. ✅ Skonfiguruj zmienne środowiskowe email
3. ✅ Upload zdjęć przez Cloudinary
4. 🔄 Przetestuj panel admina
5. 🔄 Przetestuj wysyłanie emaili
6. 🔄 Dodaj prawdziwe zdjęcia usług (zamień placeholdery)

### Dodatkowe usprawnienia:
- ✅ Upload zdjęć bezpośrednio z panelu (integracja z Cloudinary)
- Historia zmian cen
- Wersjonowanie ustawień
- Backup/restore konfiguracji
- A/B testing różnych cenników

## Troubleshooting

### Problem: "Supabase nie jest skonfigurowany"
**Rozwiązanie:** Sprawdź czy w `.env` są ustawione:
```env
SUPABASE_URL=https://twoj-projekt.supabase.co
SUPABASE_SERVICE_ROLE_KEY=twoj-klucz
NEXT_PUBLIC_SUPABASE_ANON_KEY=twoj-anon-key
```

### Problem: "Email nie jest skonfigurowany"
**Rozwiązanie:** Dodaj do `.env`:
```env
EMAIL_USER=email@gmail.com
EMAIL_PASS=haslo-aplikacji
ADMIN_EMAIL=admin@example.com
```

### Problem: "Błąd weryfikacji transportera email"
**Rozwiązanie:** 
- Sprawdź czy hasło aplikacji Gmail jest poprawne
- Sprawdź czy 2FA jest włączone w Gmail
- Sprawdź czy email nie jest zablokowany przez Google

### Problem: Brak dostępu do panelu admina
**Rozwiązanie:**
- Zaloguj się najpierw przez `/admin/realizacje/dodaj`
- Token sesji jest wspólny dla całego panelu admina

## Autor
Implementacja przez GitHub Copilot dla damianGG/posadzki-zywiczne
Data: 30 grudnia 2024

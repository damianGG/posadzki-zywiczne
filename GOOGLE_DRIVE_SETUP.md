# Google Drive Picker - Instrukcja Konfiguracji

## 📋 Spis treści
1. [Wprowadzenie](#wprowadzenie)
2. [Wymagania wstępne](#wymagania-wstępne)
3. [Krok po kroku](#krok-po-kroku)
4. [Konfiguracja zmiennych środowiskowych](#konfiguracja-zmiennych-środowiskowych)
5. [Testowanie](#testowanie)
6. [Rozwiązywanie problemów](#rozwiązywanie-problemów)

---

## Wprowadzenie

Google Drive Picker pozwala użytkownikom wybierać zdjęcia bezpośrednio z:
- **Dysku Google** (Google Drive)
- **Zdjęć Google** (Google Photos)

Jest to opcjonalna funkcja - jeśli nie skonfigurujesz Google Drive API, użytkownicy nadal będą mogli przesyłać zdjęcia z urządzenia lokalnego.

---

## Wymagania wstępne

- Konto Google
- Projekt w Google Cloud Console
- Dostęp do panelu administracyjnego Vercel (dla wdrożenia produkcyjnego)

---

## Krok po kroku

### 1. Utwórz projekt w Google Cloud Console

1. Przejdź do [Google Cloud Console](https://console.cloud.google.com/)
2. Kliknij na rozwijaną listę projektów (obok logo Google Cloud)
3. Kliknij **"Nowy projekt"**
4. Wpisz nazwę projektu: `posadzki-zywiczne-drive` (lub dowolną inną)
5. Kliknij **"Utwórz"**
6. Poczekaj, aż projekt zostanie utworzony i wybierz go z listy

### 2. Włącz Google Drive API

1. W menu bocznym wybierz **"APIs & Services"** → **"Library"**
2. Wyszukaj **"Google Drive API"**
3. Kliknij na wynik wyszukiwania
4. Kliknij przycisk **"Enable"** (Włącz)

### 3. Włącz Google Picker API

1. W tym samym miejscu (**"Library"**), wyszukaj **"Google Picker API"**
2. Kliknij na wynik wyszukiwania
3. Kliknij przycisk **"Enable"** (Włącz)

### 4. Utwórz API Key

1. W menu bocznym wybierz **"APIs & Services"** → **"Credentials"**
2. Kliknij **"+ CREATE CREDENTIALS"** (u góry)
3. Wybierz **"API key"**
4. Skopiuj wygenerowany klucz - będzie to Twój **`NEXT_PUBLIC_GOOGLE_API_KEY`**
5. Opcjonalnie: Kliknij **"Edit API key"** aby ograniczyć klucz:
   - W sekcji "API restrictions" wybierz "Restrict key"
   - Zaznacz tylko: **Google Drive API** i **Google Picker API**
   - Kliknij **"Save"**

### 5. Utwórz OAuth 2.0 Client ID

1. W tym samym miejscu (**"Credentials"**), kliknij **"+ CREATE CREDENTIALS"**
2. Wybierz **"OAuth client ID"**
3. Jeśli pojawi się komunikat o ekranie zgody OAuth:
   - Kliknij **"CONFIGURE CONSENT SCREEN"**
   - Wybierz **"External"** (Zewnętrzny)
   - Kliknij **"CREATE"**
   - Wypełnij wymagane pola:
     - **App name**: "Posadzki Żywiczne Admin"
     - **User support email**: Twój email
     - **Developer contact email**: Twój email
   - Kliknij **"SAVE AND CONTINUE"**
   - Na stronie "Scopes" kliknij **"SAVE AND CONTINUE"**
   - Na stronie "Test users" możesz dodać swój email (opcjonalnie)
   - Kliknij **"SAVE AND CONTINUE"**
   - Kliknij **"BACK TO DASHBOARD"**

4. Wróć do **"Credentials"** i ponownie kliknij **"+ CREATE CREDENTIALS"** → **"OAuth client ID"**
5. Wybierz **Application type**: **"Web application"**
6. Wpisz nazwę: "Posadzki Admin Panel"
7. W sekcji **"Authorized JavaScript origins"** dodaj:
   - **Dla lokalnego rozwoju**:
     ```
     http://localhost:3000
     ```
   - **Dla produkcji** (zmień na swoją domenę):
     ```
     https://posadzkizywiczne.com
     https://www.posadzkizywiczne.com
     ```
8. **NIE MUSISZ** dodawać "Authorized redirect URIs" (Picker nie używa przekierowań)
9. Kliknij **"CREATE"**
10. Skopiuj wygenerowane dane:
    - **Client ID** - będzie to Twój **`NEXT_PUBLIC_GOOGLE_CLIENT_ID`**
11. Kliknij **"OK"**

### 6. Znajdź App ID projektu

1. W Google Cloud Console, w menu bocznym kliknij **"IAM & Admin"** → **"Settings"**
2. Znajdź **"Project number"** (numer projektu)
3. Skopiuj ten numer - będzie to Twój **`NEXT_PUBLIC_GOOGLE_APP_ID`**

---

## Konfiguracja zmiennych środowiskowych

### Lokalne środowisko (development)

1. Stwórz plik `.env.local` w głównym katalogu projektu (jeśli nie istnieje)
2. Dodaj następujące zmienne:

```bash
# Google Drive Picker Configuration
NEXT_PUBLIC_GOOGLE_API_KEY=AIzaSy...Twoj-API-Key
NEXT_PUBLIC_GOOGLE_CLIENT_ID=123456789-abc123.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_APP_ID=123456789
```

3. Zapisz plik
4. Zrestartuj serwer deweloperski: `npm run dev`

### Produkcja (Vercel)

1. Zaloguj się do [Vercel Dashboard](https://vercel.com/dashboard)
2. Wybierz swój projekt
3. Przejdź do **"Settings"** → **"Environment Variables"**
4. Dodaj każdą zmienną osobno:
   - **Key**: `NEXT_PUBLIC_GOOGLE_API_KEY`
   - **Value**: Twój API Key z Google Cloud
   - Kliknij **"Add"**
5. Powtórz dla pozostałych zmiennych:
   - `NEXT_PUBLIC_GOOGLE_CLIENT_ID`
   - `NEXT_PUBLIC_GOOGLE_APP_ID`
6. Kliknij **"Redeploy"** aby zastosować zmiany

---

## Testowanie

### 1. Test lokalny

1. Uruchom serwer deweloperski: `npm run dev`
2. Przejdź do: `http://localhost:3000/admin/realizacje/dodaj`
3. Zaloguj się hasłem (domyślnie: `posadzki2024`)
4. Przewiń do sekcji "Zdjęcia"
5. Powinieneś zobaczyć dwa przyciski:
   - **"Z urządzenia"** - przesyłanie z dysku lokalnego
   - **"Wybierz z Dysku Google"** - Google Drive Picker
6. Kliknij **"Wybierz z Dysku Google"**
7. Powinna pojawić się strona logowania Google
8. Zaloguj się i udziel uprawnień
9. Wybierz zdjęcia z Dysku Google lub Zdjęć Google
10. Zdjęcia powinny pojawić się w podglądzie

### 2. Test produkcyjny

1. Po wdrożeniu na Vercel, przejdź do: `https://twoja-domena.com/admin/realizacje/dodaj`
2. Wykonaj te same kroki co w teście lokalnym
3. Upewnij się, że Google Drive Picker działa poprawnie

---

## Rozwiązywanie problemów

### Problem: Przycisk "Wybierz z Dysku Google" nie pojawia się

**Rozwiązanie:**
- Sprawdź czy wszystkie 3 zmienne środowiskowe są ustawione
- Upewnij się, że zmienne zaczynają się od `NEXT_PUBLIC_`
- Zrestartuj serwer deweloperski

### Problem: "origin_mismatch" lub błąd CORS

**Rozwiązanie:**
1. Przejdź do Google Cloud Console → Credentials
2. Edytuj OAuth 2.0 Client ID
3. Sprawdź **"Authorized JavaScript origins"**
4. Upewnij się, że dodałeś dokładny URL (bez końcowego `/`)
   - Lokalnie: `http://localhost:3000`
   - Produkcja: `https://twoja-domena.com`
5. Zapisz i poczekaj kilka minut na propagację zmian

### Problem: "Access blocked: This app's request is invalid"

**Rozwiązanie:**
1. Przejdź do Google Cloud Console → "APIs & Services" → "OAuth consent screen"
2. Sprawdź czy status to **"Testing"** lub **"Published"**
3. Jeśli status to "Testing":
   - Dodaj swój email do listy "Test users"
   - Lub zmień status na "Published" (wymaga weryfikacji Google dla dużych aplikacji)

### Problem: "Google is not defined"

**Rozwiązanie:**
- Upewnij się, że masz połączenie z internetem
- Sprawdź konsolę przeglądarki czy skrypty Google się załadowały
- Spróbuj wyczyścić cache przeglądarki i przeładować stronę

### Problem: Zdjęcia nie są pobierane z Google Drive

**Rozwiązanie:**
1. Sprawdź czy Google Drive API jest włączone w projekcie
2. Upewnij się, że OAuth Client ma odpowiednie uprawnienia:
   - Scope: `https://www.googleapis.com/auth/drive.readonly`
3. Sprawdź konsolę przeglądarki pod kątem błędów

### Problem: "Failed to download images"

**Rozwiązanie:**
- Sprawdź czy wybrane pliki są rzeczywiście obrazami (jpg, png, etc.)
- Niektóre pliki na Google Drive mogą mieć ograniczenia pobierania
- Spróbuj wybrać inne zdjęcia
- Sprawdź połączenie internetowe

---

## Bezpieczeństwo

### Best Practices:

1. **API Key**
   - Ogranicz klucz tylko do wymaganych API (Google Drive i Picker)
   - Opcjonalnie: ogranicz do konkretnych domen w ustawieniach klucza

2. **OAuth Client**
   - Dodaj tylko zaufane domeny do "Authorized JavaScript origins"
   - Nie udostępniaj Client ID publicznie (chociaż jest to zmiennaółna publiczna w Next.js)

3. **Uprawnienia**
   - Picker używa tylko uprawnień do odczytu: `drive.readonly`
   - Nie ma dostępu do modyfikacji plików na Dysku Google

4. **Ekran zgody OAuth**
   - Dla produkcji rozważ weryfikację aplikacji przez Google (jeśli masz wielu użytkowników)
   - W trybie "Testing" tylko dodani użytkownicy testowi mogą używać aplikacji

---

## Koszty

**Google Drive API i Google Picker API są DARMOWE** dla typowego użytku:
- 1 miliard zapytań/dzień do API (limit darmowy)
- Brak kosztów za korzystanie z Picker API

---

## Dodatkowe zasoby

- [Google Picker API Documentation](https://developers.google.com/picker)
- [Google Drive API Documentation](https://developers.google.com/drive/api/v3/about-sdk)
- [OAuth 2.0 Setup](https://developers.google.com/identity/protocols/oauth2)

---

## Podsumowanie

Po wykonaniu wszystkich kroków:

✅ Użytkownicy mogą wybierać zdjęcia z trzech źródeł:
1. **Lokalny dysk** (telefon/komputer)
2. **Dysk Google** (Google Drive)
3. **Zdjęcia Google** (Google Photos)

✅ System jest w pełni funkcjonalny zarówno lokalnie jak i na produkcji

✅ Wszystko działa bezpiecznie z odpowiednimi uprawnieniami

---

**Jeśli masz pytania lub problemy, skontaktuj się z zespołem deweloperskim!** 🚀

# Quick Start Guide - Google Drive Sync

## Szybki Start (5 minut)

### Krok 1: Utwórz projekt Google Cloud (jednorazowo)

1. Wejdź na https://console.cloud.google.com/
2. Utwórz nowy projekt (np. "Posadzki Sync")
3. Włącz Google Drive API:
   - Menu ☰ → "APIs & Services" → "Enable APIs and Services"
   - Wyszukaj "Google Drive API"
   - Kliknij "Enable"

### Krok 2: Utwórz konto serwisowe (jednorazowo)

1. Menu ☰ → "APIs & Services" → "Credentials"
2. Kliknij "+ CREATE CREDENTIALS" → "Service Account"
3. Wypełnij:
   - Nazwa: "posadzki-drive-sync"
   - Kliknij "Create and Continue"
4. Pomiń opcjonalne kroki, kliknij "Done"

### Krok 3: Pobierz klucz JSON (jednorazowo)

1. W liście "Service Accounts" kliknij na utworzone konto
2. Zakładka "Keys" → "Add Key" → "Create new key"
3. Wybierz "JSON"
4. Pobierz plik i zapisz jako `google-credentials.json` w głównym katalogu projektu

⚠️ **WAŻNE:** Nie commituj tego pliku! Jest już w `.gitignore`

### Krok 4: Udostępnij folder w Google Drive (jednorazowo)

1. Otwórz Google Drive
2. Utwórz folder "Realizacje"
3. Kliknij prawym → "Udostępnij"
4. Dodaj email konta serwisowego (z pliku JSON, pole `client_email`)
   - Przykład: `posadzki-drive-sync@projekt-xxx.iam.gserviceaccount.com`
5. Nadaj uprawnienia "Viewer"
6. Skopiuj ID folderu z URL:
   - URL: `https://drive.google.com/drive/folders/1ABC...XYZ`
   - ID: `1ABC...XYZ`

### Krok 5: Skonfiguruj projekt (jednorazowo)

Edytuj plik `.env` i dodaj:

```env
GOOGLE_DRIVE_FOLDER_ID=1ABC...XYZ
```

(Wklej skopiowane ID folderu)

### Krok 6: Dodaj pierwszą realizację

1. W folderze "Realizacje" w Google Drive utwórz folder, np. `garaz-warszawa-test`

2. Dodaj plik `info.txt`:

```
TITLE: Test - garaż Warszawa
DESCRIPTION: Testowa realizacja
LOCATION: Warszawa
AREA: 25 m²
DATE: 2024-11-13
TYPE: garaż
SURFACE: epoksydowa
TAGS: test, garaż
FEATURED: true
---
## To jest test

Testowa realizacja do sprawdzenia integracji.
```

3. Dodaj kilka zdjęć (JPG, PNG) do tego folderu

### Krok 7: Zsynchronizuj

```bash
npm run sync-drive
```

Jeśli wszystko działa prawidłowo, zobaczysz:

```
=== Google Drive Sync Started ===

Authenticating with Google Drive...
✓ Authenticated successfully

Using folder ID: 1ABC...XYZ

Fetching project folders...
✓ Found 1 project folders

Processing: garaz-warszawa-test
  ✓ Downloaded: info.txt
  ✓ Downloaded: 01.jpg
  ✓ Downloaded: 02.jpg
  ✓ Created: garaz-warszawa-test.json

=== Sync Complete ===
✓ Processed 1 realizations
```

### Krok 8: Sprawdź wynik

Sprawdź czy pliki zostały utworzone:

```bash
ls data/realizacje/
# Powinno pokazać: garaz-warszawa-test.json

ls public/realizacje/garaz-warszawa-test/
# Powinno pokazać: 01.jpg, 02.jpg, ...
```

### Krok 9: Zobacz stronę

```bash
npm run dev
```

Otwórz http://localhost:3000/realizacje

## Następne kroki

### Dodawanie kolejnych realizacji

1. Utwórz nowy folder w Google Drive
2. Dodaj `info.txt` i zdjęcia
3. Uruchom `npm run sync-drive`
4. Gotowe!

### Aktualizacja istniejącej realizacji

1. Zmień pliki w folderze Google Drive
2. Uruchom `npm run sync-drive`
3. Stare dane zostaną nadpisane

### Usuwanie realizacji

⚠️ Wymaga ręcznej interwencji:

1. Usuń plik JSON: `data/realizacje/[slug].json`
2. Usuń folder ze zdjęciami: `public/realizacje/[slug]/`
3. Opcjonalnie usuń folder z Google Drive

## Rozwiązywanie problemów

### "Error: google-credentials.json not found!"

```bash
# Sprawdź czy plik istnieje
ls google-credentials.json

# Jeśli nie ma, pobierz ponownie z Google Cloud Console
```

### "Error: GOOGLE_DRIVE_FOLDER_ID not set"

```bash
# Sprawdź plik .env
cat .env | grep GOOGLE_DRIVE_FOLDER_ID

# Jeśli puste, dodaj ID folderu
```

### "No folders found"

1. Sprawdź czy ID folderu jest poprawne
2. Sprawdź czy folder jest udostępniony dla konta serwisowego
3. Sprawdź email w pliku `google-credentials.json` (pole `client_email`)

### "Permission denied"

Konto serwisowe nie ma uprawnień do folderu:
1. Sprawdź ustawienia udostępniania w Google Drive
2. Upewnij się, że dodałeś właściwy email
3. Uprawnienia powinny być minimum "Viewer"

## Wskazówki

- **Nazwy folderów**: używaj małych liter i myślników, np. `garaz-warszawa-mokotow`
- **Zdjęcia**: formaty JPG, PNG, WEBP są obsługiwane
- **Kolejność zdjęć**: sortowanie alfabetyczne, pierwsze = miniatura
- **Format daty**: zawsze YYYY-MM-DD (np. 2024-11-13)
- **Typy projektów**: garaż, taras, balkon, przemysł, inne

## Dodatkowa dokumentacja

- [Pełna instrukcja](GOOGLE_DRIVE_INTEGRATION.md)
- [Przykłady](GOOGLE_DRIVE_EXAMPLES.md)
- [Szablon info.txt](info.txt.template)

## Pomoc

Jeśli masz problemy:
1. Przeczytaj pełną dokumentację
2. Sprawdź logi z uruchomienia skryptu
3. Zweryfikuj konfigurację krok po kroku

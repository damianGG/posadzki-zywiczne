# Google Drive Integration - Automatyczne dodawanie realizacji

## Opis

Ten system umożliwia automatyczne dodawanie realizacji (projektów) do strony z folderu Google Drive. Wystarczy dodać nowy folder z plikami do Google Drive, uruchomić skrypt synchronizacji, a strona zostanie automatycznie zaktualizowana o nową realizację.

## Jak to działa?

1. Tworzysz folder w Google Drive z nazwą projektu
2. Dodajesz do folderu:
   - Plik `info.txt` z metadanymi projektu
   - Zdjęcia projektu (JPG, PNG, WEBP)
3. Uruchamiasz skrypt `npm run sync-drive`
4. Skrypt automatycznie:
   - Pobiera dane z Google Drive
   - Tworzy plik JSON z metadanymi
   - Pobiera i zapisuje zdjęcia
   - Aktualizuje stronę

## Konfiguracja (pierwsze uruchomienie)

### 1. Utwórz projekt w Google Cloud

1. Wejdź na https://console.cloud.google.com/
2. Utwórz nowy projekt lub wybierz istniejący
3. Włącz Google Drive API:
   - Menu → APIs & Services → Enable APIs and Services
   - Wyszukaj "Google Drive API"
   - Kliknij "Enable"

### 2. Utwórz konto serwisowe (Service Account)

1. Menu → APIs & Services → Credentials
2. Kliknij "+ CREATE CREDENTIALS" → "Service Account"
3. Wypełnij formularz:
   - Nazwa: "posadzki-drive-sync"
   - Opis: "Service account for syncing realizations"
4. Kliknij "Create and Continue"
5. Pomiń "Grant this service account access to project" (Optional)
6. Kliknij "Done"

### 3. Pobierz klucz JSON

1. W zakładce "Service Accounts" kliknij na utworzone konto
2. Przejdź do zakładki "Keys"
3. Kliknij "Add Key" → "Create new key"
4. Wybierz format "JSON"
5. Pobierz plik i zapisz jako `google-credentials.json` w głównym katalogu projektu

**WAŻNE:** Dodaj `google-credentials.json` do `.gitignore`! Nie commituj tego pliku!

### 4. Utwórz folder w Google Drive

1. Wejdź na Google Drive
2. Utwórz folder o nazwie "Realizacje" (lub dowolnej innej)
3. Kliknij prawym na folder → "Udostępnij" (Share)
4. Dodaj email konta serwisowego (znajdziesz go w pliku JSON, pole `client_email`)
5. Nadaj uprawnienia "Viewer" lub "Editor"
6. Skopiuj ID folderu z URL (np. `https://drive.google.com/drive/folders/FOLDER_ID_HERE`)

### 5. Skonfiguruj zmienne środowiskowe

Dodaj do pliku `.env`:

```env
GOOGLE_DRIVE_FOLDER_ID=twoje_folder_id_z_google_drive
```

## Struktura folderu w Google Drive

```
Realizacje/
├── garaz-warszawa-mokotow/
│   ├── info.txt
│   ├── zdjecie1.jpg
│   ├── zdjecie2.jpg
│   └── zdjecie3.jpg
├── taras-krakow-podgorze/
│   ├── info.txt
│   ├── photo1.jpg
│   └── photo2.jpg
└── balkon-lublin-centrum/
    ├── info.txt
    └── image.jpg
```

## Format pliku info.txt

```
TITLE: Posadzka epoksydowa - garaż Warszawa Mokotów
DESCRIPTION: Profesjonalna posadzka epoksydowa w garażu prywatnym
LOCATION: Warszawa Mokotów
AREA: 25 m²
DATE: 2024-10-15
CLIENT: Klient prywatny
TYPE: garaż
SURFACE: epoksydowa
TAGS: posadzka epoksydowa, garaż, Warszawa, antypoślizg
FEATURED: true
---
## Realizacja posadzki żywicznej w garażu

W tym projekcie wykonaliśmy kompleksową posadzkę epoksydową...

### Zakres prac

- Diagnostyka podłoża
- Szlifowanie powierzchni
- Aplikacja systemu epoksydowego

### Efekt końcowy

Klient bardzo zadowolony z efektu...
```

### Wyjaśnienie pól:

- **TITLE** (wymagane) - Tytuł realizacji
- **DESCRIPTION** (wymagane) - Krótki opis (1-2 zdania)
- **LOCATION** - Lokalizacja (np. "Warszawa Mokotów")
- **AREA** - Powierzchnia (np. "25 m²")
- **DATE** - Data realizacji w formacie YYYY-MM-DD (np. "2024-10-15")
- **CLIENT** - Opcjonalnie, nazwa klienta
- **TYPE** - Typ projektu: garaż, taras, balkon, przemysł, inne
- **SURFACE** - Rodzaj powierzchni: epoksydowa, poliuretanowa
- **TAGS** - Lista tagów oddzielonych przecinkami
- **FEATURED** - "true" jeśli ma być wyróżniona, w przeciwnym razie "false"
- **---** - Separator (wymagany)
- Poniżej separatora - szczegółowy opis w formacie Markdown

## Użycie

### Synchronizacja realizacji

```bash
npm run sync-drive
```

Skrypt:
1. Połączy się z Google Drive
2. Pobierze wszystkie foldery z folderu "Realizacje"
3. Dla każdego folderu:
   - Pobierze plik info.txt
   - Pobierze wszystkie zdjęcia
   - Utworzy plik JSON w `data/realizacje/`
   - Zapisze zdjęcia w `public/realizacje/[slug]/`

### Rebuild strony

Po synchronizacji uruchom:

```bash
npm run build
```

lub w trybie deweloperskim:

```bash
npm run dev
```

## Bezpieczeństwo

**NIGDY nie commituj:**
- `google-credentials.json`
- Żadnych kluczy API lub haseł

**Zawsze:**
- Dodaj `google-credentials.json` do `.gitignore`
- Używaj zmiennych środowiskowych dla wrażliwych danych
- Regularnie rotuj klucze serwisowe (co 90 dni)

# Google Drive Agent - Quick Start Guide

## Szybki Start

### 1. Konfiguracja Google Cloud (jednorazowa)

1. **Utwórz projekt w Google Cloud Console:**
   - Przejdź do https://console.cloud.google.com/
   - Kliknij "Create Project" lub wybierz istniejący

2. **Włącz Google Drive API:**
   - Menu → APIs & Services → Library
   - Wyszukaj "Google Drive API"
   - Kliknij "ENABLE"

3. **Utwórz API Key:**
   - APIs & Services → Credentials
   - "CREATE CREDENTIALS" → "API Key"
   - Skopiuj klucz i zapisz w bezpiecznym miejscu

4. **Utwórz OAuth 2.0 Client:**
   - "CREATE CREDENTIALS" → "OAuth client ID"
   - Application type: "Web application"
   - Authorized JavaScript origins:
     * http://localhost:3000
     * https://twoja-domena.com
   - Skopiuj "Client ID"

### 2. Struktura Google Drive

Przygotuj folder w Google Drive według poniższego schematu:

```
📁 Realizacje (folder root)
├── 📁 garaz-warszawa-2024
│   └── 📁 media
│       ├── 📄 opis.json       ← Plik z danymi
│       ├── 🖼️ glowne.jpg      ← Zdjęcie główne
│       ├── 🖼️ zdjecie1.jpg
│       └── 🖼️ zdjecie2.jpg
│
├── 📁 balkon-krakow-2024
│   └── 📁 media
│       ├── 📄 dane.yaml       ← Może być też YAML
│       └── 🖼️ ...
│
└── ... (kolejne realizacje)
```

**Pobierz ID folderu root:**
- Otwórz folder "Realizacje" w Google Drive
- Skopiuj ID z adresu URL:
  ```
  https://drive.google.com/drive/folders/[TO_JEST_ID_FOLDERU]
  ```

### 3. Konfiguracja projektu Next.js

Utwórz plik `.env.local` w głównym katalogu projektu:

```env
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=AIza...twój-api-key
NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID=123456...apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_DRIVE_ROOT_FOLDER_ID=1a2b3c...id-folderu
```

### 4. Uruchomienie

```bash
npm install
npm run dev
```

Otwórz w przeglądarce: http://localhost:3000/admin/google-drive-sync

### 5. Synchronizacja

1. Kliknij **"Zaloguj się do Google Drive"**
2. Zaloguj się kontem Google
3. Zaakceptuj uprawnienia (tylko odczyt)
4. Kliknij **"Synchronizuj realizacje"**
5. Obserwuj postęp w logach

## Przykładowy plik opisowy

### JSON (opis.json):

```json
{
  "title": "Posadzka żywiczna w garażu",
  "slug": "garaz-warszawa-2024",
  "location": "Warszawa",
  "area": "40 m²",
  "technology": "Epoksyd",
  "description": "Opis realizacji...",
  "category": "mieszkania-domy",
  "type": "indywidualna",
  "tags": ["garaż", "epoksyd"],
  "features": [
    "Odporność na ścieranie",
    "Łatwe czyszczenie"
  ]
}
```

### YAML (opis.yaml):

```yaml
title: Posadzka żywiczna w garażu
slug: garaz-warszawa-2024
location: Warszawa
area: 40 m²
technology: Epoksyd
description: Opis realizacji...
category: mieszkania-domy
type: indywidualna
tags:
  - garaż
  - epoksyd
features:
  - Odporność na ścieranie
  - Łatwe czyszczenie
```

## Pola deskryptora

### Wymagane:
- `title` - Tytuł realizacji
- `slug` - Unikalny identyfikator (URL-friendly)
- `location` - Lokalizacja
- `area` - Powierzchnia (np. "40 m²")
- `technology` - Technologia (np. "Epoksyd")
- `description` - Opis realizacji

### Opcjonalne:
- `category` - Kategoria: `mieszkania-domy`, `balkony-tarasy`, `kuchnie`, `pomieszczenia-czyste`, `schody`
- `type` - Typ: `indywidualna`, `komercyjna`
- `tags` - Lista tagów
- `color` - Kolor (np. "Szary RAL 7037")
- `duration` - Czas realizacji (np. "3 dni")
- `features` - Lista cech/rozwiązań
- `keywords` - Słowa kluczowe SEO
- `clientTestimonial` - Opinia klienta (obiekt z `content` i `author`)

## Rozwiązywanie problemów

### Błąd: "Brak wymaganych zmiennych środowiskowych"
- Sprawdź czy plik `.env.local` istnieje
- Sprawdź czy zmienne mają prefix `NEXT_PUBLIC_`
- Zrestartuj serwer deweloperski

### Błąd: "Authorization failed"
- Sprawdź Client ID
- Sprawdź Authorized JavaScript origins w Google Cloud Console
- Wyczyść cache przeglądarki

### Brak folderów/plików
- Sprawdź czy używasz poprawnego konta Google
- Sprawdź czy foldery są dostępne dla tego konta
- Sprawdź ID folderu root

### Nie widać zmian po synchronizacji
- Sprawdź katalog `data/realizacje/` - powinny pojawić się nowe pliki JSON
- Odśwież stronę `/realizacje` w przeglądarce
- Sprawdź logi w konsoli przeglądarki

## Dokumentacja szczegółowa

Pełna dokumentacja dostępna w pliku: `GOOGLE_DRIVE_AGENT_DOCS.md`

## Wsparcie

W razie problemów:
1. Sprawdź logi w panelu administratora
2. Sprawdź console w DevTools przeglądarki
3. Przejrzyj dokumentację szczegółową
4. Sprawdź konfigurację Google Cloud Console

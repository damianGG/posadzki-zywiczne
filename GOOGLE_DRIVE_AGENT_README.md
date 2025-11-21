# 🚀 Google Drive Agent - Automatyczna Synchronizacja Realizacji

> System agenta działającego w przeglądarce do automatycznego pobierania danych realizacji z Google Drive i aktualizacji statycznych stron w Next.js.

## 📋 Spis treści

- [Szybki start](#szybki-start)
- [Funkcjonalność](#funkcjonalność)
- [Architektura](#architektura)
- [Konfiguracja](#konfiguracja)
- [Użytkowanie](#użytkowanie)
- [Dokumentacja](#dokumentacja)
- [Bezpieczeństwo](#bezpieczeństwo)

## ⚡ Szybki start

### 1. Przygotuj Google Cloud

```bash
# 1. Utwórz projekt w Google Cloud Console
# 2. Włącz Google Drive API
# 3. Utwórz API Key i OAuth 2.0 Client ID
```

📖 **Szczegółowa instrukcja:** [GOOGLE_DRIVE_AGENT_QUICKSTART.md](./GOOGLE_DRIVE_AGENT_QUICKSTART.md)

### 2. Konfiguracja

```bash
# Użyj skryptu setup
bash scripts/setup-google-drive.sh

# Lub ręcznie - skopiuj .env.example do .env.local i uzupełnij:
cp .env.example .env.local
```

Edytuj `.env.local`:
```env
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=twój-api-key
NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID=twój-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_DRIVE_ROOT_FOLDER_ID=id-folderu-root
```

### 3. Uruchom

```bash
npm install
npm run dev
```

Otwórz: **http://localhost:3000/admin/google-drive-sync**

## 🎯 Funkcjonalność

### Co robi agent?

- ✅ **Autoryzacja OAuth 2.0** - Bezpieczne logowanie do Google Drive (tylko odczyt)
- ✅ **Skanowanie folderów** - Automatyczne znajdowanie folderów realizacji
- ✅ **Parsowanie deskryptorów** - Odczyt plików JSON i YAML z danymi
- ✅ **Pobieranie obrazów** - Ekstrahuje metadane plików graficznych
- ✅ **Aktualizacja danych** - Zapisuje/aktualizuje pliki JSON w projekcie
- ✅ **Revalidation** - Automatycznie odświeża strony w Next.js
- ✅ **Logowanie** - Szczegółowe logi operacji w czasie rzeczywistym
- ✅ **Obsługa błędów** - Graceful handling z informacjami diagnostycznymi

### Struktura Google Drive

```
📁 Realizacje (root folder)
├── 📁 garaz-warszawa-2024
│   └── 📁 media
│       ├── 📄 opis.json          ← Dane realizacji
│       ├── 🖼️ glowne.jpg         ← Zdjęcie główne
│       ├── 🖼️ zdjecie1.jpg
│       └── 🖼️ zdjecie2.jpg
├── 📁 balkon-krakow-2024
│   └── 📁 media
│       ├── 📄 dane.yaml          ← Alternatywnie YAML
│       └── 🖼️ ...
└── ... (kolejne realizacje)
```

## 🏗️ Architektura

### Komponenty systemu

```
┌─────────────────────────────────────────────────────────┐
│                   Admin Panel UI                        │
│          /admin/google-drive-sync/page.tsx              │
└─────────────────┬───────────────────────────────────────┘
                  │
                  ▼
┌─────────────────────────────────────────────────────────┐
│              Google Drive Agent                         │
│           lib/google-drive-agent.ts                     │
│  • OAuth 2.0 Authentication                             │
│  • Folder/File Fetching                                 │
│  • JSON/YAML Parsing                                    │
│  • Data Conversion                                      │
└─────────────┬──────────────────┬────────────────────────┘
              │                  │
              ▼                  ▼
    ┌─────────────────┐  ┌─────────────────┐
    │  API: Sync      │  │ API: Revalidate │
    │  /api/realizacje│  │  /api/revalidate│
    │  /sync          │  │                 │
    └────────┬────────┘  └────────┬────────┘
             │                    │
             ▼                    ▼
    ┌─────────────────────────────────────┐
    │      data/realizacje/*.json         │
    │    (Static JSON Files)              │
    └─────────────────────────────────────┘
```

### Przepływ danych

1. **Administrator** otwiera panel `/admin/google-drive-sync`
2. **Inicjalizacja** agenta (ładowanie Google API)
3. **Autoryzacja** przez OAuth 2.0
4. **Synchronizacja**:
   - Pobierz listę folderów z Google Drive
   - Dla każdego folderu:
     - Znajdź podfolder "media"
     - Odczytaj plik JSON/YAML
     - Pobierz listę obrazów
     - Konwertuj do formatu `Realizacja`
     - Zapisz przez API
     - Wywołaj revalidation
5. **Wyświetl wyniki** w UI

## ⚙️ Konfiguracja

### Google Cloud Console

**Krok 1: Utwórz projekt**
1. Przejdź do https://console.cloud.google.com/
2. Kliknij "Create Project"
3. Nadaj nazwę projektu

**Krok 2: Włącz API**
1. Menu → APIs & Services → Library
2. Wyszukaj "Google Drive API"
3. Kliknij "ENABLE"

**Krok 3: Credentials**

**API Key:**
- APIs & Services → Credentials
- CREATE CREDENTIALS → API Key
- Skopiuj klucz

**OAuth 2.0 Client:**
- CREATE CREDENTIALS → OAuth client ID
- Type: Web application
- Authorized JavaScript origins:
  - `http://localhost:3000` (development)
  - `https://twoja-domena.com` (production)
- Skopiuj Client ID

**Krok 4: Znajdź folder ID**
1. Otwórz folder root w Google Drive
2. Skopiuj ID z URL:
   ```
   https://drive.google.com/drive/folders/[TO_JEST_ID]
   ```

### Format deskryptora

**JSON (`opis.json`):**
```json
{
  "title": "Posadzka żywiczna w garażu",
  "slug": "garaz-warszawa-2024",
  "location": "Warszawa",
  "area": "40 m²",
  "technology": "Epoksyd",
  "description": "Opis...",
  "category": "mieszkania-domy",
  "type": "indywidualna",
  "tags": ["garaż", "epoksyd"],
  "features": ["Feature 1", "Feature 2"],
  "keywords": ["keyword1", "keyword2"]
}
```

**YAML (`opis.yaml`):**
```yaml
title: Posadzka żywiczna w garażu
slug: garaz-warszawa-2024
location: Warszawa
area: 40 m²
technology: Epoksyd
description: Opis...
category: mieszkania-domy
type: indywidualna
tags:
  - garaż
  - epoksyd
features:
  - Feature 1
  - Feature 2
keywords:
  - keyword1
  - keyword2
```

📄 Przykłady: [example-descriptor.json](./data/realizacje/example-descriptor.json), [example-descriptor.yaml](./data/realizacje/example-descriptor.yaml)

## 🎮 Użytkowanie

### Panel administratora

1. Otwórz: `http://localhost:3000/admin/google-drive-sync`
2. Kliknij **"Zaloguj się do Google Drive"**
3. Zaloguj się kontem Google i zaakceptuj uprawnienia
4. Kliknij **"Synchronizuj realizacje"**
5. Obserwuj postęp w logach
6. Sprawdź wyniki w tabeli

### Programatyczne użycie

```typescript
import { GoogleDriveAgent, createGoogleDriveAgent } from '@/lib/google-drive-agent';

// Utwórz agenta
const agent = createGoogleDriveAgent();

if (!agent) {
  console.error('Brak konfiguracji');
  return;
}

// Inicjalizacja
await agent.initialize();

// Autoryzacja
await agent.authorize();

// Synchronizacja
const results = await agent.syncRealizations();

// Przetwórz wyniki
for (const result of results) {
  if (result.status === 'success') {
    console.log(`✓ ${result.data.title}`);
    
    // Zapisz dane
    await agent.saveRealizacja(result.data);
    
    // Wywołaj revalidation
    await agent.triggerRevalidation(result.slug);
  }
}

// Wyloguj
agent.signOut();
```

## 📚 Dokumentacja

| Dokument | Opis |
|----------|------|
| [GOOGLE_DRIVE_AGENT_QUICKSTART.md](./GOOGLE_DRIVE_AGENT_QUICKSTART.md) | Szybki start - krok po kroku |
| [GOOGLE_DRIVE_AGENT_DOCS.md](./GOOGLE_DRIVE_AGENT_DOCS.md) | Pełna dokumentacja techniczna |
| [GOOGLE_DRIVE_AGENT_SUMMARY.md](./GOOGLE_DRIVE_AGENT_SUMMARY.md) | Podsumowanie implementacji |

## 🔒 Bezpieczeństwo

### Implementowane zabezpieczenia

- ✅ **OAuth 2.0** z zakresem `drive.readonly` (tylko odczyt)
- ✅ **API Key** ograniczony do Google Drive API
- ✅ **Zmienne środowiskowe** - wszystkie credentials w `.env.local`
- ✅ **Walidacja danych** - sprawdzanie typów przed zapisem
- ✅ **Brak hardcoded secrets** - zero credentiali w kodzie

### ⚠️ Rekomendacje dla produkcji

- Dodaj middleware autoryzacji do `/admin/google-drive-sync`
- Implementuj rate limiting dla API endpoints
- Dodaj proper error logging (np. Sentry)
- Ogranicz dostęp przez IP whitelist (opcjonalnie)

## 🐛 Rozwiązywanie problemów

### "Brak wymaganych zmiennych środowiskowych"
✅ **Rozwiązanie:**
- Sprawdź czy plik `.env.local` istnieje
- Upewnij się że zmienne mają prefix `NEXT_PUBLIC_`
- Zrestartuj serwer deweloperski (`npm run dev`)

### "Authorization failed"
✅ **Rozwiązanie:**
- Zweryfikuj Client ID w Google Cloud Console
- Sprawdź Authorized JavaScript origins
- Wyczyść cache przeglądarki
- Spróbuj w trybie incognito

### "Cannot read files from Google Drive"
✅ **Rozwiązanie:**
- Sprawdź czy folder jest udostępniony dla Twojego konta Google
- Zweryfikuj poprawność ID folderu root
- Upewnij się że Google Drive API jest włączone

### "Images not displaying"
⚠️ **Uwaga:**
Agent pobiera tylko metadane obrazów. Dla pełnej funkcjonalności:
1. Implementuj pobieranie plików binarnych
2. Zapisz obrazy w `public/images/realizacje/`
3. Lub prześlij do CDN (Cloudinary, Vercel Blob)

## 🚧 Ograniczenia i przyszłe rozszerzenia

### Aktualna implementacja
- ✅ Metadane obrazów (thumbnailLink, webViewLink)
- ✅ Prosty parser YAML (podstawowe struktury)
- ✅ Synchronizacja na żądanie

### Planowane rozszerzenia
- 📋 Pobieranie i zapis faktycznych plików obrazów
- 📋 Upload do CDN
- 📋 Zaawansowany parser YAML (biblioteka js-yaml)
- 📋 Automatyczna synchronizacja (co X godzin)
- 📋 Webhooks Google Drive
- 📋 Progress bar
- 📋 Historia zmian

## 📊 Statystyki implementacji

- **Plików utworzonych:** 11
- **Linii kodu:** ~1800+
- **Dokumentacja:** 3 pliki markdown
- **API Endpoints:** 2
- **Komponenty UI:** 1 (admin panel)

## 🤝 Wsparcie

Masz problem? Sprawdź:

1. 📖 [Quick Start Guide](./GOOGLE_DRIVE_AGENT_QUICKSTART.md)
2. 📚 [Full Documentation](./GOOGLE_DRIVE_AGENT_DOCS.md)
3. 🐛 Logi w konsoli przeglądarki (F12)
4. 📝 Logi w panelu administratora
5. ☁️ Konfigurację w Google Cloud Console

## 📄 Licencja

Część projektu Posadzki Żywiczne.

---

**Made with ❤️ for automated content management**

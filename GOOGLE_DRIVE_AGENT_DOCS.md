# Google Drive Agent - Dokumentacja

## Opis

Agent działający w przeglądarce do automatycznego pobierania danych realizacji z Google Drive i aktualizacji statycznych stron w Next.js.

## Funkcjonalność

- ✅ Autoryzacja OAuth 2.0 z Google Drive API (tylko do odczytu)
- ✅ Pobieranie listy folderów realizacji z określonego folderu root
- ✅ Odczyt plików opisowych (JSON/YAML) z podfolderów "media"
- ✅ Pobieranie metadanych plików graficznych
- ✅ Zapis/aktualizacja plików JSON w katalogu `data/realizacje/`
- ✅ Automatyczne wywoływanie revalidation w Next.js
- ✅ Panel administratora z interfejsem użytkownika
- ✅ Szczegółowe logowanie operacji

## Struktura Google Drive

Agent oczekuje następującej struktury w Google Drive:

```
📁 Root Folder (ID w zmiennej NEXT_PUBLIC_GOOGLE_DRIVE_ROOT_FOLDER_ID)
├── 📁 Realizacja 1
│   └── 📁 media
│       ├── 📄 opis.json (lub opis.yaml)
│       ├── 🖼️ obraz1.jpg
│       ├── 🖼️ obraz2.jpg
│       └── 🖼️ obraz3.png
├── 📁 Realizacja 2
│   └── 📁 media
│       ├── 📄 dane.json
│       └── 🖼️ ...
└── ...
```

## Format pliku opisowego

### JSON Format

```json
{
  "title": "Posadzka żywiczna w garażu - Warszawa",
  "slug": "garaz-warszawa-2024",
  "location": "Warszawa, Mokotów",
  "area": "40 m²",
  "technology": "Epoksyd z posypką kwarcową",
  "description": "Kompleksowa realizacja posadzki epoksydowej...",
  "category": "mieszkania-domy",
  "type": "indywidualna",
  "tags": ["garaż", "epoksyd", "antypoślizg"],
  "color": "Szary RAL 7037",
  "duration": "3 dni",
  "features": [
    "Wysoka odporność na ścieranie",
    "Łatwe utrzymanie czystości"
  ],
  "keywords": [
    "posadzka żywiczna garaż",
    "epoksyd garaż Warszawa"
  ],
  "clientTestimonial": {
    "content": "Jestem bardzo zadowolony z wykonanej posadzki...",
    "author": "Pan Tomasz, Warszawa"
  }
}
```

### YAML Format

```yaml
title: Posadzka żywiczna w garażu - Warszawa
slug: garaz-warszawa-2024
location: Warszawa, Mokotów
area: 40 m²
technology: Epoksyd z posypką kwarcową
description: Kompleksowa realizacja posadzki epoksydowej...
category: mieszkania-domy
type: indywidualna
tags:
  - garaż
  - epoksyd
  - antypoślizg
color: Szary RAL 7037
duration: 3 dni
features:
  - Wysoka odporność na ścieranie
  - Łatwe utrzymanie czystości
keywords:
  - posadzka żywiczna garaż
  - epoksyd garaż Warszawa
```

## Konfiguracja

### 1. Utwórz projekt w Google Cloud Console

1. Przejdź do [Google Cloud Console](https://console.cloud.google.com/)
2. Utwórz nowy projekt lub wybierz istniejący
3. Włącz Google Drive API:
   - Menu → APIs & Services → Library
   - Znajdź "Google Drive API"
   - Kliknij "Enable"

### 2. Utwórz credentials

#### API Key

1. APIs & Services → Credentials
2. Kliknij "Create Credentials" → "API Key"
3. Opcjonalnie: Ogranicz klucz do Google Drive API
4. Skopiuj wygenerowany klucz

#### OAuth 2.0 Client ID

1. APIs & Services → Credentials
2. Kliknij "Create Credentials" → "OAuth client ID"
3. Typ aplikacji: "Web application"
4. Nazwa: "Google Drive Sync Agent"
5. Authorized JavaScript origins:
   - `http://localhost:3000` (dla developmentu)
   - `https://twoja-domena.com` (dla produkcji)
6. Kliknij "Create"
7. Skopiuj "Client ID"

### 3. Znajdź ID folderu root w Google Drive

1. Otwórz folder root w Google Drive
2. Skopiuj ID z URL:
   ```
   https://drive.google.com/drive/folders/[TO_JEST_ID_FOLDERU]
   ```

### 4. Skonfiguruj zmienne środowiskowe

Dodaj do pliku `.env.local`:

```env
NEXT_PUBLIC_GOOGLE_DRIVE_API_KEY=twój-api-key
NEXT_PUBLIC_GOOGLE_DRIVE_CLIENT_ID=twój-client-id.apps.googleusercontent.com
NEXT_PUBLIC_GOOGLE_DRIVE_ROOT_FOLDER_ID=id-folderu-root
```

**WAŻNE:** Zmienne muszą mieć prefix `NEXT_PUBLIC_` aby były dostępne w przeglądarce.

## Użytkowanie

### Panel administratora

1. Przejdź do `/admin/google-drive-sync`
2. Kliknij "Zaloguj się do Google Drive"
3. Zaakceptuj wymagane uprawnienia (tylko odczyt)
4. Kliknij "Synchronizuj realizacje"
5. Obserwuj postęp w logach

### Programatyczne użycie

```typescript
import { GoogleDriveAgent, createGoogleDriveAgent } from '@/lib/google-drive-agent';

// Utwórz agenta
const agent = createGoogleDriveAgent();

// Inicjalizacja
await agent.initialize();

// Autoryzacja
await agent.authorize();

// Synchronizacja
const results = await agent.syncRealizations();

// Zapis danych
for (const result of results) {
  if (result.status === 'success') {
    await agent.saveRealizacja(result.data);
    await agent.triggerRevalidation(result.slug);
  }
}

// Wylogowanie
agent.signOut();
```

## API Endpoints

### POST /api/realizacje/sync

Zapisuje/aktualizuje realizację.

**Request:**
```json
{
  "slug": "garaz-warszawa-2024",
  "title": "Posadzka w garażu",
  "description": "...",
  "category": "mieszkania-domy",
  "type": "indywidualna",
  "location": "Warszawa",
  "tags": ["garaż"],
  "images": {
    "main": "/path/to/main.jpg",
    "gallery": ["/path/to/img1.jpg"]
  },
  "details": {
    "surface": "40 m²",
    "system": "Epoksyd"
  },
  "features": [],
  "keywords": []
}
```

**Response:**
```json
{
  "success": true,
  "message": "Realizacja utworzona pomyślnie",
  "slug": "garaz-warszawa-2024",
  "isUpdate": false
}
```

### GET /api/realizacje/sync

Pobiera listę wszystkich realizacji.

**Response:**
```json
{
  "success": true,
  "count": 5,
  "realizacje": [...]
}
```

### POST /api/revalidate?path=/realizacje/slug

Wywołuje revalidation dla podanej ścieżki.

**Response:**
```json
{
  "success": true,
  "message": "Revalidation dla /realizacje/slug zakończony",
  "revalidated": true,
  "now": 1700000000000
}
```

## Bezpieczeństwo

- ✅ OAuth 2.0 z zakresem tylko do odczytu (`drive.readonly`)
- ✅ Klucz API ograniczony do Google Drive API
- ✅ Brak zapisywania credentials w kodzie
- ✅ Wszystkie sekrety w zmiennych środowiskowych
- ⚠️ Panel admin nie ma wbudowanej autoryzacji - dodaj własną!

## Ograniczenia i uwagi

1. **Obrazy:** Agent pobiera tylko metadane obrazów. W pełnej implementacji należy:
   - Pobrać pliki binarne
   - Zapisać je w katalogu `public/images/realizacje/`
   - Lub przesłać do CDN (Cloudinary, Vercel Blob, etc.)

2. **YAML Parser:** Implementacja zawiera prosty parser YAML. Dla produkcji zalecane jest użycie biblioteki `js-yaml`.

3. **Rate limiting:** Google Drive API ma limity. Dla dużych ilości danych warto dodać throttling.

4. **Uprawnienia administratora:** Panel nie ma autoryzacji - zalecane dodanie middleware z weryfikacją uprawnień.

## Rozszerzenia

### Automatyczna synchronizacja w tle

Dodaj automatyczną synchronizację co X godzin:

```typescript
// W komponencie admin
useEffect(() => {
  const interval = setInterval(async () => {
    if (isAuthorized && !isSyncing) {
      await handleSync();
    }
  }, 3600000); // co godzinę

  return () => clearInterval(interval);
}, [isAuthorized, isSyncing]);
```

### Webhook dla zmian w Google Drive

Użyj Google Drive Push Notifications API do wykrywania zmian w czasie rzeczywistym.

### Obsługa obrazów

Dodaj pobieranie i zapisywanie obrazów:

```typescript
async downloadImage(fileId: string, slug: string, fileName: string): Promise<string> {
  const response = await gapi.client.drive.files.get({
    fileId: fileId,
    alt: 'media',
  });

  // Konwertuj do blob
  const blob = await fetch(response.body).then(r => r.blob());
  
  // Prześlij do API
  const formData = new FormData();
  formData.append('file', blob, fileName);
  formData.append('slug', slug);
  
  const uploadResponse = await fetch('/api/upload-image', {
    method: 'POST',
    body: formData,
  });
  
  const data = await uploadResponse.json();
  return data.url;
}
```

## Troubleshooting

### "Failed to load GAPI"

- Sprawdź połączenie internetowe
- Sprawdź czy nie blokuje firewall/ad-blocker
- Sprawdź console przeglądarki

### "Authorization failed"

- Zweryfikuj Client ID
- Sprawdź Authorized JavaScript origins
- Wyczyść cache przeglądarki

### "Cannot read files"

- Sprawdź czy folder jest udostępniony dla konta Google
- Zweryfikuj ID folderu root
- Sprawdź uprawnienia w Google Cloud Console

### "API key not valid"

- Zweryfikuj API key
- Sprawdź czy Google Drive API jest włączone
- Sprawdź ograniczenia klucza

## Wsparcie

W razie problemów:
1. Sprawdź logi w konsoli przeglądarki
2. Sprawdź logi w panelu administratora
3. Zweryfikuj konfigurację w Google Cloud Console
4. Sprawdź zmienne środowiskowe

## Licencja

Kod jest częścią projektu Posadzki Żywiczne.

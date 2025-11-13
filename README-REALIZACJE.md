# Posadzki Żywiczne - System automatycznego dodawania realizacji

## Nowe Funkcjonalności

### 1. Strona Realizacji

Dodano nową sekcję "Realizacje" na stronie, która pozwala na prezentację wykonanych projektów:

- **Lista realizacji**: `/realizacje` - galeria wszystkich projektów z filtrowaniem po typach
- **Szczegóły realizacji**: `/realizacje/[slug]` - strona szczegółowa z opisem, parametrami i galerią zdjęć

### 2. Integracja z Google Drive

System automatycznej synchronizacji realizacji z Google Drive. 

#### Cechy:
- Automatyczne pobieranie projektów z folderu Google Drive
- Parsowanie metadanych z plików tekstowych
- Automatyczne pobieranie i organizacja zdjęć
- Generowanie struktury danych dla strony

#### Konfiguracja:

Szczegółowa instrukcja znajduje się w: [docs/GOOGLE_DRIVE_INTEGRATION.md](docs/GOOGLE_DRIVE_INTEGRATION.md)

Krótkie kroki:
1. Skonfiguruj projekt Google Cloud i włącz Google Drive API
2. Utwórz konto serwisowe i pobierz credentials
3. Udostępnij folder "Realizacje" dla konta serwisowego
4. Ustaw `GOOGLE_DRIVE_FOLDER_ID` w pliku `.env`
5. Uruchom `npm run sync-drive`

### 3. Struktura danych

Realizacje przechowywane są w:
- **Dane**: `/data/realizacje/*.json` - metadane projektów
- **Zdjęcia**: `/public/realizacje/[slug]/*.jpg` - obrazy projektów

### 4. Nowe komponenty

- `RealizationDetailView` - widok szczegółowy realizacji
- `RealizationsGallery` - galeria ze wszystkimi realizacjami

## Jak używać

### Dodawanie nowej realizacji przez Google Drive

1. Utwórz folder w Google Drive (w folderze "Realizacje") z nazwą projektu
2. Dodaj plik `info.txt` z metadanymi (szablon: `docs/info.txt.template`)
3. Dodaj zdjęcia projektu (JPG, PNG, WEBP)
4. Uruchom synchronizację:
   ```bash
   npm run sync-drive
   ```
5. Zbuduj stronę:
   ```bash
   npm run build
   ```

### Ręczne dodawanie realizacji

1. Utwórz plik JSON w `data/realizacje/`
2. Dodaj zdjęcia do `public/realizacje/[slug]/`
3. Zbuduj stronę

Przykład struktury JSON znajduje się w `data/realizacje/garaz-warszawa-mokotow.json`

## Komendy

```bash
# Uruchom serwer developerski
npm run dev

# Zbuduj projekt
npm run build

# Uruchom produkcyjny serwer
npm start

# Synchronizuj z Google Drive
npm run sync-drive

# Linting
npm run lint
```

## Dokumentacja

- [Integracja Google Drive](docs/GOOGLE_DRIVE_INTEGRATION.md) - pełna instrukcja konfiguracji
- [Szablon info.txt](docs/info.txt.template) - szablon pliku z metadanymi

## Technologie

- Next.js 15
- TypeScript
- React
- Google Drive API v3
- Tailwind CSS
- React Markdown

## Bezpieczeństwo

**WAŻNE:** Nie commituj wrażliwych danych:
- `google-credentials.json` - powinien być w `.gitignore`
- Pliki `.env` z kluczami API

## Wsparcie

W razie problemów sprawdź:
1. Dokumentację w folderze `docs/`
2. Logi z uruchomienia skryptów
3. Konfigurację Google Cloud Console

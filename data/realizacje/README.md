# Realizacje - Dodawanie Nowych Projektów

## Jak dodać nową realizację?

Dodawanie nowej realizacji jest bardzo proste! Wystarczy utworzyć nowy plik JSON w tym folderze.

### Krok 1: Utwórz nowy plik JSON

Nazwij plik według schematu: `nazwa-projektu-rok.json`

Przykłady:
- `mieszkanie-warszawa-2024.json`
- `balkon-krakow-2025.json`
- `kuchnia-rzeszow-2024.json`

### Krok 2: Wypełnij dane projektu

Użyj poniższego szablonu i wypełnij wszystkie pola:

```json
{
  "slug": "mieszkanie-warszawa-2024",
  "title": "Posadzka żywiczna w mieszkaniu - Warszawa",
  "description": "Kompleksowa realizacja posadzki epoksydowej w mieszkaniu w Warszawie. System epoksydowy z gładką powierzchnią zapewniający nowoczesny wygląd.",
  "category": "mieszkania-domy",
  "type": "indywidualna",
  "location": "Warszawa, Mokotów",
  "date": "2024-10-15",
  "tags": ["mieszkanie", "epoksyd", "nowoczesna", "gładka", "salon"],
  "images": {
    "main": "/mieszkanie/glowne.jpg",
    "gallery": [
      "/mieszkanie/foto1.jpg",
      "/mieszkanie/foto2.jpg",
      "/mieszkanie/foto3.jpg"
    ]
  },
  "details": {
    "surface": "40 m²",
    "system": "Epoksyd samopoziomujący",
    "color": "Szary RAL 7037",
    "duration": "3 dni"
  },
  "features": [
    "Wysoka odporność na ścieranie",
    "Łatwe utrzymanie czystości",
    "Estetyczny wygląd",
    "Bezspoinowa powierzchnia",
    "Kompatybilność z ogrzewaniem podłogowym"
  ],
  "keywords": [
    "posadzka żywiczna mieszkanie",
    "epoksyd mieszkanie Warszawa",
    "posadzka salon"
  ],
  "clientTestimonial": {
    "content": "Jestem bardzo zadowolony z wykonanej posadzki. Mieszkanie wygląda profesjonalnie, a powierzchnia jest bardzo wytrzymała.",
    "author": "Pan Tomasz, Warszawa"
  }
}
```

### Objaśnienie pól:

#### Podstawowe informacje:
- **slug**: Unikalny identyfikator (taki sam jak nazwa pliku bez `.json`)
- **title**: Tytuł realizacji (pojawi się jako nagłówek)
- **description**: Szczegółowy opis projektu (2-3 zdania, ważne dla SEO)
- **category**: Kategoria projektu - MUSI być jedną z:
  - `"mieszkania-domy"` - dla mieszkań i domów
  - `"balkony-tarasy"` - dla balkonów i tarasów
  - `"kuchnie"` - dla kuchni
  - `"pomieszczenia-czyste"` - dla pomieszczeń czystych, hal, warsztatów
  - `"schody"` - dla schodów
- **type**: Typ projektu - MUSI być jedną z:
  - `"indywidualna"` - dla projektów prywatnych/indywidualnych
  - `"komercyjna"` - dla projektów komercyjnych/biznesowych
- **location**: Lokalizacja (np. "Warszawa, Mokotów")
- **date**: Data realizacji w formacie YYYY-MM-DD (np. "2024-10-15")
- **tags**: Tablica tagów opisujących projekt (np. ["garaż", "epoksyd", "antypoślizg"])
  - Używaj konkretnych, opisowych tagów
  - 5-7 tagów to optymalna liczba
  - Tagi pomagają w wyszukiwaniu i filtrowaniu

#### Zdjęcia:
- **images.main**: Główne zdjęcie (pojawi się jako miniatura)
- **images.gallery**: Lista dodatkowych zdjęć (galeria)
  - Zdjęcia umieszczaj w folderze `/public/`
  - Ścieżki zaczynają się od `/` (np. `/garaz/foto1.jpg`)

#### Szczegóły projektu:
- **details.surface**: Powierzchnia (np. "40 m²")
- **details.system**: Rodzaj systemu (np. "Epoksyd z posypką kwarcową")
- **details.color**: Kolor (opcjonalnie, np. "Szary RAL 7037")
- **details.duration**: Czas realizacji (opcjonalnie, np. "3 dni")

#### SEO i marketing:
- **features**: Lista zalet/cech projektu (5-7 punktów)
- **keywords**: Słowa kluczowe SEO (3-5 fraz)
- **clientTestimonial** (opcjonalnie):
  - **content**: Treść opinii klienta
  - **author**: Autor opinii (np. "Pan Jan, Kraków")

### Krok 3: Dodaj zdjęcia

1. Wgraj zdjęcia do odpowiedniego folderu w `/public/`:
   - `/public/garaz/` - dla garaży
   - `/public/mieszkanie/` - dla mieszkań i domów
   - `/public/` - dla balkonów i tarasów (lub utwórz nowy folder)

2. Zaktualizuj ścieżki w pliku JSON:
   ```json
   "images": {
     "main": "/garaz/moje-zdjecie-glowne.jpg",
     "gallery": [
       "/garaz/zdjecie1.jpg",
       "/garaz/zdjecie2.jpg",
       "/garaz/zdjecie3.jpg"
     ]
   }
   ```

### Krok 4: Zapisz i gotowe!

Po zapisaniu pliku JSON, nowa realizacja automatycznie pojawi się na stronie:
- W liście wszystkich realizacji: `/realizacje`
- Na własnej podstronie: `/realizacje/slug-projektu`
- W mapie strony (sitemap.xml)

## Najlepsze praktyki

### Nazewnictwo:
- Używaj małych liter i łączników w slug
- Bądź konsekwentny: `garaz-miasto-rok.json`

### Opisy:
- Title: 50-70 znaków - zwięzły, opisowy
- Description: 150-200 znaków - szczegółowy, zawiera słowa kluczowe
- Features: konkretne korzyści dla klienta

### SEO:
- Keywords: używaj fraz, które klienci wpisują w Google
- Dodaj lokalizację w title i description
- Używaj słów kluczowych naturalnie w opisie

### Zdjęcia:
- Format: JPG lub PNG
- Rozmiar: optymalizuj przed wgraniem (maks 1-2 MB na zdjęcie)
- Jakość: używaj dobrych, ostrych zdjęć pokazujących efekt końcowy
- Galeria: 3-6 zdjęć to optymalna liczba

### Opinie klientów:
- Autentyczne opinie zwiększają wiarygodność
- Cytuj konkretne korzyści wymienione przez klienta
- Możesz pominąć nazwisko (np. "Pan Tomasz, Warszawa")

## Przykłady kategorii i typów

### Mieszkanie/Dom (Indywidualne):
```json
{
  "category": "mieszkania-domy",
  "type": "indywidualna",
  "tags": ["mieszkanie", "salon", "epoksyd", "nowoczesna", "gładka"],
  "keywords": [
    "posadzka żywiczna mieszkanie",
    "posadzka salon",
    "epoksyd mieszkanie"
  ]
}
```

### Kuchnia:
```json
{
  "category": "kuchnie",
  "type": "indywidualna",
  "tags": ["kuchnia", "epoksyd", "bezspoinowa", "biała", "minimalizm"],
  "keywords": [
    "posadzka kuchnia",
    "epoksyd kuchnia",
    "posadzka bezspoinowa kuchnia"
  ]
}
```

### Balkon/Taras:
```json
{
  "category": "balkony-tarasy",
  "type": "indywidualna",
  "tags": ["balkon", "poliuretan", "UV", "wodoszczelność", "antypoślizg"],
  "keywords": [
    "posadzka balkon",
    "renowacja balkonu",
    "balkon wodoszczelny"
  ]
}
```

### Pomieszczenia Czyste (Komercyjne):
```json
{
  "category": "pomieszczenia-czyste",
  "type": "komercyjna",
  "tags": ["hala", "warsztat", "przemysłowa", "chemoodporna", "garaż"],
  "keywords": [
    "posadzka przemysłowa",
    "posadzka hala",
    "posadzka chemoodporna"
  ]
}
```

### Schody:
```json
{
  "category": "schody",
  "type": "indywidualna",
  "tags": ["schody", "wewnętrzne", "antypoślizg", "epoksyd", "nowoczesne"],
  "keywords": [
    "posadzka schody",
    "schody żywiczne",
    "schody antypoślizgowe"
  ]
}
```

## Wsparcie

Jeśli masz pytania lub problemy, sprawdź istniejące pliki JSON w tym folderze jako przykłady.

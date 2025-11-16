# 📸 Przewodnik Przygotowania Realizacji dla Automatycznego Generowania Artykułów

## 🎯 Cel tego dokumentu

Ten dokument wyjaśnia **krok po kroku**, jak przygotować zdjęcia i dane realizacji, aby można było automatycznie wygenerować kompletny artykuł portfolio z:
- ✅ Profesjonalną galerią zdjęć
- ✅ Wszystkimi meta elementami SEO (title, description, keywords, OpenGraph)
- ✅ Structured data (JSON-LD) dla Google
- ✅ Optymalizacją pod pozycjonowanie lokalne
- ✅ Responsywnym layoutem
- ✅ Automatycznym dodaniem do mapy strony (sitemap.xml)

---

## 📋 Wymagania - Co Musisz Przygotować

### 1. **Zdjęcia Realizacji** 📷

#### Minimalne wymagania:
- **1 zdjęcie główne** (cover photo) - najlepsze ujęcie całości projektu
- **3-6 zdjęć do galerii** - pokazujące różne aspekty realizacji

#### Wytyczne techniczne dla zdjęć:
```
✅ Format: JPG lub PNG (preferowany JPG)
✅ Rozmiar: 1200-2000px na szerokość (automatycznie zoptymalizowane przez Next.js)
✅ Wielkość pliku: maksymalnie 2 MB na zdjęcie (przed wgraniem)
✅ Orientacja: preferowane poziome (landscape)
✅ Jakość: dobra ostrość, odpowiednie oświetlenie
```

#### Co pokazać na zdjęciach:
1. **Zdjęcie główne**: Najlepszy ogólny widok zakończonej realizacji
2. **Galeria - różnorodność ujęć**:
   - Szeroki plan całego pomieszczenia/powierzchni
   - Zbliżenia na detale (tekstura, połysk, krawędzie)
   - Różne kąty i perspektywy
   - Zdjęcia "przed i po" (jeśli dostępne) - BARDZO WARTOŚCIOWE
   - Etapy pracy (opcjonalnie)

#### ⚠️ Czego unikać:
- ❌ Rozmytych zdjęć
- ❌ Zbyt ciemnych ujęć
- ❌ Zdjęć z widocznymi danymi osobowymi klientów
- ❌ Nieporządku w tle (sprzęt budowlany, bałagan)

---

### 2. **Informacje o Projekcie** 📝

Przygotuj następujące informacje w dowolnej formie (email, notatka, dokument):

#### **A. Podstawowe dane (WYMAGANE)**

```yaml
Nazwa projektu: np. "Garaż dwustanowiskowy w Warszawie"
Lokalizacja: np. "Warszawa, Mokotów" lub "Kraków"
Data realizacji: np. "październik 2024" lub "2024-10-15"
Kategoria: wybierz jedną z:
  - Mieszkania i domy
  - Balkony i tarasy
  - Kuchnie
  - Pomieszczenia czyste/przemysłowe (garaże, hale)
  - Schody

Typ projektu:
  - Indywidualna (prywatny dom/mieszkanie)
  - Komercyjna (firma, obiekt publiczny)
```

#### **B. Opis projektu (WYMAGANY)**

Napisz 2-4 zdania opisujące projekt. **To jest najważniejsze dla SEO!**

**Przykład dobrego opisu:**
> "Kompleksowa realizacja posadzki epoksydowej w garażu dwustanowiskowym w warszawskim Mokotowie. Zastosowaliśmy system epoksydowy z posypką kwarcową, zapewniający wysoką odporność na ścieranie, plamy olejowe i intensywny ruch samochodów. Powierzchnia 40 m² została wykonana w neutralnym szarym kolorze RAL 7037 z antypoślizgową fakturą."

**Wskazówki:**
- Używaj konkretnych słów kluczowych (epoksyd, poliuretan, system, posadzka)
- Dodaj lokalizację (Warszawa, Kraków, Mokotów)
- Opisz funkcje i korzyści
- Wspominaj parametry techniczne
- 150-250 znaków to optymalna długość

#### **C. Szczegóły techniczne**

```yaml
Powierzchnia: np. "40 m²", "25 m²", "15 m²"
System/Materiał: np. 
  - "Epoksyd z posypką kwarcową"
  - "Poliuretan UV"
  - "Epoksyd samopoziomujący"
  - "System epoksydowy 3-warstwowy"

Kolor: (opcjonalnie) np. "Szary RAL 7037", "Biały", "Beżowy"
Czas realizacji: (opcjonalnie) np. "3 dni", "2 dni robocze"
```

#### **D. Cechy i zalety projektu** (5-7 punktów)

Lista konkretnych korzyści i rozwiązań zastosowanych w projekcie:

**Przykłady:**
- Wysoka odporność na ścieranie
- Łatwe utrzymanie czystości
- Estetyczny wygląd
- Odporność na plamy olejowe
- Antypoślizgowa powierzchnia
- Bezspoinowa powierzchnia
- Kompatybilność z ogrzewaniem podłogowym
- Odporność na UV
- Chemoodporność

#### **E. Tagi/Słowa kluczowe** (5-10 słów)

Krótkie słowa opisujące projekt (używane do filtrowania i wyszukiwania):

**Przykłady:**
- garaż, epoksyd, antypoślizg, dwustanowiskowy, posypka kwarcowa
- balkon, poliuretan, UV, wodoszczelność, antypoślizg
- mieszkanie, salon, epoksyd, nowoczesna, gładka

#### **F. Frazy SEO** (3-5 fraz)

Konkretne frazy, które klienci wpisują w Google:

**Przykłady dla garażu:**
- "posadzka żywiczna garaż"
- "epoksyd garaż Warszawa"
- "posadzka garaż dwustanowiskowy"
- "posadzka antypoślizgowa garaż"

**Przykłady dla balkonu:**
- "posadzka balkon"
- "renowacja balkonu"
- "balkon wodoszczelny"
- "posadzka taras Kraków"

**Wskazówka:** Użyj Google Search Console lub narzędzia do słów kluczowych

#### **G. Opinia klienta** (OPCJONALNIE, ale bardzo wartościowa!)

Jeśli klient zgodził się na publikację opinii:

```yaml
Treść opinii: "Cytat klienta - konkretne zalety, korzyści"
Autor: "Pan Tomasz, Warszawa" (imię + miasto)
```

**Przykład:**
> "Jestem bardzo zadowolony z wykonanej posadzki. Garaż wygląda profesjonalnie, a powierzchnia jest bardzo wytrzymała. Ekipa pracowała szybko i sprawnie."
> — Pan Tomasz, Warszawa

---

## 🎨 Schemat Nazewnictwa Plików

### Zdjęcia - jak nazywać:

```
Format nazwy: kategoria-lokalizacja-numer.jpg
```

**Przykłady:**
```
garaz-warszawa-glowne.jpg       (zdjęcie główne)
garaz-warszawa-1.jpg            (galeria - zdjęcie 1)
garaz-warszawa-2.jpg            (galeria - zdjęcie 2)
garaz-warszawa-przed.jpg        (przed realizacją)
garaz-warszawa-po.jpg           (po realizacji)

balkon-krakow-main.jpg
balkon-krakow-detail-1.jpg
balkon-krakow-detail-2.jpg

mieszkanie-rzeszow-salon-glowne.jpg
mieszkanie-rzeszow-salon-1.jpg
```

### Slug projektu (identyfikator URL):

```
Format: kategoria-lokalizacja-rok
```

**Przykłady:**
```
garaz-warszawa-2024
balkon-krakow-2024
mieszkanie-rzeszow-2024
schody-warszawa-2025
taras-wieliczka-2024
```

---

## 📂 Struktura Folderów dla Zdjęć

Umieść zdjęcia w odpowiednim folderze w `/public/`:

```
/public/
  ├── garaz/           # Zdjęcia garaży i hal
  ├── mieszkanie/      # Zdjęcia mieszkań i domów
  ├── balkon/          # Zdjęcia balkonów (możesz utworzyć)
  ├── taras/           # Zdjęcia tarasów (możesz utworzyć)
  ├── kuchnia/         # Zdjęcia kuchni (możesz utworzyć)
  └── schody/          # Zdjęcia schodów (możesz utworzyć)
```

**Możesz utworzyć nowy folder**, jeśli nie istnieje:
```bash
mkdir public/balkon
mkdir public/taras
mkdir public/kuchnia
```

---

## 📧 Jak Przekazać Dane?

### Opcja 1: Email z załącznikami (NAJPROSTSZE)

Wyślij email z:
1. **Załączniki**: Wszystkie zdjęcia (spakowane w ZIP lub pojedynczo)
2. **Treść email**: Wypełniony szablon poniżej

#### 📋 Szablon Email:

```
TEMAT: Nowa realizacja do dodania - [Nazwa projektu]

---

PROJEKT: [np. Garaż dwustanowiskowy Warszawa]
LOKALIZACJA: [np. Warszawa, Mokotów]
DATA: [np. październik 2024]
KATEGORIA: [Mieszkania i domy / Balkony i tarasy / Kuchnie / Pomieszczenia czyste / Schody]
TYP: [Indywidualna / Komercyjna]

OPIS (2-4 zdania):
[Wpisz opis projektu z konkretnymi słowami kluczowymi i lokalizacją...]

SZCZEGÓŁY TECHNICZNE:
- Powierzchnia: [np. 40 m²]
- System: [np. Epoksyd z posypką kwarcową]
- Kolor: [opcjonalnie]
- Czas realizacji: [opcjonalnie]

CECHY I ZALETY (5-7 punktów):
- [Zaleta 1]
- [Zaleta 2]
- [Zaleta 3]
- [...]

TAGI (5-10 słów, oddzielone przecinkami):
[np. garaż, epoksyd, antypoślizg, dwustanowiskowy, posypka kwarcowa]

FRAZY SEO (3-5 fraz, oddzielone przecinkami):
[np. posadzka żywiczna garaż, epoksyd garaż Warszawa, posadzka antypoślizgowa garaż]

OPINIA KLIENTA (opcjonalnie):
Treść: "[Cytat]"
Autor: [np. Pan Tomasz, Warszawa]

ZDJĘCIA:
- Główne: [nazwa pliku, np. garaz-warszawa-glowne.jpg]
- Galeria: [lista plików, np. garaz-warszawa-1.jpg, garaz-warszawa-2.jpg, ...]
```

### Opcja 2: Google Drive / Dropbox

1. Utwórz folder z nazwą projektu
2. Wgraj zdjęcia
3. Dodaj plik tekstowy `opis.txt` z danymi (według szablonu wyżej)
4. Udostępnij link

### Opcja 3: Bezpośrednio w GitHub (dla zaawansowanych)

1. Wgraj zdjęcia do `/public/[kategoria]/`
2. Utwórz plik JSON w `/data/realizacje/` (według szablonu JSON poniżej)
3. Commit i push

---

## 📄 Szablon JSON (dla zaawansowanych)

Jeśli chcesz sam stworzyć plik JSON:

```json
{
  "slug": "garaz-warszawa-2024",
  "title": "Posadzka żywiczna w garażu dwustanowiskowym - Warszawa",
  "description": "Kompleksowa realizacja posadzki epoksydowej w garażu dwustanowiskowym w Warszawie. System epoksydowy z posypką kwarcową zapewniający wysoką odporność na ścieranie i ruch samochodów.",
  "category": "pomieszczenia-czyste",
  "type": "indywidualna",
  "location": "Warszawa, Mokotów",
  "date": "2024-10-15",
  "tags": ["garaż", "epoksyd", "antypoślizg", "dwustanowiskowy", "posypka kwarcowa"],
  "images": {
    "main": "/garaz/garaz-warszawa-glowne.jpg",
    "gallery": [
      "/garaz/garaz-warszawa-1.jpg",
      "/garaz/garaz-warszawa-2.jpg",
      "/garaz/garaz-warszawa-3.jpg",
      "/garaz/garaz-warszawa-4.jpg"
    ]
  },
  "details": {
    "surface": "40 m²",
    "system": "Epoksyd z posypką kwarcową",
    "color": "Szary RAL 7037",
    "duration": "3 dni"
  },
  "features": [
    "Wysoka odporność na ścieranie",
    "Łatwe utrzymanie czystości",
    "Estetyczny wygląd",
    "Odporność na plamy olejowe",
    "Antypoślizgowa powierzchnia"
  ],
  "keywords": [
    "posadzka żywiczna garaż",
    "epoksyd garaż Warszawa",
    "posadzka garaż dwustanowiskowy",
    "posadzka antypoślizgowa garaż"
  ],
  "clientTestimonial": {
    "content": "Jestem bardzo zadowolony z wykonanej posadzki. Garaż wygląda profesjonalnie, a powierzchnia jest bardzo wytrzymała. Ekipa pracowała szybko i sprawnie.",
    "author": "Pan Tomasz, Warszawa"
  }
}
```

### Objaśnienie kategorii:

```javascript
// Dostępne kategorie (category):
"mieszkania-domy"       // Mieszkania, domy, salony
"balkony-tarasy"        // Balkony i tarasy
"kuchnie"               // Kuchnie
"pomieszczenia-czyste"  // Garaże, hale, warsztaty, pomieszczenia przemysłowe
"schody"                // Schody wewnętrzne i zewnętrzne

// Dostępne typy (type):
"indywidualna"          // Projekt dla klienta prywatnego
"komercyjna"            // Projekt dla firmy/biznesu
```

---

## 🎯 Co Się Stanie Po Dodaniu?

### Automatycznie wygenerowane zostaną:

1. **Dedykowana strona projektu** 
   - URL: `https://posadzkizywiczne.com/realizacje/[slug]`
   - Przykład: `https://posadzkizywiczne.com/realizacje/garaz-warszawa-2024`

2. **SEO Metadata**
   ```html
   <title>Posadzka żywiczna w garażu - Warszawa | Realizacja</title>
   <meta name="description" content="[Twój opis...]">
   <meta name="keywords" content="[Twoje keywords...]">
   ```

3. **OpenGraph (dla social media)**
   ```html
   <meta property="og:title" content="...">
   <meta property="og:description" content="...">
   <meta property="og:image" content="[główne zdjęcie]">
   ```

4. **Structured Data (JSON-LD)**
   ```json
   {
     "@context": "https://schema.org",
     "@type": "Article",
     "headline": "...",
     "image": "...",
     "datePublished": "..."
   }
   ```

5. **Dodanie do sitemap.xml**
   - Priority: 0.8
   - Change frequency: monthly

6. **Wyświetlanie**
   - Na stronie `/realizacje` - w odpowiedniej kategorii
   - W podobnych projektach
   - W najnowszych realizacjach (homepage - jeśli dodane)

---

## ✅ Checklist - Przed Wysłaniem

Sprawdź czy masz:

- [ ] **Minimum 1 dobre zdjęcie główne** (najlepsze ujęcie projektu)
- [ ] **3-6 zdjęć do galerii** (różne kąty, detale)
- [ ] **Nazwa projektu** (tytuł)
- [ ] **Lokalizacja** (miasto, dzielnica)
- [ ] **Data realizacji** (miesiąc i rok wystarczy)
- [ ] **Kategoria** (mieszkanie/garaż/balkon/kuchnia/schody)
- [ ] **Typ projektu** (indywidualna/komercyjna)
- [ ] **Opis 2-4 zdania** (z lokalizacją i konkretnymi słowami kluczowymi)
- [ ] **Powierzchnia** (np. "40 m²")
- [ ] **System/materiał** (np. "Epoksyd z posypką kwarcową")
- [ ] **5-7 cech/zalet** projektu
- [ ] **5-10 tagów** (krótkie słowa kluczowe)
- [ ] **3-5 fraz SEO** (frazy wpisywane w Google)
- [ ] (Opcjonalnie) **Opinia klienta** z imieniem i miastem

---

## 🚀 Przykład Kompletnego Przekazu

### Przykład 1: Garaż

```
PROJEKT: Posadzka żywiczna w garażu dwustanowiskowym
LOKALIZACJA: Warszawa, Mokotów
DATA: Październik 2024
KATEGORIA: Pomieszczenia czyste
TYP: Indywidualna

OPIS:
Kompleksowa realizacja posadzki epoksydowej w garażu dwustanowiskowym 
w warszawskim Mokotowie. Zastosowaliśmy trójwarstwowy system epoksydowy 
z posypką kwarcową, zapewniający wysoką odporność na ścieranie, plamy 
olejowe i intensywny ruch samochodów. Powierzchnia 40 m² została wykonana 
w neutralnym szarym kolorze RAL 7037 z antypoślizgową fakturą.

SZCZEGÓŁY:
- Powierzchnia: 40 m²
- System: Epoksyd z posypką kwarcową
- Kolor: Szary RAL 7037
- Czas: 3 dni robocze

ZALETY:
- Wysoka odporność na ścieranie
- Łatwe utrzymanie czystości
- Estetyczny, profesjonalny wygląd
- Odporność na plamy olejowe i chemikalia
- Antypoślizgowa powierzchnia bezpieczna w każdych warunkach

TAGI: garaż, epoksyd, antypoślizg, dwustanowiskowy, posypka kwarcowa, 
      Warszawa, RAL 7037

FRAZY SEO: posadzka żywiczna garaż, epoksyd garaż Warszawa, 
           posadzka garaż dwustanowiskowy, posadzka antypoślizgowa garaż

OPINIA:
"Jestem bardzo zadowolony z wykonanej posadzki. Garaż wygląda 
profesjonalnie, a powierzchnia jest bardzo wytrzymała. Ekipa 
pracowała szybko i sprawnie."
— Pan Tomasz, Warszawa

ZDJĘCIA:
- Główne: garaz-warszawa-2024-main.jpg
- Galeria: garaz-warszawa-2024-1.jpg, garaz-warszawa-2024-2.jpg, 
           garaz-warszawa-2024-3.jpg, garaz-warszawa-2024-4.jpg
```

### Przykład 2: Balkon

```
PROJEKT: Renowacja balkonu z posadzką poliuretanową
LOKALIZACJA: Kraków, Nowa Huta  
DATA: Listopad 2024
KATEGORIA: Balkony i tarasy
TYP: Indywidualna

OPIS:
Kompleksowa renowacja balkonu w krakowskim osiedlu Nowa Huta. Zastosowano 
wodoszczelny system poliuretanowy odporny na UV, deszcz i mróz. Powierzchnia 
12 m² w eleganckim szarym kolorze z antypoślizgową fakturą zapewnia bezpieczeństwo 
i trwałość przez wiele lat.

SZCZEGÓŁY:
- Powierzchnia: 12 m²
- System: Poliuretan UV
- Kolor: Szary
- Czas: 2 dni

ZALETY:
- Wodoszczelność - ochrona przed wilgocią
- Odporność na UV i warunki atmosferyczne
- Antypoślizgowa powierzchnia
- Łatwa konserwacja
- Estetyczny wygląd

TAGI: balkon, poliuretan, UV, wodoszczelność, antypoślizg, Kraków, renowacja

FRAZY SEO: posadzka balkon, renowacja balkonu Kraków, balkon wodoszczelny, 
           poliuretan balkon

ZDJĘCIA:
- Główne: balkon-krakow-2024-main.jpg
- Galeria: balkon-krakow-2024-przed.jpg, balkon-krakow-2024-po.jpg, 
           balkon-krakow-2024-detail.jpg
```

---

## 💡 Dodatkowe Wskazówki

### SEO Best Practices:

1. **Lokalizacja**: Zawsze dodawaj miasto/dzielnicę - to kluczowe dla lokalnego SEO
2. **Konkretne słowa**: Używaj "epoksyd", "poliuretan", "posadzka żywiczna" zamiast ogólników
3. **Liczby**: Podawaj konkretne parametry (powierzchnia, czas, ilość warstw)
4. **Korzyści**: Opisuj co klient zyskuje, nie tylko co zostało zrobione
5. **Long-tail keywords**: Frazy 3-5 słowne są najbardziej wartościowe

### Zdjęcia - Profesjonalne Tips:

1. **Oświetlenie**: Naturalne światło dzienne = najlepsze zdjęcia
2. **Perspektywa**: Rób zdjęcia z wysokości oczu lub niżej (bardziej spektakularne)
3. **Czystość**: Powierzchnia czysta, bez śmieci i narzędzi
4. **Kontekst**: Pokaż skalę - włącz elementy otoczenia (ściany, drzwi)
5. **Przed/Po**: Jeśli możliwe - pokazanie transformacji zwiększa wartość

### Co Zwiększa Konwersję:

- ✅ Autentyczne opinie klientów z imionami
- ✅ Zdjęcia "przed i po"
- ✅ Konkretne parametry techniczne
- ✅ Czas realizacji (pokazuje profesjonalizm)
- ✅ Lokalizacja (buduje zaufanie lokalnych klientów)

---

## 📞 Pytania?

Jeśli masz pytania lub potrzebujesz pomocy:

1. Sprawdź istniejące przykłady w `/data/realizacje/`
2. Zobacz dokumentację w `REALIZACJE_IMPLEMENTATION.md`
3. Skontaktuj się - chętnie pomogę!

---

## 🎉 Gotowy?

Gdy masz przygotowane:
- ✅ Zdjęcia (nazwane według wytycznych)
- ✅ Wypełniony szablon z danymi
- ✅ Opcjonalnie: opinię klienta

**Wyślij to wszystko i automatycznie:**
1. Dodam zdjęcia do odpowiedniego folderu
2. Utworzę plik JSON z wszystkimi danymi
3. Zoptymalizuję SEO metadata
4. Dodam structured data
5. Zaktualizuję sitemap
6. Projekt pojawi się na stronie!

**Czas realizacji**: Zazwyczaj kilka minut od otrzymania kompletnych danych.

---

*Wersja: 1.0 | Data: Listopad 2024 | Autor: System Realizacji v2*

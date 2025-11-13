# Przykładowa Struktura Folderu Google Drive

## Struktura folderu "Realizacje"

```
Realizacje/
├── garaz-warszawa-bemowo/
│   ├── info.txt
│   ├── IMG_001.jpg
│   ├── IMG_002.jpg
│   └── IMG_003.jpg
│
├── taras-krakow-podgorze/
│   ├── info.txt
│   ├── photo1.jpg
│   ├── photo2.jpg
│   ├── photo3.jpg
│   └── photo4.jpg
│
└── balkon-lublin-centrum/
    ├── info.txt
    └── image.jpg
```

## Przykład: garaz-warszawa-bemowo/info.txt

```
TITLE: Posadzka epoksydowa w garażu - Warszawa Bemowo
DESCRIPTION: Dwustanowiskowy garaż z posadzką epoksydową i antypoślizgiem R10
LOCATION: Warszawa Bemowo
AREA: 40 m²
DATE: 2024-11-01
CLIENT: Klient prywatny
TYPE: garaż
SURFACE: epoksydowa
TAGS: garaż, epoksyd, Warszawa, dwustanowiskowy, antypoślizg
FEATURED: true
---
## Realizacja posadzki żywicznej w garażu dwustanowiskowym

Wykonaliśmy profesjonalną posadzkę epoksydową w garażu dwustanowiskowym w Warszawie na Bemowie. Projekt obejmował kompleksowe przygotowanie podłoża oraz aplikację systemu bezpyłowego z warstwą antypoślizgową R10.

### Zakres prac

- Diagnostyka i przygotowanie podłoża betonowego
- Szlifowanie mechaniczne powierzchni 40 m²
- Naprawa rys i ubytków
- Aplikacja podkładu epoksydowego penetrującego
- Warstwa bazowa epoksydowa z posypką kwarcową
- Lakier ochronny UV w kolorze szarym

### Parametry techniczne

- Grubość systemu: 0,5 mm
- Odporność chemiczna: oleje, paliwa, sole drogowe
- Antypoślizg: R10 (posypka kwarcowa)
- Termin wykonania: 4 dni robocze
- Temperatura podczas aplikacji: 18-22°C

### Efekt końcowy

Posadzka charakteryzuje się wysoką odpornością na истирание i substancje chemiczne. Powierzchnia jest bezpyłowa, łatwa w utrzymaniu czystości. Klient bardzo zadowolony z efektu końcowego i profesjonalizmu wykonania.

### Opinie klienta

"Bardzo profesjonalna ekipa. Prace wykonane terminowo i zgodnie z umową. Garaż wygląda świetnie, posadzka spełnia wszystkie oczekiwania." - Pan Marek, Warszawa Bemowo
```

## Przykład: taras-krakow-podgorze/info.txt

```
TITLE: Posadzka poliuretanowa na tarasie - Kraków Podgórze
DESCRIPTION: Taras z posadzką odporną na UV i warunki atmosferyczne
LOCATION: Kraków Podgórze
AREA: 30 m²
DATE: 2024-09-15
TYPE: taras
SURFACE: poliuretanowa
TAGS: taras, poliuretan, UV, Kraków, odporność atmosferyczna
FEATURED: false
---
## Taras z posadzką poliuretanową

System poliuretanowy idealny na tarasy zewnętrzne - elastyczny, odporny na UV i wahania temperatur.

### Zakres prac

- Przygotowanie podłoża betonowego
- Naprawa pęknięć
- System drenażowy
- Posadzka poliuretanowa 2 mm
- Warstwa UV-protect

### Efekt

Trwała, estetyczna powierzchnia odporna na warunki atmosferyczne.
```

## Przykład: balkon-lublin-centrum/info.txt

```
TITLE: Renowacja balkonu - posadzka żywiczna w Lublinie
DESCRIPTION: Renowacja starego balkonu z posadzką poliuretanową
LOCATION: Lublin Centrum
AREA: 8 m²
DATE: 2024-08-20
CLIENT: Wspólnota mieszkaniowa
TYPE: balkon
SURFACE: poliuretanowa
TAGS: balkon, renowacja, poliuretan, Lublin
FEATURED: false
---
## Renowacja balkonu w kamienicy

Kompleksowa renowacja balkonu w zabytkowej kamienicy w centrum Lublina.

### Zakres

- Usunięcie starego pokrycia
- Naprawa podłoża
- Izolacja przeciwwilgociowa
- Posadzka poliuretanowa z antypoślizgiem

### Rezultat

Balkon zyskał nowe życie - estetyczny, bezpieczny i odporny na warunki atmosferyczne.
```

## Wskazówki

### Nazewnictwo folderów
- Używaj małych liter
- Oddzielaj słowa myślnikami (-)
- Przykłady: `garaz-warszawa-mokotow`, `taras-poznan-wilda`, `balkon-gdansk-oliwa`

### Nazewnictwo zdjęć
- Nie ma znaczenia - skrypt automatycznie zmienia nazwy na 01.jpg, 02.jpg, etc.
- Obsługiwane formaty: JPG, JPEG, PNG, WEBP
- Pierwsze zdjęcie (alfabetycznie) będzie miniaturą

### Kolejność zdjęć
- Zdjęcia są sortowane alfabetycznie
- Jeśli chcesz kontrolować kolejność, nazwij je: `01_widok_ogolny.jpg`, `02_detale.jpg`, etc.
- Po synchronizacji będą miały nazwy: `01.jpg`, `02.jpg`, etc.

### Pola w info.txt

**Wymagane:**
- TITLE - tytuł realizacji
- DESCRIPTION - krótki opis (1-2 zdania)

**Opcjonalne:**
- LOCATION - lokalizacja
- AREA - powierzchnia
- DATE - data realizacji (YYYY-MM-DD)
- CLIENT - nazwa klienta
- TYPE - typ projektu
- SURFACE - rodzaj powierzchni
- TAGS - tagi oddzielone przecinkami
- FEATURED - czy wyróżniona (true/false)

**Treść:**
- Po separatorze `---` możesz dodać szczegółowy opis w Markdown
- Obsługuje nagłówki, listy, pogrubienie, kursywę, etc.

## Często zadawane pytania

**Q: Czy mogę dodać więcej niż jeden projekt na raz?**
A: Tak, dodaj wszystkie foldery i uruchom `npm run sync-drive` raz.

**Q: Co jeśli popełnię błąd w info.txt?**
A: Po poprawieniu uruchom ponownie `npm run sync-drive` - nadpisze poprzednie dane.

**Q: Czy mogę usunąć folder z Google Drive?**
A: Tak, ale musisz ręcznie usunąć odpowiednie pliki z `data/realizacje/` i `public/realizacje/`.

**Q: Jak zaktualizować zdjęcia w istniejącej realizacji?**
A: Zamień zdjęcia w folderze Google Drive i uruchom `npm run sync-drive`.

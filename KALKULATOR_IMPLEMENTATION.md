# Kalkulator Posadzki Żywicznej - Dokumentacja Implementacji

## Przegląd

Ten dokument opisuje implementację kalkulatora posadzki żywicznej z funkcją generowania oferty PDF i wysyłania przez email zgodnie z wymaganiami projektu.

## Funkcjonalności

### 1. Wybór Typu Pomieszczenia

Użytkownik może wybrać jeden z trzech typów pomieszczenia:

- **Garaż / Piwnica** 🚗 - Posadzka żywiczna dla garaży i piwnic
- **Mieszkanie / Dom** 🏠 - Elegancka posadzka żywiczna do przestrzeni mieszkalnych  
- **Balkon / Taras** 🌿 - *Tymczasowo niedostępne*

### 2. Wybór Stanu Betonu (tylko dla Garaż/Piwnica)

Dla pomieszczeń typu garaż/piwnica, użytkownik musi wybrać obecny stan podłoża:

- **Nowa wylewka betonowa** - Świeża wylewka wymagająca jedynie gruntowania (0 zł/m²)
- **Płytki ceramiczne** - Istniejące płytki wymagające usunięcia i przygotowania podłoża (+25 zł/m²)

### 3. Wymiary Pomieszczenia

Użytkownik może wprowadzić wymiary na dwa sposoby:

- **Wymiary** - Długość i szerokość pomieszczenia (w metrach)
- **Powierzchnia** - Bezpośrednie podanie powierzchni w m²

Dodatkowo można podać obwód pomieszczenia (w metrach) - potrzebny do kalkulacji listew, cokołów i uszczelnień.

#### Walidacja wymiarów:

- Długość/szerokość: min 1m, max 50m
- Powierzchnia: min 1m², max 2500m²

### 4. Rodzaj Powierzchni

Trzy warianty wykończenia powierzchni:

1. **Podstawowa lekko chropowata** (200 zł/m²)
   - Kruszywo kwarcowe
   - Lekko chropowata
   - Dobra przyczepność
   - Standardowa odporność

2. **Z posypką z płatków akrylowych** (230 zł/m²)
   - Płatki akrylowe
   - Efekt dekoracyjny
   - Zwiększona estetyka
   - Dobra odporność

3. **Zacierana mechanicznie** (260 zł/m²)
   - Zacierana mechanicznie
   - Gładka powierzchnia
   - Najwyższa jakość
   - Maksymalna odporność

### 5. Wybór Koloru RAL

Dostępne kolory:

- **RAL 7035 - Szary jasny** (bez dopłaty)
- **RAL 7040 - Szary okno** (bez dopłaty)
- **RAL 7035 z posypką** (+50 zł/m²)

### 6. Usługi i Dodatki

#### Usługi Obowiązkowe (zawarte w ofercie):

1. **Gruntowanie podłoża** (8 zł/m²)
   - Dwukrotne gruntowanie podłoża dla lepszej przyczepności
   - Zdjęcie: `/images/gruntowanie.jpg`

2. **Cokoły na wysokość 10cm** (15 zł/mb)
   - Wykonanie cokołu żywicznego na wysokość 10cm
   - Zdjęcie: `/images/cokol.jpg`

3. **Uszczelnienie między ścianą a posadzką** (8 zł/mb)
   - Silikonowe uszczelnienie styku posadzki z ścianą
   - Zdjęcie: `/images/uszczelnienie.jpg`

#### Usługi Opcjonalne:

**Przygotowanie podłoża:**
- Podkład wyrównujący (15 zł/m²)
- Szlifowanie betonu (12 zł/m²)
- Naprawa ubytków (25 zł/m²)
- Demontaż starej posadzki (8 zł/m²)

**Wykończenie:**
- Dylatacje (12 zł/mb)
- Sprzątanie końcowe (200 zł)

**Ochrona:**
- Warstwa ochronna (18 zł/m²)
- Powierzchnia antypoślizgowa (22 zł/m²)

**Logistyka:**
- Transport i dostawa (150 zł)

## Generowanie Oferty PDF

### Zawartość PDF:

1. **Nagłówek**
   - Tytuł: "KOSZTORYS POSADZKI ŻYWICZNEJ"
   - Numer kosztorysu: `PZ-XXXXXX`
   - Data wygenerowania

2. **Dane Pomieszczenia**
   - Typ pomieszczenia (garaż/piwnica lub mieszkanie/dom)
   - Stan podłoża (jeśli garaż/piwnica)
   - Wymiary (długość x szerokość)
   - Powierzchnia (m²)
   - Obwód (m)

3. **Specyfikacja Posadzki**
   - Rodzaj posadzki
   - Rodzaj powierzchni
   - Kolor RAL
   - Cena podstawowa

4. **Szczegółowa Kalkulacja**
   - Tabela z pozycjami:
     - Materiał podstawowy (posadzka + kolor)
     - Przygotowanie podłoża (jeśli płytki)
     - Wszystkie wybrane usługi
   - Dla każdej pozycji: ilość, jednostka, cena jednostkowa, wartość

5. **Podsumowanie**
   - Koszt całkowity
   - Koszt za m²

6. **Stopka**
   - Informacja o automatycznym wygenerowaniu
   - Uwaga o możliwości zmiany cen

## Wysyłanie Email

### Funkcjonalność:

1. Użytkownik podaje swój adres email
2. System generuje PDF z kosztorysem
3. Email jest wysyłany do:
   - Klienta (podany email)
   - Administratora (ADMIN_EMAIL z .env)

### Treść Email:

- Nagłówek: "Kosztorys Posadzki Żywicznej"
- Szczegóły zamówienia:
  - Numer kosztorysu
  - Data
  - Powierzchnia
  - Rodzaj powierzchni
  - Kolor
  - Koszt całkowity
- Podziękowanie za zainteresowanie
- Informacje kontaktowe:
  - Email: biuro@posadzkizywiczne.com
  - Telefon: +48 507 384 619
- Załącznik: PDF z kosztorysem

### Konfiguracja Email:

Wymagane zmienne środowiskowe w `.env`:

```env
EMAIL_USER=your-email@gmail.com
EMAIL_PASS=your-app-password-here
ADMIN_EMAIL=biuro@posadzkizywiczne.com
```

**Uwaga:** Dla Gmail należy użyć hasła aplikacji (App Password), nie zwykłego hasła do konta.

## Interfejs Użytkownika

### Pasek Postępu

Dynamiczny pasek pokazujący aktualny krok i postęp:

- **Dla Garaż/Piwnica (6 kroków):**
  1. Typ pomieszczenia
  2. Stan betonu
  3. Wymiary
  4. Rodzaj powierzchni
  5. Kolor
  6. Dodatki

- **Dla Mieszkanie/Dom (5 kroków):**
  1. Typ pomieszczenia
  2. Wymiary
  3. Rodzaj powierzchni
  4. Kolor
  5. Dodatki

### Interaktywne Elementy

- Każda karta ma animacje wejścia
- Aktywna karta jest podświetlona niebieską ramką
- Ukończone kroki mają zielony znacznik ✓
- Karty nieaktywne są wyszarzone z opacity 50%
- Hover effects na wszystkich interaktywnych elementach

### Responsywność

- Desktop: Layout 2-kolumnowy (opcje po lewej, podgląd po prawej)
- Mobile: Layout 1-kolumnowy (opcje powyżej, podgląd poniżej)
- Sticky buttons na mobile dla łatwego dostępu

### Podgląd

Prawa strona pokazuje:
- Zdjęcie wybranej posadzki
- Szczegóły wybranej konfiguracji
- Właściwości powierzchni
- Bieżący koszt całkowity i za m²

## Struktura Plików

```
components/blocks/kalkulator-posadzki.tsx  # Główny komponent kalkulatora
app/api/send-pdf/route.ts                  # API endpoint dla wysyłania email
app/kalkulator/page.tsx                    # Strona kalkulatora
public/images/                             # Zdjęcia usług:
  ├── gruntowanie.jpg
  ├── cokol.jpg
  ├── uszczelnienie.jpg
  ├── dylatacje.jpg
  ├── podklad.jpg
  ├── szlifowanie.jpg
  ├── naprawa.jpg
  ├── warstwa-ochronna.jpg
  ├── antypoślizgowa.jpg
  ├── transport.jpg
  ├── demontaz.jpg
  └── sprzatanie.jpg
```

## Wykorzystane Technologie

- **Next.js 15** - Framework React
- **TypeScript** - Bezpieczeństwo typów
- **Tailwind CSS** - Stylowanie
- **Radix UI** - Komponenty UI (Card, Button, Checkbox, Input, Label, etc.)
- **jsPDF** - Generowanie PDF
- **Nodemailer** - Wysyłanie email
- **Framer Motion** - Animacje
- **Canvas Confetti** - Efekt konfetti po wysłaniu

## Testowanie

### Lokalne Testowanie:

1. Zainstaluj zależności: `npm install`
2. Skonfiguruj `.env` z danymi email
3. Uruchom serwer dev: `npm run dev`
4. Otwórz: `http://localhost:3000/kalkulator`

### Weryfikacja Email:

1. Skonfiguruj EMAIL_USER, EMAIL_PASS, ADMIN_EMAIL w `.env`
2. Dla Gmail: włącz 2FA i wygeneruj App Password
3. Wypełnij kalkulator i wybierz "Wyślij kosztorys emailem"
4. Sprawdź oba skrzynki email (klienta i admina)

## Rozwiązywanie Problemów

### Email nie wysyła się:

- Sprawdź czy EMAIL_USER i EMAIL_PASS są poprawnie ustawione
- Dla Gmail: upewnij się że używasz App Password, nie zwykłego hasła
- Sprawdź logi serwera dla szczegółów błędu

### PDF się nie generuje:

- Sprawdź konsolę przeglądarki dla błędów JavaScript
- Upewnij się że wszystkie wymagane pola są wypełnione
- Zweryfikuj że powierzchnia > 0

### Obrazki się nie ładują:

- Sprawdź czy pliki istnieją w `public/images/`
- Zweryfikuj ścieżki w kodzie
- Sprawdź logi Next.js dla 404 errors

## Przyszłe Usprawnienia

- [ ] Dodać więcej kolorów RAL
- [ ] Umożliwić upload własnych zdjęć dla usług
- [ ] Dodać kalkulator dla balkonu/tarasu
- [ ] Integracja z systemem CRM
- [ ] Historia wygenerowanych kosztorysów
- [ ] Panel admina do zarządzania cenami
- [ ] Wielojęzyczność (PL/EN)
- [ ] Eksport do innych formatów (DOCX, Excel)

## Autor

Implementacja wykonana przez GitHub Copilot dla damianGG/posadzki-zywiczne
Data: 30 grudnia 2024

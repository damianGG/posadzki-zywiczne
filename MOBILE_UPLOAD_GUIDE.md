# Dodawanie Realizacji przez Telefon - Instrukcja

## Nowy sposób dodawania realizacji!

Teraz możesz łatwo dodawać nowe realizacje bezpośrednio z telefonu lub komputera przez przeglądarkę internetową. Nie musisz już korzystać z FTP, SSH ani edytować plików JSON ręcznie!

## Jak to działa?

### 1. Otwórz stronę administracyjną

Przejdź do strony: **https://posadzkizywiczne.com/admin/realizacje/dodaj**

### 2. Zaloguj się

Wprowadź hasło do panelu administracyjnego:
- Domyślne hasło: **posadzki2024**
- Hasło można zmienić w pliku `.env` przez zmienną `ADMIN_PASSWORD`

### 3. Wypełnij formularz

Formularz zawiera następujące sekcje:

#### Podstawowe informacje (wymagane):
- **Tytuł realizacji** - np. "Posadzka żywiczna w garażu - Warszawa"
- **Opis realizacji** - szczegółowy opis projektu (2-3 zdania)
- **Lokalizacja** - np. "Warszawa, Mokotów"
- **Powierzchnia** - np. "40 m²"
- **Kategoria** - wybierz z listy:
  - Domy i mieszkania
  - Balkony i tarasy
  - Garaże
  - Kuchnie
  - Pomieszczenia czyste
  - Schody
- **Typ projektu** - Indywidualna lub Komercyjna

#### Szczegóły techniczne (opcjonalne):
- **Technologia** - np. "Epoksyd z posypką kwarcową"
- **Kolor** - np. "Szary RAL 7037"
- **Czas realizacji** - np. "3 dni"

#### Zdjęcia (wymagane):
- Kliknij w pole "Dodaj zdjęcia"
- Wybierz jedno lub więcej zdjęć z telefonu/komputera
- **Pierwsze zdjęcie będzie zdjęciem głównym** (pokazywanym jako miniatura)
- Możesz dodać wiele zdjęć - zostaną dodane do galerii
- Przed wysłaniem możesz usunąć niepotrzebne zdjęcia klikając X

#### Dodatkowe informacje (opcjonalne):
- **Tagi** - oddzielone przecinkami, np. "garaż, epoksyd, antypoślizg"
- **Cechy/Zalety** - każda w nowej linii, np.:
  ```
  Wysoka odporność na ścieranie
  Łatwe utrzymanie czystości
  Estetyczny wygląd
  ```
- **Słowa kluczowe SEO** - każde w nowej linii, np.:
  ```
  posadzka żywiczna garaż
  epoksyd garaż Warszawa
  ```

#### Opinia klienta (opcjonalne):
- **Treść opinii** - co powiedział klient
- **Autor opinii** - np. "Pan Tomasz, Warszawa"

### 4. Wyślij formularz

Kliknij przycisk **"Dodaj Realizację"** na dole formularza.

System automatycznie:
1. Utworzy folder w odpowiedniej lokalizacji
2. Zapisze wszystkie zdjęcia
3. Wygeneruje plik `opis.json` z danymi
4. Uruchomi skaner, który zaktualizuje stronę
5. Realizacja będzie dostępna pod adresem `/realizacje/[nazwa-projektu]`

### 5. Gotowe!

Po pomyślnym dodaniu zobaczysz zielony komunikat: "Realizacja została pomyślnie dodana!"

## Zalety nowego systemu

✅ **Łatwe dodawanie z telefonu** - responsywny interfejs mobilny
✅ **Bez potrzeby dostępu FTP/SSH** - wszystko przez przeglądarkę
✅ **Podgląd zdjęć przed wysłaniem** - widzisz co dodajesz
✅ **Automatyczne przetwarzanie** - nie musisz ręcznie edytować JSON
✅ **Natychmiastowa publikacja** - realizacja pojawia się od razu na stronie

## Co się dzieje w tle?

System wykonuje następujące kroki:

1. **Tworzy folder** w `public/realizacje/[lokalizacja]-[slug]-[typ]/`
2. **Zapisuje zdjęcia** w tym folderze (pierwsze jako `0-glowne.jpg`)
3. **Generuje `opis.json`** z wszystkimi danymi z formularza
4. **Uruchamia skaner** który tworzy plik w `data/realizacje/[slug].json`
5. **Strona Next.js** automatycznie wyświetla nową realizację

## Rozwiązywanie problemów

### Błąd: "Tytuł i opis są wymagane"
- Upewnij się, że wypełniłeś pola tytuł i opis

### Błąd: "Dodaj co najmniej jedno zdjęcie"
- Musisz dodać przynajmniej jedno zdjęcie do realizacji

### Realizacja nie pojawia się na stronie
- Odśwież stronę (Ctrl+F5 lub Cmd+Shift+R)
- Sprawdź czy wypełniłeś wszystkie wymagane pola

## Porównanie ze starym systemem

### Stary system (lokalny skaner):
```bash
# Krok 1: Utwórz folder
mkdir public/realizacje/warszawa-mokotow-garaz

# Krok 2: Dodaj zdjęcia przez FTP
scp *.jpg server:/public/realizacje/warszawa-mokotow-garaz/

# Krok 3: Utwórz opis.json ręcznie
nano public/realizacje/warszawa-mokotow-garaz/opis.json

# Krok 4: Uruchom skaner przez SSH
ssh server "cd /app && npx tsx scripts/scan-realizacje.ts"
```

### Nowy system (webowy):
1. Otwórz stronę w przeglądarce
2. Wypełnij formularz
3. Kliknij "Dodaj Realizację"
4. Gotowe! ✨

## Wsparcie

Jeśli napotkasz problemy:
1. Sprawdź czy masz połączenie z internetem
2. Upewnij się, że wypełniłeś wszystkie wymagane pola
3. Sprawdź czy zdjęcia nie są zbyt duże (maksymalnie 10MB każde)

## Bezpieczeństwo

System jest zabezpieczony hasłem:
- Domyślne hasło: **posadzki2024**
- Hasło można zmienić przez zmienną środowiskową `ADMIN_PASSWORD` w pliku `.env`
- Sesja logowania jest zapisywana w przeglądarce (sessionStorage)
- Po zamknięciu przeglądarki trzeba zalogować się ponownie

### Zalecenia bezpieczeństwa:
1. **Zmień domyślne hasło** w pliku `.env`:
   ```
   ADMIN_PASSWORD=twoje_bezpieczne_haslo
   ```
2. Nie udostępniaj hasła osobom postronnym
3. Używaj silnego hasła (min. 12 znaków, litery, cyfry, znaki specjalne)
4. Regularnie zmieniaj hasło

W przyszłości można dodać:
- Logowanie przez email
- Wielopoziomowa autoryzacja
- Lista dozwolonych adresów IP
- Dwuskładnikowe uwierzytelnianie (2FA)

## Kod źródłowy

- Formularz: `app/admin/realizacje/dodaj/page.tsx`
- API endpoint: `app/api/admin/upload-realizacja/route.ts`
- Skaner: `lib/local-realizacje-scanner.ts`

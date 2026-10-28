# Publikowanie pełnych realizacji z ChatGPT

## Co działa w obecnym połączeniu

Projekt ma połączony GitHub oraz automatyczny deploy Vercel. Nowe realizacje
można dodać w rozmowie przez commit do `data/chatgpt-realizacje.json`, a pliki
źródłowe bez zmniejszania rozdzielczości umieścić w
`public/chatgpt-realizacje/<slug>/` przez GitHub (blob binarny/base64).
Zmiany trafiają do pull requestu do sprawdzenia i po scaleniu automatycznie do:

- `/realizacje` — lista projektów i filtry,
- `/realizacje/<slug>` — pełna, indywidualna podstrona z galerią,
- `/sitemap.xml` — mapa witryny dla Google,
- `getAllRealizacje()` — źródło kart projektu na innych stronach.

**Każdy wpis w JSON jest prawdziwą inwestycją, a nie osobnym ujęciem zdjęciowym.**
Kilka zdjęć jednego obiektu należy zapisać pod jednym slugiem jako
`images.main` i `images.gallery`.

## Gdy użytkownik wysyła zdjęcia w rozmowie

1. Poproś o oryginalne pliki (JPG/PNG/HEIC) jako załączniki — najlepiej
   przesłane jako **pliki**, nie skompresowane zrzuty ekranu.
2. Sprawdź rozdzielczość i czy obrazy przedstawiają tę samą inwestycję.
   Nigdy nie obniżaj rozdzielczości *źródeł* z powodu rozmiaru narzędzia.
3. Zbierz dane, których nie ma w zdjęciach: rzeczywista miejscowość,
   rodzaj pomieszczenia/posadzki, system i powierzchnia jeśli są znane.
   Można pominąć nieznane metraże, systemy i daty. Nie zakładaj na podstawie
   wyglądu fotografii, że realizacja pochodzi z danego miasta.
4. Przygotuj unikalny tytuł, lead, opis wykonania (bez zmyślonych etapów),
   praktyczne ograniczenia systemu, FAQ, meta opis, słowa kluczowe oraz
   dokładne teksty alt obrazów.
5. Zapisz zdjęcia w pełnej rozdzielczości jako oryginalne binarne pliki w
   `public/chatgpt-realizacje/<slug>/<nazwa>.jpg`, albo użyj oryginalnych
   `https://res.cloudinary.com/<cloud>/image/upload/...` linków.
   Nie korzystaj z adresów miniaturek/wariantów `w_600`, `c_fill`,
   `q_40` jako źródeł nowej realizacji.
6. Przy zdjęciach z publicznych inwestycji upewnij się, że użytkownik ma
   prawo publikacji, a pliki nie ujawniają danych klientów (np. EXIF GPS,
   tablice rejestracyjne, twarze i dokumenty). Metadane GPS usuń
   bez rekompresowania pikseli, zanim plik znajdzie się w publicznym repo.
7. Uzupełnij `data/chatgpt-realizacje.json` i sprawdź build Vercel.
   Nie scalaj PR ze zdjęciami/treściami bez weryfikacji poprawności.
8. W produkcji `prebuild` automatycznie przesyła oryginały z repo do
   Cloudinary bez zmniejszania rozdzielczości i generuje lokalną mapę
   adresów. Nazwa zasobu jest oparta na hashu pliku: wgranie
   identycznego zdjęcia jest idempotentne, zmiana źródła tworzy nowy zasób.
   W Preview pliki pozostają lokalne (brak zapisów do Cloudinary).
9. Po wdrożeniu sprawdź HTTP 200, canonical, obecność w sitemapie
   i czy każda fotografia ładuje się z odpowiednią ostrością.

## Format danych

Wpisy w `data/chatgpt-realizacje.json` używają interfejsu
`Realizacja` w `types/realizacje.ts`. Przykładowa **struktura**
do uzupełnienia autentycznymi danymi:

```json
{
  "slug": "przykladowy-slug-do-zastapienia",
  "title": "TYTUŁ OPARTY NA PRAWDZIWEJ REALIZACJI",
  "h1": "Dokładny nagłówek opisujący wykonane prace",
  "description": "Autentyczny opis prac o długości co najmniej 40 znaków.",
  "category": "schody",
  "location": "PRAWDZIWA MIEJSCOWOŚĆ",
  "date": "2026-10-28T00:00:00.000Z",
  "tags": ["schody", "kamienny dywan"],
  "images": {
    "main": "/chatgpt-realizacje/slug/oryginal-01.jpg",
    "gallery": [
      {
        "url": "/chatgpt-realizacje/slug/oryginal-02.jpg",
        "alt": "Opis rzeczywistego drugiego kadru"
      }
    ]
  },
  "details": {
    "surface": "",
    "system": "",
    "color": "",
    "duration": ""
  },
  "features": ["Potwierdzona cecha tej realizacji"],
  "keywords": ["kamienny dywan na schodach"],
  "content": {
    "intro": "Oryginalny opis konkretnej inwestycji.",
    "whenToUse": "Wyjaśnienie zastosowania systemu.",
    "advantages": "Zalety w kontekście tego zastosowania.",
    "disadvantages": "Uczciwe ograniczenia i konserwacja.",
    "execution": "Tylko faktycznie wykonane i potwierdzone etapy.",
    "durability": "Warunki eksploatacji wynikające z systemu.",
    "pricing": "Czynniki wpływające na wycenę bez zmyślania kwot.",
    "forWho": "Dla kogo ten system będzie odpowiedni.",
    "localService": "Informacje o rzeczywistym obszarze obsługi."
  },
  "faq": [
    {
      "question": "Czy kamienny dywan można zastosować na takich schodach?",
      "answer": "Odpowiedź zależna od rodzaju podłoża i systemu."
    }
  ]
}
```

To jest **wzorzec**, nie publikować fikcyjnego wpisu z tego przykładu.

## Cloudinary: oryginały i warianty

W aplikacji istnieje upload bezpośrednio do Cloudinary
(`components/admin/cloudinary-upload-widget.tsx`) oraz optymalizacja
(`lib/cloudinary-loader.ts`). Uploader nie powinien mieć ustawionych
`maxImageWidth` i `maxImageHeight`, gdyż Cloudinary Upload Widget w takim
wypadku pomniejsza źródło **przed przesłaniem**.

- Cloudinary przechowuje źródłową jakość tylko, jeżeli upload preset **nie ma
  incoming transformations**, które zmniejszają lub kompresują obraz.
- Pełny oryginał powinien być w Cloudinary jako zasób źródłowy (bez wymuszania
  `format` podczas uploadu przez serwer).
- Miniatury mogą używać `f_auto`, `q_auto:good` i odpowiednich rozmiarów.
- Widok powiększenia powinien używać `c_limit` albo naturalnych proporcji,
  a nie `c_fill` na telefonie; dostęp do oryginału zachowujemy osobno.
- Upload ma limity narzucone przez plan i konfigurację Cloudinary. Błąd limitu
  należy pokazać, a nie po cichu pomniejszać źródło.

**Ścieżka bez osobnej wtyczki Cloudinary:** ChatGPT zapisuje oryginalne
zdjęcia i pełny wpis przez podłączony GitHub. Na produkcyjnym buildzie
(`VERCEL_ENV=production`) skrypt
`scripts/sync-chatgpt-cloudinary.mjs` wysyła źródłowe pliki do Cloudinary,
wykorzystując istniejące sekretne zmienne środowiskowe Vercel. Jeśli upload
zawiedzie, deployment kończy się błędem zamiast publikować brakujące obrazy.
Nie przekazujemy `CLOUDINARY_API_SECRET` do rozmowy.

Wersje testowe GitHub/Vercel pokazują pełne pliki lokalne. Dopiero po
zatwierdzeniu PR i scaleniu do `main` produkcja tworzy zasoby Cloudinary.
Oryginały pozostają też jako archiwum w GitHub, co może zwiększyć rozmiar repo.
W przyszłości można zastąpić GitHub pośredniczący dedykowanym MCP lub
autoryzowanym bezpośrednim uploadem z ChatGPT.

**Ograniczenia:** konto Cloudinary może mieć limit MB na pojedynczy plik,
a Upload Preset może mieć przychodzące transformacje. Z tego powodu należy
zweryfikować faktyczne wymiary i rozmiary plików po pierwszym wdrożeniu.

## Bezpieczeństwo

Nie używaj obecnych publicznie dostępnych tras
`/api/admin/create-draft-realizacja`, `/api/admin/add-images-to-realizacja`
i `/api/admin/create-realizacja-cloudinary` jako API do publikowania przez
ChatGPT, dopóki nie zostaną zabezpieczone prawdziwą autoryzacją serwera.
Połączony GitHub i recenzowany PR stanowią kontrolowany sposób zapisu.

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
5. Zapisz zdjęcia w pełnej rozdzielczości w repo lub użyj oryginalnych
   `https://res.cloudinary.com/<cloud>/image/upload/...` linków.
   Nie korzystaj z adresów miniaturek/wariantów `w_600`, `c_fill`,
   `q_40` jako źródeł nowej realizacji.
6. Uzupełnij `data/chatgpt-realizacje.json` i sprawdź build Vercel.
   Nie scalaj PR ze zdjęciami/treściami bez weryfikacji poprawności.
7. Po wdrożeniu sprawdź HTTP 200, canonical, obecność w sitemapie
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

**Granica integracji:** aktualnie ChatGPT nie ma zainstalowanego narzędzia
z prawem zapisu do konta Cloudinary. Można przez GitHub bezpośrednio
publikować realizacje z wysokiej jakości załączników w repo lub z
już przesłanych do Cloudinary oryginalnych adresów URL. Aby przesyłanie
*bezpośrednio z rozmowy do Cloudinary* było całkowicie automatyczne,
potrzebny jest autoryzowany kanał uploadu (np. dedykowana aplikacja
z bezpiecznym zapisem do Cloudinary). Nie wolno udostępniać kluczy
`CLOUDINARY_API_SECRET` w rozmowie ani odblokowywać publicznego
endpointu publikowania bez uwierzytelnienia.

## Bezpieczeństwo

Nie używaj obecnych publicznie dostępnych tras
`/api/admin/create-draft-realizacja`, `/api/admin/add-images-to-realizacja`
i `/api/admin/create-realizacja-cloudinary` jako API do publikowania przez
ChatGPT, dopóki nie zostaną zabezpieczone prawdziwą autoryzacją serwera.
Połączony GitHub i recenzowany PR stanowią kontrolowany sposób zapisu.

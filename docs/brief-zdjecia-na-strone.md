# Plan zdjęć do stron usługowych — PR wizualny

## Zasady publikacji

To jest **szkic do akceptacji**, nie komplet materiałów do publikacji. Widoczne prostokąty z ikoną aparatu to **brakujące ujęcia**, celowo odróżnione od prawdziwych zdjęć firmy. Nie zastępujemy ich stockiem ani zdjęciem z innej inwestycji przedstawianym jako dowód.

- Źródło: zdjęcia własnych realizacji, najlepiej w oryginalnej rozdzielczości i po zgodzie właściciela obiektu; bez danych osobowych, tablic i identyfikatorów.
- Wzór „przed i po”: ten sam garaż, ta sama perspektywa, podobna ogniskowa, bez upiększającej zmiany ekspozycji i bez manipulacji materiałem.
- Każde zdjęcie ma mówić o **konkretnym detalu**: cokołach, odprowadzeniu wody, pęknięciach, przygotowaniu podłoża, strukturze płatków, uziemieniu ESD.
- Zdjęcia dostępne już w bazie/galerii są podpinane automatycznie tam, gdzie pasują do kategorii. Do innych slotów zdjęcia należy dodać dopiero po weryfikacji, co faktycznie pokazują.
- Uzupełniając `src`, podaj rzeczywisty opis `alt` (bez nadużywania słów kluczowych). Preferuj oryginał w Cloudinary lub zoptymalizowane pliki lokalne z `next/image`.

## Priorytet 1 — /garaze

| Miejsce | Dokładnie co sfotografować | Kadr |
| --- | --- | --- |
| „Przed” | Surowy/spękany beton garażu przed pracami, z widoczną całą podłogą | Poziomo 4:3, ten sam punkt co „Po” |
| „Po” | Ten sam garaż po wykonaniu żywicy i cokołów, ten sam punkt widzenia | Poziomo 4:3, para z poprzednim |
| Proces 01 | Zbliżenie rysy, dylatacji lub pomiaru podłoża — bez sugerowania konkretnego wyniku | Poziomo 4:3 |
| Proces 02 | Ręce operatora i szlifierka na betonie albo poprawnie wykonane gruntowanie | Poziomo 4:3 |
| Proces 03 | Gotowa powierzchnia z widocznym cokołem i wykończeniem przy ścianie | Poziomo 4:3 |
| Technologia 01 | Makro naprawionej rysy lub przygotowanego podłoża | Poziomo 16:9 |
| Technologia 02 | Makro faktury płatków albo kwarcu; alternatywnie rzeczywisty przekrój systemu z etykietami | Poziomo 16:9 |

**Dodatkowe zdjęcia:** obróbka kratki ściekowej, cokoły, próg garażowy, detal narożnika, antypoślizg. Nie należy używać dowolnego zdjęcia z galerii jako dowodu na opisany etap pracy.

## Priorytet 2 — strona główna

- **Mobile hero**: autentyczna fotografia wykonanego garażu (istniejący zasób).
- **Karty usług**: zdjęcie dokładnie z właściwej kategorii (gdy jest w portfolio); w przeciwnym wypadku slot z opisem brakującego ujęcia.
- **Kamienny dywan**: rzeczywista fotografia schodów + zbliżenie faktury kruszywa (istniejące materiały).

Brakujące kadry dla kart: parking z widoczną rampą/dylatacją, hala z ruchem wózków, strefa ESD, strefa gastronomiczna, wnętrze mieszkalne. Nie mylić garażu domowego z parkingiem przemysłowym.

## Priorytet 3 — /parkingi, /hale-magazyny, /gastronomia, /pomieszczenia-czyste i /posadzki-elektrostatyczne

- Parking: rampa lub połączenie dylatacyjne w rzeczywistym parkingu.
- Hala: szeroka perspektywa strefy pracy + detal powierzchni przy kołach wózka.
- Gastronomia: cokoły higieniczne i odpływ w kuchni produkcyjnej.
- Pomieszczenie czyste: bezspoinowa nawierzchnia i połączenie posadzka–ściana.
- ESD: realna posadzka w hali, **rzeczywista** siatka przewodząca lub taśmy/uziemienie oraz pomiar po wykonaniu. Nie umieszczać fikcyjnych wyników ani deklaracji zgodności na zdjęciach.

## Kryteria akceptacji PR

1. Wszystkie kadry responsywne, z czytelnymi etykietami, bez CLS (stałe proporcje).
2. Realne zdjęcia renderowane przez `next/image`, z opisowym `alt`; dekoracyjne sloty odróżnione od realnych zdjęć.
3. PR otwarty jako **Draft**. Przed sca leniem do `main` uzupełnić brakujące ujęcia, usunąć puste sloty lub uzyskać zgodę na ich ekspozycję.
4. Sprawdzić podgląd 375 px / 768 px / 1440 px, dostępność, `pnpm lint` i `pnpm build`.

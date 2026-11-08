# Opinie Google Maps – wersja bez API

Sekcja na stronie głównej, `/garaze` oraz `/posadzki-zywiczne-na-balkony` korzysta z ręcznie przepisanych **8 ocen Google** ze zrzutów ekranu przekazanych przez właściciela 8 listopada 2026 roku.

## Co jest wyświetlane

- Autentyczne widoczne teksty i dane z przesłanych zrzutów, bez dopisywania brakujących fragmentów.
- Oceny 5/5, nazwiska autorów i względne daty ze zrzutów.
- Karuzela kart, rozwijanie długich opinii, odnośniki do wizytówki Google Maps.
- Średnia 5,0 wyłącznie z **8 pokazanych ocen** – nie jest przedstawiana jako oficjalna średnia całego profilu.
- Recenzja Karola Kuliga jest oznaczona jako fragment, ponieważ jej dalsza część była ukryta.
- Oceny Kacpra Zastawnika i Bartosza Jesionowskiego nie zawierały tekstu.

Wszystkie linki prowadzą do wizytówki podanej przez właściciela:
https://share.google/fiwrzUXA1Fls64tj0

Uwaga: podany krótki URL nie został automatycznie potwierdzony, dlatego przed mergem sprawdź go w przeglądarce.

## Utrzymanie

- **Nie ma integracji z API**, żadnych kluczy, kosztów Places API ani zależności od Google Cloud.
- Treść nie aktualizuje się automatycznie; aby ją zmienić, edytuj tablicę `googleReviews` w `lib/google-reviews.ts`.
- W miarę upływu czasu względne daty typu „rok temu” stają się nieaktualne. Komponent jawnie informuje, że daty pochodzą ze zrzutów z 8.11.2026.
- Nie dodawaj do markup danych typu AggregateRating / Review do samodzielnie wystawianych przez firmę opinii – Google zwykle nie kwalifikuje takich gwiazdek do wyników rozszerzonych.
- Jeżeli w przyszłości zostanie uruchomione Google API, należy zastąpić dane statyczne osobną integracją uwzględniającą regulamin Google.

## Kontrola po wdrożeniu

1. Sprawdź widok mobilny i desktopowy, przewijanie slidera i „Czytaj więcej”.
2. Kliknij „Zobacz wszystkie opinie w Google Maps” i sprawdź, czy prowadzi do właściwej firmy.
3. Porównaj treści każdej karty ze zrzutami; brakujących fragmentów nie uzupełniaj domysłami.

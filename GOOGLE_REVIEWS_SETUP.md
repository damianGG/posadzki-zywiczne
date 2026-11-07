# Opinie Google Maps – konfiguracja

Komponent jest używany na stronie głównej, /garaze oraz /posadzki-zywiczne-na-balkony.

## Uruchomienie

1. W Google Cloud Console włącz Places API (New) i rozliczenia dla projektu.
2. Utwórz oddzielny klucz API do serwerowych zapytań Places; ogranicz go do Places API (New), ustaw limity i alerty kosztowe.
3. Ustal dokładny Place ID profilu firmy w Google Maps, w którym klienci wystawiają opinie.
4. W Vercel → Project → Settings → Environment Variables ustaw:
   - GOOGLE_PLACES_API_KEY: klucz serwerowy Places API.
   - GOOGLE_PLACE_ID: identyfikator profilu firmy z Google Maps.
5. Wykonaj ponowny deployment i upewnij się, że opinie dotyczą właściwego profilu.

Klucza nie wolno umieszczać w repozytorium ani w zmiennej NEXT_PUBLIC_. Istniejący NEXT_PUBLIC_GOOGLE_API_KEY jest używany w innym celu.

## Zasady działania

- Places API (New) zwraca maksymalnie 5 opinii (według trafności Google). Link prowadzi do pozostałych recenzji w Maps.
- Teksty opinii korzystają z płatnej kategorii Place Details Enterprise + Atmosphere. Sprawdź aktualną taryfę, ustaw budżet i limity.
- Nie zapisujemy ani nie buforujemy danych Google; serwer używa cache: no-store, a strony z opiniami są dynamiczne.
- Widoczni są autorzy, odnośniki do opinii i atrybucje dostawców. Jeżeli Google przetłumaczył opinię, komponent to sygnalizuje.
- W razie braku konfiguracji lub błędu API nie pojawia się wymyślona ocena ani przykładowe recenzje – tylko link do Google Maps.
- Przed publikacją zweryfikuj obowiązkową politykę prywatności, regulamin i zgodność z warunkami Google Maps Platform.

Dokumentacja: https://developers.google.com/maps/documentation/places/web-service/place-details
Zasady: https://developers.google.com/maps/documentation/places/web-service/policies
Place ID: https://developers.google.com/maps/documentation/places/web-service/place-id

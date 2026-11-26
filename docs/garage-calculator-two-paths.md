# Garaż: cena bez e-maila, wykonanie lub DIY
- /zamow?miejsce=garaz przekierowuje do istniejącego kalkulatora, także stare linki z wyborem wyglądu i metrażu.
- Wybór garażu z ogólnego formularza przechodzi do kalkulatora, nie wysyła zapytania.
- Kalkulator nadal używa aktualnego cennika Neon i wspólnego calculateFloorEstimate; bez nowych stawek. Po pełnej wycenie (w tym obwód, gdy wymagany) pokazuje wykonanie i zestaw DIY, cenę wykonania oraz możliwość pobrania PDF lokalnie. Nie pokazuje akcji e-mail w ścieżce garaż/piwnica. Pozostałe typy usług pozostają bez zmian.
- Sklep /sklep jest nadal zablokowany middleware, a dokumentacja EPOVIO wskazuje brak zatwierdzonych produktów i cen. Nie udajemy sprzedaży online. CTA DIY prowadzi do telefonu, aby uzgodnić materiały, cenę, dostępność i wsparcie. Nie utożsamiamy ceny wykonania z materiałem.
- Przed uruchomieniem zakupów: zatwierdzony katalog produktów i cen, instrukcje/SDS, integracja zestawu i koszyka, warunki wsparcia technicznego. Nie włączamy sklepu tym PR-em.
- Testy Preview: /zamow?miejsce=garaz&wyglad=platki&metraz=45 -> kalkulator; wybór z ogólnego formularza; 320/390/1280 px; zmiana wykończenia; cena z tymi samymi danymi co poprzednio; brak obwodu, brak cennika, PDF bez e-mail; kliknięcia obu ścieżek. Nie wysyłać testowych leadów ani nie uruchamiać płatności.

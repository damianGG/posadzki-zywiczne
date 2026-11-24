# P0 — ścieżka zakupu

Integracja wybranych zmian #108 i #109. Zdjęcia i linki usług z #108 pozostają, formularz /zamow zastępuje mailto w wyborze garażu. Kalkulator Neon pozostaje jedynym źródłem aktualnych cen; przykład 45 m² / 7500 zł netto jest historyczny. Brak ceny dla pozostałych usług oznacza indywidualną wycenę, nie fikcyjne widełki.

## Odbiór przed merge
- Build, TypeScript i lint; sprawdzić środowisko Neon i SMTP na preview.
- 375/768/1440 px: hero, menu, sticky nawigacja garażu, wszystkie linki i zdjęcia; brak poziomego przewijania poza celowo przewijalną nawigacją.
- /garaze → wykończenie → /zamow → kalkulator → powrót z metrażem i wcześniejszym wyborem. Nie przenosimy konfiguracji cenowej 1:1 — kalkulator pozostaje odrębnym narzędziem.
- Formularz: cztery wymagane pola, opcjonalne zdjęcia JPEG/PNG/WebP (do 3 szt. i 3 MB łącznie), walidacja, błędy wysyłki i fallback mailto. Rzeczywisty test SMTP na kontrolowanym adresie, bez wysyłki do klienta.
- SEO: wszystkie dotychczasowe linki usług na stronie głównej, canonical /garaze, sitemap /zamow, brak zmian adresów.
- Przed/po, makro kwarcu i zdjęcia przemysłowe czekają na potwierdzone fotografie. Nie publikować zastępników.
- Trwałe zapisy leadów, rozproszony rate limiting i pełne mapowanie kalkulatora pozostają osobnym zadaniem przed zwiększeniem ruchu.

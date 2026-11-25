# Standard UX — posadzkizywiczne.com
## Źródła i sposób wykorzystania
- Nielsen Norman Group, [10 Usability Heuristics](https://www.nngroup.com/articles/ten-usability-heuristics/) oraz [Mobile navigation discoverability](https://www.nngroup.com/articles/find-navigation-mobile-even-hamburger/): język klienta, widoczność wyboru, kontrola i informacja zwrotna.
- Baymard, [Form Design](https://baymard.com/blog/form-design), [Image resolution and zoom](https://baymard.com/research-articles/ensure-sufficient-image-resolution-and-zoom): stałe etykiety, pomoc przy polach, opcjonalność, zdjęcia o użytecznej rozdzielczości. Badania e-commerce stosujemy jako hipotezy dla usług, nie bezpośredni dowód konwersji.
- GOV.UK Design System, [Error message](https://design-system.service.gov.uk/components/error-message/): błędy przy polach i podsumowanie.
- W3C [WCAG 2.2](https://www.w3.org/TR/WCAG22/): kontrast, fokus, klawiatura, rozmiar celów. Nasz cel dla istotnych kontrolek 44 CSS px; minimum AA zależy od kryterium 2.5.8 i wyjątków.
- web.dev [Core Web Vitals](https://web.dev/articles/defining-core-web-vitals-thresholds): na 75. percentylu LCP <=2,5 s, INP <=200 ms, CLS <=0,1. Cele, nie wynik pomiaru.
- Steve Krug, Don't Make Me Think; Don Norman, The Design of Everyday Things; Marcus Sheridan, They Ask, You Answer (Big Five: cena, problemy, porównania, opinie, najlepsze rozwiązania). Korzystamy z dostępnych opisów i fragmentów, nie deklarujemy lektury pełnych książek.
## Standard komponentów
- Jedno główne działanie w danej sekcji; tekst linku mówi, co klient otrzyma. Cena przed kontaktem, bez sztucznych liczników i nacisku.
- Każda karta: nazwa, zdjęcie lub brak zdjęcia, opis, jawne oznaczenie materiałów poglądowych, widoczny link.
- Mobile: ważne sekcje dostępne bez przesuwania ukrytej listy, jeden sticky header. Desktop: indeks sekcji sticky. Test reflow 320 px.
- Formularz: cztery wymagane pola zgodnie z obecnym procesem firmy, walidacja przy polach i podsumowanie, zachowanie danych przy cofnięciu, brak zbędnych wymagań technicznych; brak wysyłki wielokrotnej podczas oczekiwania.
- Zdjęcia: możliwość powiększenia oraz otwarcia źródła, nie zmieniamy rzeczywistych realizacji.
- Neutralna paleta i #00D664 jako akcent; ciemny tekst na jaskrawej zieleni.
## Kryteria akceptacji przed merge
1. Zadania: znaleźć cenę garażu, znaleźć zdjęcie balkonu, wejść do usług przemysłowych, wybrać ESD/cleanroom, przejść do wyceny i wrócić, skorygować błędny telefon, usunąć zdjęcie, ponowić wysyłkę po błędzie.
2. Sprawdzić 320/375/390/768/1280 px, klawiaturę, fokus po zmianie kroku, czytnik ekranu, kontrast, długie nazwy zdjęć, 3 MB limit, SMTP, linki do kalkulatora, sticky desktop.
3. Ustalić baseline i porównanie GA4/Clarity: wejście w usługę, kalkulator, rozpoczęcie wyceny, przejścia kroków, potwierdzona wysyłka. Bez przesyłania danych formularza do analityki. Nie konfigurujemy zdarzeń w tym commicie.
4. Testy z 5 użytkownikami jako badanie jakościowe pierwszej iteracji, nie dowód statystyczny. Weryfikować realne leady i nie obiecywać wzrostu konwersji przed pomiarem.

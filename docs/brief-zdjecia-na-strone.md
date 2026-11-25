# Zdjęcia, które odpowiadają na pytania klienta

Aktualizacja PR #108 — 24.11.2026. Kierunek: Marcus Sheridan, „Co chce wiedzieć klient?” / They Ask, You Answer. Cena, obawy, porównania, opinie i wybór rozwiązania muszą być powiązane z konkretnymi dowodami.

## Wprowadzone w PR

- Jedno duże zdjęcie garażu 30 m² w hero strony głównej, również na telefonie, z podpisem i linkiem do właściwej realizacji.
- Karty usług ze zdjęciami z właściwego zastosowania. Garaż, balkon i kamienny dywan mają stałe, sprawdzone zasoby niezależne od CMS. Pozostałe usługi zachowują opis i link, gdy brakuje potwierdzonej fotografii.
- Trzy odpowiedzi ze zdjęciami na stronie głównej: cokół, połysk tarasu, faktura kamiennego dywanu. W odpowiedzi także ograniczenia rozwiązania.
- Porównanie garażu z płatkami i jednolitego wykończenia na prawdziwych zdjęciach. Kwarc opisany osobno, bez zastępowania go zdjęciem płatków. Kolory RAL są poglądowe i nie zmieniają zdjęcia.
- Powiększenie pełnego kadru w oknie z obsługą klawiatury, Escape, zamknięciem po polsku i przywróceniem fokusu.
- Trzy zdjęcia detali tego samego garażu 100 m² w Przemyślu: cokół, przejście, odbicia światła. Każde odpowiada na osobne pytanie.
- Cena 7500 zł netto dotyczy osobnego garażu 45 m². Zdjęć 30 i 100 m² nie podpisujemy tą ceną. Zachowujemy potwierdzony zakres: przygotowanie, szlifowanie, szpachlowanie, gruntowanie, kratka, warstwa zasadnicza, płatki lub kwarc, cokoły i uszczelnienie.
- Usunięte publiczne puste sloty, niedokończone „przed/po” i techniczne briefy. Brak materiału nie blokuje zdjęć już dostępnych. Usługi przemysłowe i ESD zachowują wcześniejszy układ do otrzymania odpowiednich materiałów.

## Lista zdjęć do uzupełnienia

| Pytanie klienta | Potrzebne zdjęcie | Co dopisać po potwierdzeniu |
| --- | --- | --- |
| Czy da się naprawić mój stary beton? | Para przed i po z tego samego garażu, podobna perspektywa | Stan wyjściowy, naprawy, czas i metraż |
| Co dokładnie dostaję w cenie? | Garaż 45 m² za 7500 zł netto oraz detal kratki i cokołu | Data i potwierdzony zakres tej realizacji |
| Czym kwarc różni się od płatków? | Makro prawdziwego kwarcu, płatków i gładkiej powierzchni | Układ warstw, czyszczenie, udokumentowana klasa antypoślizgowości |
| Co robicie przed żywicą? | Szlifowanie, naprawa rysy, gruntowanie z jednej inwestycji | Faktycznie wykonany etap, bez dopisywania parametrów |
| Jak wygląda odpływ i dylatacja? | Zbliżenia wykonanej kratki, progu i dylatacji | Zakres w ofercie, sposób użytkowania |
| Czy wytrzyma w moim zakładzie? | Własne zdjęcia hali, parkingu, gastronomii, pomieszczenia czystego | Typ obiektu i system potwierdzony dokumentacją |
| Jak sprawdzacie ESD? | Siatka/taśma, uziemienie, pomiar z tej samej inwestycji | Wynik wyłącznie z protokołu i warunki badania |

Z każdego zlecenia zbieramy: szeroki kadr, fakturę, cokół, odpływ/próg, zdjęcie stanu przed pracami i 1–2 etapy. Film 30–60 sekund może pokazać powierzchnię z poziomu oczu i przejście do detalu. Nie wymyślamy dat, cen, materiałów ani lokalizacji.

## Zasady zdjęć

- Oryginalne zdjęcia wykonawcy. Bez stocku i generowanych ilustracji oznaczonych jako realizacje.
- „Przed i po” tylko z tego samego obiektu. Do czasu dostarczenia pary sekcja jest ukryta.
- Opis alt mówi, co widać. Fotografia nie potwierdza parametrów, np. antypoślizgowości, grubości lub odporności ESD.
- Cloudinary i next/image, responsywne sizes, stałe proporcje, lazy loading poniżej hero. Duży kadr ładowany po otwarciu podglądu.
- Podpisu z ceną nie łączymy z fotografią innego zlecenia.

## Powiązanie z PR #109

#108 jest samodzielnym PR zdjęciowym, opartym na main. Nie zawiera API formularza ani /zamow. CTA wykończeń otwiera istniejący kanał e-mail z nazwą wykończenia. Strona jasno mówi o otwarciu poczty i ręcznym dołączeniu zdjęć.

#109 nadal zawiera docelową trzyetapową wycenę. Przed jego scaleniem trzeba rozwiązać nakładające się zmiany w app/page.tsx oraz komponencie wykończeń garażu: zachować zdjęcia, powiększenie, uczciwe porównanie i odpowiedzi z #108, a akcje wyceny podłączyć do /zamow. Nie przywracać pustych slotów ani schematycznych tekstur. W wycenie zachować wybrane zdjęcie/wykończenie; nie dodawać niepotwierdzonych deklaracji „nie jest śliskie”.

## Odbiór

- Sprawdzić / i /garaze w szerokościach 375, 768, 1440 px.
- Każde zdjęcie ma się ładować, z zachowaniem podpisu i właściwego zakresu realizacji.
- Powiększenie: klawiatura, Escape, zamknięcie i przywrócenie fokusu.
- Linki sekcji i ofert, treść mailto, brak pustych sekcji i poziomego przewijania.
- Lint zmienionych komponentów i build. Produkcyjna publikacja dopiero po merge; preview nie jest publikacją na domenie.

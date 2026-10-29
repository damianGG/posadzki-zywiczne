export type CitySlug = "rzeszow" | "krakow" | "lublin" | "warszawa" | "katowice";

type LocalFaq = { question: string; answer: string };
type LocalSection = { title: string; paragraphs: string[] };

export interface LocalServicePage {
  slug: CitySlug;
  city: string;
  cityLocative: string;
  title: string;
  description: string;
  lead: string;
  localContext: string;
  sections: LocalSection[];
  faq: LocalFaq[];
}

export const localServicePages: Record<CitySlug, LocalServicePage> = {
  rzeszow: {
    slug: "rzeszow",
    city: "Rzeszów",
    cityLocative: "w Rzeszowie",
    title: "Posadzki żywiczne Rzeszów | Wykonanie i wycena",
    description: "Posadzki żywiczne w Rzeszowie: garaże, domy, balkony i obiekty usługowe. Sprawdź lokalne realizacje, dobór systemu i zamów wycenę.",
    lead: "Wykonujemy posadzki żywiczne do garaży, domów i obiektów użytkowych na terenie Rzeszowa oraz okolic. Wyceniamy konkretny system po analizie podłoża, przeznaczenia i zakresu prac.",
    localContext: "W Rzeszowie trafiają do nas zarówno zapytania o nowe garaże przy domach jednorodzinnych, jak i modernizacje użytkowanych już powierzchni. W nowym betonie sprawdzamy stan i wilgotność, a podczas renowacji również stare powłoki, zabrudzenia i dylatacje.",
    sections: [
      {
        title: "Garaże w Rzeszowie – od stanu betonu do warstwy użytkowej",
        paragraphs: [
          "W garażach najczęściej rozpatrujemy systemy epoksydowe z odpowiednio dobranym gruntem oraz warstwą wykończeniową. Przy intensywnym użytkowaniu liczą się ścieranie, kontakt z wodą, olejem i solą drogową. Wybór wykończenia gładkiego, kwarcowego lub z płatkami wpływa nie tylko na wygląd, ale także na czyszczenie.",
          "Kluczowe jest mechaniczne przygotowanie betonu oraz właściwe rozwiązanie rys, dylatacji i przejść przy bramie. Sama nazwa żywicy nie określa parametrów całej posadzki.",
        ],
      },
      {
        title: "Pomieszczenia techniczne i powierzchnie usługowe",
        paragraphs: [
          "W kotłowniach, pomieszczeniach gospodarczych i obiektach usługowych dobieramy system do obciążeń, chemii użytkowej i wymaganej łatwości mycia. Nie obiecujemy jednego rozwiązania dla każdego zastosowania: najpierw ustalamy warunki pracy nawierzchni i parametry produktu.",
        ],
      },
      {
        title: "Balkony i tarasy – sprawdzenie hydroizolacji przed remontem",
        paragraphs: [
          "Przy pracach na zewnątrz oceniamy spadki, szczelność warstw pod posadzką, detale przy drzwiach oraz wpływ temperatury i UV. Jeśli pod płytkami zalega wilgoć, sama nowa powłoka żywiczna nie usuwa przyczyny problemu. Zakres napraw ustalamy po oględzinach.",
        ],
      },
    ],
    faq: [
      {
        question: "Ile kosztuje wykonanie posadzki żywicznej w garażu w Rzeszowie?",
        answer: "Koszt zależy przede wszystkim od metrażu, stanu betonu, liczby warstw, cokołów i wykończenia. Prześlij zdjęcia oraz powierzchnię, a przygotujemy wstępną wycenę; ostateczną technologię potwierdzimy po ocenie podłoża.",
      },
      {
        question: "Czy można wykonać żywicę na starej posadzce?",
        answer: "Czasem tak, ale wymaga to sprawdzenia przyczepności i nośności istniejących warstw. Olej, odspojenia, rysy oraz wilgoć mogą wymagać usunięcia powłoki i naprawy betonu.",
      },
      {
        question: "Jakie dane są potrzebne do wyceny?",
        answer: "Podaj miejscowość, powierzchnię w m², przeznaczenie pomieszczenia, orientacyjny termin oraz zdjęcia całości i problematycznych miejsc, np. dylatacji i pęknięć.",
      },
    ],
  },
  krakow: {
    slug: "krakow",
    city: "Kraków",
    cityLocative: "w Krakowie",
    title: "Posadzki żywiczne Kraków | Garaże i tarasy",
    description: "Posadzki żywiczne w Krakowie: realizacje z dokumentacją zdjęciową, systemy garażowe i balkonowe oraz indywidualna wycena wykonania.",
    lead: "W Krakowie wykonujemy posadzki żywiczne do garaży, lokali i na powierzchnie zewnętrzne. Zakres technologii ustalamy osobno dla każdego obiektu — zależnie od podłoża, wilgotności i sposobu użytkowania.",
    localContext: "W Krakowie różne warunki wymagają różnych rozwiązań: w garażu nowego budynku ważna jest wilgotność wylewki i połączenie przy bramie, a na remontowanym balkonie — stan warstw pod płytkami, spadek oraz odwodnienie. Takie różnice wpływają na zakres napraw i dobór produktu.",
    sections: [
      {
        title: "Garaże i stanowiska postojowe w Krakowie",
        paragraphs: [
          "Przy wyborze posadzki do garażu sprawdzamy, czy beton jest suchy, stabilny oraz wolny od słabo związanych powłok i zanieczyszczeń. Przygotowanie podłoża i naprawa uszkodzeń poprzedzają aplikację gruntu i kolejnych warstw żywicznych.",
          "Możliwe jest wykończenie z posypką dekoracyjną lub fakturą antypoślizgową. Konkretny poziom odporności na ścieranie i właściwości użytkowe wynikają z karty technicznej dobranego systemu, a nie z samego określenia „epoksyd”.",
        ],
      },
      {
        title: "Krakowskie balkony i tarasy – diagnostyka przed żywicą",
        paragraphs: [
          "W przypadku balkonów, na których odspajają się płytki, najpierw weryfikujemy źródło wilgoci i stan istniejących warstw. Dopiero na tej podstawie można wskazać, czy wystarczy naprawa lokalna, czy potrzebna jest przebudowa wylewki i hydroizolacji.",
          "Do eksploatacji na zewnątrz dobiera się kompletny system dopuszczony do takiego zastosowania, z odpowiednią odpornością na promieniowanie UV i wahania temperatury. Nie traktujemy żywicy jako uniwersalnej naprawy każdego przeciekającego tarasu.",
        ],
      },
      {
        title: "Prace w czynnych obiektach – organizacja etapów",
        paragraphs: [
          "W pomieszczeniach usługowych i technicznych uwzględniamy możliwość wyłączenia powierzchni z użytku, przerwy technologiczne i termin ponownego obciążania. Czas aplikacji oraz utwardzania zależy od systemu i warunków obiektu, dlatego harmonogram podajemy po wyborze rozwiązania.",
        ],
      },
    ],
    faq: [
      {
        question: "Jaka żywica sprawdzi się w garażu w Krakowie?",
        answer: "Wiele garaży może korzystać z systemów epoksydowych, ale grubość, sposób wykończenia i grunt zależą od stanu betonu. Przy ekspozycji na UV lub nietypowych obciążeniach analizujemy inne systemy albo dodatkowe warstwy.",
      },
      {
        question: "Czy można położyć posadzkę żywiczną na mokry balkon?",
        answer: "Nie powinno się zakładać, że nowa powłoka rozwiąże zawilgocenie. Najpierw trzeba ustalić jego przyczynę, ocenić hydroizolację i wysuszyć lub odbudować nieodpowiednie warstwy zgodnie z wymaganiami systemu.",
      },
      {
        question: "Jak zamówić wycenę posadzki w Krakowie?",
        answer: "Prześlij metraż, lokalizację, fotografie podłoża, informację o istniejącej nawierzchni i oczekiwanym wykończeniu. Po wstępnej analizie ustalimy potrzebne pomiary i zakres prac.",
      },
    ],
  },
  lublin: {
    slug: "lublin",
    city: "Lublin",
    cityLocative: "w Lublinie",
    title: "Posadzki żywiczne Lublin | Garaże, hale, wycena",
    description: "Posadzki żywiczne w Lublinie: garaże, hale, lokale i balkony. Dobór systemu epoksydowego, poliuretanowego lub ESD oraz wycena prac.",
    lead: "Wykonujemy posadzki żywiczne w Lublinie i okolicach: od garaży przydomowych po powierzchnie przemysłowe i usługowe. Dobieramy rodzaj żywicy, warstwy i wykończenie do rzeczywistych obciążeń.",
    localContext: "W Lublinie zakres zapytań obejmuje zarówno przydomowe garaże i tarasy, jak i modernizacje posadzek w lokalach oraz obiektach produkcyjnych. Każda z tych powierzchni ma inne wymagania związane z wilgotnością betonu, chemią użytkową i intensywnością ruchu.",
    sections: [
      {
        title: "Posadzki do garaży i pomieszczeń użytkowych w Lublinie",
        paragraphs: [
          "W garażu dobieramy system do obciążeń od samochodu, kontaktu z solą drogową i sposobu sprzątania. Dostępne są warianty dekoracyjne z płatkami oraz wykończenia antypoślizgowe. O trwałości decyduje także grunt i przygotowanie betonu.",
          "Przed rozpoczęciem prac sprawdzamy rysy, dylatacje, stan istniejącej powłoki oraz zawilgocenie. W razie potrzeby zakres obejmuje naprawę podłoża, nie tylko aplikację żywicy.",
        ],
      },
      {
        title: "Hale, magazyny i posadzki specjalistyczne",
        paragraphs: [
          "Dla hal i powierzchni technicznych analizujemy ścieranie, obciążenia punktowe oraz wymagania chemiczne. W obiektach z elektroniką możliwy jest dobór specjalistycznych posadzek ESD, po ustaleniu docelowej rezystancji i sposobu pomiaru.",
          "Nie przedstawiamy systemu uniwersalnego: właściwości potwierdzają dokumenty techniczne wybranych materiałów oraz uzgodniony zakres odbioru.",
        ],
      },
      {
        title: "Balkony i tarasy w rejonie Lublina",
        paragraphs: [
          "W strefach zewnętrznych weryfikujemy spadki, stan hydroizolacji i ekspozycję na promieniowanie UV. Nie wykonujemy powłoki na zawilgoconym podłożu bez potwierdzenia kompatybilności całego systemu.",
        ],
      },
    ],
    faq: [
      {
        question: "Jak wygląda wycena posadzki żywicznej w Lublinie?",
        answer: "Na początek potrzebujemy metrażu, zdjęć, opisu przeznaczenia i lokalizacji. Po analizie ustalamy zakres przygotowania betonu, rodzaj systemu i harmonogram.",
      },
      {
        question: "Czy wykonujecie w Lublinie posadzki przemysłowe?",
        answer: "Przyjmujemy zapytania dotyczące hal i pomieszczeń przemysłowych. Dobór technologii uzależniamy od parametrów inwestorskich, stanu podłoża i wymagań eksploatacyjnych.",
      },
      {
        question: "Czy można odnowić starą posadzkę epoksydową?",
        answer: "Często jest to możliwe, ale wymaga oceny przyczepności i stanu istniejących warstw. W przypadku odspojeń, skażeń i zawilgocenia może być konieczne ich usunięcie.",
      },
    ],
  },
  warszawa: {
    slug: "warszawa",
    city: "Warszawa",
    cityLocative: "w Warszawie",
    title: "Posadzki żywiczne Warszawa | Garaże i przemysł",
    description: "Wykonanie posadzek żywicznych w Warszawie: garaże, lokale, hale i systemy ESD. Dobór epoksydu lub poliuretanu oraz wycena po ocenie podłoża.",
    lead: "Realizujemy posadzki żywiczne w Warszawie i okolicy — w garażach, obiektach usługowych oraz na powierzchniach technicznych. Doradzamy technologię odpowiednią do obciążeń, estetyki i warunków prowadzenia prac.",
    localContext: "Warszawskie realizacje często wymagają uzgodnienia dostępu do obiektu, ograniczenia przestojów oraz podziału robót na etapy. W podziemnych garażach i czynnych lokalach liczą się również odpowiednie parametry użytkowe oraz czas ponownego dopuszczenia nawierzchni do ruchu.",
    sections: [
      {
        title: "Garaże prywatne i powierzchnie parkingowe w Warszawie",
        paragraphs: [
          "Dobierając posadzkę do garażu, uwzględniamy obciążenia kół, wodę, sól drogową oraz możliwość utrzymania czystości. Opcje wykończenia obejmują gładkie powłoki, płatki dekoracyjne i systemy o fakturze antypoślizgowej.",
          "Przed nałożeniem powłoki analizujemy stan betonu, dylatacje, rysy oraz wilgotność. W obiektach wielostanowiskowych zwracamy szczególną uwagę na organizację etapów prac.",
        ],
      },
      {
        title: "Lokale usługowe, pomieszczenia techniczne i hale",
        paragraphs: [
          "W lokalach usługowych istotna bywa estetyka oraz łatwe sprzątanie. W pomieszczeniach przemysłowych dobór posadzki zależy dodatkowo od ruchu, chemikaliów i temperatur. Warunki te ustalamy przed przygotowaniem oferty.",
          "W obszarach ochrony elektroniki można zastosować system ESD. Wymagane parametry elektryczne, uziemienie i procedury pomiarów muszą zostać określone w dokumentacji projektu.",
        ],
      },
      {
        title: "Remonty balkonów i tarasów",
        paragraphs: [
          "Przy powierzchniach zewnętrznych oceniamy spadki i hydroizolację, a dopiero potem wybieramy system dopuszczony do pracy w warunkach UV i zmian temperatury. Nowa żywica nie zastępuje naprawy przyczyny przecieku.",
        ],
      },
    ],
    faq: [
      {
        question: "Czy można wykonać posadzkę w czynnym lokalu w Warszawie?",
        answer: "Możemy zaplanować prace etapami, jeżeli pozwalają na to warunki technologiczne. Dokładny czas wyłączenia powierzchni zależy od zastosowanego systemu i warunków utwardzania.",
      },
      {
        question: "Jak zamówić wycenę garażu w Warszawie?",
        answer: "Prześlij metraż, adres inwestycji, zdjęcia podłoża, informację o dylatacjach i preferowanym wykończeniu. Pozwoli to przygotować zakres i wstępną kalkulację.",
      },
      {
        question: "Czy realizujecie posadzki antystatyczne ESD w Warszawie?",
        answer: "Przyjmujemy takie zapytania. Przygotowanie oferty wymaga określenia wymagań dla rezystancji i badań, a także oceny podłoża i warunków użytkowania.",
      },
    ],
  },
  katowice: {
    slug: "katowice",
    city: "Katowice",
    cityLocative: "w Katowicach",
    title: "Posadzki żywiczne Katowice | Hale, garaże, ESD",
    description: "Posadzki żywiczne Katowice: hale produkcyjne, magazyny, garaże oraz specjalistyczne systemy ESD. Dobór materiałów, przygotowanie podłoża i wycena.",
    lead: "Wykonujemy posadzki żywiczne w Katowicach i okolicy. Oferta obejmuje zarówno garaże i pomieszczenia usługowe, jak i posadzki techniczne do hal, magazynów i zakładów przemysłowych.",
    localContext: "W Katowicach i na Górnym Śląsku przy posadzkach przemysłowych szczególnie istotne są obciążenia od wózków i urządzeń, intensywny ruch oraz chemia procesu. Nie wystarczy wybrać żywicy według nazwy — potrzebna jest analiza wymaganej nośności całego układu i właściwości samej warstwy żywicznej.",
    sections: [
      {
        title: "Posadzki przemysłowe do hal w Katowicach",
        paragraphs: [
          "Dobór systemu do produkcji i magazynowania zaczynamy od specyfikacji użytkowej: ścieralności, kontaktu z chemikaliami, wózków widłowych, udarów oraz wymaganej tekstury powierzchni. Obciążenia konstrukcyjne przenosi przede wszystkim odpowiednio zaprojektowane podłoże.",
          "Przy modernizacjach oceniamy istniejącą warstwę i wymagane przerwy technologiczne. Zakres napraw oraz grubość systemu ustalamy po rozpoznaniu betonu i warunków eksploatacji.",
        ],
      },
      {
        title: "Posadzki ESD w przemyśle elektronicznym",
        paragraphs: [
          "Dla procesów wrażliwych na wyładowania elektrostatyczne analizujemy zastosowanie powłok przewodzących lub rozpraszających, sposób uziemienia oraz wymagania pomiarowe. Parametry posadzki muszą odpowiadać dokumentacji i procedurom obowiązującym w zakładzie.",
          "Sam wybór produktu z oznaczeniem ESD nie jest równoznaczny z potwierdzeniem zgodności całej strefy produkcyjnej.",
        ],
      },
      {
        title: "Garaże i obiekty usługowe w Katowicach",
        paragraphs: [
          "W garażach oraz lokalach wykonujemy rozwiązania epoksydowe lub poliuretanowe dopasowane do sposobu użytkowania. Odpowiednia obróbka mechaniczna, naprawa rys i dobór powłoki mają kluczowe znaczenie dla trwałości.",
        ],
      },
    ],
    faq: [
      {
        question: "Jakie informacje są potrzebne do wyceny hali w Katowicach?",
        answer: "Potrzebujemy powierzchni, stanu podłoża, rodzaju ruchu i obciążeń, wymagań chemicznych oraz ewentualnej specyfikacji technicznej. Zdjęcia i dokumentacja przyspieszają wstępny dobór technologii.",
      },
      {
        question: "Czy posadzka żywiczna może przenosić ruch wózków widłowych?",
        answer: "Tak, przy prawidłowym dobraniu systemu do ruchu i podłoża. O nośności konstrukcyjnej decyduje głównie płyta betonowa, a żywicę dobiera się do wymagań powierzchniowych oraz odporności eksploatacyjnej.",
      },
      {
        question: "Czy wykonujecie posadzki przewodzące i ESD?",
        answer: "Oferujemy dobór systemów elektrostatycznych na podstawie wymaganej rezystancji, przeznaczenia strefy i właściwych metod badań. Szczegóły uzgadniamy przed ofertą.",
      },
    ],
  },
};

export function getLocalServicePage(slug: string): LocalServicePage | null {
  return Object.prototype.hasOwnProperty.call(localServicePages, slug)
    ? localServicePages[slug as CitySlug]
    : null;
}

/** Exact recorded city only: nearby towns are not relabelled as the main city. */
function cityToken(value: string): string {
  return value.toLowerCase().replace(/ł/g, "l").normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "").replace(/[^a-z0-9]+/g, " ").trim();
}

export function isProjectInCity(location: string, city: string): boolean {
  const normalized = cityToken(location);
  const target = cityToken(city);
  return normalized === target || normalized.startsWith(target + " ");
}

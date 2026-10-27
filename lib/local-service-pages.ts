export type CitySlug = "rzeszow" | "krakow";

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

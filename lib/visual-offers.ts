/** Visual choices for the customer quote flow. Photos are finished jobs from this site, not stock. */

export type PlaceId = "garaz" | "taras" | "dom" | "firma";

export type FloorLook = {
  id: string;
  title: string;
  description: string;
  detail: string;
  image?: string;
  alt: string;
  caption: string;
};

export type FloorPlace = {
  id: PlaceId;
  title: string;
  eyebrow: string;
  summary: string;
  image?: string;
  alt: string;
  href: string;
  looks: FloorLook[];
};

export const floorPlaces: FloorPlace[] = [
  {
    id: "garaz",
    title: "Garaż",
    eyebrow: "Najczęściej wybierane",
    summary: "Odporna na opony, olej i sól. Wybierz wygląd na zdjęciach i podaj metraż.",
    image: "/garaz/IMG_1253.JPG",
    alt: "Jasna posadzka z płatkami dekoracyjnymi w garażu z białą bramą",
    href: "/garaze",
    looks: [
      {
        id: "platki",
        title: "Jasne płatki",
        description: "Najczęściej wybierany wygląd garażu. Drobna mozaika maskuje piasek i kurz.",
        detail: "Wielkość płatków ustalamy na próbce. Do wjazdu można dodać delikatną fakturę antypoślizgową.",
        image: "/garaz/IMG_1253.JPG",
        alt: "Garaż z jasną posadzką żywiczną w płatki",
        caption: "Garaż z płatkami, jasny melanż",
      },
      {
        id: "gladka",
        title: "Jednolita i gładka",
        description: "Spokojna, jasna powierzchnia. Łatwo ją przetrzeć, mniej „rysunku” na podłodze.",
        detail: "Gładka żywica bywa śliska na mokro. Przy wjeździe dobieramy fakturę do sposobu użytkowania.",
        image: "/garaz/IMG_0910.JPG",
        alt: "Jasna, gładka posadzka żywiczna w dużym garażu",
        caption: "Gładka, jasna posadzka w garażu",
      },
      {
        id: "melanz",
        title: "Szary melanż",
        description: "Szare płatki w większym garażu. Spokojny kolor, który nie pokazuje każdej drobinki.",
        detail: "Ten wygląd dobrze znosi codzienny wjazd autem. Odcień potwierdzamy próbką, nie ekranem.",
        image: "/chatgpt-realizacje/posadzka-zywiczna-garaz-100m2-przemysl-ral7035/przemysl-garaz-100m2-ujecie-glowne.jpg",
        alt: "Szara posadzka z płatkami w garażu o powierzchni około 100 m² w Przemyślu",
        caption: "Przemyśl · około 100 m² · RAL 7035",
      },
    ],
  },
  {
    id: "taras",
    title: "Taras i balkon",
    eyebrow: "Na zewnątrz",
    summary: "Deszcz, słońce i zamarzanie. Tu liczy się woda, UV i przyczepność.",
    image: "/kamienny-dywan/realizacje/kamienny-dywan-taras-bez-rzeszow-06-hq.webp",
    alt: "Beżowy kamienny dywan na tarasie domu w Rzeszowie",
    href: "/posadzki-zywiczne-na-balkony",
    looks: [
      {
        id: "dywan",
        title: "Kamienny dywan",
        description: "Kruszywo zatopione w żywicy. Naturalny wygląd tarasu i schodów, woda ma gdzie spływać.",
        detail: "Kolor kruszywa wybieramy ze wzornika. Na schodach dokładamy wykończenie krawędzi.",
        image: "/kamienny-dywan/realizacje/kamienny-dywan-taras-bez-rzeszow-06-hq.webp",
        alt: "Beżowy kamienny dywan na zadaszonym tarasie",
        caption: "Taras, kamienny dywan, okolice Rzeszowa",
      },
      {
        id: "taras-gladki",
        title: "Gładki taras",
        description: "Jednolita, jasna powłoka. Dobrze wygląda pod zadaszeniem i na balkonach.",
        detail: "Na otwartym słońcu dobieramy warstwę odporną na UV, żeby kolor nie żółkł.",
        image: "/realizacje/rzeszow-glogow-malopolski-taras/IMG_9538.JPG",
        alt: "Jasna gładka posadzka na zadaszonym tarasie z drewnianą balustradą",
        caption: "Taras, Głogów Małopolski",
      },
      {
        id: "balkon-platki",
        title: "Płatki na balkonie",
        description: "Lżejszy rysunek niż kamienny dywan. Dobry, gdy balkon ma zostać jasny i prosty w myciu.",
        detail: "Przy balustradzie i progu robimy szczelne połączenie, żeby woda nie wchodziła pod warstwę.",
        image: "/realizacje/krakow-rydlowka-balkon/IMG_1315.JPG",
        alt: "Jasny balkon z posadzką w drobne płatki i żółtą balustradą",
        caption: "Balkon, Kraków",
      },
    ],
  },
  {
    id: "dom",
    title: "Dom",
    eyebrow: "Wnętrze",
    summary: "Kuchnia, hol, pomieszczenie gospodarcze. Gładka podłoga, którą widać od progu.",
    image: "/garaz/garaz-zywica-2.jpg",
    alt: "Ciemnoszara, gładka posadzka w pomieszczeniu z oknami",
    href: "/kuchnia-salon",
    looks: [
      {
        id: "ciemna",
        title: "Ciemna i gładka",
        description: "Spokojny grafit. Dobrze kryje codzienny kurz i pasuje do prostych ścian.",
        detail: "We wnętrzu ważny jest połysk: mat mniej odbija światło, satyna wygląda głębiej.",
        image: "/garaz/garaz-zywica-2.jpg",
        alt: "Ciemnoszara gładka posadzka żywiczna w pomieszczeniu",
        caption: "Gładka posadzka w ciemnym odcieniu",
      },
      {
        id: "schody",
        title: "Schody z kruszywem",
        description: "Wejście do domu, które nie jest śliskie po deszczu i nie wymaga płytek.",
        detail: "Kruszywo i żywica na stopniach. Kolor i frakcję dobieramy do elewacji.",
        image: "/kamienny-dywan/realizacje/kamienny-dywan-schody-wejscie-grafit-rzeszow-01-hq.webp",
        alt: "Grafitowe schody zewnętrzne z kamiennym dywanem przed wejściem do domu",
        caption: "Schody wejściowe, kamienny dywan",
      },
      {
        id: "inne",
        title: "Inne pomieszczenie",
        description: "Hol, piwnica albo pomieszczenie gospodarcze. Napisz, co tam stoi i czy podłoga jest już betonowa.",
        detail: "We wnętrzu sprawdzamy wilgoć i ogrzewanie podłogowe. Od tego zależy grunt, nie kolor.",
        alt: "Inne pomieszczenie w domu",
        caption: "Dobór po krótkim opisie",
      },
    ],
  },
  {
    id: "firma",
    title: "Firma",
    eyebrow: "Hala, parking, gastro",
    summary: "Tu nie wybierasz koloru z katalogu. Najpierw rodzaj obiektu, potem dobór systemu.",
    alt: "Posadzki do hal, parkingów i gastronomii",
    href: "/hale-magazyny",
    looks: [
      {
        id: "hala",
        title: "Hala lub magazyn",
        description: "Wózki, regały, intensywny ruch. Grubość i odporność dobieramy do obciążenia.",
        detail: "Do wyceny potrzebujemy metrażu, rodzaju kół i informacji, czy podłoga jest już betonowa.",
        alt: "Hala lub magazyn",
        caption: "Dobór po opisie obiektu",
      },
      {
        id: "parking",
        title: "Parking",
        description: "Miejsca postojowe, rampy i drogi manewrowe. Liczy się przyczepność i oznaczenia.",
        detail: "Napisz, czy parking jest zadaszony i czy zimą wjeżdża na niego sól.",
        alt: "Parking",
        caption: "Dobór po opisie obiektu",
      },
      {
        id: "gastro",
        title: "Gastronomia",
        description: "Kuchnia, zmywalnia, produkcja spożywcza. Powłoka do mycia i chemii.",
        detail: "Podaj, czy podłoga ma spadki i kratki. To zmienia przygotowanie podłoża.",
        alt: "Gastronomia",
        caption: "Dobór po opisie obiektu",
      },
      {
        id: "esd",
        title: "Strefa ESD",
        description: "Elektronika i wymagania antyelektrostatyczne. System musi spełnić pomiar, nie tylko kolor.",
        detail: "Jeśli masz specyfikację rezystancji, dopisz ją w wiadomości.",
        alt: "Posadzka antyelektrostatyczna",
        caption: "Dobór po wymaganiach pomiarowych",
      },
    ],
  },
];

export const portfolioShots: Array<{ src: string; alt: string; caption: string; href: string }> = [
  {
    src: "/garaz/IMG_1253.JPG",
    alt: "Jasna posadzka z płatkami w garażu",
    caption: "Garaż · płatki",
    href: "/garaze",
  },
  {
    src: "/chatgpt-realizacje/posadzka-zywiczna-garaz-100m2-przemysl-ral7035/przemysl-garaz-100m2-ujecie-glowne.jpg",
    alt: "Szara posadzka z płatkami w garażu w Przemyślu",
    caption: "Przemyśl · 100 m²",
    href: "/realizacje/posadzka-zywiczna-garaz-100m2-przemysl-ral7035",
  },
  {
    src: "/chatgpt-realizacje/posadzka-zywiczna-garaz-30m2-sedziszow-malopolski/garaz-30m2-ral7035-oryginal.jpg",
    alt: "Garaż 30 m² z jasnoszarą posadzką w płatki",
    caption: "Sędziszów · 30 m²",
    href: "/realizacje/posadzka-zywiczna-garaz-30m2-sedziszow-malopolski",
  },
  {
    src: "/garaz/IMG_0910.JPG",
    alt: "Jasna gładka posadzka w garażu",
    caption: "Garaż · gładka",
    href: "/garaze",
  },
  {
    src: "/realizacje/tarnow-bajeczna-garaz/IMG_8687.JPG",
    alt: "Jasnoszara gładka posadzka w garażu w Tarnowie",
    caption: "Tarnów · gładka",
    href: "/realizacje",
  },
  {
    src: "/kamienny-dywan/realizacje/kamienny-dywan-taras-bez-rzeszow-06-hq.webp",
    alt: "Beżowy kamienny dywan na tarasie",
    caption: "Taras · kamienny dywan",
    href: "/kamienny-dywan",
  },
  {
    src: "/realizacje/krakow-rydlowka-balkon/IMG_1315.JPG",
    alt: "Balkon z jasną posadzką w płatki w Krakowie",
    caption: "Kraków · balkon",
    href: "/posadzki-zywiczne-na-balkony",
  },
  {
    src: "/realizacje/rzeszow-glogow-malopolski-taras/IMG_9538.JPG",
    alt: "Gładka jasna posadzka na tarasie",
    caption: "Taras · gładka",
    href: "/posadzki-zywiczne-na-balkony",
  },
  {
    src: "/kamienny-dywan/realizacje/kamienny-dywan-schody-wejscie-grafit-rzeszow-01-hq.webp",
    alt: "Grafitowe schody z kamiennym dywanem",
    caption: "Schody · kamienny dywan",
    href: "/kamienny-dywan",
  },
  {
    src: "/antypolizg.jpg",
    alt: "Zbliżenie posadzki z płatkami dekoracyjnymi",
    caption: "Zbliżenie płatków",
    href: "/galeria",
  },
];

export function findPlace(id: string | null | undefined): FloorPlace | undefined {
  return floorPlaces.find((place) => place.id === id);
}

export function findLook(place: FloorPlace | undefined, lookId: string | null | undefined): FloorLook | undefined {
  return place?.looks.find((look) => look.id === lookId);
}

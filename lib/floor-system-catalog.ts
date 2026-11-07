/**
 * Editorial catalog of manufacturers, system families and named materials.
 * A system-family entry is NOT a manufacturer-approved layer specification.
 * Material examples are NOT proof they were used on a particular job.
 * No product is for sale here; store IDs are populated only after launch.
 * EPOVIO is an independent own-label brand, not a rebadged Sicon system.
 * Final formulations, actual producer and measured data must be verified before sale.
 */
export type ManufacturerId = "sika" | "flowcrete" | "sto" | "sicon" | "epovio";
export type SystemApplication = "garaze" | "parkingi" | "hale" | "esd" | "balkony" | "gastronomia";

export interface CatalogMaterial {
  id: string;
  name: string;
  manufacturerId: ManufacturerId;
  description: string;
  /** Optional external commercial product mapping; never guessed from the name. */
  shopProductId?: string;
  /** Manufacturer's own technical data sheet. */
  technicalSheetUrl?: string;
  /** Reference consumption for this specific use, never a total system estimate. */
  referenceConsumption?: string;
}

export interface CatalogSystem {
  slug: string;
  title: string;
  manufacturerId: ManufacturerId;
  application: SystemApplication;
  serviceHref: string;
  summary: string;
  selectionCriteria: string[];
  /** Technical examples from the manufacturer's range, not a layer recipe. */
  exampleMaterialIds: string[];
  /** Concept-stage brand/system, not yet a technical specification or saleable product. */
  isConcept?: boolean;
  plannedOffer?: Array<{ name: string; description: string }>;
  /** Proposed structure; not manufacturer-approved as one complete specification. */
  proposedLayers?: Array<{ title: string; materialId?: string; description: string }>;
  pendingValidation?: string[];
  /** Fields for a brand-owned technical-card layout. Unknown figures are left as pending. */
  technicalFields?: Array<{ label: string; value: string }>;
}

export const manufacturers: Record<ManufacturerId, { name: string; description: string }> = {
  sika: { name: "Sika", description: "Rozwiązania żywiczne do garaży, pomieszczeń użytkowych i powierzchni zewnętrznych." },
  flowcrete: { name: "Flowcrete", description: "Systemy posadzkowe dla parkingów, obiektów przemysłowych i wymagających stref użytkowych." },
  sto: { name: "Sto", description: "Rozwiązania przemysłowe, w tym posadzki wymagające kontroli właściwości elektrycznych." },
  sicon: { name: "Sicon", description: "Materiały i rozwiązania do wykonywania posadzek żywicznych." },
  epovio: { name: "EPOVIO", description: "Własna, rozwijana marka Posadzkizywiczne.com. Koncepcja zestawów do samodzielnego wykonywania posadzek garażowych." },
};

export const catalogMaterials: CatalogMaterial[] = [
  { id: "sikafloor-264", name: "Sikafloor-264", manufacturerId: "sika", description: "Materiał z rodziny epoksydowych rozwiązań posadzkowych Sika; zastosowanie zależy od aktualnej karty technicznej." },
  { id: "sikafloor-2540-w", name: "Sikafloor-2540 W", manufacturerId: "sika", description: "Wodorozcieńczalny materiał epoksydowy; dobór wymaga sprawdzenia podłoża i dokumentacji producenta." },
  { id: "sikafloor-305-w", name: "Sikafloor-305 W", manufacturerId: "sika", description: "Powłoka wykończeniowa z oferty Sika; zgodność z układem warstw wymaga potwierdzenia." },
  { id: "flowcrete-deckshield-finish", name: "Flowcrete Deckshield Finish", manufacturerId: "flowcrete", description: "Produkt z rodziny rozwiązań parkingowych Deckshield; dobór i zakres stosowania według producenta." },
  { id: "sto-put-wv-150", name: "Sto PUT WV 150", manufacturerId: "sto", description: "Materiał z oferty Sto; szczegółowe przeznaczenie i kompatybilność należy potwierdzić w dokumentacji." },
  { id: "sto-put-wv-200", name: "Sto PUT WV 200", manufacturerId: "sto", description: "Materiał z oferty Sto; parametry techniczne należy odczytać z aktualnej karty produktu." },
  { id: "sicon-rr100-pro", name: "Sicon RR100 PRO", manufacturerId: "sicon", description: "Materiał do rozwiązań posadzkowych Sicon; właściwy układ warstw wymaga potwierdzenia. Nie należy utożsamiać go z RR100-E." },
  {
    id: "siconofloor-gf-e-premium",
    name: "Siconofloor GF-E Premium",
    manufacturerId: "sicon",
    description: "Bezbarwny, dwuskładnikowy grunt epoksydowy do betonu i pod systemy żywiczne. Producent podaje zużycie gruntowania około 0,3–0,6 kg/m², zależne od podłoża.",
    referenceConsumption: "Gruntowanie: orientacyjnie 0,3–0,6 kg/m² (karta Sicon; porowate podłoże może wymagać kolejnej warstwy).",
    technicalSheetUrl: "https://www.sicon.pl/wp-content/uploads/2023/02/SICONOFLOOR-GF-E-PREMIUM-KT.pdf",
  },
  {
    id: "siconofloor-rr100-e",
    name: "Siconofloor RR100-E",
    manufacturerId: "sicon",
    description: "Barwiona, dwuskładnikowa żywica epoksydowa stosowana jako powłoka zamykająca w systemach gładkich i z kruszywem kwarcowym. To RR100-E, a nie odrębny wariant RR100 PRO.",
    referenceConsumption: "Powłoka na gładkiej powierzchni: ok. 0,15–0,20 kg/m²; przy zasypie kwarcowym i nierównościach zużycie wzrasta.",
    technicalSheetUrl: "https://www.sicon.pl/wp-content/uploads/2023/02/SICONOFLOOR-RR100-KT.pdf",
  },
];

export const catalogSystems: CatalogSystem[] = [
  {
    slug: "epovio-garaz",
    title: "EPOVIO Garage – autorski system do garażu",
    manufacturerId: "epovio",
    application: "garaze",
    serviceHref: "/garaze",
    summary: "EPOVIO Garage to rozwijany pod własną marką EPOVIO system powłokowy do garaży. Projekt obejmuje wariant gładki, dekoracyjny z płatkami i antypoślizgowy; ostateczne produkty, skład i parametry zostaną zatwierdzone przed sprzedażą.",
    selectionCriteria: [
      "Ocena podłoża betonowego: wilgotności, nośności, rys, dylatacji i starych powłok.",
      "Dobór oczekiwanego wykończenia: gładkiego, z płatkami dekoracyjnymi albo antypoślizgowego.",
      "Weryfikacja ostatecznej dokumentacji EPOVIO: zgodności składników, zużycia, czasów aplikacji, obciążeń i zasad pielęgnacji.",
    ],
    // Brand-owned product names below are design placeholders, not verified SKUs.
    // Never link third-party products or copy their technical values into EPOVIO.
    exampleMaterialIds: [],
    isConcept: true,
    proposedLayers: [
      { title: "1. Przygotowanie podłoża", description: "Weryfikacja i mechaniczne przygotowanie betonu, usunięcie zanieczyszczeń oraz naprawy ubytków przed nałożeniem powłok. Metodę przygotowania określi docelowa instrukcja EPOVIO." },
      { title: "2. Grunt EPOVIO Garage Primer", description: "Planowany dedykowany grunt pod warstwy EPOVIO. Nazwa robocza; rodzaj spoiwa, zużycie, liczba warstw i warunki stosowania wymagają zatwierdzenia." },
      { title: "3. Warstwa zasadnicza EPOVIO Garage Coat", description: "Projektowana powłoka właściwa do garażu. Nazwa robocza; skład, mieszanie, grubość i parametry eksploatacyjne zostaną podane po badaniach produktu." },
      { title: "4. Wykończenie powierzchni", description: "Wariant gładki, opcjonalny zasyp kwarcowy lub płatki dekoracyjne. Dobór warstwy zamykającej EPOVIO, jej przejrzystość oraz kompatybilność pozostają częścią opracowania." },
    ],
    technicalFields: [
      { label: "Marka", value: "EPOVIO – marka własna Posadzkizywiczne.com" },
      { label: "Przeznaczenie", value: "Planowany system do garaży indywidualnych" },
      { label: "Rodzaj spoiwa", value: "Do potwierdzenia po wyborze finalnej formulacji" },
      { label: "Podłoże", value: "Beton; szczegółowe wymagania zostaną określone w karcie technicznej" },
      { label: "Wykończenia", value: "Projekt: gładkie, z płatkami dekoracyjnymi, antypoślizgowe" },
      { label: "Zużycie i grubość", value: "Do ustalenia na podstawie finalnych materiałów i prób" },
      { label: "Mieszanie i czas pracy", value: "Do potwierdzenia w karcie technicznej produktów EPOVIO" },
      { label: "Utwardzanie i dopuszczenie ruchu", value: "Do potwierdzenia w badaniach i instrukcji EPOVIO" },
      { label: "Dokumentacja", value: "W opracowaniu – karty techniczne, bezpieczeństwa i instrukcje" },
    ],
    pendingValidation: [
      "Ustalenie finalnych produktów EPOVIO i ich rzeczywistego producenta lub dostawcy private label.",
      "Zatwierdzenie formulacji, współpracy warstw i wariantów wykończenia na podstawie badań.",
      "Parametry techniczne: zużycie, mieszanie, pot life, przyczepność, odporność, grubość, poślizg i utwardzanie.",
      "Opracowanie własnych kart technicznych, dokumentacji bezpieczeństwa, etykiet i instrukcji EPOVIO.",
      "Weryfikacja opakowań, numerów SKU, warunków gwarancji, cen i zgodności z przepisami przed uruchomieniem sklepu.",
    ],
    plannedOffer: [
      { name: "EPOVIO Garage Kit", description: "Planowany podstawowy zestaw produktów pod marką EPOVIO do samodzielnego wykonania posadzki garażowej." },
      { name: "EPOVIO Garage Flakes Kit", description: "Planowany zestaw EPOVIO z dekoracyjnymi płatkami i odpowiednią powłoką zamykającą; specyfikacja w opracowaniu." },
      { name: "EPOVIO Repair Kit", description: "Planowany zestaw uzupełniający EPOVIO do przygotowania i miejscowych napraw podłoża." },
    ],
  },
  {
    slug: "sika-posadzki-garazowe",
    title: "Systemy Sika do garaży",
    manufacturerId: "sika",
    application: "garaze",
    serviceHref: "/garaze",
    summary: "Dobór posadzki garażowej zależy od stanu betonu, wilgotności, obciążeń, wykończenia i oczekiwanej łatwości mycia.",
    selectionCriteria: ["Ocena wilgotności, nośności, napraw i dylatacji betonu.", "Dobór wykończenia gładkiego, z płatkami lub z fakturą antypoślizgową.", "Potwierdzenie kompatybilności i czasu utwardzania konkretnego układu."],
    exampleMaterialIds: ["sikafloor-264", "sikafloor-2540-w"],
  },
  {
    slug: "sika-balkony-tarasy",
    title: "Rozwiązania Sika na balkony i tarasy",
    manufacturerId: "sika",
    application: "balkony",
    serviceHref: "/posadzki-zywiczne-na-balkony",
    summary: "Na zewnątrz priorytetami są woda, nasłonecznienie, ruchy podłoża oraz poprawnie wykonane detale uszczelnień.",
    selectionCriteria: ["Sprawdzenie spadków, odwodnienia, rys oraz zawilgocenia.", "Dobór systemu przewidzianego do ekspozycji zewnętrznej i UV.", "Opracowanie detali przy drzwiach, balustradach i dylatacjach."],
    exampleMaterialIds: [],
  },
  {
    slug: "flowcrete-parkingi",
    title: "Systemy Flowcrete do parkingów",
    manufacturerId: "flowcrete",
    application: "parkingi",
    serviceHref: "/parkingi",
    summary: "Rozwiązania dla miejsc postojowych, ramp i dróg manewrowych dobierane do rodzaju konstrukcji i ruchu.",
    selectionCriteria: ["Rozróżnienie stropu, płyty na gruncie i stref zewnętrznych.", "Ocena szczelności, mostkowania rys i obciążeń ruchem.", "Dobór faktury i warstw do konkretnej strefy parkingu."],
    exampleMaterialIds: ["flowcrete-deckshield-finish"],
  },
  {
    slug: "flowcrete-posadzki-przemyslowe",
    title: "Posadzki przemysłowe Flowcrete",
    manufacturerId: "flowcrete",
    application: "hale",
    serviceHref: "/hale-magazyny",
    summary: "Systemy dla hal i magazynów uwzględniające ruch kołowy, czyszczenie, obciążenia i warunki pracy.",
    selectionCriteria: ["Weryfikacja ruchu wózków, nacisków punktowych i ścierania.", "Ocena substancji chemicznych oraz temperatury procesu.", "Dobór warstw na podstawie warunków eksploatacji."],
    exampleMaterialIds: [],
  },
  {
    slug: "sto-posadzki-esd",
    title: "Rozwiązania Sto do posadzek ESD",
    manufacturerId: "sto",
    application: "esd",
    serviceHref: "/posadzki-elektrostatyczne",
    summary: "Posadzki przewodzące i rozpraszające wymagają uzgodnienia parametrów elektrycznych całego systemu oraz pomiarów odbiorowych.",
    selectionCriteria: ["Określenie wymaganego zakresu rezystancji i metod pomiarowych.", "Zaplanowanie połączeń uziemiających i warstwy przewodzącej.", "Weryfikacja zgodności systemu z wymaganiami inwestycji."],
    exampleMaterialIds: [],
  },
  {
    slug: "sicon-posadzki-garazowe",
    title: "Rozwiązania Sicon do posadzek garażowych",
    manufacturerId: "sicon",
    application: "garaze",
    serviceHref: "/garaze",
    summary: "Dobór materiałów Sicon do garażu opieramy na stanie podłoża, oczekiwanej fakturze i sposobie eksploatacji.",
    selectionCriteria: ["Sprawdzenie nośności, wilgotności i przygotowania podłoża.", "Uzgodnienie odporności chemicznej i sposobu utrzymania czystości.", "Potwierdzenie właściwych materiałów i zużycia z dokumentacją."],
    exampleMaterialIds: ["sicon-rr100-pro", "siconofloor-gf-e-premium", "siconofloor-rr100-e"],
  },
];

export function getCatalogSystem(slug: string): CatalogSystem | undefined {
  return catalogSystems.find(system => system.slug === slug);
}
export function getCatalogMaterial(id: string): CatalogMaterial | undefined {
  return catalogMaterials.find(material => material.id === id);
}
export function systemsForApplication(application: SystemApplication): CatalogSystem[] {
  return catalogSystems.filter(system => system.application === application);
}

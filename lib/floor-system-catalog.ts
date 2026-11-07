/**
 * Editorial catalog of manufacturers, system families and named materials.
 * A system-family entry is NOT a manufacturer-approved layer specification.
 * Material examples are NOT proof they were used on a particular job.
 * No product is for sale here; store IDs are populated only after launch.
 * EPOVIO is a brand concept (not a verified material manufacturer or tested recipe).
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
    title: "EPOVIO Garage – system garażowy na materiałach Sicon",
    manufacturerId: "epovio",
    application: "garaze",
    serviceHref: "/garaze",
    summary: "Proponowany przez Posadzkizywiczne.com układ powłok garażowych: grunt Siconofloor GF-E Premium i barwna warstwa zamykająca Siconofloor RR100-E. Wersja antypoślizgowa przewiduje zasyp kwarcowy. Szczegóły kombinacji i wykonania wymagają weryfikacji.",
    selectionCriteria: [
      "Podłoże mineralne: ocena wytrzymałości, przyczepności, wilgotności, rys, dylatacji i zabrudzeń przed gruntowaniem.",
      "Warstwa gruntująca GF-E Premium oraz RR100-E jako cienkowarstwowe wykończenie — zużycia tylko wg kart Sicon, a nie jako gwarancja ilości zestawu.",
      "Jeśli potrzebny antypoślizg: rozważenie zasypu kwarcowego wg rozwiązań Sicon Epoxy Structur oraz potwierdzenie parametrów konkretnego układu.",
      "Wariant z płatkami dekoracyjnymi wymaga osobno dobranej kompatybilnej warstwy zamykającej; nie jest jeszcze zweryfikowaną recepturą.",
    ],
    exampleMaterialIds: ["siconofloor-gf-e-premium", "siconofloor-rr100-e"],
    isConcept: true,
    proposedLayers: [
      { title: "1. Przygotowanie betonu", description: "Mechaniczne otwarcie porów, usunięcie mleczka cementowego, zanieczyszczeń i słabych warstw, naprawy oraz odkurzenie. Zgodnie z kartami produktów." },
      { title: "2. Gruntowanie", materialId: "siconofloor-gf-e-premium", description: "Dwuskładnikowy grunt epoksydowy Siconofloor GF-E Premium. Teoretyczne zużycie wg producenta 0,3–0,6 kg/m²; w zależności od chłonności może być potrzebne ponowne gruntowanie." },
      { title: "3. Faktura antypoślizgowa (wariant opcjonalny)", description: "W wariancie kwarcowym projektujemy zasyp odpowiednim suchym kruszywem. System Siconofloor Epoxy Structur jest punktem odniesienia, lecz nie potwierdza automatycznie zgodności całej kombinacji z GF-E Premium." },
      { title: "4. Barwna warstwa zamykająca", materialId: "siconofloor-rr100-e", description: "Siconofloor RR100-E. Karta podaje 0,15–0,20 kg/m² przy użyciu jako lakier na powierzchni gładkiej; zużycie na posypce kwarcowej jest większe i zależy od faktury." },
    ],
    pendingValidation: [
      "Pisемne potwierdzenie przez Sicon zgodności GF-E Premium i RR100-E jako konkretnego układu oraz warunków międzywarstwowych.",
      "Dobór granulacji, ilości i sposobu zasypu kwarcowego oraz oczekiwanej klasy antypoślizgowości.",
      "Próba na reprezentatywnym betonie, kontrola przyczepności oraz szczegółowy protokół przygotowania podłoża.",
      "Receptura z płatkami dekoracyjnymi oraz dobór przezroczystej warstwy zamykającej i jej kompatybilności.",
      "Finalne jednostki handlowe, składy zestawów, instrukcje, dokumenty bezpieczeństwa i ceny dla sklepu EPOVIO.",
    ],
    plannedOffer: [
      { name: "EPOVIO Garage Kit", description: "Projekt zestawu powłokowego opartego na GF-E Premium (grunt) i RR100-E (barwne wykończenie), po potwierdzeniu zgodności układu." },
      { name: "EPOVIO Garage Flakes Kit", description: "Wariant dekoracyjny w opracowaniu; wymagane osobne potwierdzenie systemu z płatkami i przezroczystą powłoką zamykającą." },
      { name: "EPOVIO Repair Kit", description: "Osobny zestaw do miejscowych napraw podłoża, nie zastępuje dwóch materiałów bazowego systemu." },
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

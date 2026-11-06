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
  { id: "sicon-rr100-pro", name: "Sicon RR100 PRO", manufacturerId: "sicon", description: "Materiał do rozwiązań posadzkowych Sicon; właściwy układ warstw wymaga potwierdzenia." },
];

export const catalogSystems: CatalogSystem[] = [
  {
    slug: "epovio-garaz",
    title: "EPOVIO Garage – autorski system do garażu",
    manufacturerId: "epovio",
    application: "garaze",
    serviceHref: "/garaze",
    summary: "Rozwijana przez Posadzkizywiczne.com koncepcja systemu garażowego EPOVIO: zestawy DIY z wariantem podstawowym i dekoracyjnym z płatkami. Skład, parametry i instrukcje wymagają jeszcze zatwierdzenia.",
    selectionCriteria: [
      "Rozpoznanie rodzaju i stanu podłoża, wilgotności, zanieczyszczeń i ewentualnych napraw.",
      "Wybór oczekiwanego efektu: jednolite wykończenie albo wariant z płatkami dekoracyjnymi.",
      "Weryfikacja docelowych materiałów, zgodności warstw, zużycia, warunków utwardzania i dokumentacji bezpieczeństwa przed wdrożeniem do sprzedaży.",
    ],
    exampleMaterialIds: [],
    isConcept: true,
    plannedOffer: [
      { name: "EPOVIO Garage Kit", description: "Opracowywany zestaw bazowy do samodzielnego wykonania posadzki garażowej." },
      { name: "EPOVIO Garage Flakes Kit", description: "Opracowywany wariant dekoracyjny z płatkami do garażu." },
      { name: "EPOVIO Repair Kit", description: "Planowany zestaw uzupełniający do miejscowych napraw i przygotowania podłoża; nie jest kompletnym systemem posadzkowym." },
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
    exampleMaterialIds: ["sicon-rr100-pro"],
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

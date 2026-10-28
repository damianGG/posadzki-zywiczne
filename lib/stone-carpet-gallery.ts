/**
 * Galeria przesłanych przez wykonawcę zdjęć kamiennego dywanu.
 *
 * Każde zdjęcie to osobna karta portfolio — różne kadry mogą pochodzić
 * z tej samej inwestycji. Nie dopisujemy niepotwierdzonych miejscowości,
 * dat wykonania, metraży ani parametrów systemów.
 *
 * Pliki zdjęć: public/kamienny-dywan/realizacje/
 */
export type StoneCarpetPhoto = {
  id: string;
  src: string;
  title: string;
  alt: string;
  caption: string;
  location?: string;
};

const area = "Rzeszów i okolice";

export const stoneCarpetGallery: ReadonlyArray<StoneCarpetPhoto> = [
  {
    id: "wejscie-schody-grafit-01",
    src: "/kamienny-dywan/realizacje/kamienny-dywan-schody-realizacja-hq.webp",
    title: "Schody wejściowe — grafitowe wykończenie",
    alt: "Schody wejściowe wykończone ciemnoszarym kamiennym dywanem przy białej elewacji, czarne barierki",
    caption: "Grafitowa nawierzchnia na stopniach i podeście wejściowym",
  },
  {
    id: "schody-grafit-02",
    src: "/kamienny-dywan/realizacje/kamienny-dywan-schody-wejscie-grafit-rzeszow-01-hq.webp",
    title: "Schody zewnętrzne przy wejściu do budynku",
    alt: "Szare schody z kamiennym dywanem i czarną balustradą przy wejściu do budynku w okolicach Rzeszowa",
    caption: "Szara nawierzchnia kruszywowa na schodach i podeście",
    location: area,
  },
  {
    id: "podest-grafit-03",
    src: "/kamienny-dywan/realizacje/kamienny-dywan-schody-wejscie-grafit-rzeszow-02-hq.webp",
    title: "Wejście do obiektu — podest i stopnie",
    alt: "Szeroki podest wejściowy i stopnie wykończone szarym kamiennym dywanem z ciemnymi pasami",
    caption: "Spójne wykończenie szerokiego podestu i stopni",
    location: area,
  },
  {
    id: "dlugie-schody-04",
    src: "/kamienny-dywan/realizacje/kamienny-dywan-schody-dlugie-budynek-rzeszow-03-hq.webp",
    title: "Długie schody zewnętrzne — szary kamień",
    alt: "Długi bieg schodów na zewnątrz budynku wykończony szarą strukturą kamiennego dywanu",
    caption: "Kamienny dywan na biegu schodów i krawędziach stopni",
    location: area,
  },
  {
    id: "schody-dwukolorowe-05",
    src: "/kamienny-dywan/realizacje/kamienny-dywan-schody-bez-braz-rzeszow-04-hq.webp",
    title: "Dwukolorowy kamienny dywan na schodach",
    alt: "Schody wejściowe z jasnobeżowymi stopnicami i brązowymi podstopnicami z kamiennego dywanu",
    caption: "Jasnobeżowe stopnice zestawione z brązowymi podstopnicami",
    location: area,
  },
  {
    id: "schody-dwukolorowe-06",
    src: "/kamienny-dywan/realizacje/kamienny-dywan-schody-bez-braz-rzeszow-05-hq.webp",
    title: "Schody wejściowe w dwóch odcieniach kruszywa",
    alt: "Zbliżenie schodów z jasnym kamiennym dywanem na stopnicach i ciemnobrązowym na podstopnicach",
    caption: "Zbliżenie na kontrastujące kolory stopni",
    location: area,
  },
  {
    id: "taras-bez-07",
    src: "/kamienny-dywan/realizacje/kamienny-dywan-taras-bez-rzeszow-06-hq.webp",
    title: "Jasnobeżowy kamienny dywan na tarasie",
    alt: "Taras przy domu wykończony beżowym kamiennym dywanem z obramowaniem przy kolumnach",
    caption: "Jasna faktura kruszywa i wykończenie przy filarach",
    location: area,
  },
  {
    id: "taras-przy-domu-08",
    src: "/kamienny-dywan/realizacje/kamienny-dywan-taras-podest-rzeszow-07-hq.webp",
    title: "Taras przydomowy — jednolita powierzchnia",
    alt: "Szeroki taras i podest przy domu pokryty jasnym kamiennym dywanem, widok na obrzeże",
    caption: "Kamienny dywan na podeście z obróbką krawędzi",
    location: area,
  },
  {
    id: "struktura-kamienia-09",
    src: "/kamienny-dywan/realizacje/kamienny-dywan-struktura-grafit-rzeszow-08-hq.webp",
    title: "Detal wykończenia schodów — struktura kruszywa",
    alt: "Zbliżenie na ziarnistą szarą powierzchnię kamiennego dywanu i profile na krawędziach stopni",
    caption: "Faktura kruszywa i precyzyjne obróbki stopni",
    location: area,
  },
];

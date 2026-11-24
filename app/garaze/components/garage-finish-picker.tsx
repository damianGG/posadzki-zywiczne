import Link from "next/link";
import ProjectPhoto from "@/components/project-photo";
import { SITE_EMAIL } from "@/lib/site-config";

const finishes = [
  {
    title: "Płatki dekoracyjne",
    src: "/garaz/IMG_1253.JPG",
    alt: "Jasnoszara posadzka z kontrastującymi płatkami w garażu z białą bramą",
    caption: "Płatki i cokoły · zdjęcie z naszej galerii garaży",
    advantage: "Drobny wzór rozbija jednolity kolor. Gęstość i wielkość płatków możesz dobrać na próbce.",
    limitation: "Same płatki nie określają antypoślizgowości. Fakturę i warstwę zamykającą dobieramy do sposobu użytkowania i mycia.",
  },
  {
    title: "Jednolita powierzchnia",
    src: "/garaz/IMG_0910.JPG",
    alt: "Garaż z jednolitą jasnoszarą posadzką i widocznymi odbiciami światła",
    caption: "Jednolite wykończenie · zdjęcie z naszej galerii garaży",
    advantage: "Spokojny wygląd bez dekoracyjnego wzoru. Na zdjęciu możesz ocenić odbicia światła i efekt na dużej powierzchni.",
    limitation: "Na jednolitej powierzchni łatwiej zauważyć smugi i ślady użytkowania. Gładka posadzka może być śliska na mokro.",
  },
];

const colors = [
  { name: "Jasny szary", ral: "RAL 7035", hex: "#d7d9d3" },
  { name: "Szary", ral: "RAL 7040", hex: "#9da3a6" },
  { name: "Antracyt", ral: "RAL 7016", hex: "#383e43" },
  { name: "Beżowoszary", ral: "RAL 1019", hex: "#a89b86" },
];

export default function GarageFinishPicker() {
  return (
    <section id="wykonczenia" aria-labelledby="wykonczenia-heading" className="scroll-mt-24 bg-zinc-50 py-14 sm:py-20">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="text-sm font-semibold uppercase tracking-widest text-zinc-500">Porównaj przed wyborem</p>
        <h2 id="wykonczenia-heading" className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight text-zinc-950 sm:text-4xl">Które wykończenie sprawdzi się u Ciebie?</h2>
        <p className="mt-4 max-w-2xl leading-relaxed text-zinc-600">Obejrzyj i powiększ prawdziwe zdjęcia. Wygląd wybierasz Ty, a technologię dobieramy do betonu, wody i obciążeń w garażu.</p>
        <div className="mt-9 grid gap-8 md:grid-cols-2">
          {finishes.map(finish => (
            <article key={finish.title} className="min-w-0 rounded-2xl border border-zinc-200 bg-white p-4 sm:p-6">
              <ProjectPhoto src={finish.src} alt={finish.alt} caption={finish.caption} />
              <h3 className="mt-5 text-2xl font-semibold text-zinc-950">{finish.title}</h3>
              <p className="mt-3 leading-relaxed text-zinc-600">{finish.advantage}</p>
              <p className="mt-4 border-l-2 border-zinc-300 pl-4 leading-relaxed text-zinc-600"><strong className="text-zinc-950">Co warto wiedzieć? </strong>{finish.limitation}</p>
              <a href={`mailto:${SITE_EMAIL}?subject=${encodeURIComponent("Wycena garażu — " + finish.title)}&body=${encodeURIComponent("Interesuje mnie: " + finish.title + "\nMiejscowość: \nMetraż: \nStan podłoża: \n\nDołączam zdjęcie całego garażu i zbliżenia uszkodzeń.")}`} className="mt-5 inline-block rounded-full bg-zinc-950 px-5 py-3 text-base font-semibold text-white hover:bg-zinc-700">Zapytaj o takie wykończenie</a>
              <p className="mt-2 text-sm text-zinc-600">Otworzy się wiadomość e-mail. Wpisz metraż i miejscowość, a zdjęcia podłoża dodaj jako załączniki.</p>
            </article>
          ))}
        </div>
        <div className="mt-8 grid gap-8 rounded-2xl border border-zinc-200 bg-white p-6 md:grid-cols-2 sm:p-8">
          <div>
            <h3 className="text-xl font-semibold">A jeśli potrzebuję mocniejszej faktury?</h3>
            <p className="mt-3 leading-relaxed text-zinc-600">Możemy rozważyć posypkę kwarcową. Bardziej wyczuwalna struktura zmienia komfort chodzenia i sposób czyszczenia. Stopień antypoślizgowości potwierdzamy dla dobranego systemu, nie na podstawie zdjęcia.</p>
            <Link href="/kontakt" className="mt-4 inline-block py-2 font-semibold underline underline-offset-4">Porozmawiaj o wodzie i antypoślizgu</Link>
          </div>
          <div>
            <h3 className="text-xl font-semibold">Jaki kolor wybrać?</h3>
            <ul className="mt-4 grid grid-cols-2 gap-4 sm:grid-cols-4" aria-label="Poglądowe kolory RAL">
              {colors.map(color => (
                <li key={color.ral}>
                  <span className="block h-12 rounded-lg border border-zinc-300" style={{ backgroundColor: color.hex }} aria-hidden="true" />
                  <span className="mt-2 block text-sm font-medium">{color.ral}</span>
                  <span className="text-sm text-zinc-600">{color.name}</span>
                </li>
              ))}
            </ul>
            <p className="mt-4 text-sm leading-relaxed text-zinc-600">To poglądowe kolory, nie zmiana koloru zdjęć. Odcień, połysk i dostępność potwierdzamy na próbce wybranego systemu.</p>
          </div>
        </div>
      </div>
    </section>
  );
}

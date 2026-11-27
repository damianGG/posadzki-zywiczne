import Link from "next/link";
import ProjectPhoto from "@/components/project-photo";
import { stoneCarpetGallery } from "@/lib/stone-carpet-gallery";

const answers = [
  {
    question: "Jak będzie wyglądać przy ścianie?",
    src: "/chatgpt-realizacje/posadzka-zywiczna-garaz-100m2-przemysl-ral7035/przemysl-garaz-100m2-wykonczenie-cokolu.jpg",
    alt: "Szara posadzka z płatkami i cokół w narożniku garażu w Przemyślu",
    caption: "Cokół i narożnik · garaż 100 m² w Przemyślu",
    answer: "Zobacz połączenie podłogi ze ścianą i fakturę z bliska. W ofercie ustalamy wysokość cokołu oraz sposób uszczelnienia styku. Te detale też mają wpływ na koszt.",
    href: "/realizacje/posadzka-zywiczna-garaz-100m2-przemysl-ral7035",
    link: "Obejrzyj cały garaż",
  },
  {
    question: "Czy gładki taras będzie dla mnie dobry?",
    src: "/realizacje/rzeszow-glogow-malopolski-taras/IMG_9538.JPG",
    alt: "Jasna, połyskująca posadzka na zadaszonym tarasie z drewnianą balustradą",
    caption: "Wykończenie tarasu pod zadaszeniem · Głogów Małopolski",
    answer: "Na zdjęciu widać odbicia światła. Połysk, śliskość na mokro i łatwość mycia to osobne kwestie. Przed wyborem omawiamy ekspozycję na deszcz i słońce oraz stan hydroizolacji.",
    href: "/posadzki-zywiczne-na-balkony",
    link: "Sprawdź rozwiązania na balkon i taras",
  },
  {
    question: "Jak wygląda kamienny dywan z bliska?",
    src: stoneCarpetGallery[8].src,
    alt: stoneCarpetGallery[8].alt,
    caption: "Struktura kruszywa i profile przy krawędziach stopni",
    answer: "Powiększ zdjęcie, żeby zobaczyć kruszywo i krawędź stopnia. Otwarta struktura wymaga czyszczenia, a sam kamienny dywan nie zastępuje hydroizolacji. Dobór zaczynamy od warunków na Twoich schodach lub tarasie.",
    href: "/kamienny-dywan",
    link: "Poznaj zalety, ograniczenia i koszt",
  },
];

export default function CustomerPhotoAnswers() {
  return (
    <section className="brand-surface py-14 sm:py-20" aria-labelledby="photo-answers-heading">
      <div className="mx-auto max-w-7xl px-4 sm:px-6">
        <p className="brand-eyebrow">Zanim wybierzesz</p>
        <h2 id="photo-answers-heading" className="mt-3 max-w-3xl text-3xl font-semibold tracking-tight sm:text-4xl">Jakość widać w detalach.</h2>
        <p className="mt-4 max-w-2xl text-zinc-600">Przyjrzyj się wykończeniu z bliska. To właśnie faktura, połączenia i krawędzie pokazują, jak posadzka będzie wyglądała na co dzień. Sprawdź też ograniczenia poszczególnych rozwiązań.</p>
        <div className="mt-9 grid gap-8 md:grid-cols-3">
          {answers.map(answer => (
            <article key={answer.question} className="min-w-0">
              <ProjectPhoto src={answer.src} alt={answer.alt} caption={answer.caption} sizes="(max-width: 768px) 100vw, 33vw" />
              <h3 className="mt-5 text-xl font-semibold text-zinc-950">{answer.question}</h3>
              <p className="mt-3 leading-relaxed text-zinc-600">{answer.answer}</p>
              <Link href={answer.href} className="mt-4 inline-block py-2 font-semibold underline underline-offset-4">{answer.link}</Link>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

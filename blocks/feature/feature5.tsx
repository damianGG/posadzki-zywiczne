import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { serviceGroups } from "@/lib/service-navigation";
import { stoneCarpetGallery } from "@/lib/stone-carpet-gallery";
import type { Realizacja, RealizacjaCategory } from "@/types/realizacje";
import Image from "next/image";

// Curated fallbacks keep photographed services visible when the CMS is unavailable.
const photoCategories: Partial<Record<string, RealizacjaCategory>> = {
  "/garaze": "garaze",
  "/posadzki-zywiczne-na-balkony": "balkony-tarasy",
  "/kuchnia-salon": "domy-mieszkania",

};
// A contextual image is never evidence of a specific industrial system or project.
const industrialPhotos: Record<string, { src: string; alt: string; caption: string; pattern: RegExp }> = {
  "/hale-magazyny": { src: "/produkcja.jpg", alt: "Przykładowe otoczenie produkcyjne", caption: "Zdjęcie poglądowe · przemysł", pattern: /\b(hal[aeiy]|magazyn\w*|zakład produkcyjny)\b/i },
  "/parkingi": { src: "/garaz/garaz-hala.png", alt: "Poglądowy przykład dużej powierzchni posadzkowej", caption: "Materiał poglądowy · nawierzchnia pod ruch pojazdów", pattern: /\bparking\w*\b/i },
  "/gastronomia": { src: "/gastronomia.jpg", alt: "Przykładowe otoczenie gastronomiczne", caption: "Zdjęcie poglądowe · gastronomia", pattern: /\b(gastronomi\w*|kuchni\w* przemysłow\w*|zmywalni\w*)\b/i },
  "/posadzki-elektrostatyczne": { src: "/produkcja.jpg", alt: "Przykładowe otoczenie przemysłowe, nie potwierdzenie parametrów ESD", caption: "Zdjęcie poglądowe · nie dokumentacja ESD", pattern: /\bESD\b|elektrostatyczn\w*|antystatyczn\w*/i },
  "/pomieszczenia-czyste": { src: "/gastronomia.jpg", alt: "Poglądowy przykład pomieszczenia o wymaganiach higienicznych", caption: "Zdjęcie poglądowe · nie potwierdza klasy czystości", pattern: /clean\s?room|pomieszczeni\w* czyst\w*|laboratori\w*/i },
};
const servicePhotos: Record<string, { src: string; alt: string; caption: string }> = {
  "/garaze": { src: "/garaz/IMG_1253.JPG", alt: "Jasna posadzka z płatkami i cokołami w garażu", caption: "Posadzka z płatkami · zdjęcie z naszej galerii" },
  "/posadzki-zywiczne-na-balkony": { src: "/realizacje/krakow-rydlowka-balkon/IMG_1315.JPG", alt: "Balkon z jasną posadzką w płatki i żółtą balustradą", caption: "Wykończenie balkonu · z naszej galerii" },
  "/kamienny-dywan": { src: stoneCarpetGallery[0].src, alt: stoneCarpetGallery[0].alt, caption: "Kamienny dywan na stopniach i podeście" },
};

export function Feature5({ projects = [] }: { projects?: Realizacja[] }) {

  return (
    <section className="container mx-auto px-4 py-14 lg:py-24" aria-labelledby="services-heading">
      <p className="brand-eyebrow">Zastosowania i realizacje</p>
      <h2 id="services-heading" className="premium-display mt-3 scroll-mt-28 text-3xl font-medium md:text-5xl">Każda przestrzeń potrzebuje innego wykończenia.</h2>
      <p className="mt-4 max-w-2xl text-muted-foreground">
        Od prywatnego garażu po wymagającą halę produkcyjną. Zobacz wykończenia, przykładowe realizacje i rozwiązania dopasowane do codziennego użytkowania.
      </p>
      {serviceGroups.map((group,index) => (
        <div key={group.title} id={index === 0 ? "home-services-private" : "home-services-business"} className="mt-10 scroll-mt-28">
          <h3 className="brand-section-heading mb-5 text-2xl font-semibold">{group.title}</h3>
          <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {group.items.map(item => {
              const category = photoCategories[item.href];
              const industrial = industrialPhotos[item.href];
              const project = projects.find(candidate => Boolean(candidate.images.main) && (industrial ? industrial.pattern.test(candidate.title) : candidate.category === category));
              const selectedPhoto = servicePhotos[item.href] || (!project ? industrial : undefined);
              const src = selectedPhoto?.src || project?.images.main;
              const alt = selectedPhoto?.alt || (project ? `${project.title} — ${project.location}` : undefined);
              const caption = selectedPhoto?.caption || (project ? `Z naszej realizacji: ${project.location}` : undefined);

              return (
                <Link
                  key={item.href}
                  prefetch={false}
                  href={item.href}
                  className="group grid min-w-0 grid-cols-[minmax(0,0.8fr)_minmax(0,1.2fr)] overflow-hidden rounded-xl border border-[#DEDED5] bg-white transition-colors hover:border-[#64836A] focus-visible:outline focus-visible:outline-2 focus-visible:outline-primary sm:flex sm:flex-col"
                >
                  {src && alt && <div className="relative min-h-32 self-stretch overflow-hidden bg-zinc-100 sm:aspect-[4/3]"><Image src={src} alt={alt} fill sizes="(min-width: 1536px) 488px, (min-width: 1280px) 402px, (min-width: 1024px) 317px, (min-width: 768px) 357px, (min-width: 640px) 293px, calc((100vw - 34px) * 0.4)" className="object-cover motion-safe:transition-transform motion-safe:group-hover:scale-[1.025]" /></div>}
                  <div className={"flex min-w-0 flex-1 flex-col p-3 sm:p-6 " + (!src || !alt ? "col-span-2" : "")}>
                    <h4 className="text-base font-semibold tracking-tight sm:text-xl">{item.title}</h4>
                    <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{item.description}</p>
                    {caption && <p className="mt-2 text-xs text-zinc-600">{caption}</p>}
                    <span className="mt-auto flex items-center justify-between gap-1 pt-3 text-sm font-semibold text-zinc-950">Poznaj rozwiązanie <ArrowRight className="h-4 w-4 shrink-0 text-[#007A3D]" aria-hidden="true" /></span>
                  </div>
                </Link>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
